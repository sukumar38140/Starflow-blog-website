import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import ExportCsvButton from "@/components/ExportCsvButton";
import { Mail, Clock, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
  const session = await getSession();

  if (!session) return null;

  // Query all subscribers
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Export button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            View and export community newsletter signup details.
          </p>
        </div>
        <ExportCsvButton data={subscribers} />
      </div>

      {/* Subscribers Table grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 bg-zinc-50/50 dark:border-zinc-850 dark:bg-zinc-900/30 text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                <th className="px-6 py-3.5">Email Address</th>
                <th className="px-6 py-3.5">Signup Source</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Date Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {subscribers.map((sub) => (
                <tr
                  key={sub.id}
                  className="text-xs text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
                >
                  {/* Email */}
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Mail size={13} className="text-zinc-400" />
                    {sub.email}
                  </td>
                  {/* Source */}
                  <td className="px-6 py-4">
                    <span className="capitalize">{sub.source || "footer"}</span>
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 font-medium">
                      {sub.is_active ? (
                        <>
                          <CheckCircle size={12} className="text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="text-red-500" />
                          <span className="text-red-650 dark:text-red-400">Unsubscribed</span>
                        </>
                      )}
                    </span>
                  </td>
                  {/* Date */}
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5 text-zinc-450 dark:text-zinc-500">
                    <Clock size={12} />
                    {new Date(sub.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}

              {subscribers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                    No subscribers joined yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
