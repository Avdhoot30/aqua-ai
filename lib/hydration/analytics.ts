import {
  eachDayOfInterval,
  format,
  subDays,
} from "date-fns";

import { TZDate } from "@date-fns/tz";

import { createClient } from "@/lib/supabase/server";

import type {
  DailyHydrationStat,
  HydrationAnalytics,
  TimeOfDayStat,
  WeekdayStat,
} from "@/types/analytics";

export async function getHydrationAnalytics(
  userId: string,
  days = 30,
): Promise<HydrationAnalytics> {
  const supabase = await createClient();

  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("timezone")
      .eq("id", userId)
      .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  const timezone =
    profile?.timezone ?? "UTC";

  const now = new TZDate(
    Date.now(),
    timezone,
  );

  const start = subDays(
    now,
    days - 1,
  );

  const startLocal = new TZDate(
    start,
    timezone,
  );

  const endLocal = new TZDate(
    now,
    timezone,
  );

  const startUtc = new TZDate(
    startLocal,
    timezone,
  ).toISOString();

  const endUtc = new TZDate(
    endLocal,
    timezone,
  ).toISOString();

  const {
    data: logs,
    error: logsError,
  } = await supabase
    .from("water_logs")
    .select(
      "amount_ml, logged_at",
    )
    .eq("user_id", userId)
    .gte("logged_at", startUtc)
    .lte("logged_at", endUtc);

  if (logsError) {
    throw new Error(logsError.message);
  }

  const {
    data: goals,
    error: goalsError,
  } = await supabase
    .from("hydration_goals")
    .select(
      "daily_target_ml, effective_from",
    )
    .eq("user_id", userId)
    .order("effective_from", {
      ascending: true,
    });

  if (goalsError) {
    throw new Error(goalsError.message);
  }

  const dailyMap = new Map<
    string,
    number
  >();

  for (const log of logs ?? []) {
    const localDate = new TZDate(
      new Date(log.logged_at),
      timezone,
    );

    const key = format(
      localDate,
      "yyyy-MM-dd",
    );

    dailyMap.set(
      key,
      (dailyMap.get(key) ?? 0) +
        log.amount_ml,
    );
  }

  const dates = eachDayOfInterval({
    start: startLocal,
    end: endLocal,
  });

  const dailyStats =
    dates.map((date) => {
      const localDate = new TZDate(
        date,
        timezone,
      );

      const dateKey = format(
        localDate,
        "yyyy-MM-dd",
      );

      const totalMl =
        dailyMap.get(dateKey) ?? 0;

      const goalMl =
        getGoalForDate(
          goals ?? [],
          dateKey,
        ) ?? 2800;

      const percentage =
        goalMl > 0
          ? Math.min(
              Math.round(
                (totalMl / goalMl) * 100,
              ),
              100,
            )
          : 0;

      return {
        date: dateKey,
        totalMl,
        goalMl,
        percentage,
        goalCompleted:
          totalMl >= goalMl,
      };
    });

  const weekdayStats =
    calculateWeekdayStats(
      dailyStats,
    );

  const timeOfDayStats =
    calculateTimeOfDayStats(
      logs ?? [],
      timezone,
    );

  const averageMl =
    dailyStats.length
      ? Math.round(
          dailyStats.reduce(
            (sum, day) =>
              sum + day.totalMl,
            0,
          ) / dailyStats.length,
        )
      : 0;

  const averageGoalCompletion =
    dailyStats.length
      ? Math.round(
          dailyStats.reduce(
            (sum, day) =>
              sum + day.percentage,
            0,
          ) / dailyStats.length,
        )
      : 0;

  const goalsCompleted =
    dailyStats.filter(
      (day) => day.goalCompleted,
    ).length;

  const daysWithData =
    dailyStats.filter(
      (day) => day.totalMl > 0,
    );

  const bestDay =
    daysWithData.length
      ? [...daysWithData].sort(
          (a, b) =>
            b.totalMl - a.totalMl,
        )[0]
      : null;

  return {
    days: dailyStats,
    averageMl,
    averageGoalCompletion,
    goalsCompleted,
    bestDay,
    currentStreak:
      calculateCurrentStreak(
        dailyStats,
      ),
    longestStreak:
      calculateLongestStreak(
        dailyStats,
      ),
    weekdayStats,
    timeOfDayStats,
  };
}

