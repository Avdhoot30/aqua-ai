"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const addWaterSchema = z.object({
  amountMl: z
    .number()
    .int()
    .min(10, "Amount must be at least 10 ml.")
    .max(5000, "Amount cannot exceed 5000 ml."),

  beverageType: z.enum([
    "water",
    "tea",
    "coffee",
    "milk",
    "electrolyte",
    "other",
  ]),
});

const updateWaterSchema = z.object({
  id: z.string().uuid(),
  amountMl: z
    .number()
    .int()
    .min(10)
    .max(5000),
  beverageType: z.enum([
    "water",
    "tea",
    "coffee",
    "milk",
    "electrolyte",
    "other",
  ]),
});

const deleteWaterSchema = z.object({
  id: z.string().uuid(),
});

export async function addWater(
  amountMl: number,
  beverageType:
    | "water"
    | "tea"
    | "coffee"
    | "milk"
    | "electrolyte"
    | "other" = "water",
) {
  const parsed = addWaterSchema.safeParse({
    amountMl,
    beverageType,
  });

  if (!parsed.success) {
    throw new Error(
      parsed.error.issues[0]?.message ??
        "Invalid water entry.",
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { error } = await supabase
    .from("water_logs")
    .insert({
      user_id: user.id,
      amount_ml: parsed.data.amountMl,
      beverage_type: parsed.data.beverageType,
      source: "manual",
    });

  if (error) {
    throw new Error(error.message);
  }

  revalidateHydrationPages();
}

export async function updateWater(
  id: string,
  amountMl: number,
  beverageType:
    | "water"
    | "tea"
    | "coffee"
    | "milk"
    | "electrolyte"
    | "other",
) {
  const parsed = updateWaterSchema.safeParse({
    id,
    amountMl,
    beverageType,
  });

  if (!parsed.success) {
    throw new Error("Invalid water entry.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { error } = await supabase
    .from("water_logs")
    .update({
      amount_ml: parsed.data.amountMl,
      beverage_type: parsed.data.beverageType,
    })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateHydrationPages();
}

export async function deleteWater(id: string) {
  const parsed = deleteWaterSchema.safeParse({ id });

  if (!parsed.success) {
    throw new Error("Invalid water log.");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const { error } = await supabase
    .from("water_logs")
    .delete()
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  revalidateHydrationPages();
}

function revalidateHydrationPages() {
  revalidatePath("/dashboard");
  revalidatePath("/tracker");
  revalidatePath("/history");
  revalidatePath("/analytics");
}