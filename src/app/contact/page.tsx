"use client";

import React, { useState, useTransition } from "react";
import { submitContactForm } from "@/lib/actions";
import { Send, CheckCircle2, AlertCircle, Phone, Mail, Building, MapPin } from "lucide-react";
import AiFlowWidget from "@/components/AiFlowWidget";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [state, setState] = useState<{ success?: boolean; error?: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("company", company);
      formData.set("message", message);
      formData.set("source", "/contact");

      const res = await submitContactForm(null, formData);
      if (res?.error) {
        setState({ error: res.error });
      } else {
        setState({ success: true });
        setName("");
        setEmail("");
        setCompany("");
        setMessage("");
      }
    });
  };

  const contactInfo = [
    { icon: <Mail className="h-5 w-5 text-indigo-650 dark:text-violet-400" />, label: "Email Us", val: "startflow@gmail.com" },
    { icon: <Phone className="h-5 w-5 text-indigo-650 dark:text-violet-400" />, label: "Call / WhatsApp", val: "9834252099" },
    { icon: <MapPin className="h-5 w-5 text-indigo-650 dark:text-violet-400" />, label: "Location", val: "India" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-zinc-950 text-white min-h-[80vh] transition-colors duration-300 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Info & Details */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-center animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl leading-none">
              Book Your Free Strategy Call
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-md font-sans">
              Looking to consult on legacy system automation, deploy autonomous AI agents, or construct custom enterprise operations platforms? Schedule a strategy call.
            </p>
          </div>

          <div className="space-y-6 pt-4">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/60">
                  {info.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {info.label}
                  </div>
                  <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    {info.val}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active AI Playground Workspace Console */}
          <div className="pt-6 border-t border-zinc-900/60 space-y-4">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
              Try StartFlow AI Agent Preview
            </div>
            <AiFlowWidget />
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-7 flex items-center">
          <div className="w-full rounded-3xl border border-zinc-200/50 bg-zinc-50/20 p-6 sm:p-10 dark:border-zinc-850 dark:bg-zinc-900/10 backdrop-blur-sm shadow-sm">
            {state?.success ? (
              <div className="text-center py-12 space-y-4 animate-fade-in">
                <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Inquiry received successfully!</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out. A partnerships advisor will review your message and connect with you within 24 business hours.
                </p>
                <button
                  onClick={() => setState(null)}
                  className="mt-6 rounded-lg bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white dark:bg-white dark:text-zinc-950 hover:opacity-90"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sarah Connor"
                      required
                      disabled={isPending}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@cyberdyne.com"
                      required
                      disabled={isPending}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Cyberdyne Systems"
                      disabled={isPending}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Message / Project Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Briefly describe your project goals, timelines, or advisory needs..."
                    required
                    rows={4}
                    disabled={isPending}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-all focus:border-violet-500 focus:ring-1 focus:ring-violet-500 disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Submit action */}
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-zinc-950 py-3 text-sm font-bold text-white transition-all hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                >
                  {isPending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Consult Request</span>
                    </>
                  )}
                </button>

                {state?.error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3.5 text-xs text-red-600 dark:bg-red-500/5 dark:text-red-400 border border-red-500/20 animate-slide-up">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{state.error}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
