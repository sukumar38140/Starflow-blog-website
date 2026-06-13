"use client";

import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Cpu, Activity, Zap } from "lucide-react";
import NewsletterForm from "./NewsletterForm";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  pulseSpeed: number;
  pulseTime: number;
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Real-time telemetry state
  const [sysLoad, setSysLoad] = useState("1.85");
  const [tokenRate, setTokenRate] = useState("45,210");
  const [latency, setLatency] = useState("14");

  // Magnetic button references
  const btnRef = useRef<HTMLDivElement>(null);
  const [btnTransform, setBtnTransform] = useState("translate3d(0px, 0px, 0px)");

  useEffect(() => {
    // 1. Telemetry ticking updates
    const statInterval = setInterval(() => {
      setSysLoad((1.5 + Math.random() * 0.9).toFixed(2));
      setTokenRate((42000 + Math.floor(Math.random() * 5000)).toLocaleString());
      setLatency((12 + Math.floor(Math.random() * 5)).toString());
    }, 1200);

    // 2. Interactive node network animation
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = 550);

    const nodes: Node[] = [];
    const maxNodes = isReducedMotion ? 0 : 35;
    const linkDistance = 120;

    for (let i = 0; i < maxNodes; i++) {
      const radius = 2 + Math.random() * 2;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius,
        baseRadius: radius,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseTime: Math.random() * Math.PI,
      });
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const resize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = 550;
    };
    window.addEventListener("resize", resize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.15;
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`; // indigo
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        // Bounce walls
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Pulse size
        n.pulseTime += n.pulseSpeed;
        n.radius = n.baseRadius + Math.sin(n.pulseTime) * 1;

        // Cursor attraction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          n.x -= (dx / dist) * force * 0.5;
          n.y -= (dy / dist) * force * 0.5;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = dist < 150 ? "rgba(6, 182, 212, 0.7)" : "rgba(139, 92, 246, 0.5)"; // cyan on hover, violet default
        ctx.fill();

        // Node glow
        if (dist < 150) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
          ctx.fill();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    if (!isReducedMotion) {
      render();
    }

    return () => {
      clearInterval(statInterval);
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // Magnetic button cursor calculation
  const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setBtnTransform(`translate3d(${x * 0.35}px, ${y * 0.35}px, 0px) scale(1.02)`);
  };

  const handleMagneticLeave = () => {
    setBtnTransform("translate3d(0px, 0px, 0px) scale(1)");
  };

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950/45 border-b border-zinc-900/60 py-24 md:py-36">
      
      {/* Immersive Node Network Canvas background overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 md:opacity-60">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Newsletter (7 Columns) */}
          <div className="lg:col-span-7 space-y-8 text-left animate-fade-in">
            {/* High-Tech Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/40 px-3.5 py-1 text-xs text-zinc-300 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              <span className="text-[10px] font-mono tracking-widest font-semibold uppercase">
                STARTFLOW AI // DECODED_LOGIC
              </span>
            </div>

            {/* Cinematic Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
              INSIGHTS & <br />
              <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                SYSTEMS AUTOMATION
              </span>
            </h1>

            {/* Description (Under 30 words constraint: exactly 20 words) */}
            <p className="max-w-xl text-base text-zinc-400 leading-relaxed font-sans">
              Deep dives into operations engineering, autonomous agents, and system automation. Learn to eliminate manual bottlenecks and scale with AI.
            </p>

            {/* Premium Subscriber Hub console */}
            <div className="w-full max-w-md pt-2">
              <div 
                ref={btnRef}
                onMouseMove={handleMagneticMove}
                onMouseLeave={handleMagneticLeave}
                style={{ transform: btnTransform }}
                className="transition-transform duration-200 ease-out"
              >
                <div className="p-1 rounded-2xl border border-zinc-850 bg-zinc-900/30 backdrop-blur-md shadow-lg">
                  <div className="px-4 py-2 border-b border-zinc-900/60 flex items-center justify-between">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      Subscribe to intelligence logs
                    </span>
                    <Zap size={10} className="text-cyan-400 animate-pulse" />
                  </div>
                  <div className="p-2.5">
                    <NewsletterForm />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Telemetry Dashboard (5 Columns) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "150ms" }}>
            <div className="w-full max-w-sm rounded-3xl border border-zinc-850 bg-zinc-950/80 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-violet-500/30 transition-colors duration-300">
              
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
                    SYSTEM_MONITOR // ACTIVE
                  </span>
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>

              {/* Real-time parameters list */}
              <div className="space-y-4">
                
                {/* Metric 1: System Load */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                      OPS_COMPILER_LOAD
                    </span>
                    <span className="text-lg font-bold text-white font-mono">{sysLoad}%</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-violet-400">
                    <Cpu size={14} className="animate-spin-slow" />
                  </div>
                </div>

                {/* Metric 2: Token rate */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                      TOKEN_SYNC_RATE
                    </span>
                    <span className="text-lg font-bold text-white font-mono">{tokenRate} t/s</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-cyan-400">
                    <Activity size={14} />
                  </div>
                </div>

                {/* Metric 3: Network Latency */}
                <div className="p-3.5 rounded-xl border border-zinc-900 bg-zinc-900/20 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block">
                      NODE_RTT_LATENCY
                    </span>
                    <span className="text-lg font-bold text-white font-mono">{latency} ms</span>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                    <Zap size={14} />
                  </div>
                </div>

              </div>

              {/* Status footer badges */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-5 text-[9px] font-mono text-zinc-500">
                <div className="flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  <span>INTELLIGENT_OS_OK</span>
                </div>
                <span>CORE v1.0.4</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
