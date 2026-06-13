"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);

      const res = await loginAction(null, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-white px-4 py-12 dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-zinc-200/50 bg-zinc-50/20 p-8 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm shadow-sm animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto relative h-12 w-12 overflow-hidden rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/logo.png"
              alt="StartFlow Logo"
              width={36}
              height={36}
              className="object-contain dark:invert-0 invert"
            />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Console Login
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Sign in to manage insights, tags, leads, and analytics.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@startflow.in"
                required
                disabled={isPending}
                className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:opacity-50 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isPending}
                className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-10 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:opacity-50 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-450 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3.5 text-xs text-red-600 dark:bg-red-500/5 dark:text-red-400 border border-red-500/20 animate-slide-up">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-950 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isPending ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <span>Sign In to Console</span>
            )}
          </button>
        </form>

        {/* Demo Helper */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 text-left space-y-2">
          <h3 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Demo Credentials
          </h3>
          <ul className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
            <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Super Admin:</span> admin@startflow.in / Password123!</li>
            <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Editor:</span> editor@startflow.in / Password123!</li>
            <li><span className="font-semibold text-zinc-700 dark:text-zinc-300">Author:</span> author@startflow.in / Password123!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
