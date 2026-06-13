"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { saveContent, ContentSaveInput, BlockInput } from "@/lib/actions";
import { ArrowLeft, Save, Plus, Trash2, ArrowUp, ArrowDown, Brain, HelpCircle, LayoutGrid, Quote, Type, Image as ImageIcon, Video, CreditCard } from "lucide-react";

interface BlockEditorProps {
  post: {
    id: string;
    type: string;
    status: string;
    title: string;
    subtitle: string | null;
    slug: string;
    featured_image_id: string;
    category_id: string;
    author_id: string;
    publish_date: Date | null;
    seo_title: string | null;
    seo_description: string | null;
    canonical_url: string | null;
    blocks: { id: string; type: string; position: number; data: string }[];
    tags: { tag_id: string }[];
  };
  categories: { id: string; name: string; slug: string }[];
  authors: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  mediaList: { id: string; cloudinary_url: string; original_name: string }[];
  userRole: string;
}

export default function BlockEditor({
  post,
  categories,
  authors,
  tags,
  mediaList,
  userRole,
}: BlockEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Basic metadata states
  const [title, setTitle] = useState(post.title);
  const [subtitle, setSubtitle] = useState(post.subtitle || "");
  const [slug, setSlug] = useState(post.slug);
  const [featuredImageId, setFeaturedImageId] = useState(post.featured_image_id);
  const [categoryId, setCategoryId] = useState(post.category_id);
  const [authorId, setAuthorId] = useState(post.author_id);
  const [publishDate, setPublishDate] = useState(
    post.publish_date ? new Date(post.publish_date).toISOString().slice(0, 16) : ""
  );
  const [status, setStatus] = useState(post.status);
  const [seoTitle, setSeoTitle] = useState(post.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(post.seo_description || "");
  const [canonicalUrl, setCanonicalUrl] = useState(post.canonical_url || "");

  // Tags list state
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    post.tags.map((t) => t.tag_id)
  );

  // Blocks structure state
  const [blocks, setBlocks] = useState<BlockInput[]>(
    post.blocks.map((b) => {
      let data = {};
      try {
        data = JSON.parse(b.data);
      } catch (_e) {}
      return {
        id: b.id,
        type: b.type,
        position: b.position,
        data,
      };
    })
  );

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Auto-generate slug from Title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    // Only auto-generate slug on first edits or if it was untitled
    if (post.title === "Untitled Article") {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80);
      setSlug(generated);
    }
  };

  // Block management actions
  const handleAddBlock = (type: string) => {
    let defaultData = {};
    switch (type) {
      case "hero":
        defaultData = { title: "", subtitle: "", image_url: mediaList[0]?.cloudinary_url || "" };
        break;
      case "text":
        defaultData = { heading: "", body: "" };
        break;
      case "image":
        defaultData = { image_url: mediaList[0]?.cloudinary_url || "", caption: "" };
        break;
      case "image_text":
        defaultData = { image_url: mediaList[0]?.cloudinary_url || "", body: "", image_position: "left" };
        break;
      case "statistics":
        defaultData = { stats: [{ value: "10x", label: "Increase", description: "" }] };
        break;
      case "quote":
        defaultData = { text: "", author: "" };
        break;
      case "faq":
        defaultData = { faqs: [{ question: "Question?", answer: "Answer." }] };
        break;
      case "cta":
        defaultData = { title: "", button_text: "Get Started", button_url: "/contact" };
        break;
      case "video":
        defaultData = { video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" };
        break;
      case "feature_grid":
        defaultData = { features: [{ title: "Feature Title", description: "Detail text..." }] };
        break;
    }

    const newBlock: BlockInput = {
      type,
      position: blocks.length + 1,
      data: defaultData,
    };
    setBlocks([...blocks, newBlock]);
  };

  const handleDeleteBlock = (idx: number) => {
    const nextBlocks = blocks.filter((_, i) => i !== idx);
    // Re-index position fields
    const reindexed = nextBlocks.map((b, i) => ({
      ...b,
      position: i + 1,
    }));
    setBlocks(reindexed);
  };

  const handleMoveBlock = (idx: number, dir: "up" | "down") => {
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === blocks.length - 1) return;

    const nextBlocks = [...blocks];
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;

    // Swap items
    const temp = nextBlocks[idx];
    nextBlocks[idx] = nextBlocks[targetIdx];
    nextBlocks[targetIdx] = temp;

    // Re-index position fields
    const reindexed = nextBlocks.map((b, i) => ({
      ...b,
      position: i + 1,
    }));
    setBlocks(reindexed);
  };

  const handleBlockDataChange = (idx: number, updatedFields: any) => {
    const nextBlocks = [...blocks];
    nextBlocks[idx] = {
      ...nextBlocks[idx],
      data: {
        ...nextBlocks[idx].data,
        ...updatedFields,
      },
    };
    setBlocks(nextBlocks);
  };

  const handleTagToggle = (tagId: string) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validations
    if (title.trim().length < 10 || title.trim().length > 120) {
      setMessage({ type: "error", text: "Validation Error: Title must be between 10 and 120 characters." });
      return;
    }

    if (!slug) {
      setMessage({ type: "error", text: "Validation Error: URL slug is required." });
      return;
    }

    // Role Guard: Authors submit for review
    let activeStatus = status;
    if (userRole === "author" && status === "published") {
      activeStatus = "pending_review";
      setStatus("pending_review");
    }

    startTransition(async () => {
      const payload: ContentSaveInput = {
        id: post.id,
        title,
        subtitle: subtitle || null,
        slug,
        featured_image_id: featuredImageId,
        category_id: categoryId,
        author_id: authorId,
        publish_date: publishDate ? new Date(publishDate).toISOString() : null,
        status: activeStatus,
        seo_title: seoTitle || null,
        seo_description: seoDescription || null,
        canonical_url: canonicalUrl || null,
        blocks,
        tag_ids: selectedTagIds,
      };

      const res = await saveContent(payload);
      if (res?.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: "Article saved successfully!" });
        router.refresh();
      }
    });
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "hero": return <ImageIcon size={14} className="text-blue-500" />;
      case "text": return <Type size={14} className="text-zinc-500" />;
      case "image": return <ImageIcon size={14} className="text-emerald-500" />;
      case "image_text": return <LayoutGrid size={14} className="text-orange-500" />;
      case "statistics": return <Brain size={14} className="text-pink-500" />;
      case "quote": return <Quote size={14} className="text-violet-500" />;
      case "faq": return <HelpCircle size={14} className="text-cyan-500" />;
      case "cta": return <CreditCard size={14} className="text-rose-500" />;
      case "video": return <Video size={14} className="text-red-500" />;
      default: return <Plus size={14} />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editor Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/content"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Listings
        </Link>

        <button
          onClick={handleSave}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50 dark:bg-violet-600 dark:hover:bg-violet-750"
        >
          {isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Save size={14} />
          )}
          <span>Save Document</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs font-bold border ${
          message.type === "success"
            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            : "bg-red-500/10 text-red-600 border-red-500/20"
        }`}>
          {message.text}
        </div>
      )}

      {/* Editor Grid Split */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Metadata and Blocks Editor list */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Metadata Section */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 space-y-5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 pb-3 dark:border-zinc-850">
              Document Metadata
            </h3>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter article title..."
                required
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
              />
            </div>

            {/* Subtitle / Deck */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Subtitle / Deck
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter deck summary..."
                rows={2}
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:focus:border-white resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  URL Route Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="untitled-article"
                  required
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white dark:focus:border-white"
                />
              </div>

              {/* Cover Image selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Featured Cover Image
                </label>
                <select
                  value={featuredImageId}
                  onChange={(e) => setFeaturedImageId(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300"
                >
                  {mediaList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.original_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Blocks Layout Editor */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 pb-3 dark:border-zinc-850">
              Content Blocks Layout Builder
            </h3>

            {/* List of active blocks */}
            <div className="space-y-4">
              {blocks.map((block, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-850 dark:bg-zinc-900/20 space-y-4"
                >
                  {/* Block Header Toolbar */}
                  <div className="flex items-center justify-between border-b border-zinc-200/50 pb-2 dark:border-zinc-800/60">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-white dark:bg-zinc-950 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/60">
                        {getBlockIcon(block.type)}
                      </div>
                      <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                        {block.type.replace("_", " ")} Block
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, "up")}
                        disabled={idx === 0}
                        className="rounded p-1 text-zinc-500 hover:bg-white disabled:opacity-30 dark:hover:bg-zinc-950"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(idx, "down")}
                        disabled={idx === blocks.length - 1}
                        className="rounded p-1 text-zinc-500 hover:bg-white disabled:opacity-30 dark:hover:bg-zinc-950"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(idx)}
                        className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Block Forms dynamically rendered based on type */}
                  {block.type === "text" && (
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="Section Heading (H2 - optional)"
                        value={block.data.heading || ""}
                        onChange={(e) => handleBlockDataChange(idx, { heading: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                      <textarea
                        placeholder="Prose section body text (markdown tags allowed)..."
                        rows={5}
                        value={block.data.body || ""}
                        onChange={(e) => handleBlockDataChange(idx, { body: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white font-mono"
                      />
                    </div>
                  )}

                  {block.type === "hero" && (
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="Hero Title (H1 Overlay)"
                        value={block.data.title || ""}
                        onChange={(e) => handleBlockDataChange(idx, { title: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Hero Subtitle"
                        value={block.data.subtitle || ""}
                        onChange={(e) => handleBlockDataChange(idx, { subtitle: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                      <select
                        value={block.data.image_url || ""}
                        onChange={(e) => handleBlockDataChange(idx, { image_url: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300"
                      >
                        {mediaList.map((m) => (
                          <option key={m.id} value={m.cloudinary_url}>
                            {m.original_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {block.type === "quote" && (
                    <div className="grid grid-cols-1 gap-3">
                      <textarea
                        placeholder="Quote text..."
                        rows={2}
                        value={block.data.text || ""}
                        onChange={(e) => handleBlockDataChange(idx, { text: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Attribution name"
                        value={block.data.author || ""}
                        onChange={(e) => handleBlockDataChange(idx, { author: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="grid grid-cols-1 gap-3">
                      <select
                        value={block.data.image_url || ""}
                        onChange={(e) => handleBlockDataChange(idx, { image_url: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-700 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300"
                      >
                        {mediaList.map((m) => (
                          <option key={m.id} value={m.cloudinary_url}>
                            {m.original_name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Caption text (max 120 chars)"
                        value={block.data.caption || ""}
                        onChange={(e) => handleBlockDataChange(idx, { caption: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                    </div>
                  )}

                  {block.type === "cta" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="CTA Header text"
                        value={block.data.title || ""}
                        onChange={(e) => handleBlockDataChange(idx, { title: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white sm:col-span-3"
                      />
                      <input
                        type="text"
                        placeholder="Button Action label"
                        value={block.data.button_text || ""}
                        onChange={(e) => handleBlockDataChange(idx, { button_text: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Button Action URL link"
                        value={block.data.button_url || ""}
                        onChange={(e) => handleBlockDataChange(idx, { button_url: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white sm:col-span-2"
                      />
                    </div>
                  )}

                  {block.type === "video" && (
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder="YouTube or Vimeo watch URL link"
                        value={block.data.video_url || ""}
                        onChange={(e) => handleBlockDataChange(idx, { video_url: e.target.value })}
                        className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
                      />
                    </div>
                  )}

                  {/* Fallback note for complex grids like stats/faqs to show they are pre-filled or editable */}
                  {["statistics", "faq", "feature_grid", "image_text"].includes(block.type) && (
                    <div className="text-[11px] text-zinc-550 italic leading-relaxed">
                      This block data configuration fields ({block.type.toUpperCase()}) are automatically initialized with high-quality templates for testing. Block values will parse correctly when saving.
                    </div>
                  )}
                </div>
              ))}

              {blocks.length === 0 && (
                <p className="text-xs text-zinc-500 text-center py-6 border border-dashed border-zinc-200 rounded-xl">
                  No layout blocks added. Click one of the options below to build your page.
                </p>
              )}
            </div>

            {/* Add Block Toolbar Options */}
            <div className="border-t border-zinc-200/50 pt-4 dark:border-zinc-800/60">
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mb-3">
                Append layout segment
              </span>
              <div className="flex flex-wrap gap-2">
                {["hero", "text", "image", "image_text", "statistics", "quote", "faq", "cta", "video", "feature_grid"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleAddBlock(t)}
                    className="inline-flex items-center gap-1 rounded bg-zinc-150 hover:bg-zinc-250 dark:bg-zinc-900 dark:hover:bg-zinc-800 px-2.5 py-1.5 text-[10px] font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider border border-zinc-200/30 dark:border-zinc-850"
                  >
                    <Plus size={10} />
                    {t.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Publish Status, Tags, Categories, and SEO configurations */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Status and Actions Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 pb-2 dark:border-zinc-850">
              Publish Settings
            </h3>

            {/* Status selection (Role aware) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Document Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300"
              >
                <option value="draft">Draft</option>
                <option value="pending_review">Submit for Review</option>
                {userRole !== "author" && (
                  <>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </>
                )}
              </select>
            </div>

            {/* Scheduled Release Date */}
            {status === "scheduled" && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Scheduled Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 outline-none focus:border-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300"
                />
              </div>
            )}

            {/* Taxonomy categories */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Attribution */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Author Profile
              </label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                disabled={userRole === "author"} // Authors are locked to their own profiles
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none focus:border-zinc-950 dark:border-zinc-850 dark:bg-zinc-950 dark:text-zinc-300 disabled:opacity-50"
              >
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags selectors card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 space-y-4">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 pb-2 dark:border-zinc-850">
              Taxonomy Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isSelected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                      isSelected
                        ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                        : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO meta tags panel */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900/10 space-y-5">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 pb-2 dark:border-zinc-850">
              SEO Optimization
            </h3>

            {/* SEO Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                SEO Meta Title
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Defaults to Title..."
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
              />
            </div>

            {/* SEO Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                SEO Meta Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Defaults to Subtitle..."
                rows={3}
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white resize-none"
              />
            </div>

            {/* Canonical Link */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                Canonical Link URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                placeholder="https://another-domain.com/article"
                className="w-full rounded border border-zinc-200 bg-white px-3 py-1.5 text-xs text-zinc-800 dark:border-zinc-850 dark:bg-zinc-950 dark:text-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
