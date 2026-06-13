import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/db";
import Hero from "@/components/Hero";
import ServicesEcosystem from "@/components/ServicesEcosystem";
import LatestInsights from "@/components/LatestInsights";
import { Mail, Phone } from "lucide-react";

export const revalidate = 60; // ISR 60-second revalidation

export default async function Home() {
  let posts: any[] = [];
  let founder: any = null;

  try {
    // 1. Fetch recently published posts (exactly 3 for our asymmetric layout)
    posts = await prisma.content.findMany({
      where: {
        type: "blog",
        status: "published",
      },
      orderBy: {
        publish_date: "desc",
      },
      take: 3,
      include: {
        category: true,
        author: true,
        featured_image: true,
      },
    });

    // 2. Fetch founder profile
    founder = await prisma.author.findUnique({
      where: { slug: "sushil-panchal" },
      include: { photo: true },
    });
  } catch (error) {
    console.error("Failed to fetch homepage dynamic data:", error);
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-zinc-950 text-white animate-fade-in">
      {/* 1. Immersive Hero Telemetry Scene */}
      <Hero />

      {/* 2. Connected Services Ecosystem Graph (Single High-Motion Section) */}
      <ServicesEcosystem />

      {/* 3. Asymmetric Blog Insights Grid */}
      <LatestInsights posts={posts} />

      {/* 4. Founder Profile Module */}
      {founder && (
        <section className="relative py-24 md:py-40 px-4 border-t border-zinc-900/60 bg-zinc-950/20">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="text-center space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block">
                AUTHOR_PROFILE // 01
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-center">
                The Founder
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Meet the engineering strategist scaling StartFlow. Sushil Panchal builds custom automation systems, digital architectures, and autonomous pipelines for organizations worldwide.
              </p>
            </div>

            {/* Founder Card Module (Radius 24px) */}
            <div className="rounded-3xl border border-zinc-850 bg-zinc-900/10 p-8 flex flex-col md:flex-row gap-8 items-center max-w-2xl mx-auto backdrop-blur-md">
              <div className="h-24 w-24 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono text-zinc-650 select-none">SP</span>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-bold text-white">{founder.name}</h4>
                  <p className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider mt-0.5">
                    {founder.designation}
                  </p>
                </div>

                <p className="text-xs text-zinc-450 leading-relaxed font-sans italic">
                  "{founder.bio}"
                </p>

                <div className="flex flex-wrap items-center gap-6 border-t border-zinc-900 pt-4 text-[10px] font-mono text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Mail size={12} className="text-cyan-400" />
                    <a href="mailto:startflow.in@gmail.com" className="hover:text-white transition-colors">
                      startflow.in@gmail.com
                    </a>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={12} className="text-cyan-400" />
                    <a href="tel:+919834252099" className="hover:text-white transition-colors">
                      +91 9834252099
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Support CTA Banner */}
      <section className="relative py-24 md:py-40 px-4 bg-zinc-950 border-t border-zinc-900/60 text-center overflow-hidden">
        <div className="absolute inset-0 bg-radial-glow opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl leading-tight">
            Build faster. Scale smarter. Grow with AI.
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
            Need custom automation workflows, digital architectures, or AI implementations? Get in touch with our team directly.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/contact"
              className="rounded-lg bg-white px-6 py-2.5 text-xs font-bold text-zinc-950 transition-all hover:bg-zinc-200"
            >
              Contact Team
            </Link>
            <Link
              href="/blog"
              className="rounded-lg border border-zinc-800 px-6 py-2.5 text-xs font-bold text-white transition-all hover:bg-zinc-900"
            >
              Explore Insights
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
