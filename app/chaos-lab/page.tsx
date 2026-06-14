"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CheckCircle2,
  Copy,
  Gamepad2,
  Keyboard,
  MousePointerClick,
  RefreshCcw,
  Sparkles,
  ToggleLeft,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";

type AppKey =
  | "bubble"
  | "runaway"
  | "autocorrect"
  | "notifications"
  | "fidget"
  | "perfect";

type ChaosNote = {
  id: string;
  text: string;
  kind: "info" | "chaos" | "calm" | "perfect";
};

type ConfettiPiece = {
  id: string;
  x: number;
  y: number;
  rotate: number;
  delay: number;
};

type SoundName =
  | "pop"
  | "golden"
  | "annoy"
  | "toggle"
  | "ding"
  | "copy"
  | "perfect"
  | "error";

type WebAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

const appCards = [
  {
    key: "bubble" as const,
    title: "Bubble Wrap",
    label: "Micro Interaction",
    short: "Pop bubbles and find gold.",
    text: "I used this to test a responsive button grid, instant feedback, confetti, sound, and small state changes that feel immediate.",
    button: "Open Bubble Wrap",
    icon: Gamepad2,
  },
  {
    key: "runaway" as const,
    title: "Runaway Button",
    label: "Interaction Experiment",
    short: "Try to press it.",
    text: "I wanted to see how far I could push a deliberately annoying control while still making it work on phones and touch screens.",
    button: "Open Runaway Button",
    icon: MousePointerClick,
  },
  {
    key: "autocorrect" as const,
    title: "Bad Autocorrect",
    label: "Live Text Tool",
    short: "Type something and watch it break.",
    text: "This was me experimenting with live text transformation, sliders, visual corruption, copy controls, and immediate output.",
    button: "Open Autocorrect",
    icon: Keyboard,
  },
  {
    key: "notifications" as const,
    title: "Notifications",
    label: "GUI Component",
    short: "Build and dismiss alerts.",
    text: "I built a desktop style notification panel with stacked states, dismiss controls, counters, and optional sound.",
    button: "Open Notifications",
    icon: Bell,
  },
  {
    key: "fidget" as const,
    title: "Fidget Board",
    label: "Control Panel",
    short: "Flip switches and move sliders.",
    text: "I built this like a small GUI settings panel to test toggles, motion, glow, state changes, and touch friendly controls.",
    button: "Open Fidget Board",
    icon: ToggleLeft,
  },
  {
    key: "perfect" as const,
    title: "Perfect Button",
    label: "Feedback Design",
    short: "Give the button a click.",
    text: "A simple test of positive feedback, streaks, progress, animation, and sound without hiding what the control does.",
    button: "Open Perfect Button",
    icon: CheckCircle2,
  },
];

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function getId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function playTone(
  context: AudioContext,
  frequency: number,
  start: number,
  duration: number,
  type: OscillatorType,
  volume: number
) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);

  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

function playSound(enabled: boolean, sound: SoundName) {
  if (!enabled) return;
  if (typeof window === "undefined") return;

  const AudioContextConstructor =
    window.AudioContext ?? (window as WebAudioWindow).webkitAudioContext;

  if (!AudioContextConstructor) return;

  const context = new AudioContextConstructor();
  const now = context.currentTime;

  if (sound === "pop") {
    playTone(context, 520, now, 0.045, "sine", 0.055);
    playTone(context, 180, now + 0.015, 0.035, "triangle", 0.035);
  }

  if (sound === "golden") {
    playTone(context, 523, now, 0.08, "sine", 0.06);
    playTone(context, 659, now + 0.08, 0.08, "sine", 0.06);
    playTone(context, 784, now + 0.16, 0.12, "sine", 0.06);
  }

  if (sound === "annoy") {
    playTone(context, 180, now, 0.06, "square", 0.035);
    playTone(context, 120, now + 0.065, 0.08, "square", 0.028);
  }

  if (sound === "toggle") {
    playTone(context, 360, now, 0.045, "triangle", 0.04);
    playTone(context, 540, now + 0.04, 0.055, "triangle", 0.035);
  }

  if (sound === "ding") {
    playTone(context, 720, now, 0.08, "sine", 0.05);
    playTone(context, 960, now + 0.07, 0.1, "sine", 0.035);
  }

  if (sound === "copy") {
    playTone(context, 600, now, 0.07, "triangle", 0.04);
  }

  if (sound === "perfect") {
    playTone(context, 440, now, 0.08, "sine", 0.045);
    playTone(context, 554, now + 0.07, 0.08, "sine", 0.045);
    playTone(context, 659, now + 0.14, 0.12, "sine", 0.045);
  }

  if (sound === "error") {
    playTone(context, 110, now, 0.12, "sawtooth", 0.04);
  }

  window.setTimeout(() => {
    void context.close();
  }, 500);
}

function PageButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
    >
      {children}
    </Link>
  );
}

