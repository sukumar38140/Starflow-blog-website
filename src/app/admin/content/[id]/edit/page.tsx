import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import BlockEditor from "./BlockEditor";

export const dynamic = "force-dynamic";

interface EditContentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditContentPage({ params }: EditContentPageProps) {
  const session = await getSession();
  const { id } = await params;

  if (!session) return null;

  // 1. Fetch Post Detail
  const post = await prisma.content.findUnique({
    where: { id },
    include: {
      blocks: {
        orderBy: { position: "asc" },
      },
      tags: {
        select: { tag_id: true },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Enforce Author permissions (can only edit own content)
  if (session.role === "author") {
    const postAuthor = await prisma.author.findUnique({
      where: { id: post.author_id },
    });
    if (postAuthor && postAuthor.slug !== session.name.toLowerCase().replace(/\s+/g, "-")) {
      return (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center text-sm text-red-650 dark:text-red-400">
          Unauthorized: You do not have permission to edit this article.
        </div>
      );
    }
  }

  // 2. Fetch drop options
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const authors = await prisma.author.findMany({
    orderBy: { name: "asc" },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
  });

  const mediaList = await prisma.media.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <BlockEditor
      post={post}
      categories={categories}
      authors={authors}
      tags={tags}
      mediaList={mediaList}
      userRole={session.role}
    />
  );
}
