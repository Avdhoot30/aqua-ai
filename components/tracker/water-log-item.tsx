"use client";

import { useState, useTransition } from "react";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  deleteWater,
  updateWater,
} from "@/app/(dashboard)/tracker/actions";

import { WaterLog, BeverageType } from "@/types/hydration";

type Props = {
  log: WaterLog;
};

export function WaterLogItem({ log }: Props) {
  const [editing, setEditing] =
    useState(false);

  const [amount, setAmount] =
    useState(String(log.amount_ml));

  const [beverage, setBeverage] =
    useState<BeverageType>(
      log.beverage_type,
    );

  const [isPending, startTransition] =
    useTransition();

  function save() {
    startTransition(async () => {
      await updateWater(
        log.id,
        Number(amount),
        beverage,
      );

      setEditing(false);
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteWater(log.id);
    });
  }

  return (
    <div className="rounded-xl bg-muted/40 p-4">
      {editing ? (
        <div className="grid gap-3 sm:grid-cols-[1fr_180px_auto_auto]">
          <input
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            type="number"
            min={10}
            max={5000}
            className="rounded-lg border bg-background px-3 py-2"
          />

          <select
            value={beverage}
            onChange={(e) =>
              setBeverage(
                e.target
                  .value as BeverageType,
              )
            }
            className="rounded-lg border bg-background px-3 py-2"
          >
            <option value="water">Water</option>
            <option value="tea">Tea</option>
            <option value="coffee">Coffee</option>
            <option value="milk">Milk</option>
            <option value="electrolyte">
              Electrolyte
            </option>
            <option value="other">Other</option>
          </select>

          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
          >
            Save
          </button>

          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={isPending}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
              💧
            </div>

            <div>
              <p className="font-semibold">
                {log.amount_ml} ml
              </p>

              <p className="text-xs capitalize text-muted-foreground">
                {log.beverage_type} ·{" "}
                {new Date(
                  log.logged_at,
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              disabled={isPending}
              className="inline-flex size-9 items-center justify-center rounded-lg border hover:bg-muted"
              aria-label="Edit entry"
            >
              <Pencil className="size-4" />
            </button>

            <button
              type="button"
              onClick={remove}
              disabled={isPending}
              className="inline-flex size-9 items-center justify-center rounded-lg border text-red-400 hover:bg-red-500/10"
              aria-label="Delete entry"
            >
              <Trash2 className="size-4" />
            </button>

            <button
              type="button"
              disabled
              className="inline-flex size-9 items-center justify-center rounded-lg border"
              aria-label="More actions"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}