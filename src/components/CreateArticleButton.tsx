"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBlankArticle } from "@/lib/actions";
import { Plus } from "lucide-react";

export default function CreateArticleButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      const res = await createBlankArticle();
      if (res?.success && res.id) {
        router.push(`/admin/content/${res.id}/edit`);
      } else {
        alert(res?.error || "Failed to create new draft article.");
      }
    });
  };

  return (
    <button
      onClick={handleCreate}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
    >
      {isPending ? (
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Plus size={14} />
      )}
      <span>Create New Insight</span>
    </button>
  );
}
