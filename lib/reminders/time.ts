import { TZDate } from "@date-fns/tz";

export function getUserLocalNow(
  timezone: string,
) {
  return new TZDate(
    Date.now(),
    timezone,
  );
}

export function getLocalDayOfWeek(
  timezone: string,
) {
  const now =
    getUserLocalNow(timezone);

  const jsDay =
    now.getDay();

  // JavaScript:
  // Sunday = 0
  // Monday = 1
  //
  // Our application:
  // Monday = 1
  // ...
  // Sunday = 7

  return jsDay === 0
    ? 7
    : jsDay;
}

export function getLocalTimeMinutes(
  timezone: string,
) {
  const now =
    getUserLocalNow(timezone);

  return (
    now.getHours() * 60 +
    now.getMinutes()
  );
}

export function parseReminderTime(
  value: string,
) {
  const [hours, minutes] =
    value.split(":").map(Number);

  return hours * 60 + minutes;
}

export function getReminderSlot(
  timezone: string,
  reminderTime: string,
) {
  const now =
    getUserLocalNow(timezone);

  const [hours, minutes] =
    reminderTime
      .split(":")
      .map(Number);

  const scheduled =
    new TZDate(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      0,
      0,
      timezone,
    );

  return scheduled.toISOString();
}