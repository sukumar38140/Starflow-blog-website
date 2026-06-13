"use client";

import React, { useState, useEffect } from "react";
import { Database, GitBranch, PenTool, CreditCard, MessageSquare, ArrowRightLeft } from "lucide-react";

interface ServiceNode {
  id: string;
  label: string;
  icon: React.ReactNode;
  desc: string;
  dependencies: string[]; // Node IDs this node connects to
  x: number; // percentage width
  y: number; // percentage height
  color: string;
}

export default function ServicesEcosystem() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const services: ServiceNode[] = [
    {
      id: "crm",
      label: "AI CRM & Leads",
      icon: <Database size={18} />,
      desc: "Autonomously routes leads, syncs contact details, and triggers immediate onboarding schedules.",
      dependencies: ["workflows", "support"],
      x: 20,
      y: 30,
      color: "#6366f1", // indigo
    },
    {
      id: "workflows",
      label: "Workflow Orchestrator",
      icon: <GitBranch size={18} />,
      desc: "Coordinates cross-platform software triggers, handles background tasks, and synchronizes external databases.",
      dependencies: ["billing", "crm", "content"],
      x: 50,
      y: 50,
      color: "#a855f7", // purple
    },
    {
      id: "content",
      label: "Content AI Editor",
      icon: <PenTool size={18} />,
      desc: "Drafts SEO-optimized articles, updates site indexes, and structures markdown assets automatically.",
      dependencies: ["crm"],
      x: 80,
      y: 30,
      color: "#06b6d4", // cyan
    },
    {
      id: "billing",
      label: "Billing Engine",
      icon: <CreditCard size={18} />,
      desc: "Manages invoices, synchronizes recurring Stripe records, and predicts revenue flows.",
      dependencies: ["workflows"],
      x: 35,
      y: 75,
      color: "#10b981", // emerald
    },
    {
      id: "support",
      label: "AI Support Agents",
      icon: <MessageSquare size={18} />,
      desc: "Solves support inquiries, onboarding checks, and handles customer interactions 24/7.",
      dependencies: ["crm", "workflows"],
      x: 65,
      y: 75,
      color: "#ec4899", // pink
    },
  ];

  const activeNode = services.find((n) => n.id === hoveredNode) || services[1]; // default to workflows

  // Check if a node is currently highlighted (either hovered itself, or a dependency of the hovered node)
  const isHighlighted = (id: string) => {
    if (!hoveredNode) return true; // show all default
    if (hoveredNode === id) return true;
    const hoveredObj = services.find((n) => n.id === hoveredNode);
    return hoveredObj?.dependencies.includes(id) || false;
  };

  // Check if a link between node A and node B is active
  const isLinkActive = (fromId: string, toId: string) => {
    if (!hoveredNode) return true;
    return hoveredNode === fromId || hoveredNode === toId;
  };

  // Inject dash keyframe animation via useEffect (App Router compatible)
  useEffect(() => {
    const styleId = "services-dash-keyframe";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `@keyframes dash { to { stroke-dashoffset: -50; } }`;
      document.head.appendChild(style);
    }
    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, []);

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-40 border-t border-zinc-900/60">
      
      {/* 12-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Heading & Passive Specs (5 columns) */}
        <div className="lg:col-span-5 space-y-6 text-left animate-fade-in">
          <div className="inline-flex items-center gap-1 text-[9px] font-mono tracking-widest text-cyan-400 uppercase">
            <ArrowRightLeft size={10} className="animate-pulse" />
            <span>Node Dependency Graph</span>
          </div>

          <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
            Connected Systems
          </h3>

          {/* Section description (Under 60 words constraint: 26 words) */}
          <p className="text-sm text-zinc-400 leading-relaxed font-sans">
            Explore how our specialized agents link together to automate operations. Hover over any service node below to map out dynamic data dependencies, active workflows, and systemic pipelines.
          </p>

          {/* Evolving Explanatory Card (Changes based on hover) */}
          <div className="rounded-2xl border border-zinc-850 bg-zinc-900/20 p-5 shadow-lg relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 h-16 w-16 bg-radial-glow opacity-30 pointer-events-none" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div 
                  className="h-8 w-8 rounded-lg flex items-center justify-center border transition-colors"
                  style={{ 
                    borderColor: `${activeNode.color}30`,
                    backgroundColor: `${activeNode.color}08`,
                    color: activeNode.color 
                  }}
                >
                  {activeNode.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                    ACTIVE_MODULE_INFO
                  </span>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide">
                    {activeNode.label}
                  </h4>
                </div>
              </div>

              {/* Card description (Under 20 words constraint: 10-12 words) */}
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                {activeNode.desc}
              </p>

              {/* Dependencies listing */}
              <div className="border-t border-zinc-900/80 pt-3 flex items-center gap-2 text-[10px] font-mono text-zinc-500">
                <span>DEPENDS_ON:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.dependencies.map((depId) => {
                    const depNode = services.find((n) => n.id === depId);
                    return (
                      <span 
                        key={depId}
                        className="rounded px-1.5 py-0.5 text-[8px] font-bold border"
                        style={{ 
                          borderColor: `${depNode?.color}20`,
                          backgroundColor: `${depNode?.color}08`,
                          color: depNode?.color 
                        }}
                      >
                        {depNode?.label.split(" ")[1] || depNode?.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Motion Connected Node Canvas/SVG Graph (7 columns) */}
        <div 
          className="lg:col-span-7 w-full h-[380px] rounded-3xl border border-zinc-850 bg-zinc-900/10 backdrop-blur-sm relative overflow-hidden flex items-center justify-center animate-fade-in"
          style={{ animationDelay: "150ms" }}
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

          {/* SVG Connection Cables */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {services.map((sourceNode) =>
              sourceNode.dependencies.map((targetId) => {
                const targetNode = services.find((n) => n.id === targetId);
                if (!targetNode) return null;

                const active = isLinkActive(sourceNode.id, targetId);
                const strokeColor = hoveredNode 
                  ? (active ? "rgba(99, 102, 241, 0.4)" : "rgba(63, 63, 70, 0.08)") 
                  : "rgba(99, 102, 241, 0.25)";

                const pathString = `M ${sourceNode.x}% ${sourceNode.y}% C ${(sourceNode.x + targetNode.x) / 2}% ${sourceNode.y}%, ${(sourceNode.x + targetNode.x) / 2}% ${targetNode.y}%, ${targetNode.x}% ${targetNode.y}%`;

                return (
                  <g key={`${sourceNode.id}-${targetId}`}>
                    {/* Underlying cable path */}
                    <path
                      d={pathString}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={active ? 2 : 1}
                      className="transition-colors duration-300"
                    />
                    {/* Animated running pulse packet along active paths */}
                    {active && (
                      <path
                        d={pathString}
                        fill="none"
                        stroke="url(#pulseGradient)"
                        strokeWidth={2}
                        strokeDasharray="10 40"
                        className="animate-[dash_2.5s_linear_infinite]"
                      />
                    )}
                  </g>
                );
              })
            )}

            {/* Gradient definition for path pulses */}
            <defs>
              <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0} />
                <stop offset="50%" stopColor="#a855f7" stopOpacity={1} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
          </svg>

          {/* Interactive node elements */}
          {services.map((node) => {
            const active = isHighlighted(node.id);
            const isHovered = hoveredNode === node.id;

            return (
              <button
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: "translate(-50%, -50%)",
                  borderColor: isHovered ? node.color : (active ? "rgba(63, 63, 70, 0.3)" : "rgba(63, 63, 70, 0.1)"),
                  color: active ? "white" : "rgba(255, 255, 255, 0.2)",
                  boxShadow: isHovered ? `0 0 30px ${node.color}20` : "none",
                }}
                className="absolute z-10 flex flex-col items-center gap-1.5 p-3 rounded-2xl border bg-zinc-950/80 backdrop-blur-md transition-all duration-300 hover:scale-105"
              >
                {/* Micro Node icon */}
                <div 
                  className="h-8 w-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: isHovered ? `${node.color}20` : "rgba(63, 63, 70, 0.1)",
                    color: isHovered ? node.color : "rgba(255, 255, 255, 0.6)"
                  }}
                >
                  {node.icon}
                </div>
                
                {/* Node Label */}
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase">
                  {node.label.split(" ")[1] || node.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>

    </section>
  );
}
