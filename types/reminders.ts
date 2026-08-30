export type ReminderMode =
  | "fixed"
  | "smart";

export type Reminder = {
  id: string;
  reminder_time: string;
  amount_ml: number;
  enabled: boolean;
  days_of_week: number[];
  mode: ReminderMode;
};