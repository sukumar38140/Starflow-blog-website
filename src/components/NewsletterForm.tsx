"use client";

import React, { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setState(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("source", "footer");

      const res = await subscribeNewsletter(null, formData);
      if (res?.error) {
        setState({ error: res.error });
      } else {
        setState({ success: true, message: res?.message || "Subscribed successfully!" });
        setEmail("");
      }
    });
  };

  return (
    <div className="w-full max-w-sm">
      {state?.success ? (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20 animate-fade-in">
          <CheckCircle2 size={16} className="shrink-0" />
          <span>{state.message || "Thank you for subscribing!"}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative mt-2">
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white"
            />
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center justify-center gap-1 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-zinc-800 focus:outline-none disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {isPending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <>
                  <Send size={14} />
                  <span>Join</span>
                </>
              )}
            </button>
          </div>
          {state?.error && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 animate-slide-up">
              <AlertCircle size={12} />
              <span>{state.error}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
