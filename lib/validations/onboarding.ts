import { z } from "zod";

export const onboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name is too long."),

  dateOfBirth: z
    .string()
    .min(1, "Please select your date of birth."),

  sex: z.enum(["male", "female", "other", "prefer_not_to_say"]),

  heightCm: z
    .number()
    .min(50, "Height must be at least 50 cm.")
    .max(250, "Height must be less than 250 cm."),

  weightKg: z
    .number()
    .min(20, "Weight must be at least 20 kg.")
    .max(300, "Weight must be less than 300 kg."),

  activityLevel: z.enum(["low", "moderate", "high"]),

  exerciseMinutes: z
    .number()
    .int()
    .min(0)
    .max(600),

  wakeTime: z.string().min(1),
  sleepTime: z.string().min(1),

  timezone: z.string().min(1),
});

export type OnboardingInput = z.infer<
  typeof onboardingSchema
>;