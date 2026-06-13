"use client";

import React from "react";
import { Download } from "lucide-react";

interface SubscriberRow {
  email: string;
  is_active: boolean;
  source: string | null;
  created_at: string | Date;
}

interface ExportCsvButtonProps {
  data: SubscriberRow[];
}

export default function ExportCsvButton({ data }: ExportCsvButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      alert("No subscribers available to export.");
      return;
    }

    const headers = ["Email", "Active Status", "Signup Source", "Added Date"];
    const rows = data.map((s) => [
      s.email,
      s.is_active ? "Active" : "Unsubscribed",
      s.source || "Unknown",
      new Date(s.created_at).toISOString().split("T")[0],
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `subscribers_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
    >
      <Download size={14} />
      <span>Export CSV</span>
    </button>
  );
}
