"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface BlogFiltersProps {
  categories: FilterOption[];
  authors: FilterOption[];
  tags: FilterOption[];
}

export default function BlogFilters({ categories, authors, tags }: BlogFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Local state for search to allow debouncing
  const [searchVal, setSearchVal] = useState(searchParams.get("q") || "");

  // Read current filters from URL params
  const currentCategory = searchParams.get("category") || "";
  const currentAuthor = searchParams.get("author") || "";
  const currentSort = searchParams.get("sort") || "latest";
  const selectedTags = searchParams.get("tags") ? searchParams.get("tags")!.split(",") : [];

  // Update URL helpers
  const updateParams = (newParams: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Always reset page to 1 on filter/search change
    params.set("page", "1");

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.join(","));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // Search Debounce: 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchVal !== (searchParams.get("q") || "")) {
        updateParams({ q: searchVal });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchVal]);

  const handleTagToggle = (tagSlug: string) => {
    let nextTags: string[];
    if (selectedTags.includes(tagSlug)) {
      nextTags = selectedTags.filter((t) => t !== tagSlug);
    } else {
      nextTags = [...selectedTags, tagSlug];
    }
    updateParams({ tags: nextTags });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 p-6 transition-colors duration-300 dark:border-zinc-800/50 dark:bg-zinc-900/10 backdrop-blur-sm">
      {/* Row 1: Search and Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="relative md:col-span-5">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search insights by title, tag, keyword..."
            className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:placeholder-zinc-500 dark:focus:border-white dark:focus:ring-white"
          />
        </div>

        {/* Category Dropdown */}
        <div className="md:col-span-3">
          <select
            value={currentCategory}
            onChange={(e) => updateParams({ category: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-white dark:focus:ring-white"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author Dropdown */}
        <div className="md:col-span-2">
          <select
            value={currentAuthor}
            onChange={(e) => updateParams({ author: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-white dark:focus:ring-white"
          >
            <option value="">All Authors</option>
            {authors.map((a) => (
              <option key={a.id} value={a.slug}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-2">
          <select
            value={currentSort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none transition-all focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-white dark:focus:ring-white"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Row 2: Tag Multi-Select Filters */}
      <div className="space-y-2 border-t border-zinc-200/50 pt-4 dark:border-zinc-800/60">
        <span className="text-[11px] font-bold tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
          Filter by tags (AND Logic)
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.slug);
            return (
              <button
                key={tag.id}
                onClick={() => handleTagToggle(tag.slug)}
                className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                    : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-450 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Row 3: Active Filters Summary Chips */}
      {(currentCategory || currentAuthor || searchVal || selectedTags.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200/50 pt-4 dark:border-zinc-800/60 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Active filters:</span>
            {searchVal && (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Search: "{searchVal}"
                <button onClick={() => setSearchVal("")} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
            {currentCategory && (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Cat: {categories.find((c) => c.slug === currentCategory)?.name || currentCategory}
                <button onClick={() => updateParams({ category: "" })} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
            {currentAuthor && (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                Author: {authors.find((a) => a.slug === currentAuthor)?.name || currentAuthor}
                <button onClick={() => updateParams({ author: "" })} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            )}
            {selectedTags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                Tag: {tags.find((tag) => tag.slug === t)?.name || t}
                <button onClick={() => handleTagToggle(t)} className="hover:text-red-500">
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>

          <button
            onClick={handleClearFilters}
            className="text-xs font-bold text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