function getGoalForDate(
  goals: Array<{
    daily_target_ml: number;
    effective_from: string;
  }>,
  date: string,
) {
  let activeGoal: number | null =
    null;

  for (const goal of goals) {
    if (
      goal.effective_from <= date
    ) {
      activeGoal =
        goal.daily_target_ml;
    }
  }

  return activeGoal;
}

function calculateCurrentStreak(
  days: DailyHydrationStat[],
) {
  let streak = 0;

  for (
    let i = days.length - 1;
    i >= 0;
    i--
  ) {
    if (days[i].goalCompleted) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function calculateLongestStreak(
  days: DailyHydrationStat[],
) {
  let current = 0;
  let longest = 0;

  for (const day of days) {
    if (day.goalCompleted) {
      current++;

      longest = Math.max(
        longest,
        current,
      );
    } else {
      current = 0;
    }
  }

  return longest;
}

function calculateWeekdayStats(
  days: DailyHydrationStat[],
): WeekdayStat[] {
  const groups = new Map<
    string,
    DailyHydrationStat[]
  >();

  for (const day of days) {
    const date = new Date(
      `${day.date}T00:00:00`,
    );

    const weekday = format(
      date,
      "EEE",
    );

    const existing =
      groups.get(weekday) ?? [];

    existing.push(day);

    groups.set(
      weekday,
      existing,
    );
  }

  const order = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  return order.map((weekday) => {
    const values =
      groups.get(weekday) ?? [];

    if (!values.length) {
      return {
        weekday,
        averageMl: 0,
        averagePercentage: 0,
      };
    }

    return {
      weekday,
      averageMl: Math.round(
        values.reduce(
          (sum, day) =>
            sum + day.totalMl,
          0,
        ) / values.length,
      ),
      averagePercentage: Math.round(
        values.reduce(
          (sum, day) =>
            sum + day.percentage,
          0,
        ) / values.length,
      ),
    };
  });
}

function calculateTimeOfDayStats(
  logs: Array<{
    amount_ml: number;
    logged_at: string;
  }>,
  timezone: string,
): TimeOfDayStat[] {
  const periods = [
    {
      name: "Morning",
      start: 5,
      end: 12,
    },
    {
      name: "Afternoon",
      start: 12,
      end: 17,
    },
    {
      name: "Evening",
      start: 17,
      end: 21,
    },
    {
      name: "Night",
      start: 21,
      end: 5,
    },
  ];

  const totals = new Map<
    string,
    number
  >();

  for (const period of periods) {
    totals.set(
      period.name,
      0,
    );
  }

  for (const log of logs) {
    const localDate =
      new TZDate(
        new Date(log.logged_at),
        timezone,
      );

    const hour =
      localDate.getHours();

    const period =
      periods.find((item) => {
        if (
          item.start < item.end
        ) {
          return (
            hour >= item.start &&
            hour < item.end
          );
        }

        return (
          hour >= item.start ||
          hour < item.end
        );
      });

    if (period) {
      totals.set(
        period.name,
        (totals.get(
          period.name,
        ) ?? 0) + log.amount_ml,
      );
    }
  }

  const totalMl = Array.from(
    totals.values(),
  ).reduce(
    (sum, value) =>
      sum + value,
    0,
  );

  return periods.map(
    (period) => {
      const total =
        totals.get(
          period.name,
        ) ?? 0;

      return {
        period: period.name,
        totalMl: total,
        percentage:
          totalMl > 0
            ? Math.round(
                (total / totalMl) *
                  100,
              )
            : 0,
      };
    },
  );
}