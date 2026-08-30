"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  const confirmPassword = String(
    formData.get("confirmPassword") ?? "",
  );

  if (!email || !password || !confirmPassword) {
    redirect(
      "/auth/sign-up?error=All%20fields%20are%20required.",
    );
  }

  if (password.length < 8) {
    redirect(
      "/auth/sign-up?error=Password%20must%20contain%20at%20least%208%20characters.",
    );
  }

  if (password !== confirmPassword) {
    redirect(
      "/auth/sign-up?error=Passwords%20do%20not%20match.",
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(
      `/auth/sign-up?error=${encodeURIComponent(error.message)}`,
    );
  }

if (data.session) {
  redirect("/onboarding");
}

  redirect("/auth/login?success=Account%20created.%20Please%20sign%20in.");
}