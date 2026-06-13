import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://startflow.in";

  let blogUrls: { url: string; lastModified: Date }[] = [];
  try {
    const posts = await prisma.content.findMany({
      where: {
        type: "blog",
        status: "published",
      },
      select: {
        slug: true,
        updated_at: true,
      },
    });

    blogUrls = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updated_at,
    }));
  } catch (error) {
    console.error("Failed to query sitemap urls:", error);
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...blogUrls.map((item) => ({
      url: item.url,
      lastModified: item.lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
