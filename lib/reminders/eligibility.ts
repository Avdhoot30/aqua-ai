import {
  getLocalDayOfWeek,
  getLocalTimeMinutes,
  parseReminderTime,
} from "./time";

type Reminder = {
  reminder_time: string;
  enabled: boolean | null;
  days_of_week: number[] | null;
};

export function isReminderDue(reminder: Reminder, timezone: string) {
  if (reminder.enabled !== true) {
    return false;
  }

  const currentDay = getLocalDayOfWeek(timezone);

  const currentMinutes = getLocalTimeMinutes(timezone);

  const reminderMinutes = parseReminderTime(reminder.reminder_time);

  const allowedDays = reminder.days_of_week ?? [1, 2, 3, 4, 5, 6, 7];

  if (!allowedDays.includes(currentDay)) {
    return false;
  }

  return (
    currentMinutes >= reminderMinutes && currentMinutes < reminderMinutes + 60
  );
}
