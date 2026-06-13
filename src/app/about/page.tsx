import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Sparkles, Bot, ShieldAlert, Cpu, Mail, Phone } from "lucide-react";

export default async function AboutPage() {
  let founder: any = null;

  try {
    founder = await prisma.author.findUnique({
      where: { slug: "sushil-panchal" },
    });
  } catch (e) {
    console.error("Failed to query founder inside about page:", e);
  }

  const pillars = [
    {
      icon: <Bot className="h-6 w-6 text-violet-500" />,
      title: "Augmented Workflows",
      description: "Moving beyond manual tasks to autonomous, project-based execution within existing enterprise frameworks.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-violet-500" />,
      title: "Market Readiness",
      description: "Bridging the gap between legacy infrastructure and the high-speed requirements of the global AI economy.",
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-violet-500" />,
      title: "Automation Culture",
      description: "Integrating the 'automate everything' mindset into the DNA of modern businesses.",
    },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen transition-colors duration-300 animate-fade-in">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 space-y-24">
        
        {/* Header Hero */}
        <div className="mx-auto max-w-3xl text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3.5 py-1 text-xs text-zinc-400">
            <Sparkles size={12} className="text-violet-400" />
            <span>MISSION: SCALABLE FUTURE</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
            Evolving Global Operations
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            "We aren't here to change your business; we are here to automate it."
          </p>
        </div>

        {/* Mission / Vision statement block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Vision card */}
          <div className="rounded-3xl border border-zinc-855 bg-zinc-900/10 p-6 space-y-3 hover:border-zinc-800 transition-colors">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">
              Our Vision
            </h3>
            <h4 className="text-base font-bold text-white uppercase tracking-wide">
              Empowering teams with autonomous systems
            </h4>
            <p className="text-xs text-zinc-450 leading-relaxed font-sans">
              "Empowering every modern business to move from manual bottlenecks to fully autonomous AI scaling."
            </p>
          </div>

          {/* Mission card */}
          <div className="rounded-3xl border border-zinc-855 bg-zinc-900/10 p-6 space-y-3 hover:border-zinc-800 transition-colors">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">
              Our Mission
            </h3>
            <h4 className="text-base font-bold text-white uppercase tracking-wide">
              Integrating AI into every business process
            </h4>
            <p className="text-xs text-zinc-450 leading-relaxed font-sans">
              "To integrate automation culture into enterprises and provide a frictionless digital ecosystem for real-world scaling."
            </p>
          </div>
        </div>

        {/* Pillars description */}
        <div className="border-t border-zinc-900 pt-16 max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-2xl font-bold text-white">Three Pillars of Automation</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              How we help legacy and modern organizations upgrade their operational systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-zinc-855 bg-zinc-900/10 hover:border-zinc-800 transition-colors space-y-4"
              >
                <div className="h-10 w-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                  {p.icon}
                </div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wide">{p.title}</h4>
                <p className="text-xs text-zinc-450 leading-relaxed font-sans">{p.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Manifesto block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-t border-zinc-900 pt-16 max-w-4xl mx-auto">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
              alt="StartFlow Team Collaboration"
              fill
              className="object-cover opacity-60"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              Every enterprise has incredible potential trapped in repetitive tasks.
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              We bridge the gap between traditional operations and the global AI economy. By integrating automation culture into your company, we transform manual teams into hyper-efficient organizations.
            </p>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Our objective is to empower the next generation of enterprises. Not by replacing the workforce, but by augmenting it with real-world execution tools.
            </p>
          </div>
        </div>

        {/* Dynamic Founder Bio */}
        {founder && (
          <div className="border-t border-zinc-900 pt-16 max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white">The Visionary Founder</h3>
            </div>

            <div className="rounded-3xl border border-zinc-850 bg-zinc-900/10 p-8 flex flex-col md:flex-row gap-8 items-center max-w-2xl mx-auto">
              <div className="h-28 w-28 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 flex items-center justify-center">
                <span className="text-xl font-bold font-mono text-zinc-500">SP</span>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{founder.name}</h4>
                  <p className="text-xs text-violet-400 font-mono font-bold uppercase tracking-wider mt-0.5">
                    {founder.designation}
                  </p>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  "{founder.bio}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Support Center channels */}
        <div className="border-t border-zinc-900 pt-16 max-w-2xl mx-auto space-y-8 text-center" id="support">
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white">Support Center</h3>
            <p className="text-xs text-zinc-500">
              Whether you're stuck on a build or want to know more about our ecosystem, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/10 p-5 space-y-2 text-center">
              <div className="h-8 w-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto text-violet-400">
                <Phone size={14} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Call / WhatsApp</h4>
              <p className="text-[10px] font-mono text-zinc-500">Direct line to the team</p>
              <a href="tel:+919834252099" className="text-xs font-bold text-violet-400 block hover:underline">
                9834252099
              </a>
            </div>

            <div className="rounded-2xl border border-zinc-850 bg-zinc-900/10 p-5 space-y-2 text-center">
              <div className="h-8 w-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto text-violet-400">
                <Mail size={14} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Email Us</h4>
              <p className="text-[10px] font-mono text-zinc-500">Response within 24h</p>
              <a href="mailto:startflow@gmail.com" className="text-xs font-bold text-violet-400 block hover:underline">
                startflow@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
