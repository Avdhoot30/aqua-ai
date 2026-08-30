import { getOpenAIClient } from "@/lib/ai/client";
import { buildHydrationContext } from "@/lib/ai/context";
import { createClient } from "@/lib/supabase/server";

type InsightOutput = {
  summary: string;
  recommendation: string;
  severity:
    | "normal"
    | "positive"
    | "warning";
};

export async function getOrCreateDailyInsight(
  userId: string,
) {
  const supabase =
    await createClient();

  const today =
    new Date()
      .toISOString()
      .slice(0, 10);

  const { data: existing, error: existingError } =
    await supabase
      .from("ai_insights")
      .select("*")
      .eq("user_id", userId)
      .eq("insight_date", today)
      .maybeSingle();

  if (existingError) {
    throw new Error(
      existingError.message,
    );
  }

  if (existing) {
    return existing;
  }

  const context =
    await buildHydrationContext(
      userId,
    );

  const openai =
    getOpenAIClient();

  const response =
    await openai.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are AquaAI's daily hydration insight engine.

Generate one concise daily hydration insight.

Rules:
- Base the insight only on the supplied application data.
- Do not diagnose medical conditions.
- Do not provide medical treatment.
- Do not claim medical certainty.
- Keep the summary under 40 words.
- Keep the recommendation under 30 words.
- Severity must be one of:
  normal, positive, warning.

Return ONLY valid JSON with this structure:

{
  "summary": "string",
  "recommendation": "string",
  "severity": "normal"
}
`,

      input: JSON.stringify(
        context,
      ),

      text: {
        format: {
          type: "json_schema",
          name: "daily_hydration_insight",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: {
                type: "string",
              },

              recommendation: {
                type: "string",
              },

              severity: {
                type: "string",
                enum: [
                  "normal",
                  "positive",
                  "warning",
                ],
              },
            },
            required: [
              "summary",
              "recommendation",
              "severity",
            ],
            additionalProperties: false,
          },
        },
      },
    });

  const raw =
    response.output_text;

  if (!raw) {
    throw new Error(
      "AI returned an empty insight.",
    );
  }

  let insight: InsightOutput;

  try {
    insight =
      JSON.parse(raw);
  } catch {
    throw new Error(
      "AI returned invalid insight JSON.",
    );
  }

  const { data, error } =
    await supabase
      .from("ai_insights")
      .insert({
        user_id: userId,
        insight_date: today,
        summary: insight.summary,
        recommendation:
          insight.recommendation,
        severity:
          insight.severity,
      })
      .select("*")
      .single();

  if (error) {
    // Another request may have generated it first.
    if (
      error.code === "23505"
    ) {
      const { data: existingInsight } =
        await supabase
          .from("ai_insights")
          .select("*")
          .eq(
            "user_id",
            userId,
          )
          .eq(
            "insight_date",
            today,
          )
          .single();

      if (existingInsight) {
        return existingInsight;
      }
    }

    throw new Error(
      error.message,
    );
  }

  return data;
}