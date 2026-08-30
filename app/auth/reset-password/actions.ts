"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  );

  if (password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters.",
    );
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/auth/login?success=Password%20updated.%20Please%20sign%20in.");
}