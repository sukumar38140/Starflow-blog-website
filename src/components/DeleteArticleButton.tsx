"use client";

import React, { useTransition } from "react";
import { deleteContent } from "@/lib/actions";
import { Trash2 } from "lucide-react";

interface DeleteArticleButtonProps {
  id: string;
  title: string;
}

export default function DeleteArticleButton({ id, title }: DeleteArticleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm(`Are you sure you want to archive "${title}"? This will hide it from public listings.`)) {
      startTransition(async () => {
        const res = await deleteContent(id);
        if (res?.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-lg p-1.5 text-zinc-550 hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/20 dark:hover:text-red-400 transition-colors disabled:opacity-50"
      title="Archive Article"
    >
      {isPending ? (
        <div className="h-3.5 w-3.5 animate-spin rounded-full border border-current border-t-transparent" />
      ) : (
        <Trash2 size={14} />
      )}
    </button>
  );
}
