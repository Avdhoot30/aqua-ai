import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { OnboardingForm } from "./onboarding-form";

export async function OnboardingContent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  // If onboarding is already complete, don't let the user
  // accidentally go through onboarding again.
  if (profile?.onboarding_completed) {
    redirect("/dashboard");
  }

  return <OnboardingForm />;
}