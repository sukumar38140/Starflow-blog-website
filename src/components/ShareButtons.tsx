"use client";

import React, { useState } from "react";
import { Link2, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getPageUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(getPageUrl());
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank");
  };

  const handleShareLinkedin = () => {
    const url = encodeURIComponent(getPageUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleCopyLink = () => {
    const url = getPageUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">Share:</span>
      <button
        onClick={handleShareTwitter}
        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
        aria-label="Share on Twitter"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>
      <button
        onClick={handleShareLinkedin}
        className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors flex items-center justify-center"
        aria-label="Share on LinkedIn"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
        </svg>
      </button>
      <button
        onClick={handleCopyLink}
        className="relative rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white transition-colors"
        aria-label="Copy Page Link"
      >
        {copied ? (
          <>
            <Check size={15} className="text-emerald-500 animate-pulse" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-zinc-900 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-white dark:text-zinc-950 shadow animate-fade-in whitespace-nowrap">
              Copied!
            </span>
          </>
        ) : (
          <Link2 size={15} />
        )}
      </button>
    </div>
  );
}
