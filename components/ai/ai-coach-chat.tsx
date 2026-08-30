"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Bot,
  Send,
  User,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Why am I missing my goal?",
  "How am I doing today?",
  "How can I improve my consistency?",
];

export function AICoachChat() {
  const [messages, setMessages] =
    useState<Message[]>([
      {
        role: "assistant",
        content:
          "Hi! I'm AquaAI. I can help you understand your hydration habits and suggest practical ways to stay consistent.",
      },
    ]);

  const [
    conversationId,
    setConversationId,
  ] = useState<string | null>(null);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function sendMessage(
    message?: string,
  ) {
    const text =
      (message ?? input).trim();

    if (!text || loading) {
      return;
    }

    setInput("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: text,
      },
    ]);

    setLoading(true);

    try {
      const response =
        await fetch(
          "/api/ai/coach",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              message: text,
              conversationId,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Something went wrong.",
        );
      }

      if (data.conversationId) {
        setConversationId(
          data.conversationId,
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Unable to reach AquaAI right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(
    event: FormEvent,
  ) {
    event.preventDefault();

    void sendMessage();
  }

  return (
    <div className="flex min-h-162.5 flex-col rounded-3xl border bg-card">
      <div className="border-b p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Bot className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">
              AquaAI Coach
            </h2>

            <p className="text-xs text-muted-foreground">
              Personalized hydration guidance
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">
        {messages.map(
          (message, index) => {
            const isUser =
              message.role === "user";

            return (
              <div
                key={`${message.role}-${index}`}
                className={`flex gap-3 ${
                  isUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                    <Bot className="size-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    isUser
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>

                {isUser && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="size-4" />
                  </div>
                )}
              </div>
            );
          },
        )}

        {loading && (
          <div className="flex gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
              <Bot className="size-4" />
            </div>

            <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
              Thinking...
            </div>
          </div>
        )}

        {!loading &&
          messages.length === 1 && (
            <div className="grid gap-2 pt-3">
              {suggestions.map(
                (suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      void sendMessage(
                        suggestion,
                      )
                    }
                    className="rounded-xl border px-4 py-3 text-left text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t p-4"
      >
        <div className="flex items-center gap-2 rounded-xl border bg-background p-2">
          <input
            value={input}
            onChange={(event) =>
              setInput(
                event.target.value,
              )
            }
            placeholder="Ask your AI Coach..."
            maxLength={1000}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />

          <button
            type="submit"
            disabled={
              loading ||
              !input.trim()
            }
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="size-4" />
          </button>
        </div>
      </form>
    </div>
  );
}