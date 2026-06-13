import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Optional security guard: check token if configured in production
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        {
          error: {
            code: "FORBIDDEN",
            message: "Unauthorized cron execution.",
          },
        },
        { status: 403 }
      );
    }

    const now = new Date();

    // 1. Fetch scheduled articles whose date has passed
    const scheduledArticles = await prisma.content.findMany({
      where: {
        status: "scheduled",
        publish_date: {
          lte: now,
        },
      },
    });

    if (scheduledArticles.length === 0) {
      return NextResponse.json({
        message: "No articles scheduled for publish at this time.",
        published: [],
      });
    }

    // 2. Publish articles
    const publishedIds: string[] = [];
    for (const article of scheduledArticles) {
      await prisma.content.update({
        where: { id: article.id },
        data: {
          status: "published",
          publish_date: now, // update to actual publish time or preserve scheduled date
        },
      });

      // Clear blocks position re-indexes if necessary, trigger revalidation
      revalidatePath(`/posts/${article.slug}`);
      publishedIds.push(article.id);
    }

    // Revalidate lists
    revalidatePath("/blog");
    revalidatePath("/");

    return NextResponse.json({
      message: `Successfully published ${scheduledArticles.length} scheduled articles.`,
      published: scheduledArticles.map((a) => ({ id: a.id, title: a.title, slug: a.slug })),
    });
  } catch (error) {
    console.error("Cron scheduled publish error:", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "Scheduled publish cron task failed.",
        },
      },
      { status: 500 }
    );
  }
}
