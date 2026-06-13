import React from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { LayoutDashboard, FileText, Inbox, Users, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();

  // Guard (fallback in case middleware didn't intercept)
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <div className="space-y-4 text-center">
          <p>Checking authorization session...</p>
          <Link href="/admin/login" className="underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  const isSuperAdminOrEditor = session.role === "super_admin" || session.role === "editor";

  const adminLinks = [
    { label: "Overview", href: "/admin", icon: <LayoutDashboard size={16} />, visible: true },
    { label: "Content CMS", href: "/admin/content", icon: <FileText size={16} />, visible: true },
    { label: "Leads CRM", href: "/admin/leads", icon: <Inbox size={16} />, visible: isSuperAdminOrEditor },
    { label: "Subscribers", href: "/admin/subscribers", icon: <Users size={16} />, visible: isSuperAdminOrEditor },
  ];

  return (
    <div className="flex min-h-[90vh] bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-900 dark:text-zinc-50 border-t border-zinc-200/40 dark:border-zinc-800/40 transition-colors duration-300">
      <div className="mx-auto max-w-7xl w-full flex flex-col md:flex-row gap-8 px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          {/* User Details box */}
          <div className="rounded-2xl border border-zinc-200/60 bg-white p-5 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm shadow-sm space-y-3">
            <div>
              <div className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Active Console Session
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white mt-1">
                {session.name}
              </div>
              <div className="inline-flex mt-1 items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-600 dark:bg-violet-400/10 dark:text-violet-400 uppercase">
                {session.role.replace("_", " ")}
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 w-full text-left"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* Links navigation list */}
          <nav className="rounded-2xl border border-zinc-200/60 bg-white p-3 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm shadow-sm flex flex-col gap-1">
            {adminLinks
              .filter((l) => l.visible)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-xs font-bold text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-white transition-colors"
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
          </nav>
        </aside>

        {/* Page Content viewport */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
