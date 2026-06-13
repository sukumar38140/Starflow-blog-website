"use client";

import React, { useTransition } from "react";
import { updateLeadStatus } from "@/lib/actions";

interface StatusUpdateButtonProps {
  leadId: string;
  status: string;
  currentStatus: string;
}

export default function StatusUpdateButton({
  leadId,
  status,
  currentStatus,
}: StatusUpdateButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (status === currentStatus) return;

    startTransition(async () => {
      const res = await updateLeadStatus(leadId, status);
      if (res?.error) {
        alert(res.error);
      }
    });
  };

  const isActive = status === currentStatus;

  const getStyle = () => {
    if (isActive) {
      switch (status) {
        case "new":
          return "bg-blue-600 text-white font-bold border-blue-600";
        case "contacted":
          return "bg-yellow-600 text-white font-bold border-yellow-600";
        case "converted":
          return "bg-emerald-600 text-white font-bold border-emerald-600";
      }
    }
    return "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-350 hover:text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-250";
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={isPending || isActive}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition-all focus:outline-none disabled:opacity-80 ${getStyle()}`}
    >
      {isPending ? (
        <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
      ) : (
        <span>{status}</span>
      )}
    </button>
  );
}
