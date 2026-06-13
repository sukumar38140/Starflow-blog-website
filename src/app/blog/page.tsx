import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import BlogFilters from "@/components/BlogFilters";
import PostCard from "@/components/PostCard";
import { ArrowLeft, ArrowRight, CornerDownRight } from "lucide-react";

export const revalidate = 60; // ISR revalidation: 60 seconds as per PRD §12.3

interface BlogPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    author?: string;
    tags?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const q = params.q || "";
  const categorySlug = params.category || "";
  const authorSlug = params.author || "";
  const tagSlugs = params.tags ? params.tags.split(",") : [];
  const sort = params.sort || "latest";
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  // 1. Fetch filter options for categories, authors, and tags
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const authors = await prisma.author.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const tags = await prisma.tag.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  // 2. Build Prisma Filter Clause
  const whereClause: any = {
    AND: [
      { type: "blog" },
      { status: "published" },
    ],
  };

  // Keyword search matches title, subtitle, or tag name
  if (q) {
    whereClause.AND.push({
      OR: [
        { title: { contains: q } },
        { subtitle: { contains: q } },
        {
          tags: {
            some: {
              tag: {
                name: { contains: q },
              },
            },
          },
        },
      ],
    });
  }

  // Category filter
  if (categorySlug) {
    whereClause.AND.push({
      category: { slug: categorySlug },
    });
  }

  // Author filter
  if (authorSlug) {
    whereClause.AND.push({
      author: { slug: authorSlug },
    });
  }

  // Multi-tag filter (AND logic: article must contain ALL selected tags)
  if (tagSlugs.length > 0) {
    tagSlugs.forEach((slug) => {
      whereClause.AND.push({
        tags: {
          some: {
            tag: { slug },
          },
        },
      });
    });
  }

  // 3. Sorting logic
  let orderByClause: any = { publish_date: "desc" }; // default latest
  if (sort === "oldest") {
    orderByClause = { publish_date: "asc" };
  } else if (sort === "views") {
    orderByClause = { view_count: "desc" };
  }

  // 4. Pagination sizing
  const itemsPerPage = 9;
  const skip = (currentPage - 1) * itemsPerPage;

  // 5. Query execution
  const totalItems = await prisma.content.count({ where: whereClause });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const posts = await prisma.content.findMany({
    where: whereClause,
    orderBy: orderByClause,
    skip,
    take: itemsPerPage,
    include: {
      category: true,
      author: true,
      featured_image: true,
    },
  });

  // Check if we render a featured card at the top.
  // We only render a FeaturedCard if we are on Page 1 AND no active search/filters are selected.
  const showFeaturedHeader = currentPage === 1 && !q && !categorySlug && !authorSlug && tagSlugs.length === 0;

  const featuredPost = showFeaturedHeader ? posts[0] : null;
  const gridPosts = showFeaturedHeader ? posts.slice(1) : posts;

  // Helpers to rebuild URL queries for pagination buttons
  const getPageUrl = (pageNumber: number) => {
    const queryParts = [];
    if (q) queryParts.push(`q=${encodeURIComponent(q)}`);
    if (categorySlug) queryParts.push(`category=${categorySlug}`);
    if (authorSlug) queryParts.push(`author=${authorSlug}`);
    if (tagSlugs.length > 0) queryParts.push(`tags=${tagSlugs.join(",")}`);
    if (sort !== "latest") queryParts.push(`sort=${sort}`);
    queryParts.push(`page=${pageNumber}`);
    return `/blog?${queryParts.join("&")}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-violet-400">
          <CornerDownRight size={14} />
          <span>StartFlow AI Resources</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
          Insights Feed
        </h1>
        <p className="max-w-2xl text-base text-zinc-500 dark:text-zinc-400">
          Browse technical architecture guidelines, design systems logic, transactional email setup, and organic growth benchmarks.
        </p>
      </div>

      {/* Filter and search controllers */}
      <BlogFilters categories={categories} authors={authors} tags={tags} />

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800 animate-fade-in">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">No insights matched your query</h3>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
            Try adjusting your search keywords, switching categories, or clearing some of the active tag filters.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex rounded-lg bg-zinc-950 px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-zinc-950"
          >
            Clear Filters
          </Link>
        </div>
      )}

      {/* Blog Cards */}
      {posts.length > 0 && (
        <div className="space-y-12">
          {/* Featured top card if on page 1 */}
          {featuredPost && (
            <div className="animate-fade-in">
              <PostCard post={featuredPost} isFeatured={true} />
            </div>
          )}

          {/* Secondary posts grid */}
          {gridPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
              {gridPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <nav className="flex items-center justify-between border-t border-zinc-200/50 pt-8 dark:border-zinc-800/60" aria-label="Pagination">
              <div className="hidden sm:block">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Showing page <span className="font-semibold text-zinc-900 dark:text-white">{currentPage}</span> of{" "}
                  <span className="font-semibold text-zinc-900 dark:text-white">{totalPages}</span> (Total{" "}
                  <span className="font-semibold text-zinc-900 dark:text-white">{totalItems}</span> posts)
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end gap-3 w-full sm:w-auto">
                <Link
                  href={currentPage > 1 ? getPageUrl(currentPage - 1) : "#"}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 ${
                    currentPage === 1 ? "pointer-events-none opacity-40" : ""
                  }`}
                  aria-disabled={currentPage === 1}
                >
                  <ArrowLeft size={12} />
                  Prev
                </Link>

                <div className="hidden md:flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isCurrent = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={getPageUrl(pageNum)}
                        className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
                          isCurrent
                            ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950"
                            : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href={currentPage < totalPages ? getPageUrl(currentPage + 1) : "#"}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3.5 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900 ${
                    currentPage === totalPages ? "pointer-events-none opacity-40" : ""
                  }`}
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                  <ArrowRight size={12} />
                </Link>
              </div>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
