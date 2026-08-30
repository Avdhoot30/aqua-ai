import { TZDate } from "@date-fns/tz";

export function getUserTimezone(
  timezone: string | null | undefined,
) {
  return timezone || "UTC";
}

export function getTodayInTimezone(
  timezone: string | null | undefined,
) {
  const tz = getUserTimezone(timezone);

  return new TZDate(Date.now(), tz);
}

export function getDateKey(
  timezone: string | null | undefined,
) {
  const date = getTodayInTimezone(timezone);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

export function getDayBoundsUtc(
  timezone: string | null | undefined,
  dateKey?: string,
) {
  const tz = getUserTimezone(timezone);

  const reference = dateKey
    ? new TZDate(
        `${dateKey}T00:00:00`,
        tz,
      )
    : getTodayInTimezone(tz);

  const start = new TZDate(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate(),
    0,
    0,
    0,
    0,
    tz,
  );

  const end = new TZDate(
    reference.getFullYear(),
    reference.getMonth(),
    reference.getDate() + 1,
    0,
    0,
    0,
    0,
    tz,
  );

  return {
    startUtc: start.toISOString(),
    endUtc: end.toISOString(),
  };
}