function AppButton({
  children,
  onClick,
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
        active
          ? "bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.28)]"
          : "border border-cyan-300/25 bg-black/25 text-cyan-200 hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
      }`}
    >
      {children}
    </button>
  );
}

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </p>

      <p
        className={
          accent
            ? "mt-2 text-3xl font-black text-cyan-200"
            : "mt-2 text-2xl font-black text-white"
        }
      >
        {value}
      </p>
    </div>
  );
}

function SoundToggle({
  soundOn,
  setSoundOn,
}: {
  soundOn: boolean;
  setSoundOn: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        setSoundOn(!soundOn);
        playSound(true, soundOn ? "error" : "ding");
      }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm font-black transition ${
        soundOn
          ? "border-green-300/35 bg-green-400/15 text-green-200"
          : "border-zinc-600 bg-black/25 text-zinc-300"
      }`}
    >
      {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
      Sound {soundOn ? "On" : "Off"}
    </button>
  );
}

function AppHeader({
  kicker,
  title,
  text,
  soundOn,
  setSoundOn,
  children,
}: {
  kicker: string;
  title: string;
  text: string;
  soundOn: boolean;
  setSoundOn: (value: boolean) => void;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
          {kicker}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 md:text-base">
          {text}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <SoundToggle soundOn={soundOn} setSoundOn={setSoundOn} />
        {children}
      </div>
    </div>
  );
}

