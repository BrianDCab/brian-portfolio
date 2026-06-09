"use client";

import { useEffect, useState } from "react";

const skylineBars = [
  70, 110, 85, 145, 95, 180, 125, 75, 155, 105, 135, 90, 170, 115, 80, 150,
  100, 190, 130, 95,
];

const sideLeftBars = [120, 180, 150, 220, 170, 260, 210, 140, 190, 155];
const sideRightBars = [160, 210, 130, 240, 190, 280, 175, 230, 145, 205];

export default function CyberpunkBackground() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      setMouse({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    }

    function handleScroll() {
      setScrollY(window.scrollY);
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const moveX = (mouse.x - 0.5) * 36;
  const moveY = (mouse.y - 0.5) * 28;
  const scrollDrift = scrollY * 0.025;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.13),transparent_36%),linear-gradient(to_bottom,#020617,#000000_60%,#000000)]" />

      <div
        style={{
          transform: `translate3d(${moveX}px, ${moveY + scrollDrift}px, 0)`,
        }}
        className="cyber-glow-one absolute -left-28 top-12 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <div
        style={{
          transform: `translate3d(${-moveX * 0.75}px, ${
            -moveY * 0.45 + scrollDrift
          }px, 0)`,
        }}
        className="cyber-glow-two absolute right-[-8rem] top-48 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl"
      />

      <div
        style={{
          transform: `translate3d(${moveX * 0.35}px, ${-moveY * 0.3}px, 0)`,
        }}
        className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
      />

      <div className="absolute inset-0 opacity-[0.12]">
        <div className="h-full w-full bg-[linear-gradient(rgba(34,211,238,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.18)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[linear-gradient(115deg,transparent_0%,rgba(34,211,238,0.22)_1px,transparent_2px)] bg-[size:90px_90px]" />
      </div>

      <div
        style={{
          transform: `translate3d(${-moveX * 0.45}px, ${
            moveY * 0.2 + scrollDrift
          }px, 0)`,
        }}
        className="absolute left-0 top-20 hidden h-[78vh] w-28 flex-col justify-around opacity-30 lg:flex"
      >
        {sideLeftBars.map((height, index) => (
          <div
            key={`left-${index}`}
            style={{
              height,
              width: `${28 + (index % 4) * 10}px`,
            }}
            className="relative rounded-r-md border-y border-r border-cyan-300/20 bg-zinc-950/90 shadow-[0_0_22px_rgba(34,211,238,0.08)]"
          >
            <div className="absolute right-2 top-4 h-1 w-1 rounded-full bg-cyan-300/60" />
            <div className="absolute right-4 top-10 h-1 w-1 rounded-full bg-fuchsia-300/40" />
            <div className="absolute right-3 top-16 h-1 w-1 rounded-full bg-cyan-300/35" />
            <div className="absolute bottom-4 right-2 h-1 w-1 rounded-full bg-cyan-300/45" />

            <div className="absolute right-0 top-0 h-full w-px bg-cyan-300/20" />
          </div>
        ))}
      </div>

      <div
        style={{
          transform: `translate3d(${moveX * 0.45}px, ${
            -moveY * 0.2 + scrollDrift
          }px, 0)`,
        }}
        className="absolute right-0 top-16 hidden h-[82vh] w-28 flex-col items-end justify-around opacity-30 lg:flex"
      >
        {sideRightBars.map((height, index) => (
          <div
            key={`right-${index}`}
            style={{
              height,
              width: `${32 + (index % 5) * 9}px`,
            }}
            className="relative rounded-l-md border-y border-l border-cyan-300/20 bg-zinc-950/90 shadow-[0_0_22px_rgba(34,211,238,0.08)]"
          >
            <div className="absolute left-2 top-5 h-1 w-1 rounded-full bg-cyan-300/60" />
            <div className="absolute left-4 top-12 h-1 w-1 rounded-full bg-fuchsia-300/40" />
            <div className="absolute left-3 top-20 h-1 w-1 rounded-full bg-cyan-300/35" />
            <div className="absolute bottom-5 left-2 h-1 w-1 rounded-full bg-cyan-300/45" />

            <div className="absolute left-0 top-0 h-full w-px bg-cyan-300/20" />
          </div>
        ))}
      </div>

      <div
        style={{
          transform: `translate3d(${-moveX * 0.2}px, ${
            scrollDrift * 0.6
          }px, 0)`,
        }}
        className="absolute left-0 top-0 hidden h-full w-32 bg-gradient-to-r from-cyan-300/8 via-cyan-300/3 to-transparent lg:block"
      />

      <div
        style={{
          transform: `translate3d(${moveX * 0.2}px, ${
            scrollDrift * 0.6
          }px, 0)`,
        }}
        className="absolute right-0 top-0 hidden h-full w-32 bg-gradient-to-l from-fuchsia-400/8 via-cyan-300/3 to-transparent lg:block"
      />

      <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black via-black/80 to-transparent" />

      <div
        style={{
          transform: `translate3d(${-moveX * 0.25}px, ${scrollDrift}px, 0)`,
        }}
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-2 px-6 opacity-35"
      >
        {skylineBars.map((height, index) => (
          <div
            key={index}
            style={{ height }}
            className="relative w-8 rounded-t-md border border-cyan-300/20 bg-zinc-950/90 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
          >
            <div className="absolute left-2 top-3 h-1 w-1 rounded-full bg-cyan-300/50" />
            <div className="absolute right-2 top-8 h-1 w-1 rounded-full bg-fuchsia-300/40" />
            <div className="absolute left-3 top-14 h-1 w-1 rounded-full bg-cyan-300/40" />
            <div className="absolute bottom-5 left-2 h-1 w-1 rounded-full bg-cyan-300/30" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.24)_52%,rgba(0,0,0,0.84)_100%)]" />
      <div className="absolute inset-0 bg-black/42" />
    </div>
  );
}