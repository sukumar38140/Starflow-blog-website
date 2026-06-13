import React from "react";
import Image from "next/image";
import { Sparkles, HelpCircle, Check, Play } from "lucide-react";

interface BlockData {
  heading?: string;
  body?: string;
  text?: string;
  author?: string;
  image_url?: string;
  image_position?: "left" | "right";
  caption?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_url?: string;
  video_url?: string;
  stats?: { value: string; label: string; description?: string }[];
  faqs?: { question: string; answer: string }[];
  features?: { icon?: string; title: string; description: string }[];
}

interface BlockProps {
  block: {
    id: string;
    type: string;
    position: number;
    data: string; // JSON string
  };
}

// Simple pure JS markdown parser to avoid heavy dependencies and ensure 100% build compatibility.
function renderMarkdown(text: string = "") {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold (**bold**)
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  
  // Italic (*italic* or _italic_)
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Links ([label](url))
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-650 dark:text-violet-400 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">$1</a>');

  // Code inline (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="bg-zinc-100 dark:bg-zinc-800 rounded px-1.5 py-0.5 font-mono text-xs text-pink-600 dark:text-pink-400">$1</code>');

  // Line breaks
  const paragraphs = html.split("\n\n");
  return paragraphs
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return "";
      // Check if it is a list item
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const items = trimmed
          .split(/\n[-*]\s/)
          .map((item) => `<li class="ml-4 list-disc">${item.replace(/^[-*]\s/, "")}</li>`)
          .join("");
        return `<ul class="space-y-1 my-3">${items}</ul>`;
      }
      return `<p class="mb-4 leading-relaxed">${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

export default function BlockRenderer({ block }: BlockProps) {
  let data: BlockData = {};
  try {
    data = JSON.parse(block.data);
  } catch (e) {
    console.error("Failed to parse block data JSON:", e);
    return null;
  }

  switch (block.type) {
    case "hero":
      return (
        <div className="relative w-full rounded-2xl overflow-hidden aspect-video bg-zinc-950 flex flex-col justify-end p-6 sm:p-12 mb-8 border border-zinc-850">
          {data.image_url && (
            <Image
              src={data.image_url}
              alt={data.title || "Hero Banner"}
              fill
              className="object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {data.title}
            </h1>
            {data.subtitle && (
              <p className="text-sm sm:text-base text-zinc-300">
                {data.subtitle}
              </p>
            )}
          </div>
        </div>
      );

    case "text":
      return (
        <div className="prose dark:prose-invert max-w-none mb-8 text-zinc-700 dark:text-zinc-300">
          {data.heading && (
            <h2 id={data.heading.toLowerCase().replace(/[^\w]+/g, "-")} className="text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-4 tracking-tight">
              {data.heading}
            </h2>
          )}
          {data.body && (
            <div
              dangerouslySetInnerHTML={{ __html: renderMarkdown(data.body) }}
              className="text-base leading-relaxed"
            />
          )}
        </div>
      );

    case "image":
      return (
        <figure className="my-10 flex flex-col items-center space-y-2.5">
          {data.image_url && (
            <div className="relative w-full rounded-xl overflow-hidden aspect-video border border-zinc-200/50 dark:border-zinc-800/50">
              <Image
                src={data.image_url}
                alt={data.caption || "Article media"}
                fill
                className="object-cover"
              />
            </div>
          )}
          {data.caption && (
            <figcaption className="text-xs text-zinc-500 dark:text-zinc-400 max-w-lg text-center leading-relaxed">
              {data.caption}
            </figcaption>
          )}
        </figure>
      );

    case "image_text":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10 items-center">
          <div className={`relative aspect-video rounded-xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 ${data.image_position === "right" ? "md:order-2" : ""}`}>
            {data.image_url && (
              <Image
                src={data.image_url}
                alt="Feature illustration"
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            {data.body && (
              <div
                dangerouslySetInnerHTML={{ __html: renderMarkdown(data.body) }}
                className="text-base leading-relaxed"
              />
            )}
          </div>
        </div>
      );

    case "statistics":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10">
          {data.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center p-6 rounded-xl border border-zinc-200/50 bg-white shadow-sm dark:border-zinc-850 dark:bg-zinc-900/20 text-center"
            >
              <span className="text-3xl font-extrabold text-indigo-650 dark:text-violet-400">
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                {stat.label}
              </span>
              {stat.description && (
                <span className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                  {stat.description}
                </span>
              )}
            </div>
          ))}
        </div>
      );

    case "quote":
      return (
        <blockquote className="relative my-10 border-l-4 border-indigo-500 bg-indigo-500/5 p-6 rounded-r-xl dark:border-violet-400 dark:bg-violet-950/20">
          <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed italic">
            "{data.text}"
          </p>
          {(data.author) && (
            <cite className="mt-4 block not-italic text-sm font-semibold text-zinc-900 dark:text-white">
              — {data.author}
            </cite>
          )}
        </blockquote>
      );

    case "faq":
      return (
        <div className="my-10 space-y-4">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-violet-400" />
            FAQ Section
          </h3>
          {data.faqs?.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-850 dark:bg-zinc-900/10 transition-colors [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 focus:outline-none text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                <span>{faq.question}</span>
                <span className="relative h-4 w-4 shrink-0">
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-zinc-400 group-open:hidden" />
                  <span className="absolute left-1/2 top-1/2 h-2.5 w-0.5 -translate-x-1/2 -translate-y-1/2 bg-zinc-400 group-open:hidden" />
                  <span className="absolute left-1/2 top-1/2 h-0.5 w-2.5 -translate-x-1/2 -translate-y-1/2 bg-zinc-400 hidden group-open:block" />
                </span>
              </summary>
              <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      );

    case "cta":
      return (
        <div className="relative rounded-2xl bg-zinc-950 p-8 text-center my-10 overflow-hidden border border-zinc-900">
          <div className="absolute inset-0 bg-radial-glow opacity-30" />
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {data.title}
            </h3>
            {data.button_text && data.button_url && (
              <a
                href={data.button_url}
                className="inline-flex rounded-lg bg-white px-5 py-2.5 text-xs font-bold text-zinc-950 hover:bg-zinc-200 transition-colors"
              >
                {data.button_text}
              </a>
            )}
          </div>
        </div>
      );

    case "video":
      return (
        <div className="my-10 space-y-2.5">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
            {data.video_url && (
              <iframe
                src={data.video_url.replace("watch?v=", "embed/")}
                title="Video embed"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
          </div>
        </div>
      );

    case "feature_grid":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-10">
          {data.features?.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-zinc-200/50 bg-white dark:border-zinc-850 dark:bg-zinc-900/10 space-y-2.5"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-500/10 dark:bg-violet-400/10 flex items-center justify-center text-indigo-600 dark:text-violet-400">
                <Check size={14} />
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                {feat.title}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      );

    default:
      return null;
  }
}
