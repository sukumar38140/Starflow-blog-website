"use client";

import React from "react";
import { HelpCircle } from "lucide-react";

interface Faq {
  id: string;
  question: string;
  answer: string;
  position: number;
}

interface FaqSectionProps {
  faqs: Faq[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  // Sort FAQs by position
  const sortedFaqs = [...faqs].sort((a, b) => a.position - b.position);

  return (
    <section className="border-t border-zinc-200/40 py-24 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-950/30" id="faqs">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <span className="text-[10px] font-mono font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-widest block">
            INTELLIGENCE BASE
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-zinc-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Answers to common questions about StartFlow AI automation, workflows, integrations, and deployment.
          </p>
        </div>

        {/* List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {sortedFaqs.map((faq) => (
            <details
              key={faq.id}
              className="group rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-850 dark:bg-zinc-900/50 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden hover:border-zinc-350 dark:hover:border-zinc-750"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 focus:outline-none">
                <div className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-violet-500 shrink-0" />
                  <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white leading-relaxed">
                    {faq.question}
                  </h3>
                </div>
                <span className="relative h-5 w-5 shrink-0">
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 bg-zinc-400 group-open:hidden transition-transform duration-300" />
                  <span className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-zinc-400 group-open:hidden transition-transform duration-300" />
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-3 -translate-x-1/2 -translate-y-1/2 bg-zinc-400 hidden group-open:block transition-transform duration-300" />
                </span>
              </summary>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 pl-7 font-sans">
                {faq.answer}
              </p>
            </details>
          ))}

          {sortedFaqs.length === 0 && (
            <div className="text-center py-6 text-zinc-500">
              No FAQs added yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
