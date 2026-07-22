"use client";

import { useEffect, useRef } from "react";

// Chongqing at night: stacked buildings climbing a hillside, fog between the
// layers, and cyan light bleeding into the haze. Everything here is decorative,
// so it stays behind the content, ignores the pointer, and barely moves.

// Two silhouette rows. Heights are hand-picked so the skyline reads as
// stacked terraces instead of a flat bar chart.
const backRow = [
  150, 210, 175, 260, 195, 300, 230, 165, 275, 200, 245, 185, 290, 215, 170,
  255, 190, 310, 235, 180,
];

const frontRow = [
  70, 120, 90, 160, 105, 195, 135, 80, 170, 110, 145, 95, 185, 125, 85, 165,
  100, 205, 140, 100,
];

export default function CyberpunkBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) return;

    let frame = 0;

    function handleScroll() {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;

        if (parallaxRef.current) {
          parallaxRef.current.style.transform = `translateY(${
            window.scrollY * 0.03
          }px)`;
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070c]">
      {/* Base wash: cool light pollution fading to black over the river */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.10),transparent_55%),linear-gradient(to_bottom,#050a12,#05070c_55%,#020408)]" />

      {/* Faint survey grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,107,122,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,107,122,0.5)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        {/* Back terrace, taller and dimmer */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 px-2 opacity-25">
          {backRow.map((height, index) => (
            <div
              key={`back-${index}`}
              style={{ height, width: `${26 + (index % 5) * 8}px` }}
              className="relative border-x border-t border-accent-300/10 bg-[#060b12]"
            >
              <div className="absolute left-1.5 top-4 h-1 w-1 bg-accent-300/30" />
              <div className="absolute right-1.5 top-10 h-1 w-1 bg-fuchsia-300/25" />
              <div className="absolute left-2 top-16 h-1 w-1 bg-accent-300/20" />
            </div>
          ))}
        </div>

        {/* Fog band between the two rows */}
        <div className="fog-drift absolute bottom-16 left-0 right-0 h-40 bg-[linear-gradient(to_top,transparent,rgba(34,211,238,0.05)_40%,transparent)] blur-2xl" />

        {/* Front terrace, shorter and brighter */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1.5 px-4 opacity-40">
          {frontRow.map((height, index) => (
            <div
              key={`front-${index}`}
              style={{ height, width: `${28 + (index % 4) * 9}px` }}
              className="relative border-x border-t border-accent-300/15 bg-[#05090f] shadow-[0_0_18px_rgba(34,211,238,0.05)]"
            >
              <div className="absolute left-2 top-3 h-1 w-1 bg-accent-300/50" />
              <div className="absolute right-2 top-8 h-1 w-1 bg-fuchsia-300/35" />
              <div className="absolute left-3 top-14 h-1 w-1 bg-accent-300/30" />
              <div className="absolute bottom-4 right-2 h-1 w-1 bg-accent-300/25" />
            </div>
          ))}
        </div>
      </div>

      {/* Low fog covering the base of the skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#05070c] via-[#05070c]/85 to-transparent" />

      {/* One controlled glow, bottom center, like neon reflecting off water */}
      <div className="fog-drift absolute -bottom-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-sm bg-accent-500/10 blur-3xl" />

      {/* Vignette so content stays readable */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(6,4,7,0.35)_55%,rgba(6,4,7,0.85)_100%)]" />
    </div>
  );
}
