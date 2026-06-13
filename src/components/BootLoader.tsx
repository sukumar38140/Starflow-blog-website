"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Shield, Cpu, Activity } from "lucide-react";

export default function BootLoader() {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check session storage to only run once per session
    const hasBooted = sessionStorage.getItem("startflow_booted");
    
    if (hasBooted) {
      return; // Skip loading animation
    }

    setVisible(true);
    document.body.style.overflow = "hidden"; // lock page scroll during boot

    const bootSequence = [
      "SYSTEM INITIATED // STARTFLOW_OS v1.0.4",
      "CHECKING HOST INTEGRITY...",
      "LOAD KERNEL NODE: OK",
      "SYNCING SECURE PRISMA DATABASE INTERFACE...",
      "LOCATING ACTIVE AUTOMATION AGENT WORKFLOWS... FOUND",
      "COMPILING SYSTEM DEPLOYMENT TELEMETRY...",
      "ESTABLISHING GRAPH CONSOLE PORTAL..."
    ];

    let currentLogIdx = 0;
    
    // Add logs progressively
    const logInterval = setInterval(() => {
      if (currentLogIdx < bootSequence.length) {
        setLogs((prev) => [...prev, bootSequence[currentLogIdx]]);
        currentLogIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 180);

    // Progress counter animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // Trigger fade out after progress reaches 100
          setTimeout(() => {
            setFadeOut(true);
            
            // Unmount completely and restore scroll after fade completes
            setTimeout(() => {
              setVisible(false);
              document.body.style.overflow = "unset";
              sessionStorage.setItem("startflow_booted", "true");
            }, 600);
          }, 300);

          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 45);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black font-mono transition-all duration-500 ease-in-out crt-overlay ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Animated scanner overlay bar */}
      <div className="absolute inset-x-0 h-0.5 bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.5)] scanner-line pointer-events-none" />

      {/* Terminal Container */}
      <div className="w-full max-w-xl px-6 py-8 md:px-10 space-y-6 text-xs text-emerald-400 select-none">
        
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-emerald-950 pb-3">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="animate-pulse" />
            <span className="text-[10px] tracking-wider font-extrabold uppercase">
              BOOT SECURE ENGINE // SF_SYS_LOAD
            </span>
          </div>
          <div className="flex items-center gap-1.5 opacity-60">
            <Shield size={11} className="text-emerald-500" />
            <span className="text-[9px] uppercase font-bold">Encrypted</span>
          </div>
        </div>

        {/* Console logs output */}
        <div className="space-y-2.5 min-h-[160px] max-h-[160px] overflow-hidden">
          {logs.map((log, idx) => (
            <div key={idx} className="flex items-center gap-2 animate-fade-in">
              <span className="text-emerald-600 font-bold">&gt;&gt;</span>
              <span>{log}</span>
            </div>
          ))}
          {logs.length < 7 && (
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">&gt;&gt;</span>
              <span className="h-4 w-1.5 bg-emerald-400 animate-pulse" />
            </div>
          )}
        </div>

        {/* Progress bar container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-emerald-500/80">
            <span className="flex items-center gap-1">
              <Cpu size={12} className="animate-spin-slow" />
              <span>Orchestrator Booting</span>
            </span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          
          <div className="h-1.5 w-full rounded-full bg-emerald-950/45 border border-emerald-900/30 overflow-hidden p-0.5">
            <div
              className="h-full bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.7)] transition-all duration-75"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>

        {/* Dynamic coordinate indicators at bottom */}
        <div className="flex items-center justify-between border-t border-emerald-950 pt-4 text-[9px] opacity-40">
          <div className="flex items-center gap-1">
            <Activity size={10} />
            <span>NODE_SCANNING: ACTIVE</span>
          </div>
          <span>SECURE_SESSION // 0x51F729</span>
        </div>

      </div>
    </div>
  );
}
