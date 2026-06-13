"use client";

import React, { useEffect, useRef } from "react";
import { trackAnalyticsEvent } from "@/lib/actions";

interface ReadProgressTrackerProps {
  postId: string;
}

export default function ReadProgressTracker({ postId }: ReadProgressTrackerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const trackedRef = useRef(false);

  useEffect(() => {
    // Generate an anonymous session ID that rotates or persists for 30 minutes
    let sessionId = sessionStorage.getItem("analytics_session_id");
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem("analytics_session_id", sessionId);
    }

    // Register initial page view immediately on load
    trackAnalyticsEvent("page_view", postId, sessionId);

    // IntersectionObserver to register "content_read" when reaching the sentinel
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !trackedRef.current) {
          trackedRef.current = true; // prevent multi-firing
          trackAnalyticsEvent("content_read", postId, sessionId!);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [postId]);

  return (
    <div
      ref={sentinelRef}
      className="h-1 w-full bg-transparent pointer-events-none"
      aria-hidden="true"
    />
  );
}
