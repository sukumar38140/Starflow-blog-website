import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding started...");

  // 1. Create Roles
  const superAdminRole = await prisma.role.upsert({
    where: { name: "super_admin" },
    update: {},
    create: {
      name: "super_admin",
      permissions: JSON.stringify([
        "create:content",
        "edit:content",
        "publish:content",
        "delete:content",
        "manage:categories",
        "manage:tags",
        "manage:authors",
        "manage:media",
        "view:analytics",
        "view:leads",
        "manage:users",
        "manage:settings",
        "export:subscribers"
      ]),
    },
  });

  const editorRole = await prisma.role.upsert({
    where: { name: "editor" },
    update: {},
    create: {
      name: "editor",
      permissions: JSON.stringify([
        "create:content",
        "edit:content",
        "publish:content",
        "manage:categories",
        "manage:tags",
        "manage:authors",
        "manage:media",
        "view:analytics"
      ]),
    },
  });

  const authorRole = await prisma.role.upsert({
    where: { name: "author" },
    update: {},
    create: {
      name: "author",
      permissions: JSON.stringify([
        "create:content",
        "edit:own_content",
        "manage:media_own"
      ]),
    },
  });

  // 2. Create Users
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@startflow.in" },
    update: { password_hash: passwordHash },
    create: {
      email: "admin@startflow.in",
      name: "Super Admin",
      password_hash: passwordHash,
      role_id: superAdminRole.id,
      is_active: true,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: "editor@startflow.in" },
    update: { password_hash: passwordHash },
    create: {
      email: "editor@startflow.in",
      name: "Ed Editor",
      password_hash: passwordHash,
      role_id: editorRole.id,
      is_active: true,
    },
  });

  const authorUser = await prisma.user.upsert({
    where: { email: "author@startflow.in" },
    update: { password_hash: passwordHash },
    create: {
      email: "author@startflow.in",
      name: "Arthur Author",
      password_hash: passwordHash,
      role_id: authorRole.id,
      is_active: true,
    },
  });

  // 3. Create Categories
  const catAI = await prisma.category.upsert({
    where: { slug: "ai-ml" },
    update: {},
    create: {
      name: "AI & Machine Learning",
      slug: "ai-ml",
      description: "Deep dives into artificial intelligence, LLMs, neural networks, and prompt engineering.",
      color: "#8b5cf6", // Purple
    },
  });

  const catFrontend = await prisma.category.upsert({
    where: { slug: "engineering" },
    update: {},
    create: {
      name: "Web Engineering",
      slug: "engineering",
      description: "Modern web architecture, frontend frameworks, next-generation tooling, and performance optimization.",
      color: "#3b82f6", // Blue
    },
  });

  const catDesign = await prisma.category.upsert({
    where: { slug: "design-ui" },
    update: {},
    create: {
      name: "Design & UX",
      slug: "design-ui",
      description: "Creating premium digital experiences through aesthetic interface design, accessibility, and smooth animations.",
      color: "#ec4899", // Pink
    },
  });

  const catGrowth = await prisma.category.upsert({
    where: { slug: "growth-marketing" },
    update: {},
    create: {
      name: "Growth & Product",
      slug: "growth-marketing",
      description: "Product strategies, organic growth, search engine optimization, and lead generation frameworks.",
      color: "#10b981", // Green
    },
  });

  // 4. Create Tags
  const tagAI = await prisma.tag.upsert({ where: { slug: "artificial-intelligence" }, update: {}, create: { name: "Artificial Intelligence", slug: "artificial-intelligence" } });
  const tagNext = await prisma.tag.upsert({ where: { slug: "nextjs" }, update: {}, create: { name: "Next.js", slug: "nextjs" } });
  const tagSEO = await prisma.tag.upsert({ where: { slug: "seo" }, update: {}, create: { name: "SEO", slug: "seo" } });
  const tagUX = await prisma.tag.upsert({ where: { slug: "ux-design" }, update: {}, create: { name: "UX Design", slug: "ux-design" } });
  const tagSaaS = await prisma.tag.upsert({ where: { slug: "saas" }, update: {}, create: { name: "SaaS", slug: "saas" } });

  // 5. Create Default Media Items
  const media1 = await prisma.media.upsert({
    where: { cloudinary_public_id: "blog_cover_ai_future" },
    update: {},
    create: {
      original_name: "ai_future.jpg",
      cloudinary_public_id: "blog_cover_ai_future",
      cloudinary_url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80",
      mime_type: "image/jpeg",
      size_bytes: 85200,
      width: 1200,
      height: 675,
      alt_text: "Futuristic digital brain with glowing nodes",
      uploaded_by: adminUser.id,
    },
  });

  const media2 = await prisma.media.upsert({
    where: { cloudinary_public_id: "blog_cover_nextjs_perf" },
    update: {},
    create: {
      original_name: "nextjs_perf.jpg",
      cloudinary_public_id: "blog_cover_nextjs_perf",
      cloudinary_url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80",
      mime_type: "image/jpeg",
      size_bytes: 94100,
      width: 1200,
      height: 675,
      alt_text: "Clean neon geometric lines on dark background",
      uploaded_by: adminUser.id,
    },
  });

  const media3 = await prisma.media.upsert({
    where: { cloudinary_public_id: "blog_cover_seo_growth" },
    update: {},
    create: {
      original_name: "seo_growth.jpg",
      cloudinary_public_id: "blog_cover_seo_growth",
      cloudinary_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      mime_type: "image/jpeg",
      size_bytes: 104000,
      width: 1200,
      height: 675,
      alt_text: "Laptop showing charts and graphs",
      uploaded_by: adminUser.id,
    },
  });

  const media4 = await prisma.media.upsert({
    where: { cloudinary_public_id: "blog_cover_ui_aesthetics" },
    update: {},
    create: {
      original_name: "ui_aesthetics.jpg",
      cloudinary_public_id: "blog_cover_ui_aesthetics",
      cloudinary_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=80",
      mime_type: "image/jpeg",
      size_bytes: 78500,
      width: 1200,
      height: 675,
      alt_text: "Aesthetic workspace lighting",
      uploaded_by: adminUser.id,
    },
  });

  const authorPhoto = await prisma.media.upsert({
    where: { cloudinary_public_id: "author_photo_sarah" },
    update: {},
    create: {
      original_name: "sarah.jpg",
      cloudinary_public_id: "author_photo_sarah",
      cloudinary_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&q=80",
      mime_type: "image/jpeg",
      size_bytes: 14200,
      width: 200,
      height: 200,
      alt_text: "Sarah Connor Portrait",
      uploaded_by: adminUser.id,
    },
  });

  const authorPhoto2 = await prisma.media.upsert({
    where: { cloudinary_public_id: "author_photo_alex" },
    update: {},
    create: {
      original_name: "alex.jpg",
      cloudinary_public_id: "author_photo_alex",
      cloudinary_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
      mime_type: "image/jpeg",
      size_bytes: 13900,
      width: 200,
      height: 200,
      alt_text: "Alex Mercer Portrait",
      uploaded_by: adminUser.id,
    },
  });

  // 6. Create Authors
  const authorSarah = await prisma.author.upsert({
    where: { slug: "sarah-connor" },
    update: { photo_id: authorPhoto.id },
    create: {
      name: "Sarah Connor",
      slug: "sarah-connor",
      photo_id: authorPhoto.id,
      designation: "AI Safety & Ethics Specialist",
      bio: "Sarah Connor has 12+ years of research experience in artificial intelligence alignment, safety, and policy frameworks. Previously she researched LLM behaviors at the AI Alignment Project.",
      twitter_url: "https://twitter.com/sarahconnor",
      linkedin_url: "https://linkedin.com/in/sarahconnor",
    },
  });

  const authorAlex = await prisma.author.upsert({
    where: { slug: "alex-mercer" },
    update: { photo_id: authorPhoto2.id },
    create: {
      name: "Alex Mercer",
      slug: "alex-mercer",
      photo_id: authorPhoto2.id,
      designation: "Principal Frontend Architect",
      bio: "Alex is a web standards advocate specializing in Next.js, high-performance rendering pipelines, CSS architectures, and accessible UI frameworks. He is a frequent speaker at web tech conferences.",
      website_url: "https://alexmercer.dev",
      linkedin_url: "https://linkedin.com/in/alexmercer",
    },
  });

  const authorSushil = await prisma.author.upsert({
    where: { slug: "sushil-panchal" },
    update: {},
    create: {
      name: "Sushil Panchal",
      slug: "sushil-panchal",
      designation: "The Visionary Founder",
      bio: "I believe that automation should go beyond scripts and focus on intelligent, enterprise-wide systems. Sushil Panchal is the visionary founder of StartFlow. Passionate about artificial intelligence, business automation, and enterprise scaling, Sushil is dedicated to building the digital infrastructure for the modern enterprise. Through StartFlow, he is working to provide tools, workflows, and a robust platform that helps businesses discover inefficiencies, streamline operations, analyze data, and build autonomous agents. His mission is to empower companies to significantly cut costs and scale frictionlessly. 🚀",
      twitter_url: "https://twitter.com/sushilpanchal",
      linkedin_url: "https://linkedin.com/in/sushilpanchal",
      website_url: "https://startflow.in",
    },
  });

  // Helper to delete existing content blocks to prevent position constraint violations on re-run
  await prisma.contentBlock.deleteMany();
  await prisma.contentTag.deleteMany();
  await prisma.content.deleteMany();

  // 7. Create Article 1: Future of AI (Category: AI & ML, Author: Sarah Connor)
  const article1 = await prisma.content.create({
    data: {
      type: "blog",
      status: "published",
      title: "The Future of Generative AI: Navigating the Next Decade of LLMs",
      subtitle: "As language models grow larger and more multimodal, how should engineers and product designers prepare for the intelligence age?",
      slug: "future-of-generative-ai",
      featured_image_id: media1.id,
      category_id: catAI.id,
      author_id: authorSarah.id,
      publish_date: new Date(),
      seo_title: "The Future of Generative AI: 10-Year Outlook on LLMs",
      seo_description: "Explore the next decade of Large Language Models. Understand multimodal AI, agentic systems, safety frameworks, and optimization guidelines.",
      canonical_url: "",
      view_count: 1250,
      read_count: 875,
      word_count: 1450,
    },
  });

  // Attach Tags
  await prisma.contentTag.createMany({
    data: [
      { content_id: article1.id, tag_id: tagAI.id },
      { content_id: article1.id, tag_id: tagSaaS.id },
    ]
  });

  // Create Blocks for Article 1
  await prisma.contentBlock.createMany({
    data: [
      {
        content_id: article1.id,
        type: "hero",
        position: 1,
        data: JSON.stringify({
          image_url: media1.cloudinary_url,
          title: "The Future of Generative AI",
          subtitle: "Navigating the Next Decade of LLMs",
        }),
      },
      {
        content_id: article1.id,
        type: "text",
        position: 2,
        data: JSON.stringify({
          heading: "1. The Multimodal Revolution",
          body: "Over the past three years, Large Language Models (LLMs) have transformed from simple text predictors into rich multimodal engines capable of reading code, understanding architectural blueprints, interpreting video frames, and generating realistic audio.\n\nThis shift from single-modality to multi-modality represents a foundational change in computer science. Developers are no longer restricted to text-in-text-out architectures. We are now building spatial, audio, and visual loops directly into consumer platforms.",
        }),
      },
      {
        content_id: article1.id,
        type: "quote",
        position: 3,
        data: JSON.stringify({
          text: "We are moving away from treating AI as a static text oracle, and toward treating it as an active, agentic coworker that operates across every digital medium.",
          author: "Sarah Connor, AI Ethics Specialist",
        }),
      },
      {
        content_id: article1.id,
        type: "statistics",
        position: 4,
        data: JSON.stringify({
          stats: [
            { value: "10x", label: "Developer Speedup", description: "In standard documentation search and code drafting" },
            { value: "40%", label: "Task Automation", description: "Of repetitive operations in customer service and workflows" },
            { value: "92%", label: "Adoption Rate", description: "Among Fortune 500 engineering teams in 2025" }
          ]
        }),
      },
      {
        content_id: article1.id,
        type: "text",
        position: 5,
        data: JSON.stringify({
          heading: "2. The Rise of Agentic Architecture",
          body: "The next phase of generative technology is not just larger parameter sizes; it is **agency**. Agentic workflows involve LLMs operating in a loop: planning a sequence of tasks, invoking external tools (search engines, compilers, databases), evaluating outputs, and correcting mistakes autonomously.\n\nInstead of submitting a single prompt and getting a static reply, users will describe a high-level goal. The agent will spin up subagents, partition the workload, write scripts, verify execution, and deliver finished results.",
        }),
      },
      {
        content_id: article1.id,
        type: "faq",
        position: 6,
        data: JSON.stringify({
          faqs: [
            { question: "Will agentic AI replace software engineers?", answer: "No, but it will shift their role from syntax writing to system engineering and architectural validation." },
            { question: "How can teams prepare for this shift?", answer: "Focus on building structured data pipelines, API access controls, and robust validation harnesses that agents can safely query." }
          ]
        }),
      },
      {
        content_id: article1.id,
        type: "cta",
        position: 7,
        data: JSON.stringify({
          title: "Looking to integrate AI into your workflow?",
          button_text: "Book an Advisory Session",
          button_url: "/contact",
        }),
      },
    ],
  });

  // 8. Create Article 2: Next.js Performance (Category: Frontend, Author: Alex Mercer)
  const article2 = await prisma.content.create({
    data: {
      type: "blog",
      status: "published",
      title: "Optimizing Next.js 15 Applications for Core Web Vitals at Scale",
      subtitle: "A deep dive into server components caching strategies, dynamic client-side islands, Turbopack compiling, and sub-second LCP goals.",
      slug: "optimizing-nextjs-15-performance",
      featured_image_id: media2.id,
      category_id: catFrontend.id,
      author_id: authorAlex.id,
      publish_date: new Date(),
      seo_title: "Next.js 15 Core Web Vitals Optimization Guide",
      seo_description: "Learn how to achieve sub-second LCP and high Lighthouse scores in Next.js 15. Caching rules, server component patterns, and asset loading specs.",
      canonical_url: "",
      view_count: 2400,
      read_count: 1320,
      word_count: 1800,
    },
  });

  await prisma.contentTag.createMany({
    data: [
      { content_id: article2.id, tag_id: tagNext.id },
      { content_id: article2.id, tag_id: tagUX.id },
    ]
  });

  await prisma.contentBlock.createMany({
    data: [
      {
        content_id: article2.id,
        type: "hero",
        position: 1,
        data: JSON.stringify({
          image_url: media2.cloudinary_url,
          title: "Next.js 15 Performance",
          subtitle: "Core Web Vitals at Scale",
        }),
      },
      {
        content_id: article2.id,
        type: "text",
        position: 2,
        data: JSON.stringify({
          heading: "The Shift to Server Components",
          body: "Next.js 15 has cemented React Server Components (RSC) as the default architecture for modern web applications. By evaluating components on the server, we send zero client-side JavaScript for static sections, significantly reducing Total Blocking Time (TBT) and First Input Delay (FID).\n\nHowever, rendering on the server introduces new latency profiles. If your database calls or API fetches are unoptimized, your Time to First Byte (TTFB) will suffer, delaying LCP. Let's outline the strategies to combat this.",
        }),
      },
      {
        content_id: article2.id,
        type: "image_text",
        position: 3,
        data: JSON.stringify({
          image_url: media2.cloudinary_url,
          body: "When designing page structures, isolate interactive segments (like carousels, forms, or custom charts) into leaf nodes. Annotate these files with the 'use client' directive. This ensures the surrounding container layout is rendered statically, maximizing performance and loading speed.",
          image_position: "left"
        }),
      },
      {
        content_id: article2.id,
        type: "text",
        position: 4,
        data: JSON.stringify({
          heading: "Advanced Caching Strategies",
          body: "Next.js 15 features fine-grained caching controllers. Use **Incremental Static Regeneration (ISR)** for high-throughput listing pages. Caching static HTML at edge nodes means pages load instantly (<200ms) for visitors worldwide, with revalidation running lazily in the background.",
        }),
      },
      {
        content_id: article2.id,
        type: "quote",
        position: 5,
        data: JSON.stringify({
          text: "Caching is not about storing data; it is about reducing computing loops. A perfect cache strategy eliminates database traffic during load spikes.",
          author: "Alex Mercer, Principal Architect",
        }),
      },
      {
        content_id: article2.id,
        type: "video",
        position: 6,
        data: JSON.stringify({
          video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        }),
      },
    ],
  });

  // 9. Create Article 3: SEO Growth (Category: Growth, Author: Alex Mercer)
  const article3 = await prisma.content.create({
    data: {
      type: "blog",
      status: "published",
      title: "The Technical SEO Blueprint for Modern Content Platforms",
      subtitle: "How to automate XML sitemaps, JSON-LD schemas, canonical routing, and meta headers to rank organically in record time.",
      slug: "technical-seo-blueprint",
      featured_image_id: media3.id,
      category_id: catGrowth.id,
      author_id: authorAlex.id,
      publish_date: new Date(),
      seo_title: "Technical SEO Guide for Developer Platforms",
      seo_description: "Unlock organic traffic with our technical SEO blueprint. Automated sitemaps, dynamic schema tags, canonical mapping, and mobile responsiveness.",
      canonical_url: "",
      view_count: 980,
      read_count: 510,
      word_count: 1100,
    },
  });

  await prisma.contentTag.createMany({
    data: [
      { content_id: article3.id, tag_id: tagSEO.id },
      { content_id: article3.id, tag_id: tagSaaS.id },
    ]
  });

  await prisma.contentBlock.createMany({
    data: [
      {
        content_id: article3.id,
        type: "hero",
        position: 1,
        data: JSON.stringify({
          image_url: media3.cloudinary_url,
          title: "Technical SEO Blueprint",
          subtitle: "Automating Growth Frameworks",
        }),
      },
      {
        content_id: article3.id,
        type: "text",
        position: 2,
        data: JSON.stringify({
          heading: "Why Developers Control SEO",
          body: "SEO is no longer just about keyword stuffing or writing meta descriptions. Search engine crawlers evaluate web experiences based on core metrics: page speed, cumulative layout shift, mobile friendliness, semantic HTML structure, and machine-readable metadata.\n\nA blogging platform should enforce these requirements programmatically. Editors shouldn't need to manually configure schemas or verify sitemap inclusion. It should happen out of the box on every publish action.",
        }),
      },
      {
        content_id: article3.id,
        type: "feature_grid",
        position: 3,
        data: JSON.stringify({
          features: [
            { icon: "Shield", title: "SSL & Security", description: "Enforces HTTPS protocol and secured token authorization headers." },
            { icon: "Zap", title: "Automated Sitemap", description: "Regenerates sitemap.xml instantly upon content state transitions." },
            { icon: "Code", title: "Structured Schema", description: "Embeds BlogPosting and Breadcrumb JSON-LD schemas automatically." }
          ]
        }),
      },
    ],
  });

  // 10. Create Article 4: Aesthetic Design (Category: Design, Author: Sarah Connor)
  const article4 = await prisma.content.create({
    data: {
      type: "blog",
      status: "published",
      title: "Designing Premium Interfaces: Moving Beyond Standard Component Libraries",
      subtitle: "Why default buttons and plain colors reduce user engagement, and how to craft custom dark modes, micro-animations, and glassmorphic layouts.",
      slug: "designing-premium-user-interfaces",
      featured_image_id: media4.id,
      category_id: catDesign.id,
      author_id: authorSarah.id,
      publish_date: new Date(),
      seo_title: "Aesthetic UI Design: Micro-Animations & Dark Modes",
      seo_description: "Elevate your web design. Learn custom layout techniques, fluid CSS transitions, color theory adjustments, and how to integrate responsive aesthetics.",
      canonical_url: "",
      view_count: 1890,
      read_count: 1410,
      word_count: 1300,
    },
  });

  await prisma.contentTag.createMany({
    data: [
      { content_id: article4.id, tag_id: tagUX.id },
      { content_id: article4.id, tag_id: tagSaaS.id },
    ]
  });

  await prisma.contentBlock.createMany({
    data: [
      {
        content_id: article4.id,
        type: "hero",
        position: 1,
        data: JSON.stringify({
          image_url: media4.cloudinary_url,
          title: "Designing Premium Interfaces",
          subtitle: "Moving Beyond Default Components",
        }),
      },
      {
        content_id: article4.id,
        type: "text",
        position: 2,
        data: JSON.stringify({
          heading: "The UX of Aesthetics",
          body: "When a visitor lands on your page, their subconscious makes a decision about your brand within 200 milliseconds. If the page is unaligned, uses standard system fonts, or relies on default styling, they perceive the brand as low-budget or outdated.\n\nPremium web design is not about adding heavy assets or complex transitions. It is about harmony: smooth micro-interactions on hover, refined color palettes, proper typography leading, and glassmorphic overlays that let the layout breathe.",
        }),
      },
    ],
  });

  // 11. Seed Analytics Events (to display nice dashboard charts)
  await prisma.analyticsEvent.deleteMany();
  
  const events = [];
  const eventTypes = ["page_view", "content_read", "cta_click", "share_click"];
  const contentIds = [article1.id, article2.id, article3.id, article4.id];

  // Seed events spanning the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    for (let j = 0; j < 15; j++) {
      const randomContentId = contentIds[Math.floor(Math.random() * contentIds.length)];
      const randomType = Math.random() > 0.4 ? "page_view" : Math.random() > 0.3 ? "content_read" : "cta_click";
      events.push({
        event_type: randomType,
        content_id: randomContentId,
        session_id: `session_${Math.random().toString(36).substr(2, 9)}`,
        payload: randomType === "cta_click" ? JSON.stringify({ button_label: "Contact", destination_url: "/contact" }) : null,
        created_at: date,
      });
    }
  }

  await prisma.analyticsEvent.createMany({ data: events });

  // 12. Seed Contacts / Leads
  await prisma.contact.deleteMany();
  await prisma.contact.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@cyberdyne.com",
        company: "Cyberdyne Systems",
        message: "We need an advisory session on implementing agentic AI pipelines in our automated manufacturing plant.",
        status: "new",
        source: "/blog/future-of-generative-ai",
      },
      {
        name: "Clara Oswald",
        email: "clara@tardis.co",
        company: "Tardis Consulting",
        message: "Interested in technical SEO overhaul for our multi-regional blog site.",
        status: "contacted",
        source: "/blog/technical-seo-blueprint",
      },
      {
        name: "Bruce Wayne",
        email: "bruce@waynecorp.com",
        company: "Wayne Enterprises",
        message: "Looking for principal frontend architects to construct secure, military-grade administrative dashboard systems.",
        status: "converted",
        source: "/contact",
      }
    ]
  });

  // 13. Seed Subscribers
  await prisma.subscriber.deleteMany();
  await prisma.subscriber.createMany({
    data: [
      { email: "subscriber1@gmail.com", is_active: true, source: "homepage_footer" },
      { email: "subscriber2@yahoo.com", is_active: true, source: "blog_detail" },
      { email: "unsubscribed_user@outlook.com", is_active: false, source: "homepage_footer", unsubscribed_at: new Date() },
    ]
  });

  // 14. Seed Testimonials
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        quote: "We went from manual data entry to a fully automated pipeline in 3 weeks. StartFlow's autonomous agents transformed our business.",
        author: "Leo Chen",
        designation: "Verified Client",
        company: "Enterprise Network",
        category: "enterprise",
      },
      {
        quote: "The integration capabilities have drastically reduced our operational costs.",
        author: "Sarah Jenkins",
        designation: "Verified Client",
        company: "Agency Solutions",
        category: "agency",
      },
      {
        quote: "Scaling our customer success team with AI agents was seamless.",
        author: "James Wilson",
        designation: "Verified Client",
        company: "Business Solutions",
        category: "business",
      },
      {
        quote: "The AI tools provided by StartFlow are insane. We deployed an entire predictive model in a weekend.",
        author: "Maya Patel",
        designation: "Verified Client",
        company: "Enterprise Labs",
        category: "enterprise",
      },
      {
        quote: "Our revenue operations are more consistent than ever. We're not just predicting trends; we are acting on them automatically.",
        author: "Principal Miller",
        designation: "Verified Client",
        company: "SaaS Systems",
        category: "saas",
      },
      {
        quote: "We've found incredible efficiency through the StartFlow ecosystem. The execution data is real.",
        author: "TechCorp Ventures",
        designation: "Verified Client",
        company: "Business Ventures",
        category: "business",
      },
    ],
  });

  // 15. Seed FAQs
  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: [
      {
        question: "What is StartFlow?",
        answer: "StartFlow is an India-based AI automation studio building websites, apps, and workflow systems for SMBs in India and worldwide.",
        position: 1,
      },
      {
        question: "Who is StartFlow for?",
        answer: "StartFlow is for small businesses, enterprises, and agencies looking to automate operations, eliminate manual bottlenecks, and leverage AI capabilities.",
        position: 2,
      },
      {
        question: "Do I need technical expertise to use StartFlow?",
        answer: "No. We handle the design, implementation, and deployment. You get fully managed automation dashboards and agents.",
        position: 3,
      },
      {
        question: "What will I automate with StartFlow?",
        answer: "Everything from client onboarding and lead pipelines to complex ERP integrations, content generation, and business reporting.",
        position: 4,
      },
      {
        question: "Does StartFlow integrate with my existing tools?",
        answer: "Yes. We securely connect with your existing tools like Stripe, Salesforce, Slack, Gmail, or custom databases.",
        position: 5,
      },
      {
        question: "How is StartFlow different from Zapier or Make?",
        answer: "Unlike simple trigger-action scripts, we deploy autonomous agents that reason, plan, and execute complex workflows natively with intelligence.",
        position: 6,
      },
      {
        question: "Is my enterprise data secure?",
        answer: "Yes. We prioritize security and privacy, using secure credentials, encrypted APIs, and localized data stores.",
        position: 7,
      },
      {
        question: "Do you provide dedicated support?",
        answer: "Yes, we provide 24/7 dedicated support via WhatsApp and Email for all our clients.",
        position: 8,
      },
      {
        question: "Can agencies white-label StartFlow?",
        answer: "Yes. We offer agency packages that allow you to provide AI-powered services to your clients under your own brand.",
        position: 9,
      },
      {
        question: "How can I deploy StartFlow?",
        answer: "Simply book a free strategy call on our website to analyze your processes and receive a custom AI growth plan.",
        position: 10,
      },
    ],
  });

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
