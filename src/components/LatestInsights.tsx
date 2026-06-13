"use client";

import React from "react";
import Link from "next/link";
import PostCard from "./PostCard";
import { ArrowRight, CornerDownRight } from "lucide-react";

interface LatestInsightsProps {
  posts: any[];
}

export default function LatestInsights({ posts }: LatestInsightsProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-24 md:py-40 bg-zinc-950 text-center">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
            LOGS_EMPTY // NO_PUBLISHED_POSTS
          </p>
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const sidePosts = posts.slice(1, 3); // Stack 2 posts in the 4-column side panel

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 border-t border-zinc-900/60 bg-zinc-950/20">
      
      {/* Grid Pattern and radial overlays */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow opacity-20 pointer-events-none" />

      <div className="relative z-10 space-y-12">
        {/* Header Block (Under 60 words description: 25 words) */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-zinc-900/60 pb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-indigo-400 uppercase">
              <CornerDownRight size={12} />
              <span>Decoded Intel Stream</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Latest Insights
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-lg font-sans">
              Dive into our latest decoded intelligence records. Explore deep-dives on systems engineering, agentic architecture, and workflow optimizations mapped directly by the StartFlow engineering team.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest"
          >
            <span>DECRYPT_ALL_LOGS</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Asymmetric Magazine Grid (12-columns: Left 8-cols, Right 4-cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Featured Article (8 Columns) */}
          {featuredPost && (
            <div className="lg:col-span-8 flex flex-col h-full">
              <PostCard post={featuredPost} isFeatured={true} />
            </div>
          )}

          {/* Stacked Secondary Articles (4 Columns) */}
          {sidePosts.length > 0 && (
            <div className="lg:col-span-4 flex flex-col gap-6 justify-between h-full">
              {sidePosts.map((post) => (
                <div key={post.id} className="flex-1 flex flex-col">
                  <PostCard post={post} isFeatured={false} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
