import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { FileText, Eye, Brain, Inbox, Users, ArrowUpRight, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  const isSuperAdminOrEditor = session?.role === "super_admin" || session?.role === "editor";

  // 1. Fetch Metrics
  const totalArticles = await prisma.content.count({
    where: { type: "blog", status: "published" },
  });

  const totalDrafts = await prisma.content.count({
    where: {
      type: "blog",
      status: { in: ["draft", "pending_review"] },
    },
  });

  // Analytics counts
  const totalViews = await prisma.analyticsEvent.count({
    where: { event_type: "page_view" },
  });

  const totalReads = await prisma.analyticsEvent.count({
    where: { event_type: "content_read" },
  });

  const readRate = totalViews > 0 ? ((totalReads / totalViews) * 100).toFixed(1) : "0.0";

  // Subscribers & Leads
  const totalSubscribers = await prisma.subscriber.count({
    where: { is_active: true },
  });

  const totalLeads = await prisma.contact.count({
    where: { status: "new" },
  });

  // 2. Fetch Top 5 Popular Posts by views
  const popularPosts = await prisma.content.findMany({
    where: { type: "blog", status: "published" },
    orderBy: { view_count: "desc" },
    take: 5,
    include: { category: true, author: true },
  });

  // 3. Fetch Recent Lead Form Inquiries (only visible to super_admin or editor)
  const recentLeads = isSuperAdminOrEditor
    ? await prisma.contact.findMany({
        orderBy: { created_at: "desc" },
        take: 3,
      })
    : [];

  const statCards = [
    { label: "Published Articles", val: totalArticles, icon: <FileText className="h-5 w-5 text-indigo-500" /> },
    { label: "Drafts & Pending", val: totalDrafts, icon: <FileText className="h-5 w-5 text-yellow-500" /> },
    { label: "Total Page Views", val: totalViews, icon: <Eye className="h-5 w-5 text-blue-500" /> },
    { label: "Read Rate", val: `${readRate}%`, icon: <Brain className="h-5 w-5 text-pink-500" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Overview Console
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Real-time updates of web reach, article counts, and organic inquiries.
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-zinc-200/60 bg-white dark:border-zinc-850 dark:bg-zinc-900/10 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className="text-2xl font-black text-zinc-900 dark:text-white block">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-150 dark:border-zinc-800">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Top Posts list */}
        <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-850">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              Popular Insights
            </h3>
            <span className="text-[10px] text-zinc-400">By View Count</span>
          </div>

          <div className="space-y-4">
            {popularPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/posts/${post.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-zinc-900 dark:text-white hover:underline truncate block"
                  >
                    {post.title}
                  </Link>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    By {post.author.name} • {post.category?.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-zinc-900 dark:text-white">{post.view_count}</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">views</span>
                </div>
              </div>
            ))}

            {popularPosts.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-4">No published posts found.</p>
            )}
          </div>
        </div>

        {/* CRM Leads column */}
        <div className="lg:col-span-5 space-y-6">
          {isSuperAdminOrEditor ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-850">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Recent Inquiries
                </h3>
                <Link
                  href="/admin/leads"
                  className="flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 dark:text-violet-400 hover:underline"
                >
                  View CRM
                  <ArrowUpRight size={10} />
                </Link>
              </div>

              <div className="space-y-4">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="border-b border-zinc-100/50 last:border-0 pb-3 last:pb-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white">{lead.name}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[8px] font-bold uppercase ${
                        lead.status === "new"
                          ? "bg-blue-500/10 text-blue-600"
                          : lead.status === "contacted"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-emerald-500/10 text-emerald-600"
                      }`}>
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      "{lead.message}"
                    </p>
                  </div>
                ))}

                {recentLeads.length === 0 && (
                  <p className="text-xs text-zinc-500 text-center py-4">No leads submitted yet.</p>
                )}
              </div>
            </div>
          ) : (
            // Subscriber count widget for authors
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm space-y-4 text-center py-10">
              <CheckCircle className="mx-auto text-emerald-500 h-10 w-10" />
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Console Status Normal</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                You have active Author privileges. You can write, preview, and edit your own insights.
              </p>
            </div>
          )}

          {/* Platform updates quick dashboard */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Users size={16} />
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-zinc-900 dark:text-white block">Newsletter Community</span>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Total active subscribers list</span>
              </div>
            </div>
            <span className="text-lg font-black text-zinc-900 dark:text-white">{totalSubscribers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
