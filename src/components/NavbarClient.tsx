"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { Sun, Moon, Menu, X, LayoutDashboard, User, LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions";

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface NavbarClientProps {
  session: SessionUser | null;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logoutAction();
    window.location.reload();
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Insights", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/40 bg-white/70 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800/40 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-32 overflow-hidden rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center p-1.5 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="StartFlow Logo"
                width={120}
                height={32}
                className="object-contain dark:invert-0 invert"
              />
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-white ${
                isActive(link.href)
                  ? "text-zinc-950 dark:text-white font-semibold"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Admin link */}
          {session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg p-2 text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors dark:text-zinc-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-950/10 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:hover:shadow-white/5"
            >
              <User size={14} />
              Console Login
            </Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200/50 bg-white px-4 py-4 space-y-3 dark:border-zinc-800/50 dark:bg-zinc-950 transition-colors duration-300">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-zinc-200/50 pt-3 dark:border-zinc-800/50">
            {session ? (
              <div className="space-y-2">
                <div className="px-3 py-1.5 text-xs text-zinc-400">
                  Logged in as <span className="font-semibold text-zinc-700 dark:text-zinc-200">{session.name}</span>
                </div>
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <LayoutDashboard size={16} />
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-50 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-zinc-950"
              >
                <User size={16} />
                Console Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
