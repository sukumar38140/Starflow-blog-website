"use client";

import React, { useEffect, useState } from "react";

interface HeadingItem {
  text: string;
  id: string;
}

interface ActiveHeadingTrackerProps {
  headings: HeadingItem[];
}

export default function ActiveHeadingTracker({ headings }: ActiveHeadingTrackerProps) {
  const [activeId, setActiveId] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // 1. Reading Progress Bar Logic
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // 2. TOC Highlight Logic using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        // Find entries in the viewport
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Highlight the first visible heading
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "0px 0px -40% 0px", // triggers when heading reaches top 60% of viewport
        threshold: 0.1,
      }
    );

    // Track all h2 elements that match the headings list
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, [headings]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of fixed navbar + safety margin
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setActiveId(id);
    }
  };

  return (
    <>
      {/* Scroll Progress Bar at the top of the screen */}
      <div className="fixed top-16 left-0 right-0 z-40 h-[3px] bg-zinc-100 dark:bg-zinc-900 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sticky Table of Contents navigation list */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          In this article
        </h3>
        <nav className="flex flex-col gap-2">
          {headings.map((h) => {
            const isActive = h.id === activeId;
            return (
              <a
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => handleLinkClick(e, h.id)}
                className={`text-xs pl-3 py-1 transition-all border-l ${
                  isActive
                    ? "border-indigo-650 text-indigo-600 dark:border-violet-400 dark:text-violet-400 font-bold"
                    : "border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-white dark:hover:border-zinc-650"
                }`}
              >
                {h.text}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
}
