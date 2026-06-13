"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatItemProps {
  value: string;
  label: string;
  description?: string;
}

function StatCard({ value, label, description }: StatItemProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const cardRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isReducedMotion) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateValue();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  const animateValue = () => {
    // Parse the value: extract leading numbers, decimals, and suffix
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseFloat(match[1]);
    const suffix = match[2];
    const isDecimal = match[1].includes(".");
    
    let current = 0;
    const duration = 1500; // 1.5 seconds
    const frameRate = 60;
    const totalFrames = (duration / 1000) * frameRate;
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      
      // Easing out quad
      const easeProgress = progress * (2 - progress);
      current = targetNum * easeProgress;

      if (frame >= totalFrames) {
        clearInterval(interval);
        setDisplayValue(value);
      } else {
        const formatted = isDecimal ? current.toFixed(1) : Math.floor(current).toString();
        setDisplayValue(`${formatted}${suffix}`);
      }
    }, 1000 / frameRate);
  };

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/50 bg-white p-8 text-center shadow-sm transition-all hover:scale-[1.02] hover:border-zinc-300 dark:border-zinc-800/50 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
    >
      <span className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
        {displayValue}
      </span>
      <span className="mt-2 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {label}
      </span>
      {description && (
        <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 max-w-[200px]">
          {description}
        </span>
      )}
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    { value: "99.9%", label: "Platform Uptime", description: "Standard monthly service level agreement guarantee." },
    { value: "10x", label: "Speedup in Publishing", description: "Generate SEO metadata and blocks in seconds." },
    { value: "40%", label: "Conversion Lift", description: "Average boost in organic inbound consultation calls." },
    { value: "1.2s", label: "P75 LCP Performance", description: "Ultra-fast page loads on global edge nodes." },
  ];

  return (
    <section className="border-t border-zinc-200/40 py-24 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-zinc-900 dark:text-white">
            Engineered for High-Performance Growth
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A combined approach of modern static web architectures, structured block delivery, and responsive layouts.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard
              key={idx}
              value={stat.value}
              label={stat.label}
              description={stat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
