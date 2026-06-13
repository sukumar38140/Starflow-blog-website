import React from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { Mail, Calendar } from "lucide-react";
import StatusUpdateButton from "@/components/StatusUpdateButton";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const session = await getSession();

  if (!session) return null;

  // Fetch all leads
  const leads = await prisma.contact.findMany({
    orderBy: { created_at: "desc" },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/10 text-blue-600 dark:bg-blue-500/5 dark:text-blue-400 border border-blue-500/20";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/5 dark:text-yellow-400 border border-yellow-500/20";
      case "converted":
        return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/5 dark:text-emerald-400 border border-emerald-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Leads Pipeline CRM
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Track consulting queries, request details, and pipeline stages.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm space-y-4"
          >
            {/* Header info */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-3 dark:border-zinc-850">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {lead.name}
                  </h3>
                  {lead.company && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      at <span className="font-semibold text-zinc-600 dark:text-zinc-300">{lead.company}</span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Mail size={12} />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(lead.created_at).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {lead.source && (
                    <span className="text-[10px] bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-500">
                      Src: {lead.source}
                    </span>
                  )}
                </div>
              </div>

              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${getStatusBadge(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            {/* Message Body */}
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-350 bg-zinc-50/50 p-4 rounded-xl dark:bg-zinc-950/20 border border-zinc-150/40 dark:border-zinc-850/40">
              "{lead.message}"
            </p>

            {/* Pipeline State Actions */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Shift pipeline status
              </span>
              <div className="flex gap-2">
                <StatusUpdateButton leadId={lead.id} status="new" currentStatus={lead.status} />
                <StatusUpdateButton leadId={lead.id} status="contacted" currentStatus={lead.status} />
                <StatusUpdateButton leadId={lead.id} status="converted" currentStatus={lead.status} />
              </div>
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Pipeline Empty</h3>
            <p className="mt-2 text-sm text-zinc-500">Form submissions on your contact page will populate here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}
