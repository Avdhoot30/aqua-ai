export type DailyHydrationStat = {
  date: string;
  totalMl: number;
  goalMl: number;
  percentage: number;
  goalCompleted: boolean;
};

export type WeekdayStat = {
  weekday: string;
  averageMl: number;
  averagePercentage: number;
};

export type TimeOfDayStat = {
  period: string;
  totalMl: number;
  percentage: number;
};

export type HydrationAnalytics = {
  days: DailyHydrationStat[];

  averageMl: number;

  averageGoalCompletion: number;

  goalsCompleted: number;

  bestDay: DailyHydrationStat | null;

  currentStreak: number;

  longestStreak: number;

  weekdayStats: WeekdayStat[];

  timeOfDayStats: TimeOfDayStat[];
};