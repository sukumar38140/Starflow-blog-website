"use client";

import React, { useState } from "react";
import { MessageSquare, Quote, Sparkles } from "lucide-react";

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  designation: string;
  company: string;
  category: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "STARTUP" | "OTHER">("ALL");

  const filteredTestimonials = testimonials.filter((t) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "STARTUP") {
      // Map saas/startup elements
      return t.category === "saas" || t.category === "startup";
    }
    if (activeTab === "OTHER") {
      // Map agency/enterprise/business elements
      return t.category === "agency" || t.category === "enterprise" || t.category === "business";
    }
    return true;
  });

  return (
    <section className="border-t border-zinc-200/40 py-24 dark:border-zinc-800/40" id="proof">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/10 bg-violet-500/5 px-3 py-1 text-[10px] font-mono font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest">
            <Sparkles size={10} />
            <span>Social Proof // Wall of Proof</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-white">
            Evidence of Execution Across Our Ecosystem
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Real builders. Real products. Real execution data from our automated operations network.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-200/50 pb-6 dark:border-zinc-850/60 mb-10 max-w-5xl mx-auto">
          <div className="flex bg-zinc-100 p-1 rounded-xl dark:bg-zinc-900/60 border border-zinc-200/40 dark:border-zinc-800/40">
            {(["ALL", "STARTUP", "OTHER"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all uppercase tracking-wider ${
                  activeTab === tab
                    ? "bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950"
                    : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              // Direct navigation to strategy call page
              window.location.href = "/contact";
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-350 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-800 dark:text-zinc-300 transition-all duration-300"
          >
            <MessageSquare size={13} />
            <span>Add Your Feedback</span>
          </button>
        </div>

        {/* Testimonials Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="relative rounded-3xl border border-zinc-200/50 bg-white/40 p-6 shadow-sm backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/10 hover:border-zinc-350 dark:hover:border-zinc-750 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Quote Mark background */}
              <div className="absolute top-4 right-5 text-zinc-100 dark:text-zinc-900/45 pointer-events-none">
                <Quote size={40} strokeWidth={1.5} />
              </div>

              {/* Body */}
              <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                <p className="text-xs font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
                  "{item.quote}"
                </p>

                {/* Profile Meta info */}
                <div className="border-t border-zinc-100 pt-4 dark:border-zinc-850/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">
                      {item.author}
                    </div>
                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-0.5 uppercase">
                      {item.company}
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded bg-violet-500/10 px-2 py-0.5 text-[9px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredTestimonials.length === 0 && (
            <div className="col-span-full text-center py-12 text-zinc-500">
              No testimonials found in this category.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
