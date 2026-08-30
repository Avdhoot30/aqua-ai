import { createClient } from "@/lib/supabase/server";

export async function getOrCreateConversation(
  userId: string,
  conversationId?: string,
) {
  const supabase = await createClient();

  if (conversationId) {
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("*")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .eq("archived", false)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return data;
    }
  }

  const { data, error } = await supabase
    .from("ai_conversations")
    .insert({
      user_id: userId,
      title: "Hydration Coach",
      archived: false,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getConversationMessages(
  userId: string,
  conversationId: string,
  limit = 20,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_messages")
    .select(
      "id, conversation_id, role, content, created_at",
    )
    .eq("conversation_id", conversationId)
    .order("created_at", {
      ascending: false,
    })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  // Verify ownership through the conversation.
  const { data: conversation } =
    await supabase
      .from("ai_conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", userId)
      .maybeSingle();

  if (!conversation) {
    throw new Error("Conversation not found.");
  }

  return (data ?? []).reverse();
}

export async function saveMessage(
  conversationId: string,
  role:
    | "user"
    | "assistant"
    | "system",
  content: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("ai_messages")
    .insert({
      conversation_id: conversationId,
      role,
      content,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("ai_conversations")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", conversationId);

  return data;
}