import { hasPremiumAccess } from "./access";

export async function requirePremium(
  userId: string,
) {
  const allowed =
    await hasPremiumAccess(userId);

  if (!allowed) {
    throw new Error(
      "Premium subscription required.",
    );
  }
}