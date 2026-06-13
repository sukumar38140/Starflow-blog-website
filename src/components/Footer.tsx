import React from "react";
import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200/40 bg-zinc-50 transition-colors duration-300 dark:border-zinc-800/40 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-zinc-950 dark:bg-white flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="StartFlow Logo"
                  width={24}
                  height={24}
                  className="object-contain dark:invert-0 invert"
                />
              </div>
              <span className="text-lg font-bold text-zinc-900 dark:text-white">
                StartFlow
              </span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs leading-relaxed">
              India-based AI automation studio building websites, apps, and workflow systems for SMBs in India and worldwide.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Insights Feed
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Company Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/privacy-policy" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-wider uppercase">
              Subscribe to Growth
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Get the latest insights on SEO, AI architectures, and web technology directly to your inbox.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 border-t border-zinc-200/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 dark:border-zinc-800/50">
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            &copy; {currentYear} StartFlow // All Rights Reserved.
          </p>
          <div className="flex gap-4 flex-wrap">
            <a
              href="https://www.facebook.com/share/1Gor1rcbe8/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-950 transition-colors dark:hover:text-white text-xs"
            >
              Facebook
            </a>
            <a
              href="https://x.com/StartFlowin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-950 transition-colors dark:hover:text-white text-xs"
            >
              Twitter / X
            </a>
            <a
              href="https://www.instagram.com/startflow.in?utm_source=qr&igsh=MWhqdjV2NnBjZm1qOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-950 transition-colors dark:hover:text-white text-xs"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/sushil-startflow?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-950 transition-colors dark:hover:text-white text-xs"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
