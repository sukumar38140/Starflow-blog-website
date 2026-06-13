import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import BlockRenderer from "@/components/BlockRenderer";
import ActiveHeadingTracker from "@/components/ActiveHeadingTracker";
import ShareButtons from "@/components/ShareButtons";
import ReadProgressTracker from "@/components/ReadProgressTracker";
import PostCard from "@/components/PostCard";
import { Calendar, Clock, ArrowLeft, User, Eye, Tag } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 300; // ISR revalidation: 300 seconds as per PRD §12.3

interface PostDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.content.findUnique({
    where: { type_slug: { type: "blog", slug } },
  });

  if (!post) return {};

  const title = post.seo_title || `${post.title} | StartFlow AI`;
  const description = post.seo_description || post.subtitle || "";
  const isArchived = post.status === "archived";

  return {
    title,
    description,
    robots: isArchived ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/posts/${slug}`,
      publishedTime: post.publish_date?.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { slug } = await params;

  // 1. Fetch Post Details
  const post = await prisma.content.findUnique({
    where: {
      type_slug: { type: "blog", slug },
    },
    include: {
      category: true,
      author: {
        include: { photo: true }
      },
      featured_image: true,
      blocks: {
        orderBy: { position: "asc" },
      },
      tags: {
        include: { tag: true }
      }
    },
  });

  // If not found or not public status (unless previewing, but for public detail we restrict)
  if (!post || (post.status !== "published" && post.status !== "archived")) {
    notFound();
  }

  const readTime = Math.max(1, Math.ceil(post.word_count / 238));
  const formattedDate = post.publish_date
    ? new Date(post.publish_date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Draft";

  // 2. Extract Headings for TOC (Only H2s defined in text blocks)
  const headings = post.blocks
    .filter((b) => b.type === "text")
    .map((b) => {
      try {
        const parsed = JSON.parse(b.data);
        if (parsed.heading) {
          return {
            text: parsed.heading,
            id: parsed.heading.toLowerCase().replace(/[^\w]+/g, "-"),
          };
        }
      } catch (_e) {}
      return null;
    })
    .filter(Boolean) as { text: string; id: string }[];

  // 3. Fetch Related Posts (3 posts, same category, excluding current, ordered by recency)
  const relatedPosts = await prisma.content.findMany({
    where: {
      type: "blog",
      status: "published",
      category_id: post.category_id,
      id: { not: post.id },
    },
    orderBy: { publish_date: "desc" },
    take: 3,
    include: {
      category: true,
      author: true,
      featured_image: true,
    },
  });

  return (
    <div className="relative min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300 animate-fade-in">
      {/* 70% Scroll Sentinel for Analytics */}
      <ReadProgressTracker postId={post.id} />

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Insights Feed
        </Link>

        <article className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left / Main Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {post.category && (
                  <Link
                    href={`/blog?category=${post.category.slug}`}
                    className="rounded-full px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider"
                    style={{ backgroundColor: post.category.color || "#6b7280" }}
                  >
                    {post.category.name}
                  </Link>
                )}
                <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                  <Clock size={12} />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500">
                  <Eye size={12} />
                  {post.view_count} views
                </span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl leading-tight">
                {post.title}
              </h1>

              {post.subtitle && (
                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                  {post.subtitle}
                </p>
              )}

              {/* Author & Date Box */}
              <div className="flex items-center justify-between border-y border-zinc-100 py-4 dark:border-zinc-850">
                <div className="flex items-center gap-3">
                  {post.author.photo?.cloudinary_url ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-200 dark:border-zinc-800">
                      <Image
                        src={post.author.photo.cloudinary_url}
                        alt={post.author.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <User size={20} />
                    </div>
                  )}
                  <div className="text-left">
                    <Link
                      href={`/blog?author=${post.author.slug}`}
                      className="text-sm font-bold text-zinc-900 dark:text-white hover:underline"
                    >
                      {post.author.name}
                    </Link>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {post.author.designation}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar size={14} />
                  {formattedDate}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative w-full rounded-2xl overflow-hidden aspect-video border border-zinc-200/50 dark:border-zinc-800/50">
                <Image
                  src={post.featured_image.cloudinary_url}
                  alt={post.featured_image.alt_text || post.title}
                  fill
                  className="object-cover"
                  sizes="(max-w-1200px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Blocks Content list */}
            <div className="space-y-4">
              {post.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>

            {/* Tags footer */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-6 dark:border-zinc-850">
                <Tag size={14} className="text-zinc-400 dark:text-zinc-500" />
                {post.tags.map((ct) => (
                  <Link
                    key={ct.tag.id}
                    href={`/blog?tags=${ct.tag.slug}`}
                    className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-650 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800"
                  >
                    {ct.tag.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Column / Sticky Sidebar */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24 h-fit">
            {/* Table of contents and progress tracker */}
            {headings.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm">
                <ActiveHeadingTracker headings={headings} />
              </div>
            )}

            {/* Action Card: Social Sharing */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Article Actions
              </span>
              <ShareButtons title={post.title} />
            </div>

            {/* Sidebar Promo Call to Action */}
            <div className="rounded-2xl bg-zinc-950 p-6 border border-zinc-900 space-y-4 text-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Partner with StartFlow AI
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Scale your technical audience and generate qualified inbound lead calls automatically.
              </p>
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-white py-2.5 text-xs font-bold text-zinc-950 text-center hover:bg-zinc-200 transition-colors"
              >
                Schedule Consult Call
              </Link>
            </div>
          </div>
        </article>

        {/* Bottom / Related Posts Grid */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 border-t border-zinc-200/50 pt-16 dark:border-zinc-800/60 space-y-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Related Insights
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Continue reading related articles from our {post.category?.name} collection.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((rPost) => (
                <PostCard key={rPost.id} post={rPost} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
