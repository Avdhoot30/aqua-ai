import { NextRequest, NextResponse } from "next/server";

import { getOpenAIClient } from "@/lib/ai/client";
import { createClient } from "@/lib/supabase/server";

import { buildHydrationContext } from "@/lib/ai/context";
import { buildCoachInstructions } from "@/lib/ai/prompts";
import { getTodayAIUsage } from "@/lib/ai/usage";


import {
  getConversationMessages,
  getOrCreateConversation,
  saveMessage,
} from "@/lib/ai/conversations";

import { hasPremiumAccess } from "@/lib/billing/access";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const usage = await getTodayAIUsage(user.id);

    const dailyLimit = process.env.NODE_ENV === "development" ? 100 : 50;

    if (usage >= dailyLimit) {
      return NextResponse.json(
        {
          error: "You've reached today's AI Coach limit.",
        },
        {
          status: 429,
        },
      );
    }

    const body = await request.json();

    const message = typeof body.message === "string" ? body.message.trim() : "";

    const requestedConversationId =
      typeof body.conversationId === "string" ? body.conversationId : undefined;

    if (!message) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        {
          error: "Message is too long.",
        },
        {
          status: 400,
        },
      );
    }

    const premium =
      process.env.NODE_ENV === "development"
        ? true
        : await hasPremiumAccess(user.id);

    if (!premium) {
      return NextResponse.json(
        {
          error: "AI Coach is available on AquaAI Premium.",
        },
        {
          status: 403,
        },
      );
    }

    const conversation = await getOrCreateConversation(
      user.id,
      requestedConversationId,
    );

    const history = await getConversationMessages(user.id, conversation.id, 20);

    const context = await buildHydrationContext(user.id);

    const instructions = buildCoachInstructions(context);

    await saveMessage(conversation.id, "user", message);

    const previousMessages = history.map((item) => ({
      role:
        item.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: item.content,
    }));

    const openai = getOpenAIClient();

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      instructions,
      input: [
        ...previousMessages,
        {
          role: "user",
          content: message,
        },
      ],
    });

    const answer = response.output_text?.trim();

    if (!answer) {
      throw new Error("The AI returned an empty response.");
    }

    await saveMessage(conversation.id, "assistant", answer);

    return NextResponse.json({
      conversationId: conversation.id,
      answer,
    });
  } catch (error) {
    console.error("AI Coach error:", error);

    return NextResponse.json(
      {
        error: "Unable to generate an AI response right now.",
      },
      {
        status: 500,
      },
    );
  }
}
