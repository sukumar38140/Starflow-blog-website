"use server";

import { prisma } from "./db";
import { verifyPassword, createSessionToken, getSession } from "./auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. LOGIN
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !user.is_active) {
      return { error: "Invalid credentials or account inactive." };
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return { error: "Invalid credentials." };
    }

    // Create session token
    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
    });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Login action error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}

// 2. LOGOUT
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  revalidatePath("/");
}

// 3. CONTACT / LEAD SUBMISSION
export async function submitContactForm(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const company = formData.get("company") as string;
  const message = formData.get("message") as string;
  const source = formData.get("source") as string;

  if (!name || name.trim().length < 2) {
    return { error: "Name must be at least 2 characters." };
  }
  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }
  if (!message || message.trim().length < 10) {
    return { error: "Message must be at least 10 characters." };
  }

  try {
    // Basic rate limit check: count requests from same email in last 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentSubmissionsCount = await prisma.contact.count({
      where: {
        email,
        created_at: { gte: tenMinutesAgo },
      },
    });

    if (recentSubmissionsCount >= 2) {
      return { error: "Too many requests. Please try again in 10 minutes." };
    }

    await prisma.contact.create({
      data: {
        name,
        email,
        company: company || null,
        message,
        source: source || null,
        status: "new",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Contact submission error:", error);
    return { error: "Failed to submit message. Please try again." };
  }
}

// 4. NEWSLETTER SUBSCRIBE
export async function subscribeNewsletter(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const source = formData.get("source") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.is_active) {
        return { success: true, message: "You are already subscribed!" };
      } else {
        // Reactivate subscriber
        await prisma.subscriber.update({
          where: { email },
          data: { is_active: true, unsubscribed_at: null },
        });
        return { success: true };
      }
    }

    await prisma.subscriber.create({
      data: {
        email,
        is_active: true,
        source: source || "footer",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return { error: "Failed to subscribe. Please try again." };
  }
}

// 5. UPDATE LEAD STATUS
export async function updateLeadStatus(leadId: string, newStatus: string) {
  const session = await getSession();
  if (!session || (session.role !== "super_admin" && session.role !== "editor")) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.contact.update({
      where: { id: leadId },
      data: { status: newStatus },
    });
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (_e) {
    return { error: "Failed to update status." };
  }
}

// 6. ANALYTICS EVENT TRACKING
export async function trackAnalyticsEvent(
  eventType: string,
  contentId: string | null,
  sessionId: string,
  payload: any = null
) {
  try {
    // Optional debounce/check for page_view: limit to 1 per contentItem per session per 30 minutes
    if (eventType === "page_view" && contentId) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const existingEvent = await prisma.analyticsEvent.findFirst({
        where: {
          event_type: "page_view",
          content_id: contentId,
          session_id: sessionId,
          created_at: { gte: thirtyMinutesAgo },
        },
      });
      if (existingEvent) {
        return { success: true, status: "debounced" };
      }
    }

    await prisma.analyticsEvent.create({
      data: {
        event_type: eventType,
        content_id: contentId,
        session_id: sessionId,
        payload: payload ? JSON.stringify(payload) : null,
      },
    });

    // If it's a page_view or content_read, increment the counts on the content model directly
    if (contentId) {
      if (eventType === "page_view") {
        await prisma.content.update({
          where: { id: contentId },
          data: { view_count: { increment: 1 } },
        });
      } else if (eventType === "content_read") {
        await prisma.content.update({
          where: { id: contentId },
          data: { read_count: { increment: 1 } },
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Analytics track error:", error);
    return { error: "Failed to track event." };
  }
}

// 7. CONTENT SAVE / EDIT (CMS)
export interface BlockInput {
  id?: string;
  type: string;
  position: number;
  data: any;
}

export interface ContentSaveInput {
  id?: string;
  title: string;
  subtitle?: string | null;
  slug: string;
  featured_image_id: string;
  category_id: string;
  author_id: string;
  publish_date?: string | null;
  status: string;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  blocks: BlockInput[];
  tag_ids: string[];
}

export async function saveContent(input: ContentSaveInput) {
  const session = await getSession();
  if (!session) {
    return { error: "Unauthorized. Please log in." };
  }

  // Permission Checks:
  // - Author can only create or edit own content.
  // - Editors/Super Admins can publish or edit anyone's content.
  const isAuthor = session.role === "author";
  const _isEditorOrAdmin = session.role === "editor" || session.role === "super_admin";

  if (isAuthor && input.status === "published") {
    // Authors cannot publish directly; status changes to pending_review
    input.status = "pending_review";
  }

  if (isAuthor && input.id) {
    // If editing, check if they own the content
    const existing = await prisma.content.findUnique({
      where: { id: input.id },
      include: { author: true },
    });
    // Check if author matches logged in user name
    if (existing && existing.author.slug !== session.name.toLowerCase().replace(/\s+/g, "-")) {
      return { error: "You do not have permission to edit this content." };
    }
  }

  // Auto-calculate word count
  let totalWords = 0;
  for (const block of input.blocks) {
    if (block.type === "text" && block.data?.body) {
      totalWords += block.data.body.split(/\s+/).filter(Boolean).length;
    }
  }

  try {
    const contentData = {
      type: "blog",
      status: input.status,
      title: input.title,
      subtitle: input.subtitle || null,
      slug: input.slug,
      featured_image_id: input.featured_image_id,
      category_id: input.category_id,
      author_id: input.author_id,
      publish_date: input.publish_date ? new Date(input.publish_date) : null,
      seo_title: input.seo_title || null,
      seo_description: input.seo_description || null,
      canonical_url: input.canonical_url || null,
      word_count: totalWords,
    };

    let contentId = input.id;

    if (contentId) {
      // 1. Update existing article
      await prisma.content.update({
        where: { id: contentId },
        data: contentData,
      });

      // Remove existing blocks to overwrite
      await prisma.contentBlock.deleteMany({ where: { content_id: contentId } });
      // Remove existing tags
      await prisma.contentTag.deleteMany({ where: { content_id: contentId } });
    } else {
      // Check slug uniqueness
      const existingSlug = await prisma.content.findUnique({
        where: { type_slug: { type: "blog", slug: input.slug } },
      });
      if (existingSlug) {
        return { error: "Conflict: This URL slug is already in use." };
      }

      // 2. Create new article
      const created = await prisma.content.create({
        data: contentData,
      });
      contentId = created.id;
    }

    // Write Content Blocks
    if (input.blocks && input.blocks.length > 0) {
      const blocksToInsert = input.blocks.map((block) => ({
        content_id: contentId!,
        type: block.type,
        position: block.position,
        data: JSON.stringify(block.data),
      }));

      await prisma.contentBlock.createMany({ data: blocksToInsert });
    }

    // Write Tags
    if (input.tag_ids && input.tag_ids.length > 0) {
      const tagsToInsert = input.tag_ids.map((tagId) => ({
        content_id: contentId!,
        tag_id: tagId,
      }));

      await prisma.contentTag.createMany({ data: tagsToInsert });
    }

    revalidatePath("/blog");
    revalidatePath(`/posts/${input.slug}`);
    revalidatePath("/admin/content");

    return { success: true, id: contentId };
  } catch (error: any) {
    console.error("Save content error:", error);
    return { error: "Failed to save content. Check for unique slug violations." };
  }
}

// 8. DELETE CONTENT (Super Admin only)
export async function deleteContent(id: string) {
  const session = await getSession();
  if (!session || session.role !== "super_admin") {
    return { error: "Unauthorized. Super Admin permissions required." };
  }

  try {
    // In V1 we soft-delete or hard delete. The PRD specifies 'Soft delete. Super Admin only.'
    // We can soft delete by moving status to 'archived', which removes it from listings
    // and adds a 'noindex' tag to the page.
    await prisma.content.update({
      where: { id },
      data: { status: "archived" },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/content");
    return { success: true };
  } catch (error) {
    console.error("Delete content error:", error);
    return { error: "Failed to archive content." };
  }
}

// 9. CREATE BLANK ARTICLE
export async function createBlankArticle() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    // Fetch default relations to satisfy database FK constraints
    const defaultCategory = await prisma.category.findFirst();
    const defaultAuthor = await prisma.author.findFirst();
    const defaultMedia = await prisma.media.findFirst();

    if (!defaultCategory || !defaultAuthor || !defaultMedia) {
      throw new Error("Missing seeded setup database. Run seeding first.");
    }

    const uniqueId = Math.random().toString(36).substring(2, 9);
    const slug = `untitled-article-${uniqueId}`;

    const newContent = await prisma.content.create({
      data: {
        type: "blog",
        status: "draft",
        title: "Untitled Article",
        subtitle: "A brand new draft waiting for key takeaways and structured block content.",
        slug,
        category_id: defaultCategory.id,
        author_id: defaultAuthor.id,
        featured_image_id: defaultMedia.id,
        seo_title: "",
        seo_description: "",
      },
    });

    revalidatePath("/admin/content");
    return { success: true, id: newContent.id };
  } catch (e: any) {
    console.error("Blank article creation error:", e);
    return { error: e.message || "Failed to create new draft." };
  }
}
