"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, ChevronRight, Brain, Sparkles } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    subtitle: string | null;
    slug: string;
    view_count: number;
    read_count: number;
    word_count: number;
    publish_date: Date | string | null;
    category: { name: string; slug: string; color: string | null } | null;
    author: { name: string; slug: string; designation: string } | null;
    featured_image: { cloudinary_url: string; alt_text: string | null } | null;
  };
  isFeatured?: boolean;
}

export default function PostCard({ post, isFeatured = false }: PostCardProps) {
  const [showAI, setShowAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const formattedDate = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  const readTime = Math.max(1, Math.ceil(post.word_count / 238));

  // Truncate descriptions to strictly under 20 words for clean content density
  const getTruncatedText = (text: string | null, limit: number = 18) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= limit) return text;
    return words.slice(0, limit).join(" ") + "...";
  };

  const truncatedSubtitle = getTruncatedText(post.subtitle);

  // Mouse move handler for radial glow border tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleToggleAI = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!showAI) {
      setLoadingAI(true);
      setTimeout(() => {
        setLoadingAI(false);
        setShowAI(true);
      }, 600);
    } else {
      setShowAI(false);
    }
  };

  const categoryColor = post.category?.color || "#6b7280";

  // 1. Featured Card Layout (Takes 8 columns in grid)
  if (isFeatured) {
    return (
      <div 
        onMouseMove={handleMouseMove}
        style={{
          "--mouse-x": `${mouseCoords.x}px`,
          "--mouse-y": `${mouseCoords.y}px`,
        } as React.CSSProperties}
        className="group relative rounded-[24px] border border-zinc-900/60 bg-zinc-950/40 p-0.5 overflow-hidden transition-all duration-300 hover:scale-[1.005] hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]"
      >
        {/* Dynamic border tracking glow background */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(280px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.35), rgba(139, 92, 246, 0.2) 60%, transparent 100%)`
          }}
        />

        {/* Inner Card Container (Rounded 20px/rounded-2xl masks the glow) */}
        <div className="relative rounded-[22px] bg-zinc-950 overflow-hidden h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            
            {/* Cover Image (Left Side) */}
            <div className="relative min-h-[260px] lg:min-h-[350px] lg:col-span-6 overflow-hidden bg-zinc-900">
              <Image
                src={post.featured_image?.cloudinary_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80"}
                alt={post.featured_image?.alt_text || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                sizes="(max-w-720px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent lg:hidden" />
              <div className="absolute top-4 left-4 z-20">
                <span
                  className="rounded-full px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider"
                  style={{ backgroundColor: categoryColor }}
                >
                  {post.category?.name || "Uncategorized"}
                </span>
              </div>
            </div>

            {/* Details (Right Side) */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6 relative z-10 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {readTime} MIN READ
                  </span>
                  <span>//</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {formattedDate}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl leading-snug hover:text-indigo-400 transition-colors">
                  <Link href={`/posts/${post.slug}`} className="focus:outline-none">
                    {post.title}
                  </Link>
                </h2>

                {/* Truncated Subtitle (under 20 words) */}
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {truncatedSubtitle}
                </p>
              </div>

              {/* Interactive AI Drawer */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleToggleAI}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 px-3 py-1.5 text-[10px] font-mono font-bold text-indigo-400 transition-all"
                >
                  <Brain size={12} className={loadingAI ? "animate-pulse" : ""} />
                  {showAI ? "HIDE INTEL" : "DECODE INSIGHTS"}
                </button>

                {loadingAI && (
                  <div className="rounded-xl border border-zinc-900 bg-zinc-900/40 p-3.5 flex items-center gap-2.5 text-[10px] font-mono text-zinc-500 animate-pulse">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border border-indigo-500 border-t-transparent" />
                    <span>Synchronizing dynamic key takeaways...</span>
                  </div>
                )}

                {showAI && !loadingAI && (
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 animate-slide-up text-xs text-zinc-350 leading-relaxed font-sans relative">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-indigo-400 mb-2">
                      <Sparkles size={10} />
                      <span>DECODED_AI_KEY_TAKEAWAY</span>
                    </div>
                    {/* Simulated concise takeaways (under 20 words constraint) */}
                    {"Agentic networks and self-correcting pipelines represent the future of digital operations and autonomous system architectures."}
                  </div>
                )}

                {/* Author footer */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-4 text-[10px] font-mono text-zinc-500">
                  <div>
                    <span className="text-zinc-400 font-bold block">{post.author?.name || "Author"}</span>
                    <span className="text-[9px] uppercase tracking-wider block mt-0.5">{post.author?.designation || "Contributor"}</span>
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-bold"
                  >
                    DEPLOY INTEL <ChevronRight size={10} className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Regular Module Card Layout (Takes 4 columns in grid)
  return (
    <div 
      onMouseMove={handleMouseMove}
      style={{
        "--mouse-x": `${mouseCoords.x}px`,
        "--mouse-y": `${mouseCoords.y}px`,
      } as React.CSSProperties}
      className="group relative rounded-[24px] border border-zinc-900/60 bg-zinc-950/40 p-0.5 overflow-hidden transition-all duration-300 hover:scale-[1.005] hover:shadow-[0_0_30px_rgba(99,102,241,0.08)] flex flex-col"
    >
      {/* Dynamic border tracking glow background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(220px circle at var(--mouse-x) var(--mouse-y), rgba(6, 182, 212, 0.35), rgba(139, 92, 246, 0.2) 60%, transparent 100%)`
        }}
      />

      {/* Inner Card Container (Rounded 20px/rounded-2xl masks the glow) */}
      <div className="relative rounded-[22px] bg-zinc-950 overflow-hidden p-5 flex flex-col justify-between flex-1 space-y-5">
        
        <div className="space-y-4">
          {/* Cover image area */}
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-900">
            <Image
              src={post.featured_image?.cloudinary_url || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80"}
              alt={post.featured_image?.alt_text || post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              sizes="(max-w-720px) 100vw, 30vw"
            />
            <div className="absolute top-2.5 left-2.5 z-20">
              <span
                className="rounded-full px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider"
                style={{ backgroundColor: categoryColor }}
              >
                {post.category?.name || "Uncategorized"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[9px] font-mono text-zinc-500">
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {readTime} MIN READ
            </span>
            <span>//</span>
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-extrabold tracking-tight text-white leading-snug hover:text-indigo-400 transition-colors line-clamp-2">
            <Link href={`/posts/${post.slug}`} className="focus:outline-none">
              {post.title}
            </Link>
          </h3>

          {/* Truncated Subtitle (under 20 words) */}
          <p className="text-xs text-zinc-450 leading-relaxed font-sans line-clamp-2">
            {truncatedSubtitle}
          </p>
        </div>

        {/* AI summary button & footer info */}
        <div className="pt-2 space-y-3">
          <button
            onClick={handleToggleAI}
            className="inline-flex items-center gap-1 rounded bg-zinc-900 border border-zinc-850 hover:bg-zinc-900/60 px-2 py-1 text-[9px] font-mono font-bold text-indigo-400 transition-all"
          >
            <Brain size={10} className={loadingAI ? "animate-pulse" : ""} />
            {showAI ? "HIDE INTEL" : "DECODE INTEL"}
          </button>

          {loadingAI && (
            <div className="rounded-lg border border-zinc-900 bg-zinc-900/40 p-2.5 flex items-center gap-2 text-[9px] font-mono text-zinc-500 animate-pulse">
              <div className="h-3 w-3 animate-spin rounded-full border border-indigo-500 border-t-transparent" />
              <span>Decoding...</span>
            </div>
          )}

          {showAI && !loadingAI && (
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 animate-slide-up text-[10px] text-zinc-350 leading-relaxed font-sans">
              <p className="font-bold text-indigo-400 text-[8px] font-mono uppercase tracking-wider mb-1">
                &gt;&gt; KEY TAKEAWAY
              </p>
              {"Deploying autonomous agents reduces manual overhead and optimizes pipeline workflows."}
            </div>
          )}

          {/* Footer author details */}
          <div className="flex items-center justify-between border-t border-zinc-900 pt-3 text-[10px] font-mono text-zinc-500">
            <span className="text-zinc-400 font-bold">{post.author?.name || "Author"}</span>
            <Link
              href={`/posts/${post.slug}`}
              className="inline-flex items-center gap-0.5 text-indigo-400 hover:text-indigo-300 font-bold group-hover:translate-x-0.5 transition-transform"
            >
              DEPLOY <ChevronRight size={10} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
