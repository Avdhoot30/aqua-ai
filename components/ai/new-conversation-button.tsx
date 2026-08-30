"use client";

import { Plus } from "lucide-react";

type Props = {
  onNewConversation: () => void;
};

export function NewConversationButton({
  onNewConversation,
}: Props) {
  return (
    <button
      type="button"
      onClick={onNewConversation}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted"
    >
      <Plus className="size-4" />

      New conversation
    </button>
  );
}