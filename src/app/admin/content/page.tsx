import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import CreateArticleButton from "@/components/CreateArticleButton";
import DeleteArticleButton from "@/components/DeleteArticleButton";
import { Edit3, Eye, CheckCircle, Clock, Archive } from "lucide-react";

export const dynamic = "force-dynamic";

interface ContentListPageProps {
  searchParams: Promise<{
    status?: string;
  }>;
}

export default async function ContentListPage({ searchParams }: ContentListPageProps) {
  const session = await getSession();
  const params = await searchParams;
  const activeStatus = params.status || "all";

  if (!session) return null;

  const isAuthor = session.role === "author";
  const isSuperAdmin = session.role === "super_admin";

  // Build prisma filter
  const where: any = {
    type: "blog",
  };

  // Enforce Author permissions: can only view own content
  if (isAuthor) {
    where.author = {
      slug: session.name.toLowerCase().replace(/\s+/g, "-"),
    };
  }

  // Filter by status tab selection
  if (activeStatus !== "all") {
    where.status = activeStatus;
  }

  // Query articles list
  const articles = await prisma.content.findMany({
    where,
    orderBy: { updated_at: "desc" },
    include: {
      category: true,
      author: true,
    },
  });

  const tabs = [
    { label: "All Insights", value: "all" },
    { label: "Drafts", value: "draft" },
    { label: "Pending Review", value: "pending_review" },
    { label: "Published", value: "published" },
    { label: "Archived", value: "archived" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle size={12} className="text-emerald-500" />;
      case "draft":
        return <Clock size={12} className="text-zinc-500" />;
      case "pending_review":
        return <Clock size={12} className="text-yellow-500 animate-pulse" />;
      case "archived":
        return <Archive size={12} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Content Editor CMS
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Write, review, publish, and archive technical insights and case studies.
          </p>
        </div>
        <CreateArticleButton />
      </div>

      {/* Status tabs */}
      <div className="border-b border-zinc-200/50 dark:border-zinc-800/60 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.value === activeStatus;
          return (
            <Link
              key={tab.value}
              href={`/admin/content?status=${tab.value}`}
              className={`pb-3.5 px-2.5 text-xs font-bold transition-all relative border-b-2 ${
                isActive
                  ? "border-zinc-950 text-zinc-950 dark:border-white dark:text-white"
                  : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Articles table grid */}
      <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-150 bg-zinc-50/50 dark:border-zinc-850 dark:bg-zinc-900/30 text-[10px] font-bold uppercase tracking-wider text-zinc-450 dark:text-zinc-500">
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Author</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-center">Stats (V/R)</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
              {articles.map((post) => (
                <tr
                  key={post.id}
                  className="text-xs text-zinc-700 dark:text-zinc-350 hover:bg-zinc-50/40 dark:hover:bg-zinc-900/10 transition-colors"
                >
                  {/* Title */}
                  <td className="px-6 py-4 font-semibold text-zinc-900 dark:text-white max-w-[280px] truncate">
                    {post.title}
                  </td>
                  {/* Category */}
                  <td className="px-6 py-4">
                    <span
                      className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-white"
                      style={{ backgroundColor: post.category?.color || "#6b7280" }}
                    >
                      {post.category?.name || "Uncategorized"}
                    </span>
                  </td>
                  {/* Author */}
                  <td className="px-6 py-4">{post.author.name}</td>
                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 capitalize font-medium">
                      {getStatusIcon(post.status)}
                      {post.status.replace("_", " ")}
                    </span>
                  </td>
                  {/* Views/Reads */}
                  <td className="px-6 py-4 text-center space-x-1.5">
                    <span className="inline-flex items-center gap-0.5 font-bold text-zinc-900 dark:text-white">
                      {post.view_count}
                    </span>
                    <span className="text-zinc-400">/</span>
                    <span className="inline-flex items-center gap-0.5 text-zinc-500">
                      {post.read_count}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === "published" && (
                        <Link
                          href={`/posts/${post.slug}`}
                          target="_blank"
                          className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
                          title="View Article"
                        >
                          <Eye size={14} />
                        </Link>
                      )}
                      <Link
                        href={`/admin/content/${post.id}/edit`}
                        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
                        title="Edit Article"
                      >
                        <Edit3 size={14} />
                      </Link>
                      {isSuperAdmin && (
                        <DeleteArticleButton id={post.id} title={post.title} />
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {articles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No articles found in this section.
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
