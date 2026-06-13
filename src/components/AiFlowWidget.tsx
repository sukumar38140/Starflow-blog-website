"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

export default function AiFlowWidget() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! I'm StartFlow AI. How can I help you automate your business operations today?",
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: "Automate onboarding", val: "How do you automate client onboarding?" },
    { label: "Intelligent data analysis", val: "Tell me about your intelligent data analysis." },
    { label: "Workflow generation", val: "How does workflow generation work?" },
    { label: "ERP integration", val: "Can you help with ERP integration?" },
  ];

  const getResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("onboard")) {
      return "StartFlow coordinates your client onboarding by linking Webhooks/Typeforms directly to Slack notifications, generating automatic contract drafts in Google Drive, and setting up Client Portals in under 2 seconds. Move from manual data copy to automated scaling!";
    }
    if (q.includes("data") || q.includes("analysis") || q.includes("prediction")) {
      return "Our Intelligent Data Analyzer pulls data from Stripe or your database, parses them through an LLM analytics node, and delivers key predictions like churn risk, operational bottlenecks, and automated growth suggestions directly to your team.";
    }
    if (q.includes("workflow") || q.includes("generat")) {
      return "StartFlow parses natural language workflow requests and instantly designs custom software templates. We compile visual logic chains and synchronize background microservices to automate daily tasks without manual friction.";
    }
    if (q.includes("erp") || q.includes("integrat")) {
      return "We securely interface with legacy ERP platforms (like SAP, Oracle) or SaaS systems. Using customized AI orchestration layers, we synchronize inventory, purchase requests, and advanced billing records autonomously 24/7.";
    }
    return "StartFlow is an India-based AI automation studio. We build custom websites, dashboards, and automated agent workflows for SMBs worldwide. To explore a dedicated solution for your business, click the 'Book Free Strategy Call' button above!";
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add User Message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        sender: "bot",
        text: getResponse(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/90 shadow-[0_0_50px_rgba(139,92,246,0.18)] max-w-2xl mx-auto overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(139,92,246,0.28)] hover:border-violet-500/30">
      
      {/* High-Contrast Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-zinc-850 bg-zinc-900/80 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono font-extrabold text-emerald-400 tracking-widest uppercase">
            AI FLOW ACTIVE // SECURE_SYNC
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-red-500/70" />
          <div className="h-2 w-2 rounded-full bg-yellow-500/70" />
          <div className="h-2 w-2 rounded-full bg-green-500/70" />
        </div>
      </div>

      {/* Chat Messages Log Panel */}
      <div className="h-80 overflow-y-auto px-5 py-6 space-y-4 font-sans text-xs bg-zinc-950/40">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 max-w-[85%] ${
              msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
            }`}
          >
            {/* Avatar */}
            <div className={`h-7.5 w-7.5 rounded-lg flex items-center justify-center border shrink-0 ${
              msg.sender === "bot" 
                ? "bg-violet-500/10 border-violet-500/30 text-violet-400" 
                : "bg-zinc-800 border-zinc-700 text-zinc-200"
            }`}>
              {msg.sender === "bot" ? <Bot size={14} /> : <User size={14} />}
            </div>

            {/* Bubble */}
            <div className="space-y-1">
              <div className={`rounded-2xl px-4 py-2.5 leading-relaxed shadow-md ${
                msg.sender === "bot"
                  ? "bg-zinc-900 border border-zinc-800 text-zinc-150 shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]"
                  : "bg-gradient-to-r from-violet-600 via-indigo-655 to-indigo-500 text-white font-medium shadow-violet-950/20"
              }`}>
                {msg.text}
              </div>
              <div className={`text-[9px] text-zinc-500 ${msg.sender === "user" ? "text-right" : ""}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="h-7.5 w-7.5 rounded-lg flex items-center justify-center border bg-violet-500/10 border-violet-500/30 text-violet-400">
              <Bot size={14} />
            </div>
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-2.5">
              <div className="flex gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Command Action Chips */}
      <div className="px-5 pb-3 flex flex-wrap gap-2 border-t border-zinc-900 pt-3.5 bg-zinc-950/60">
        {presets.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.val)}
            className="flex items-center gap-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/40 px-3.5 py-1 text-[10px] font-mono font-bold text-violet-400 transition-all duration-350"
          >
            <Sparkles size={8} className="text-violet-400" />
            {p.label}
          </button>
        ))}
      </div>

      {/* Shell Input Command Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="flex items-center gap-2.5 border-t border-zinc-900 bg-zinc-900/20 px-4 py-3.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type an automation query (e.g. onboarding)..."
          className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-600 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="rounded-xl bg-white p-2.5 text-zinc-950 hover:bg-zinc-200 disabled:opacity-50 transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
