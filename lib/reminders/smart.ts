type SmartReminderInput = {
  goalMl: number;
  consumedMl: number;
  wakeHour: number;
  sleepHour: number;
  currentHour: number;
};

export function shouldSendSmartReminder({
  goalMl,
  consumedMl,
  wakeHour,
  sleepHour,
  currentHour,
}: SmartReminderInput) {
  const remainingMl =
    Math.max(
      goalMl - consumedMl,
      0,
    );

  if (remainingMl <= 0) {
    return false;
  }

  const wakingHours =
    calculateWakingHours(
      currentHour,
      sleepHour,
    );

  if (wakingHours <= 0) {
    return false;
  }

  return (
    remainingMl / wakingHours >= 150
  );
}

function calculateWakingHours(
  currentHour: number,
  sleepHour: number,
) {
  if (sleepHour > currentHour) {
    return sleepHour - currentHour;
  }

  return 24 - currentHour + sleepHour;
}