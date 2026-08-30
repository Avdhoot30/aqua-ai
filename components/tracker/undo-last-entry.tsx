"use client";

import { useState, useTransition } from "react";
import { Undo2 } from "lucide-react";

import { deleteWater } from "@/app/(dashboard)/tracker/actions";

type Props = {
  id: string;
};

export function UndoLastEntry({ id }: Props) {
  const [visible, setVisible] =
    useState(true);

  const [isPending, startTransition] =
    useTransition();

  if (!visible) {
    return null;
  }

  function undo() {
    startTransition(async () => {
      await deleteWater(id);
      setVisible(false);
    });
  }

  return (
    <button
      type="button"
      onClick={undo}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
    >
      <Undo2 className="size-4" />
      Undo
    </button>
  );
}