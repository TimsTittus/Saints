"use client";

import { useEffect, useRef, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const dismiss = () => {
      setFading(true);
      timerRef.current = setTimeout(() => setVisible(false), 650);
    };

    if (document.readyState === "complete") {
      // Small delay so the user sees the animation
      timerRef.current = setTimeout(dismiss, 400);
    } else {
      window.addEventListener("load", dismiss, { once: true });
      // Failsafe
      timerRef.current = setTimeout(dismiss, 3000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("load", dismiss as EventListener);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`loading-screen${fading ? " hidden" : ""}`}
      aria-hidden="true"
    >
      {/* Halo animation */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Outer glow rings */}
        <div className="halo-ring absolute h-36 w-36 rounded-full border border-amber-300/30" />
        <div
          className="halo-ring absolute h-28 w-28 rounded-full border border-amber-400/40"
          style={{ animationDelay: "0.3s" }}
        />
        <div
          className="halo-ring absolute h-20 w-20 rounded-full border-2 border-amber-500/50"
          style={{ animationDelay: "0.6s" }}
        />
        {/* Cross SVG */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="relative z-10"
          aria-hidden="true"
        >
          <rect x="17" y="2" width="6" height="36" rx="3" fill="url(#gold-grad)" />
          <rect x="2" y="14" width="36" height="6" rx="3" fill="url(#gold-grad)" />
          <defs>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4a84b" />
              <stop offset="100%" stopColor="#f0c060" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Title */}
      <div className="float-in" style={{ animationDelay: "0.2s" }}>
        <h1
          className="serif shimmer-text text-center text-4xl font-semibold tracking-wide"
          style={{ animationDelay: "0.3s" }}
        >
          Sancti
        </h1>
        <p className="mt-2 text-center text-sm text-amber-700/70 tracking-widest uppercase">
          The Communion of Saints
        </p>
      </div>

      {/* Loading dots */}
      <div className="mt-10 flex gap-2" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-amber-400"
            style={{
              animation: "halo-pulse 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}