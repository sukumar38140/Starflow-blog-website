"use client";

import React, { useState } from "react";
import { Compass, Cpu, Target, Zap, Activity } from "lucide-react";

interface Sector {
  id: string;
  num: string;
  name: string;
  codename: string;
  label: string;
  tool: string;
  description: string;
  detail: string;
  actionLabel: string;
  coordinates: string;
  status: string;
  colorClass: string;
  glowColor: string;
}

export default function NeuralMap() {
  const sectors: Sector[] = [
    {
      id: "idea",
      num: "01",
      name: "IDEA",
      codename: "SYNC_01 // VISION",
      label: "StartFlow Vision AI",
      tool: "Explore Data",
      description: "Business validation, niche analysis, and AI strategy alignment.",
      detail: "Vision AI decodes market signals to find your unfair advantage, analyzing real-time organic gaps and generating comprehensive feasibility scores.",
      actionLabel: "Ideation Sync",
      coordinates: "Lat 20.5937° N // Lon 78.9629° E",
      status: "SYNC_COMPLETED",
      colorClass: "text-violet-500 border-violet-500/20 bg-violet-500/5",
      glowColor: "rgba(139, 92, 246, 0.3)",
    },
    {
      id: "prototype",
      num: "02",
      name: "PROTOTYPE",
      codename: "BUILD_02 // SYSTEM",
      label: "StartFlow Builder",
      tool: "Explore Data",
      description: "Instant landing pages, MVP generation, and complex workflow setup.",
      detail: "Builder automates the transition from concept to functional system. Generates complete UI pages and configures backend API endpoints autonomously.",
      actionLabel: "Assembly Node",
      coordinates: "Lat 22.3511° N // Lon 78.6677° E",
      status: "BUILD_STABLE",
      colorClass: "text-blue-500 border-blue-500/20 bg-blue-500/5",
      glowColor: "rgba(59, 130, 246, 0.3)",
    },
    {
      id: "product",
      num: "03",
      name: "PRODUCT",
      codename: "CORE_03 // KERNEL",
      label: "StartFlow OS",
      tool: "Explore Data",
      description: "Integrated CRM, autonomous automations, and predictive analytics dashboards.",
      detail: "OS becomes the neural center of your business. Seamlessly orchestrates inventory management, multi-channel customer communications, and transaction ledgers.",
      actionLabel: "Operation Base",
      coordinates: "Lat 28.6139° N // Lon 77.2090° E",
      status: "CORE_OK",
      colorClass: "text-pink-500 border-pink-500/20 bg-pink-500/5",
      glowColor: "rgba(236, 72, 153, 0.3)",
    },
    {
      id: "growth",
      num: "04",
      name: "GROWTH",
      codename: "SCAL_04 // INFINITY",
      label: "StartFlow Growth Engine",
      tool: "Explore Data",
      description: "AI lead systems, content automation, and self-optimizing ad funnels.",
      detail: "Engine scales your impact with autonomous marketing agents, auto-generating blog articles, scheduling sitemap releases, and scraping sales signals.",
      actionLabel: "Expansion Array",
      coordinates: "Lat 19.0760° N // Lon 72.8777° E",
      status: "INFINITY_ACTIVE",
      colorClass: "text-emerald-500 border-emerald-500/20 bg-emerald-500/5",
      glowColor: "rgba(16, 185, 129, 0.3)",
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeSector = sectors[activeIdx];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
      
      {/* Interactive SVG / Graphic Panel */}
      <div className="lg:col-span-7 rounded-3xl border border-zinc-200/50 bg-white/40 p-6 backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/20 flex flex-col justify-between relative overflow-hidden min-h-[350px]">
        {/* Background Network Graphic Overlay */}
        <div className="absolute inset-0 opacity-15 dark:opacity-25 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 300">
            <line x1="80" y1="200" x2="160" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-650" />
            <line x1="160" y1="90" x2="240" y2="180" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-650" />
            <line x1="240" y1="180" x2="320" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-650" />
            
            {/* Pulsing rings around active coordinates */}
            {activeIdx === 0 && <circle cx="80" cy="200" r="18" fill="none" stroke="rgba(139, 92, 246, 0.4)" strokeWidth="1" className="animate-ping" />}
            {activeIdx === 1 && <circle cx="160" cy="90" r="18" fill="none" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="1" className="animate-ping" />}
            {activeIdx === 2 && <circle cx="240" cy="180" r="18" fill="none" stroke="rgba(236, 72, 153, 0.4)" strokeWidth="1" className="animate-ping" />}
            {activeIdx === 3 && <circle cx="320" cy="70" r="18" fill="none" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" className="animate-ping" />}

            {/* Static Connection Points */}
            <circle cx="80" cy="200" r="4" className={activeIdx === 0 ? "fill-violet-500" : "fill-zinc-400 dark:fill-zinc-750"} />
            <circle cx="160" cy="90" r="4" className={activeIdx === 1 ? "fill-blue-500" : "fill-zinc-400 dark:fill-zinc-750"} />
            <circle cx="240" cy="180" r="4" className={activeIdx === 2 ? "fill-pink-500" : "fill-zinc-400 dark:fill-zinc-750"} />
            <circle cx="320" cy="70" r="4" className={activeIdx === 3 ? "fill-emerald-500" : "fill-zinc-400 dark:fill-zinc-750"} />
          </svg>
        </div>

        {/* Telemetry Status Headers */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1 text-[9px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            <Activity size={10} className="text-violet-500 animate-pulse" />
            <span>NEURAL_SYNC_ACTIVE // DATA_FLOW_STABLE // AGENT_DYNAMICS_OK</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-zinc-800 dark:text-white uppercase">
            SCALE: 1:50000
          </span>
        </div>

        {/* Clickable Map Nodes */}
        <div className="grid grid-cols-4 gap-3 z-10 my-8">
          {sectors.map((s, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveIdx(idx)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-300 ${
                  isActive
                    ? `border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950 font-bold scale-[1.03] shadow-lg`
                    : "border-zinc-200 bg-white/50 text-zinc-500 hover:border-zinc-300 hover:text-zinc-850 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white"
                }`}
                style={{
                  boxShadow: isActive ? `0 10px 25px -5px ${s.glowColor}` : "none",
                }}
              >
                <span className="text-[10px] font-mono uppercase tracking-widest block opacity-60">
                  Sec {s.num}
                </span>
                <span className="text-xs font-bold uppercase mt-1 tracking-wider">
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Coordinate readouts */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-zinc-200/50 pt-4 dark:border-zinc-800/40 z-10 gap-2">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            TELEMETRY NODE: <span className="font-bold text-zinc-800 dark:text-zinc-300">{activeSector.coordinates}</span>
          </div>
          <div className="flex gap-4">
            <span className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[9px] font-mono font-bold text-zinc-700 dark:bg-zinc-850 dark:text-zinc-300">
              {activeSector.actionLabel}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-violet-500/10 px-2 py-0.5 text-[9px] font-mono font-bold text-violet-600 dark:text-violet-400">
              {activeSector.status}
            </span>
          </div>
        </div>
      </div>

      {/* Description Details Card */}
      <div className="lg:col-span-5 rounded-3xl border border-zinc-200/50 bg-zinc-50/50 p-6 dark:border-zinc-800/50 dark:bg-zinc-950/40 flex flex-col justify-between gap-6 transition-all duration-300">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${activeSector.colorClass}`}>
              {activeIdx === 0 && <Compass size={16} />}
              {activeIdx === 1 && <Cpu size={16} />}
              {activeIdx === 2 && <Target size={16} />}
              {activeIdx === 3 && <Zap size={16} />}
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase block">
                {activeSector.codename}
              </span>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                {activeSector.label}
              </h4>
            </div>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-zinc-800 dark:text-zinc-250">
              {activeSector.description}
            </h5>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
              {activeSector.detail}
            </p>
          </div>
        </div>

        <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-xs font-bold text-white transition-all hover:bg-zinc-850 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
          <span>Sync {activeSector.name} System</span>
        </button>
      </div>
    </div>
  );
}
