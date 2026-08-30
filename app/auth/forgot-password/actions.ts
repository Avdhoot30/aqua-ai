"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requestPasswordReset(
  formData: FormData,
) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new Error("Email is required.");
  }

  const supabase = await createClient();

  const { error } =
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}` +
        "/auth/reset-password",
    });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/auth/forgot-password/sent");
}