function ModalShell({
  activeApp,
  setActiveApp,
  onClose,
  children,
}: {
  activeApp: AppKey;
  setActiveApp: (app: AppKey) => void;
  onClose: () => void;
  children: ReactNode;
}) {
  const [maximized, setMaximized] = useState(false);
  const activeCard = appCards.find((app) => app.key === activeApp) ?? appCards[0];

  return (
    <section
      role="dialog"
      aria-modal="true"
      aria-label={`${activeCard.title} in Chaos Lab Desktop`}
      className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-5 backdrop-blur-md sm:px-4 md:py-8"
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 cursor-default"
        aria-label="Close Chaos Lab app"
      />

      <div
        className={`relative z-10 w-full overflow-hidden border border-cyan-300/25 bg-[#07111c]/95 text-white shadow-[0_0_80px_rgba(34,211,238,0.23)] transition-all ${
          maximized
            ? "min-h-[calc(100vh-2rem)] max-w-none rounded-2xl"
            : "max-w-6xl rounded-[1.65rem]"
        }`}
      >
        <div className="sticky top-0 z-20 border-b border-cyan-300/15 bg-[#081522]/95 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-black">
                CL
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-black text-cyan-100">
                  Chaos Lab Desktop
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {activeCard.title} · {activeCard.short}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMaximized((current) => !current)}
                className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:border-cyan-300/30 hover:text-cyan-100 sm:flex"
                aria-label={maximized ? "Restore window size" : "Maximize window"}
                title={maximized ? "Restore window size" : "Maximize window"}
              >
                {maximized ? "❐" : "□"}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-300/30 bg-red-400/10 text-red-200 transition hover:bg-red-400/20"
                aria-label="Close app"
              >
                <X size={19} />
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-cyan-300/10 px-4 py-3 lg:hidden">
            {appCards.map((app) => {
              const isActive = activeApp === app.key;

              return (
                <button
                  key={app.key}
                  type="button"
                  onClick={() => setActiveApp(app.key)}
                  aria-pressed={isActive}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition ${
                    isActive
                      ? "bg-cyan-300 text-black shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                      : "border border-cyan-300/20 bg-black/25 text-cyan-200"
                  }`}
                >
                  {isActive ? `${app.title} · Open` : app.title}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr]">
          <aside className="hidden border-r border-cyan-300/15 bg-black/20 p-4 lg:block">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
              App Switcher
            </p>

            <div className="space-y-2">
              {appCards.map((app) => {
                const Icon = app.icon;
                const isActive = activeApp === app.key;

                return (
                  <button
                    key={app.key}
                    type="button"
                    onClick={() => setActiveApp(app.key)}
                    aria-pressed={isActive}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      isActive
                        ? "border-cyan-300/55 bg-cyan-300/12 text-white shadow-[0_0_22px_rgba(34,211,238,0.10)]"
                        : "border-white/5 bg-black/20 text-zinc-400 hover:border-cyan-300/25 hover:text-cyan-100"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-black/30 text-cyan-300">
                      <Icon size={18} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-black">
                          {app.title}
                        </span>

                        {isActive && (
                          <span className="shrink-0 rounded-full bg-cyan-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.14em] text-black">
                            Open
                          </span>
                        )}
                      </span>

                      <span className="mt-1 block text-xs leading-5 text-zinc-500">
                        {app.short}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/5 p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                The GUI experiment
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                I wanted each toy to feel like its own app while still living
                inside one browser window. The sidebar, title bar, app switching,
                and window controls are all part of that experiment.
              </p>
            </div>

            <p className="mt-4 text-xs leading-5 text-zinc-600">
              Press Escape or use the red close button to leave the desktop.
            </p>
          </aside>

          <div className="min-h-[640px] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(236,72,153,0.08),transparent_35%)] p-4 sm:p-6 md:p-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

function BubbleWrapApp() {
  const bubbleCount = 60;
  const [soundOn, setSoundOn] = useState(false);
  const [goldenIndex, setGoldenIndex] = useState(() =>
    Math.floor(Math.random() * bubbleCount)
  );
  const [popped, setPopped] = useState<boolean[]>(
    Array.from({ length: bubbleCount }, () => false)
  );
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [goldenPopped, setGoldenPopped] = useState(false);

  const poppedCount = popped.filter(Boolean).length;
  const remaining = bubbleCount - poppedCount;

  function createConfetti() {
    const pieces = Array.from({ length: 28 }, () => ({
      id: getId(),
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
      rotate: Math.round(Math.random() * 360),
      delay: Math.round(Math.random() * 300),
    }));

    setConfetti(pieces);

    window.setTimeout(() => {
      setConfetti([]);
    }, 1400);
  }

  function popBubble(index: number) {
    if (popped[index]) return;

    const isGolden = index === goldenIndex;

    playSound(soundOn, isGolden ? "golden" : "pop");

    setPopped((previous) =>
      previous.map((isPopped, bubbleIndex) =>
        bubbleIndex === index ? true : isPopped
      )
    );

    if (isGolden) {
      setGoldenPopped(true);
      createConfetti();
    }
  }

  function refill() {
    playSound(soundOn, "ding");
    setPopped(Array.from({ length: bubbleCount }, () => false));
    setGoldenIndex(Math.floor(Math.random() * bubbleCount));
    setGoldenPopped(false);
    setConfetti([]);
  }

  function popRandom() {
    const available = popped
      .map((isPopped, index) => ({ isPopped, index }))
      .filter((bubble) => !bubble.isPopped);

    if (available.length === 0) return;

    const selected = available[Math.floor(Math.random() * available.length)];

    if (!selected) return;

    popBubble(selected.index);
  }

  return (
    <div>
      <AppHeader
        kicker="Bubble Wrap"
        title="Pop bubbles. Find gold."
        text="I made this to test a dense button grid, quick visual feedback, a hidden target, confetti, and optional sound."
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      >
        <AppButton onClick={popRandom}>
          <Zap size={15} />
          Pop One
        </AppButton>

        <AppButton onClick={refill}>
          <RefreshCcw size={15} />
          Refill
        </AppButton>
      </AppHeader>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatBox label="Popped" value={poppedCount} accent />
        <StatBox label="Remaining" value={remaining} />
        <StatBox
          label="Done"
          value={`${Math.round((poppedCount / bubbleCount) * 100)}%`}
        />
        <StatBox label="Golden" value={goldenPopped ? "Found" : "Hidden"} />
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-black/25 p-4 sm:p-6">
        {confetti.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {confetti.map((piece) => (
              <span
                key={piece.id}
                className="absolute h-3 w-2 animate-bounce rounded-sm bg-yellow-300 shadow-[0_0_12px_rgba(250,204,21,0.65)]"
                style={{
                  left: `${piece.x}%`,
                  top: `${piece.y}%`,
                  transform: `rotate(${piece.rotate}deg)`,
                  animationDelay: `${piece.delay}ms`,
                }}
              />
            ))}

            <div className="absolute inset-x-4 top-8 mx-auto max-w-sm rounded-3xl border border-yellow-300/40 bg-yellow-300/15 p-5 text-center shadow-[0_0_35px_rgba(250,204,21,0.25)] backdrop-blur-md">
              <p className="text-3xl font-black text-yellow-200">Golden Pop</p>
              <p className="mt-2 text-sm text-yellow-100">
                You found the celebration bubble.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
          {popped.map((isPopped, index) => {
            const isGolden = index === goldenIndex && !isPopped;

            return (
              <button
                key={`bubble-${index}`}
                type="button"
                onClick={() => popBubble(index)}
                aria-label={`Bubble ${index + 1}`}
                className={`aspect-square min-h-11 rounded-full border transition active:scale-90 ${
                  isPopped
                    ? "border-zinc-700 bg-zinc-900/70 shadow-inner"
                    : isGolden
                      ? "border-yellow-200/70 bg-yellow-300/25 shadow-[inset_0_6px_14px_rgba(255,255,255,0.35),0_0_22px_rgba(250,204,21,0.35)]"
                      : "border-cyan-200/50 bg-cyan-300/20 shadow-[inset_0_6px_14px_rgba(255,255,255,0.28),0_0_16px_rgba(34,211,238,0.16)] hover:bg-cyan-300/30"
                }`}
              >
                <span
                  className={`mx-auto block h-1/2 w-1/2 rounded-full ${
                    isPopped
                      ? "bg-zinc-800"
                      : isGolden
                        ? "bg-yellow-100/70"
                        : "bg-white/35"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function RunawayButtonApp() {
  const [soundOn, setSoundOn] = useState(false);
  const [rage, setRage] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 48 });
  const [messages, setMessages] = useState<ChaosNote[]>([
    {
      id: getId(),
      text: "The button is calm. For now.",
      kind: "info",
    },
  ]);

  const annoyingLines = [
    "The button dodged you. Rude.",
    "Almost. Emotionally devastating.",
    "It moved because it sensed confidence.",
    "This button has commitment issues.",
    "Try again. It will definitely behave this time.",
    "The button filed a complaint.",
    "The button has chosen violence.",
  ];

  function pokeButton() {
    const line = annoyingLines[Math.floor(Math.random() * annoyingLines.length)];

    playSound(soundOn, "annoy");

    setAttempts((value) => value + 1);
    setRage((value) => clamp(value + 11));
    setButtonPosition({
      x: Math.round(14 + Math.random() * 72),
      y: Math.round(16 + Math.random() * 64),
    });

    setMessages((previous) => [
      {
        id: getId(),
        text: line ?? "The button dodged you.",
        kind: "chaos",
      },
      ...previous.slice(0, 4),
    ]);
  }

  function mercyReset() {
    playSound(soundOn, "ding");
    setRage(0);
    setAttempts(0);
    setButtonPosition({ x: 50, y: 48 });
    setMessages([
      {
        id: getId(),
        text: "Mercy granted. The button is pretending to be normal.",
        kind: "calm",
      },
    ]);
  }

  return (
    <div>
      <AppHeader
        kicker="Runaway Button"
        title="Tap it. It runs."
        text="I wanted a deliberately annoying button that still works on touch screens. Every dodge happens after a real tap."
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      >
        <AppButton onClick={mercyReset}>
          <RefreshCcw size={15} />
          Mercy Reset
        </AppButton>
      </AppHeader>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatBox label="Attempts" value={attempts} />
        <StatBox label="Rage" value={`${rage}%`} accent />
        <StatBox
          label="Mood"
          value={rage >= 80 ? "Cursed" : rage >= 40 ? "Irritated" : "Stable"}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="relative min-h-[390px] overflow-hidden rounded-[2rem] border border-red-300/20 bg-gradient-to-br from-red-950/20 via-black/25 to-cyan-950/20 p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.13),transparent_45%)]" />

          <button
            type="button"
            onClick={pokeButton}
            style={{
              left: `${buttonPosition.x}%`,
              top: `${buttonPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            className="absolute z-10 min-h-14 rounded-2xl bg-red-400 px-6 py-4 text-base font-black text-black shadow-[0_0_24px_rgba(248,113,113,0.35)] transition active:scale-90"
          >
            Press Me {"(Don't)"}
          </button>
        </div>

        <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Complaint Log
          </p>

          <div className="mt-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-2xl border p-4 text-sm leading-6 ${
                  message.kind === "chaos"
                    ? "border-red-300/20 bg-red-400/10 text-red-100"
                    : message.kind === "calm"
                      ? "border-green-300/20 bg-green-400/10 text-green-100"
                      : "border-cyan-300/15 bg-cyan-300/10 text-cyan-100"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function applyBadAutocorrect(text: string, intensity: number) {
  const replacements: Array<[RegExp, string]> = [
    [/\bthe\b/gi, "teh"],
    [/\byou\b/gi, "yuo"],
    [/\bbutton\b/gi, "butter"],
    [/\bclick\b/gi, "clonk"],
    [/\bclicked\b/gi, "clonked"],
    [/\bportfolio\b/gi, "portfoolio"],
    [/\bproject\b/gi, "projeck"],
    [/\bdata\b/gi, "dada"],
    [/\bdashboard\b/gi, "dashbored"],
    [/\bReact\b/g, "Reaccident"],
    [/\bchaos\b/gi, "cheese"],
    [/\bperfect\b/gi, "perfrct"],
    [/\bannoying\b/gi, "emotionally loud"],
    [/\bcomputer\b/gi, "compooter"],
    [/\bimportant\b/gi, "import ant"],
    [/\bmobile\b/gi, "moblile"],
    [/\bsound\b/gi, "bloop"],
    [/\btyping\b/gi, "typoing"],
  ];

  let corrected = text;

  const replacementCount = Math.max(4, Math.round(intensity / 7));

  replacements.slice(0, replacementCount).forEach(([pattern, replacement]) => {
    corrected = corrected.replace(pattern, replacement);
  });

  if (intensity >= 45) {
    corrected = corrected.replace(/\./g, " somehow.");
    corrected = corrected.replace(/!/g, "!!??");
  }

  if (intensity >= 70) {
    corrected = corrected
      .split(" ")
      .map((word, index) => {
        if (word.length > 5 && index % 5 === 0) return `${word}???`;
        if (word.length > 4 && index % 7 === 0) return `${word.slice(0, -1)}™`;
        return word;
      })
      .join(" ");
  }

  if (intensity >= 88) {
    corrected = corrected.replace(/\bI\b/g, "me, allegedly,");
  }

  return corrected;
}

function BadAutocorrectApp() {
  const [soundOn, setSoundOn] = useState(false);
  const [input, setInput] = useState(
    "I am building a portfolio project with chaos buttons, bubble wrap, sound, and a perfect button."
  );
  const [intensity, setIntensity] = useState(42);
  const [copied, setCopied] = useState(false);
  const [manualGlitch, setManualGlitch] = useState(false);

  const output = useMemo(() => {
    const baseText = applyBadAutocorrect(input, intensity);

    if (!manualGlitch) return baseText;

    return baseText
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index % 13 === 0) return "░";
        if (index % 17 === 0) return `${char}̷`;
        return char;
      })
      .join("");
  }, [input, intensity, manualGlitch]);

  function updateInput(value: string) {
    setInput(value);

    if (soundOn && value.length % 8 === 0) {
      playSound(true, "pop");
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    playSound(soundOn, "copy");

    window.setTimeout(() => {
      setCopied(false);
    }, 1200);
  }

  function resetText() {
    playSound(soundOn, "ding");
    setInput(
      "I am building a portfolio project with chaos buttons, bubble wrap, sound, and a perfect button."
    );
    setIntensity(42);
    setManualGlitch(false);
  }

  return (
    <div>
      <AppHeader
        kicker="Bad Autocorrect"
        title="Type normally. Regret it."
        text="I used this to test live text transformation, slider driven behavior, copy controls, and instant visual output."
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      >
        <AppButton onClick={copyOutput}>
          <Copy size={15} />
          {copied ? "Copied" : "Copy"}
        </AppButton>

        <AppButton onClick={resetText}>
          <RefreshCcw size={15} />
          Reset
        </AppButton>
      </AppHeader>

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
          <label className="block">
            <span className="text-sm font-black text-zinc-300">
              Type Here
            </span>
            <textarea
              value={input}
              onChange={(event) => updateInput(event.target.value)}
              rows={9}
              className="mt-3 w-full rounded-2xl border border-cyan-300/20 bg-black/35 p-4 text-sm leading-6 text-white outline-none transition focus:border-cyan-300/50"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-black text-zinc-300">
              Badness: {intensity}
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(event) => {
                setIntensity(Number(event.target.value));
                playSound(soundOn, "toggle");
              }}
              className="mt-3 w-full"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setManualGlitch(!manualGlitch);
              playSound(soundOn, "toggle");
            }}
            className={`mt-5 flex min-h-14 w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
              manualGlitch
                ? "border-fuchsia-300/45 bg-fuchsia-400/15"
                : "border-cyan-300/15 bg-black/25"
            }`}
          >
            <span>
              <span className="block font-black text-white">
                Glitch Flavor
              </span>
              <span className="block text-sm text-zinc-400">
                Optional visual corruption.
              </span>
            </span>

            <span
              className={`flex h-8 w-14 items-center rounded-full p-1 ${
                manualGlitch ? "bg-fuchsia-300" : "bg-zinc-800"
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full bg-black transition ${
                  manualGlitch ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </span>
          </button>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatBox label="Characters" value={input.length} />
            <StatBox label="Badness" value={intensity} accent />
            <StatBox label="Mode" value={manualGlitch ? "Glitch" : "Text"} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Live Output
          </p>

          <div className="mt-4 min-h-[360px] whitespace-pre-wrap rounded-2xl border border-cyan-300/10 bg-black/45 p-5 font-mono text-lg leading-8 text-cyan-200 shadow-inner">
            {output || "Start typing and the lab will make it worse."}
          </div>
        </div>
      </div>
    </div>
  );
}
function NotificationsApp() {
  const [soundOn, setSoundOn] = useState(false);

  const notificationTexts = [
    "Bubble wrap refill complete.",
    "The runaway button escaped containment.",
    "Your chaos settings look emotionally unstable.",
    "Fake update installed successfully. Probably.",
    "A tiny goblin approved this interaction.",
    "System detected unnecessary silliness.",
    "Pleasant fidget mode is now available.",
    "The interface is being dramatic again.",
    "Perfect button says thank you.",
  ];

  const [notifications, setNotifications] = useState<ChaosNote[]>([
    {
      id: getId(),
      text: "Tap a toast to dismiss it.",
      kind: "info",
    },
  ]);

  const chaosCount = notifications.filter((note) => note.kind === "chaos").length;
  const calmCount = notifications.filter((note) => note.kind === "calm").length;

  function spawnNotification(kind: ChaosNote["kind"] = "info") {
    const text =
      notificationTexts[Math.floor(Math.random() * notificationTexts.length)] ??
      "Something happened. Probably.";

    playSound(soundOn, kind === "chaos" ? "annoy" : "ding");

    setNotifications((previous) => [
      {
        id: getId(),
        text,
        kind,
      },
      ...previous,
    ]);
  }

  function dismissNotification(id: string) {
    playSound(soundOn, "pop");
    setNotifications((previous) => previous.filter((note) => note.id !== id));
  }

  function clearNotifications() {
    playSound(soundOn, "error");
    setNotifications([]);
  }

  function spawnStack() {
    playSound(soundOn, "golden");

    const stack: ChaosNote[] = Array.from({ length: 4 }, (_, index) => ({
      id: getId(),
      text:
        notificationTexts[
          Math.floor(Math.random() * notificationTexts.length)
        ] ?? `Popup ${index + 1}`,
      kind: index % 2 === 0 ? "chaos" : "info",
    }));

    setNotifications((previous) => [...stack, ...previous]);
  }

  return (
    <div>
      <AppHeader
        kicker="Notifications"
        title="Spawn fake alerts."
        text="I built this as a small desktop notification GUI with stacked alerts, dismiss controls, counters, and optional sound."
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      >
        <AppButton onClick={() => spawnNotification("info")}>
          <Bell size={15} />
          Spawn
        </AppButton>

        <AppButton onClick={() => spawnNotification("chaos")}>
          <Zap size={15} />
          Chaos
        </AppButton>

        <AppButton onClick={() => spawnNotification("calm")}>
          <Sparkles size={15} />
          Calm
        </AppButton>

        <AppButton onClick={spawnStack}>
          <Bell size={15} />
          Stack
        </AppButton>

        <AppButton onClick={clearNotifications}>
          <RefreshCcw size={15} />
          Clear
        </AppButton>
      </AppHeader>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatBox label="Visible" value={notifications.length} accent />
        <StatBox label="Chaos" value={chaosCount} />
        <StatBox label="Calm" value={calmCount} />
        <StatBox
          label="Status"
          value={notifications.length >= 8 ? "Crowded" : "Clean"}
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            Desktop Preview
          </p>

          <div className="relative mt-4 min-h-[430px] overflow-hidden rounded-3xl border border-cyan-300/10 bg-gradient-to-br from-slate-950 via-black to-cyan-950/30 p-5">
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cyan-300/10 bg-black/35 p-4 text-xs text-zinc-500">
              Fake taskbar · Chaos Lab Desktop · Notifications on
            </div>

            <div className="absolute right-4 top-4 flex w-[min(310px,calc(100%-2rem))] flex-col gap-3">
              {notifications.length === 0 ? (
                <div className="rounded-2xl border border-cyan-300/15 bg-black/50 p-4 text-sm text-zinc-400">
                  No notifications. Suspiciously peaceful.
                </div>
              ) : (
                notifications.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={() => dismissNotification(note.id)}
                    className={`rounded-2xl border p-4 text-left text-sm leading-6 shadow-xl transition active:scale-[0.98] ${
                      note.kind === "chaos"
                        ? "border-red-300/25 bg-red-950/80 text-red-100"
                        : note.kind === "calm"
                          ? "border-teal-300/25 bg-teal-950/80 text-teal-100"
                          : note.kind === "perfect"
                            ? "border-yellow-300/25 bg-yellow-950/80 text-yellow-100"
                            : "border-cyan-300/25 bg-slate-950/90 text-cyan-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black">
                          {note.kind === "chaos"
                            ? "Chaos Alert"
                            : note.kind === "calm"
                              ? "Calm Notice"
                              : note.kind === "perfect"
                                ? "Perfect Notice"
                                : "Chaos Lab"}
                        </p>
                        <p className="mt-1 text-xs opacity-80">{note.text}</p>
                      </div>

                      <X size={16} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
            What I was testing
          </p>

          <div className="mt-4 space-y-4 text-sm leading-6 text-zinc-300">
            <p>I wanted the popups to feel like part of a desktop GUI without making the mobile layout fall apart.</p>
            <p>Each alert is also a large dismiss button, so the interaction stays obvious on touch screens.</p>
            <p>I kept sound optional so the interface stays quiet until someone chooses otherwise.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FidgetBoardApp() {
  const [soundOn, setSoundOn] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [wiggle, setWiggle] = useState(false);
  const [calm, setCalm] = useState(false);
  const [softness, setSoftness] = useState(72);
  const [speed, setSpeed] = useState(42);
  const [glow, setGlow] = useState(68);

  const mood = calm ? "Calm" : wiggle ? "Wiggly" : pulse ? "Pulsing" : "Idle";

  function flipToggle(setter: (value: boolean) => void, value: boolean) {
    playSound(soundOn, "toggle");
    setter(!value);
  }

  return (
    <div>
      <AppHeader
        kicker="Fidget Board"
        title="Flip switches."
        text="This is the control panel side of the GUI experiment. I used it to test toggles, sliders, motion, glow, and immediate state changes."
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      />

      <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          {[
            {
              label: "Pulse Mode",
              value: pulse,
              setter: setPulse,
              text: "Adds gentle breathing motion.",
            },
            {
              label: "Wiggle Mode",
              value: wiggle,
              setter: setWiggle,
              text: "Adds a tiny chaos wobble.",
            },
            {
              label: "Calm Mode",
              value: calm,
              setter: setCalm,
              text: "Softens the whole board.",
            },
          ].map((toggle) => (
            <button
              key={toggle.label}
              type="button"
              onClick={() => flipToggle(toggle.setter, toggle.value)}
              className={`w-full rounded-3xl border p-5 text-left transition active:scale-[0.99] ${
                toggle.value
                  ? "border-cyan-300/45 bg-cyan-300/12"
                  : "border-cyan-300/15 bg-black/25"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-black text-white">
                    {toggle.label}
                  </p>
                  <p className="mt-1 text-sm text-zinc-400">{toggle.text}</p>
                </div>

                <span
                  className={`flex h-9 w-16 items-center rounded-full p-1 ${
                    toggle.value ? "bg-cyan-300" : "bg-zinc-800"
                  }`}
                >
                  <span
                    className={`h-7 w-7 rounded-full bg-black transition ${
                      toggle.value ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </span>
              </div>
            </button>
          ))}

          <div className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
            <label className="block">
              <span className="text-sm font-black text-zinc-300">
                Softness: {softness}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={softness}
                onChange={(event) => {
                  setSoftness(Number(event.target.value));
                  playSound(soundOn, "toggle");
                }}
                className="mt-3 w-full"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-black text-zinc-300">
                Motion Speed: {speed}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={speed}
                onChange={(event) => {
                  setSpeed(Number(event.target.value));
                  playSound(soundOn, "toggle");
                }}
                className="mt-3 w-full"
              />
            </label>

            <label className="mt-5 block">
              <span className="text-sm font-black text-zinc-300">
                Glow: {glow}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={glow}
                onChange={(event) => {
                  setGlow(Number(event.target.value));
                  playSound(soundOn, "toggle");
                }}
                className="mt-3 w-full"
              />
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-cyan-300/15 bg-black/25 p-6">
          <div
            className={`flex min-h-[380px] items-center justify-center rounded-[2rem] border transition ${
              calm
                ? "border-teal-200/25 bg-teal-300/10"
                : "border-fuchsia-300/25 bg-fuchsia-400/10"
            } ${pulse ? "animate-pulse" : ""}`}
            style={{
              boxShadow: `0 0 ${Math.round(glow / 2)}px rgba(34,211,238,0.35)`,
              transform: wiggle ? `rotate(${(speed % 6) - 3}deg)` : "none",
            }}
          >
            <div
              className="flex h-48 w-48 items-center justify-center rounded-full border text-center"
              style={{
                borderColor: `rgba(34,211,238,${0.25 + glow / 160})`,
                backgroundColor: calm
                  ? `rgba(45,212,191,${0.08 + softness / 600})`
                  : `rgba(217,70,239,${0.08 + softness / 700})`,
              }}
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                  Mood
                </p>
                <p className="mt-2 text-4xl font-black text-white">{mood}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <StatBox label="Soft" value={softness} />
            <StatBox label="Speed" value={speed} />
            <StatBox label="Glow" value={glow} accent />
          </div>
        </div>
      </div>
    </div>
  );
}

function PerfectButtonApp() {
  const [soundOn, setSoundOn] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [happiness, setHappiness] = useState(50);
  const [message, setMessage] = useState("The perfect button is ready.");
  const [sparkles, setSparkles] = useState<ConfettiPiece[]>([]);

  const buttonMood =
    happiness >= 95 ? "Thriving" : happiness >= 75 ? "Happy" : "Hopeful";

  function celebrate() {
    const pieces = Array.from({ length: 18 }, () => ({
      id: getId(),
      x: Math.round(Math.random() * 100),
      y: Math.round(Math.random() * 100),
      rotate: Math.round(Math.random() * 360),
      delay: Math.round(Math.random() * 250),
    }));

    setSparkles(pieces);

    window.setTimeout(() => {
      setSparkles([]);
    }, 1000);
  }

  function clickPerfectButton() {
    const nextClicks = clicks + 1;
    const nextHappiness = clamp(happiness + 8);

    setClicks(nextClicks);
    setHappiness(nextHappiness);
    playSound(soundOn, nextClicks % 5 === 0 ? "golden" : "perfect");

    if (nextClicks % 10 === 0) {
      setMessage("The perfect button says: you are literally elite.");
      celebrate();
      return;
    }

    if (nextClicks % 5 === 0) {
      setMessage("Perfect streak. The button feels appreciated.");
      celebrate();
      return;
    }

    const lines = [
      "Thank you. That was a very good click.",
      "The button wanted that.",
      "Perfect click. No notes.",
      "The button is proud of you.",
      "That click had excellent form.",
      "The button feels seen.",
    ];

    setMessage(lines[Math.floor(Math.random() * lines.length)] ?? "Perfect.");
  }

  function resetPerfect() {
    playSound(soundOn, "ding");
    setClicks(0);
    setHappiness(50);
    setMessage("The perfect button is ready.");
    setSparkles([]);
  }

  return (
    <div>
      <AppHeader
        kicker="Perfect Button"
        title="It wants the click."
        text="I made this as the opposite of the runaway button. It stays put and shows how feedback, progress, animation, and sound can make one simple control feel alive."
        soundOn={soundOn}
        setSoundOn={setSoundOn}
      >
        <AppButton onClick={resetPerfect}>
          <RefreshCcw size={15} />
          Reset
        </AppButton>
      </AppHeader>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatBox label="Clicks" value={clicks} accent />
        <StatBox label="Happiness" value={`${happiness}%`} />
        <StatBox label="Mood" value={buttonMood} />
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-green-300/20 bg-gradient-to-br from-green-950/25 via-black/25 to-cyan-950/25 p-6">
        {sparkles.length > 0 && (
          <div className="pointer-events-none absolute inset-0 z-20">
            {sparkles.map((sparkle) => (
              <span
                key={sparkle.id}
                className="absolute h-3 w-3 animate-bounce rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.75)]"
                style={{
                  left: `${sparkle.x}%`,
                  top: `${sparkle.y}%`,
                  transform: `rotate(${sparkle.rotate}deg)`,
                  animationDelay: `${sparkle.delay}ms`,
                }}
              />
            ))}
          </div>
        )}

        <div className="flex min-h-[430px] flex-col items-center justify-center text-center">
          <button
            type="button"
            onClick={clickPerfectButton}
            className="min-h-24 rounded-[2rem] border border-green-200/50 bg-green-300 px-10 py-7 text-2xl font-black text-black shadow-[0_0_45px_rgba(134,239,172,0.35)] transition hover:-translate-y-1 hover:bg-green-200 active:scale-95"
          >
            Click Me Please
          </button>

          <div className="mt-8 max-w-xl rounded-3xl border border-green-300/20 bg-black/30 p-6">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-green-300">
              Button Feedback
            </p>
            <p className="mt-3 text-2xl font-black text-white">{message}</p>
          </div>

          <div className="mt-6 h-4 w-full max-w-md overflow-hidden rounded-full border border-green-300/20 bg-black/40">
            <div
              className="h-full rounded-full bg-green-300 transition-all"
              style={{ width: `${happiness}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChaosLabPage() {
  const [activeApp, setActiveApp] = useState<AppKey | null>(null);

  useEffect(() => {
    if (!activeApp) return;

    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveApp(null);
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeApp]);

  function renderActiveApp() {
    if (activeApp === "bubble") return <BubbleWrapApp />;
    if (activeApp === "runaway") return <RunawayButtonApp />;
    if (activeApp === "autocorrect") return <BadAutocorrectApp />;
    if (activeApp === "notifications") return <NotificationsApp />;
    if (activeApp === "fidget") return <FidgetBoardApp />;
    if (activeApp === "perfect") return <PerfectButtonApp />;
    return null;
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <Sparkles size={15} />
            GUI and Interaction Experiment
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            I built a tiny browser desktop and filled it with weird apps
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            Chaos Lab started as me experimenting with GUI ideas. I wanted one
            window, an app switcher, desktop style controls, optional sound, and
            a group of small interactions that all feel different without
            sending the visitor to another page.
          </p>

          <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm leading-6 text-zinc-300">
            Click anywhere on an app card below. It opens inside the same GUI
            shell. Once you are inside, use the sidebar or the mobile tabs to
            switch between apps.
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PageButton href="/playground">
              <ArrowLeft size={16} />
              Back to Playground
            </PageButton>

            <PageButton href="/gravity-lab">
              Next: Gravity Lab
              <ArrowRight size={16} />
            </PageButton>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
                Choose an app
              </p>
              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Six small GUI experiments
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
              The whole card is clickable. Every app opens inside the same
              desktop style window.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {appCards.map((app) => {
              const Icon = app.icon;

              return (
                <button
                  key={app.key}
                  type="button"
                  onClick={() => setActiveApp(app.key)}
                  aria-label={`Open ${app.title} in Chaos Lab Desktop`}
                  className={`${glassCard} group flex h-full w-full flex-col p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300 transition group-hover:border-cyan-300/50 group-hover:bg-cyan-300/10">
                      <Icon size={22} />
                    </div>

                    <span className="rounded-full border border-cyan-300/20 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
                      GUI App
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                    {app.label}
                  </p>

                  <h3 className="mt-4 text-2xl font-black text-white">
                    {app.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-6 text-zinc-300">
                    {app.text}
                  </p>

                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-black text-cyan-300 transition group-hover:translate-x-1 group-hover:text-cyan-100">
                    {app.button}
                    <ArrowRight size={15} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className={`${glassCard} p-6`}>
            <Gamepad2 className="text-cyan-300" size={24} />
            <h3 className="mt-4 text-xl font-black text-white">
              Desktop style shell
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              I wanted to see how a title bar, app switcher, window controls,
              and separate tools could feel inside one browser interface.
            </p>
          </div>

          <div className={`${glassCard} p-6`}>
            <Zap className="text-cyan-300" size={24} />
            <h3 className="mt-4 text-xl font-black text-white">
              Built around state
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Each app keeps track of its own clicks, toggles, messages,
              counters, sliders, and visual feedback.
            </p>
          </div>

          <div className={`${glassCard} p-6`}>
            <MousePointerClick className="text-cyan-300" size={24} />
            <h3 className="mt-4 text-xl font-black text-white">
              Made for touch
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              I kept the main controls large and visible. Nothing important
              depends on hovering with a mouse.
            </p>
          </div>

          <div className={`${glassCard} p-6`}>
            <Volume2 className="text-cyan-300" size={24} />
            <h3 className="mt-4 text-xl font-black text-white">
              Sound is optional
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Every app starts quiet and has its own sound control. The visitor
              decides whether the interface makes noise.
            </p>
          </div>
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">
            Why I made this
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            I wanted to practice GUI behavior without building another normal
            dashboard
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            This page gave me a place to experiment with window layouts, app
            switching, touch targets, sound controls, live state, feedback, and
            intentionally strange interaction design. It is playful, but the
            same frontend ideas carry over to real tools and desktop style web
            applications.
          </p>
        </section>
      </section>

      {activeApp && (
        <ModalShell
          activeApp={activeApp}
          setActiveApp={setActiveApp}
          onClose={() => setActiveApp(null)}
        >
          {renderActiveApp()}
        </ModalShell>
      )}
    </main>
  );
}
