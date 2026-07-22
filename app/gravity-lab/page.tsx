"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Activity,
  Circle,
  Droplets,
  ExternalLink,
  Gauge,
  Hourglass,
  Pause,
  Play,
  RefreshCcw,
  SlidersHorizontal,
  Smartphone,
  Volume2,
  VolumeX,
} from "lucide-react";

type MotionPermission = "idle" | "granted" | "denied" | "unsupported";
type ExperimentKey = "liquid" | "hourglass" | "marble" | "readout";

type TiltState = {
  x: number;
  y: number;
  z: number;
};

type BallState = {
  x: number;
  y: number;
};

const neutralTilt: TiltState = {
  x: 0,
  y: 0,
  z: 0,
};

const experimentDefaults: Record<ExperimentKey, boolean> = {
  liquid: true,
  hourglass: true,
  marble: true,
  readout: true,
};

const soundDefaults: Record<ExperimentKey, boolean> = {
  liquid: false,
  hourglass: false,
  marble: false,
  readout: false,
};

const glassPanel =
  "rounded-lg border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/40 backdrop-blur-md";

const glassCard =
  "rounded-lg border border-white/10 bg-zinc-950/60 backdrop-blur-md transition hover:border-accent-400/50 hover:bg-accent-950/20";

const experimentCards = [
  {
    key: "liquid" as const,
    title: "Liquid Cup",
    label: "Tilt + Pour",
    text: "I used this one to test whether a simple interface could feel physical when the phone moves.",
    icon: Droplets,
  },
  {
    key: "hourglass" as const,
    title: "Tilt Hourglass",
    label: "Flip Logic",
    text: "This was my test for direction changes, calibration, and turning raw tilt into a clear visual state.",
    icon: Hourglass,
  },
  {
    key: "marble" as const,
    title: "Gravity Marble",
    label: "Physics Loop",
    text: "I built a small motion loop here so the marble can accelerate, slow down, and bounce off the edges.",
    icon: Circle,
  },
  {
    key: "readout" as const,
    title: "Motion Readout",
    label: "Sensor Values",
    text: "This is the less flashy view where I can see the raw sensor values and what the app is actually using.",
    icon: Gauge,
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatAngle(value: number) {
  return `${value.toFixed(1)}°`;
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
      className={`rounded-md border p-4 ${
        accent
          ? "border-accent-300/40 bg-accent-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-accent-300/15 bg-black/25"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300/80">
        {label}
      </p>
      <p
        className={
          accent
            ? "mt-2 text-3xl font-semibold text-accent-200"
            : "mt-2 text-2xl font-semibold text-white"
        }
      >
        {value}
      </p>
    </div>
  );
}

function PageButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-sm border border-accent-400/60 bg-accent-500/90 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent-400"
    >
      {children}
    </Link>
  );
}

function GhostButton({
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
      className={`inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 text-sm font-semibold transition ${
        active
          ? "border border-accent-400/60 bg-accent-500/90 text-white shadow-[0_0_20px_rgba(34,211,238,0.28)]"
          : "border border-accent-300/25 bg-black/25 text-accent-200 hover:-translate-y-0.5 hover:border-accent-300/50 hover:bg-accent-400/10"
      }`}
    >
      {children}
    </button>
  );
}

function ManualTiltControls({
  manualTilt,
  updateManualTilt,
}: {
  manualTilt: TiltState;
  updateManualTilt: (axis: keyof TiltState, value: string) => void;
}) {
  return (
    <div className="rounded-lg border border-accent-300/15 bg-black/25 p-5">
      <div className="flex items-center gap-2 text-accent-300">
        <SlidersHorizontal size={16} />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
          Manual Tilt
        </p>
      </div>

      <p className="mt-3 text-sm leading-6 text-zinc-400">
        Desktop fallback. On a phone, enable the sensor and these controls become
        your backup.
      </p>

      <div className="mt-5 grid gap-5">
        <label className="text-sm text-zinc-300">
          Tilt Left / Right: {formatAngle(manualTilt.x)}
          <input
            type="range"
            min="-45"
            max="45"
            value={manualTilt.x}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateManualTilt("x", event.target.value)
            }
            className="mt-3 w-full accent-accent-300"
          />
        </label>

        <label className="text-sm text-zinc-300">
          Tilt Forward / Back: {formatAngle(manualTilt.y)}
          <input
            type="range"
            min="-45"
            max="45"
            value={manualTilt.y}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateManualTilt("y", event.target.value)
            }
            className="mt-3 w-full accent-accent-300"
          />
        </label>
      </div>
    </div>
  );
}

function ExperimentToolbar({
  title,
  description,
  motionOn,
  soundOn,
  sourceLabel,
  onToggleMotion,
  onToggleSound,
  onReset,
}: {
  title: string;
  description: string;
  motionOn: boolean;
  soundOn: boolean;
  sourceLabel: string;
  onToggleMotion: () => void;
  onToggleSound: () => void;
  onReset: () => void;
}) {
  return (
    <div className={`${glassPanel} p-6 md:p-8`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
            Active Experiment
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-white md:text-5xl">
            {title}
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
            {description}
          </p>

          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
            Source: <span className="text-accent-300">{sourceLabel}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <GhostButton active={motionOn} onClick={onToggleMotion}>
            {motionOn ? <Pause size={15} /> : <Play size={15} />}
            Motion {motionOn ? "On" : "Off"}
          </GhostButton>

          <GhostButton active={soundOn} onClick={onToggleSound}>
            {soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}
            Sound {soundOn ? "On" : "Off"}
          </GhostButton>

          <GhostButton onClick={onReset}>
            <RefreshCcw size={15} />
            Reset
          </GhostButton>
        </div>
      </div>
    </div>
  );
}

export default function GravityLabPage() {
  const [activeExperiment, setActiveExperiment] =
    useState<ExperimentKey>("liquid");

  const [motionPermission, setMotionPermission] =
    useState<MotionPermission>("idle");
  const [phoneMotionActive, setPhoneMotionActive] = useState(false);

  const [motionByExperiment, setMotionByExperiment] =
    useState<Record<ExperimentKey, boolean>>(experimentDefaults);

  const [soundByExperiment, setSoundByExperiment] =
    useState<Record<ExperimentKey, boolean>>(soundDefaults);

  const [rawTilt, setRawTilt] = useState<TiltState>(neutralTilt);
  const [manualTilt, setManualTilt] = useState<TiltState>(neutralTilt);
  const [calibration, setCalibration] = useState<TiltState>(neutralTilt);

  const [ball, setBall] = useState<BallState>({ x: 50, y: 50 });

  const [statusMessage, setStatusMessage] = useState(
    "Pick an experiment below. On a phone, you can enable the motion sensor. On desktop, the sliders do the same job."
  );

  const [pourCount, setPourCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [bounceCount, setBounceCount] = useState(0);

  const velocityRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundByExperimentRef =
    useRef<Record<ExperimentKey, boolean>>(soundDefaults);
  const wasPouringRef = useRef(false);
  const lastHourglassSideRef = useRef<"top" | "bottom">("bottom");

  const sensorReady = motionPermission === "granted" && phoneMotionActive;

  const calibratedTilt = useMemo<TiltState>(() => {
    if (sensorReady) {
      return {
        x: clamp(rawTilt.x - calibration.x, -45, 45),
        y: clamp(rawTilt.y - calibration.y, -45, 45),
        z: rawTilt.z,
      };
    }

    return manualTilt;
  }, [sensorReady, rawTilt, calibration, manualTilt]);

  const liquidTilt = motionByExperiment.liquid ? calibratedTilt : neutralTilt;
  const hourglassTilt = motionByExperiment.hourglass ? calibratedTilt : neutralTilt;
  const marbleTilt = motionByExperiment.marble ? calibratedTilt : neutralTilt;
  const readoutTilt = motionByExperiment.readout ? calibratedTilt : neutralTilt;

  const liquidAngle = clamp(liquidTilt.x * 0.9, -45, 45);
  const liquidHeight = clamp(52 + liquidTilt.y * 0.45, 28, 78);
  const isPouring =
    Math.abs(liquidTilt.x) > 34 || Math.abs(liquidTilt.y) > 38;
  const pourSide = liquidTilt.x >= 0 ? "right" : "left";

  const sandBottomFill = clamp(50 + hourglassTilt.y * 1.15, 4, 96);
  const sandTopFill = 100 - sandBottomFill;
  const hourglassSide = sandBottomFill >= 50 ? "bottom" : "top";

  const tiltStrength = Math.round(
    clamp(
      Math.sqrt(readoutTilt.x * readoutTilt.x + readoutTilt.y * readoutTilt.y) *
        2.2,
      0,
      100
    )
  );

  const sourceLabel = sensorReady ? "Phone sensor" : "Manual sliders";

  useEffect(() => {
    soundByExperimentRef.current = soundByExperiment;
  }, [soundByExperiment]);

  useEffect(() => {
    tiltRef.current = {
      x: marbleTilt.x,
      y: marbleTilt.y,
    };
  }, [marbleTilt.x, marbleTilt.y]);

  useEffect(() => {
    if (!phoneMotionActive) return;

    function handleOrientation(event: DeviceOrientationEvent) {
      setRawTilt({
        x: event.gamma ?? 0,
        y: event.beta ?? 0,
        z: event.alpha ?? 0,
      });
    }

    window.addEventListener("deviceorientation", handleOrientation);

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [phoneMotionActive]);

  useEffect(() => {
    if (!motionByExperiment.liquid) {
      wasPouringRef.current = false;
      return;
    }

    if (isPouring && !wasPouringRef.current) {
      setPourCount((current) => current + 1);
      setStatusMessage(
        pourSide === "right"
          ? "Liquid Cup is pouring to the right."
          : "Liquid Cup is pouring to the left."
      );
      playTone("liquid", 180, 0.1, "sawtooth");
      window.setTimeout(() => playTone("liquid", 240, 0.08, "sine"), 80);
    }

    wasPouringRef.current = isPouring;
  }, [isPouring, pourSide, motionByExperiment.liquid]);

  useEffect(() => {
    if (!motionByExperiment.hourglass) return;

    if (lastHourglassSideRef.current !== hourglassSide) {
      lastHourglassSideRef.current = hourglassSide;
      setFlipCount((current) => current + 1);
      setStatusMessage(
        hourglassSide === "bottom"
          ? "Hourglass sand is falling toward the bottom."
          : "Hourglass reversed. The sand flipped upward."
      );
      playTone("hourglass", hourglassSide === "bottom" ? 420 : 620, 0.08, "triangle");
    }
  }, [hourglassSide, motionByExperiment.hourglass]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!motionByExperiment.marble) return;

      setBall((current) => {
        const gravity = tiltRef.current;

        let nextVelocityX = velocityRef.current.x + gravity.x * 0.012;
        let nextVelocityY = velocityRef.current.y + gravity.y * 0.012;

        nextVelocityX *= 0.965;
        nextVelocityY *= 0.965;

        let nextX = current.x + nextVelocityX;
        let nextY = current.y + nextVelocityY;

        let bounced = false;

        if (nextX < 5) {
          nextX = 5;
          nextVelocityX = Math.abs(nextVelocityX) * 0.62;
          bounced = true;
        }

        if (nextX > 95) {
          nextX = 95;
          nextVelocityX = -Math.abs(nextVelocityX) * 0.62;
          bounced = true;
        }

        if (nextY < 5) {
          nextY = 5;
          nextVelocityY = Math.abs(nextVelocityY) * 0.62;
          bounced = true;
        }

        if (nextY > 95) {
          nextY = 95;
          nextVelocityY = -Math.abs(nextVelocityY) * 0.62;
          bounced = true;
        }

        velocityRef.current = {
          x: nextVelocityX,
          y: nextVelocityY,
        };

        if (bounced) {
          setBounceCount((currentCount) => currentCount + 1);
          playTone("marble", 280 + Math.random() * 140, 0.045, "square");
        }

        return {
          x: nextX,
          y: nextY,
        };
      });
    }, 24);

    return () => {
      window.clearInterval(interval);
    };
  }, [motionByExperiment.marble]);

  function playTone(
    experiment: ExperimentKey,
    frequency: number,
    duration = 0.08,
    type: OscillatorType = "sine"
  ) {
    if (!soundByExperimentRef.current[experiment] || typeof window === "undefined") {
      return;
    }

    const AudioContextConstructor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextConstructor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextConstructor();
    }

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  async function enablePhoneMotion() {
    if (typeof window === "undefined") return;

    const deviceOrientationEvent = (
      window as unknown as {
        DeviceOrientationEvent?: {
          requestPermission?: () => Promise<"granted" | "denied">;
        };
      }
    ).DeviceOrientationEvent;

    if (!("ondeviceorientation" in window) && !deviceOrientationEvent) {
      setMotionPermission("unsupported");
      setPhoneMotionActive(false);
      setStatusMessage(
        "Phone motion is not supported here. Use manual sliders instead."
      );
      return;
    }

    try {
      if (typeof deviceOrientationEvent?.requestPermission === "function") {
        const permission = await deviceOrientationEvent.requestPermission();

        if (permission === "granted") {
          setMotionPermission("granted");
          setPhoneMotionActive(true);
          setStatusMessage(
            "Phone sensor enabled. Each experiment can still turn its own motion on or off."
          );
        } else {
          setMotionPermission("denied");
          setPhoneMotionActive(false);
          setStatusMessage(
            "Motion permission was denied. Manual sliders still work."
          );
        }

        return;
      }

      setMotionPermission("granted");
      setPhoneMotionActive(true);
      setStatusMessage(
        "Phone sensor enabled. Tilt your phone or use the per-experiment controls."
      );
    } catch {
      setMotionPermission("denied");
      setPhoneMotionActive(false);
      setStatusMessage("Motion controls could not start. Use manual sliders.");
    }
  }

  function calibrateMotion() {
    setCalibration(rawTilt);
    setStatusMessage("Calibration saved. This phone angle is now neutral.");
    playTone(activeExperiment, 520, 0.08, "triangle");
    window.setTimeout(() => playTone(activeExperiment, 700, 0.08, "triangle"), 90);
  }

  function toggleMotion(experiment: ExperimentKey) {
    setMotionByExperiment((current) => ({
      ...current,
      [experiment]: !current[experiment],
    }));
  }

  function toggleSound(experiment: ExperimentKey) {
    setSoundByExperiment((current) => {
      const nextValue = !current[experiment];

      const next = {
        ...current,
        [experiment]: nextValue,
      };

      soundByExperimentRef.current = next;

      if (nextValue) {
        window.setTimeout(() => playTone(experiment, 440, 0.07, "sine"), 20);
        window.setTimeout(() => playTone(experiment, 660, 0.07, "sine"), 100);
      }

      return next;
    });
  }

  function resetExperiment(experiment: ExperimentKey) {
    if (experiment === "liquid") {
      setPourCount(0);
      wasPouringRef.current = false;
      setStatusMessage("Liquid Cup reset.");
      playTone("liquid", 330, 0.08, "sine");
    }

    if (experiment === "hourglass") {
      setFlipCount(0);
      lastHourglassSideRef.current = "bottom";
      setStatusMessage("Tilt Hourglass reset.");
      playTone("hourglass", 440, 0.08, "triangle");
    }

    if (experiment === "marble") {
      setBall({ x: 50, y: 50 });
      setBounceCount(0);
      velocityRef.current = { x: 0, y: 0 };
      setStatusMessage("Gravity Marble reset.");
      playTone("marble", 330, 0.08, "sine");
    }

    if (experiment === "readout") {
      setManualTilt(neutralTilt);
      setCalibration(neutralTilt);
      setStatusMessage("Motion Readout reset.");
      playTone("readout", 520, 0.08, "sine");
    }
  }

  function updateManualTilt(axis: keyof TiltState, value: string) {
    setManualTilt((current) => ({
      ...current,
      [axis]: Number(value),
    }));
  }

  const activeCard =
    experimentCards.find((card) => card.key === activeExperiment) ??
    experimentCards[0];

  const activeDescription = activeCard?.text ?? "";

  return (
    <main className="min-h-screen px-4 py-10 text-white md:px-6 md:py-16">
      <section className="mx-auto max-w-6xl">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm border border-accent-300/25 bg-accent-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent-200">
                <Activity size={14} />
                Gravity Lab
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
                I wanted to see how much a browser could do with phone motion.
              </h1>

              <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
                Gravity Lab started as me experimenting with the
                DeviceOrientation API and trying to turn raw phone tilt into
                something people could actually see and play with. I added
                desktop sliders too, so the page still works without a motion
                sensor.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <GhostButton onClick={enablePhoneMotion} active={sensorReady}>
                <Smartphone size={15} />
                Phone Sensor {sensorReady ? "On" : "Off"}
              </GhostButton>

              <GhostButton onClick={calibrateMotion}>
                <Gauge size={15} />
                Calibrate
              </GhostButton>

              <PageButton href="/projects">
                View Projects <ExternalLink size={15} />
              </PageButton>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-md border border-accent-300/15 bg-black/25 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                Status
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                {statusMessage}
              </p>
            </div>

            <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Sensor Privacy
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                The motion values stay in your browser. I am not saving or
                sending the sensor data anywhere.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox
              label="Sensor"
              value={
                motionPermission === "idle"
                  ? "Not Started"
                  : motionPermission === "granted"
                    ? "Granted"
                    : motionPermission === "denied"
                      ? "Denied"
                      : "Unsupported"
              }
            />
            <StatBox label="Source" value={sourceLabel} accent={sensorReady} />
            <StatBox label="Tilt Strength" value={`${tiltStrength}/100`} />
            <StatBox label="Active App" value={activeCard?.title ?? "Lab"} />
          </div>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {experimentCards.map((experiment) => {
            const Icon = experiment.icon;
            const isActive = activeExperiment === experiment.key;

            return (
              <button
                key={experiment.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveExperiment(experiment.key)}
                className={`text-left ${glassCard} p-6 ${
                  isActive
                    ? "border-accent-300/60 bg-accent-300/[0.11] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                      {experiment.label}
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      {experiment.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      {experiment.text}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="rounded-md border border-accent-300/25 bg-accent-300/10 p-3 text-accent-200">
                      <Icon size={24} />
                    </div>

                    {isActive && (
                      <span className="rounded-sm border border-accent-400/50 bg-accent-500/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-100">
                        Currently Open
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-sm border border-accent-300/15 bg-black/25 px-3 py-1 text-xs font-semibold text-accent-100">
                    Motion {motionByExperiment[experiment.key] ? "On" : "Off"}
                  </span>

                  <span className="rounded-sm border border-accent-300/15 bg-black/25 px-3 py-1 text-xs font-semibold text-accent-100">
                    Sound {soundByExperiment[experiment.key] ? "On" : "Off"}
                  </span>
                </div>
              </button>
            );
          })}
        </section>

        <div className="mt-5 rounded-lg border border-accent-300/25 bg-accent-300/10 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-200">
            Currently Open
          </p>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-xl font-semibold text-white">
              {activeCard?.title ?? "Gravity Lab"}
            </p>
            <p className="text-sm text-zinc-300">
              Source: <span className="font-semibold text-accent-200">{sourceLabel}</span>
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Click any experiment card to switch. The full card is the button, so
            you do not have to aim for a small link.
          </p>
        </div>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <div className={`${glassCard} p-6`}>
            <Smartphone className="text-accent-300" size={24} />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Try it on a phone
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Tap Phone Sensor, allow motion access if your browser asks, then
              hold the phone in a comfortable position and press Calibrate.
            </p>
          </div>

          <div className={`${glassCard} p-6`}>
            <SlidersHorizontal className="text-accent-300" size={24} />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Desktop still works
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              The manual sliders feed the same experiments, so you can test the
              page with a mouse even when no motion sensor is available.
            </p>
          </div>

          <div className={`${glassCard} p-6`}>
            <Gauge className="text-accent-300" size={24} />
            <h2 className="mt-4 text-xl font-semibold text-white">
              Calibration matters
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              I added calibration because every device starts at a slightly
              different angle. The current position becomes the new neutral.
            </p>
          </div>
        </section>

        <div className="mt-8">
          <ExperimentToolbar
            title={activeCard?.title ?? "Gravity App"}
            description={activeDescription}
            motionOn={motionByExperiment[activeExperiment]}
            soundOn={soundByExperiment[activeExperiment]}
            sourceLabel={sourceLabel}
            onToggleMotion={() => toggleMotion(activeExperiment)}
            onToggleSound={() => toggleSound(activeExperiment)}
            onReset={() => resetExperiment(activeExperiment)}
          />
        </div>

        <section className="mt-8 grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_380px]">
          <div className={`${glassPanel} p-6 md:p-8`}>
            {activeExperiment === "liquid" && (
              <div>
                <div className="relative mx-auto h-96 max-w-md overflow-hidden rounded-lg border-4 border-accent-300/25 bg-black/40 shadow-[0_0_45px_rgba(34,211,238,0.08)]">
                  <div className="absolute left-6 right-6 top-6 text-center text-sm text-zinc-500">
                    Tilt X: {formatAngle(liquidTilt.x)}
                  </div>

                  <div
                    style={{
                      height: `${liquidHeight}%`,
                      transform: `rotate(${liquidAngle}deg) scaleX(1.35)`,
                      transformOrigin: "center top",
                    }}
                    className="absolute bottom-[-18%] left-[-20%] right-[-20%] rounded-t-[45%] bg-accent-300/80 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition-all duration-150"
                  />

                  <div className="absolute inset-x-0 bottom-6 text-center font-mono text-sm font-semibold text-white">
                    {isPouring ? "POURING" : "STABLE"}
                  </div>

                  {isPouring && (
                    <div
                      className={`absolute top-28 h-32 w-4 rounded-sm bg-accent-300/80 shadow-[0_0_20px_rgba(34,211,238,0.45)] ${
                        pourSide === "right" ? "right-2" : "left-2"
                      }`}
                    />
                  )}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox label="Pour Count" value={pourCount} accent />
                  <StatBox
                    label="Liquid Height"
                    value={`${Math.round(liquidHeight)}%`}
                  />
                  <StatBox label="Tilt X" value={formatAngle(liquidTilt.x)} />
                </div>
              </div>
            )}

            {activeExperiment === "hourglass" && (
              <div>
                <div className="mx-auto flex max-w-sm flex-col items-center">
                  <div className="relative h-80 w-52">
                    <div className="absolute left-1/2 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-300/40 bg-black" />

                    <div className="absolute left-6 right-6 top-0 h-36 overflow-hidden rounded-b-3xl rounded-t-full border border-accent-300/25 bg-black/45">
                      <div
                        style={{ height: `${sandTopFill}%` }}
                        className="absolute bottom-0 left-0 right-0 rounded-t-[45%] bg-accent-300/80 transition-all duration-150"
                      />
                    </div>

                    <div className="absolute left-1/2 top-36 h-8 w-2 -translate-x-1/2 bg-accent-300/80 shadow-[0_0_16px_rgba(34,211,238,0.5)]" />

                    <div className="absolute bottom-0 left-6 right-6 h-36 overflow-hidden rounded-b-full rounded-t-3xl border border-accent-300/25 bg-black/45">
                      <div
                        style={{ height: `${sandBottomFill}%` }}
                        className="absolute bottom-0 left-0 right-0 rounded-t-[45%] bg-accent-300/80 transition-all duration-150"
                      />
                    </div>
                  </div>

                  <p className="mt-5 text-center text-sm text-zinc-400">
                    Sand is mostly in the{" "}
                    <span className="font-semibold text-accent-300">
                      {hourglassSide}
                    </span>{" "}
                    chamber.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox label="Flip Count" value={flipCount} accent />
                  <StatBox label="Top Fill" value={`${Math.round(sandTopFill)}%`} />
                  <StatBox
                    label="Bottom Fill"
                    value={`${Math.round(sandBottomFill)}%`}
                  />
                </div>
              </div>
            )}

            {activeExperiment === "marble" && (
              <div>
                <div className="relative h-[30rem] overflow-hidden rounded-lg border border-accent-300/15 bg-black/40">
                  <div className="absolute left-1/2 top-0 h-full w-px bg-accent-300/10" />
                  <div className="absolute left-0 top-1/2 h-px w-full bg-accent-300/10" />

                  <div
                    style={{
                      left: `${ball.x}%`,
                      top: `${ball.y}%`,
                    }}
                    className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-300 shadow-[0_0_35px_rgba(34,211,238,0.55)] transition-[background-color]"
                  />

                  <div className="absolute bottom-4 left-4 right-4 rounded-md border border-accent-300/15 bg-zinc-950/80 p-4 text-sm text-zinc-400">
                    Motion controls the marble. It bounces off walls with small
                    sound clicks when this app sound is on.
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox label="Bounces" value={bounceCount} accent />
                  <StatBox
                    label="Position"
                    value={`${Math.round(ball.x)}, ${Math.round(ball.y)}`}
                  />
                  <StatBox label="Tilt" value={formatAngle(marbleTilt.x)} />
                </div>
              </div>
            )}

            {activeExperiment === "readout" && (
              <div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatBox label="Raw Gamma" value={formatAngle(rawTilt.x)} />
                  <StatBox label="Raw Beta" value={formatAngle(rawTilt.y)} />
                  <StatBox label="Raw Alpha" value={formatAngle(rawTilt.z)} />
                  <StatBox
                    label="Effective X"
                    value={formatAngle(readoutTilt.x)}
                    accent
                  />
                  <StatBox
                    label="Effective Y"
                    value={formatAngle(readoutTilt.y)}
                    accent
                  />
                  <StatBox label="Strength" value={`${tiltStrength}/100`} />
                </div>

                <div className="mt-6 rounded-lg border border-accent-300/15 bg-black/25 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                    What I am reading
                  </p>

                  <p className="mt-3 text-sm leading-7 text-zinc-400">
                    Gamma is left and right tilt, beta is forward and back, and
                    alpha is the device heading. I subtract the calibration
                    angle before the experiments use those values.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-zinc-500">
                    This works best on a real phone over HTTPS. iPhone usually
                    asks for permission first. Android often starts after the
                    sensor button tap.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <ManualTiltControls
              manualTilt={manualTilt}
              updateManualTilt={updateManualTilt}
            />

            <div className={`${glassPanel} p-5`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
                Experiment Stats
              </p>

              <div className="mt-5 grid gap-4">
                <StatBox label="Liquid Pours" value={pourCount} />
                <StatBox label="Hourglass Flips" value={flipCount} />
                <StatBox label="Marble Bounces" value={bounceCount} />
              </div>
            </div>
          </aside>
        </section>

        <section className={`${glassPanel} mt-10 p-6 md:p-8`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
            Why I Built This
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-white">
            I wanted the phone itself to become part of the interface.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            Most of my web projects are controlled with clicks, taps, or text
            input. Here I wanted to work with a different kind of input and see
            how device motion could control a visual interface in real time.
          </p>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400 md:text-base">
            Building it made me work through browser permissions, sensor
            differences, calibration, desktop fallbacks, animation loops,
            sound, and physics-style movement. It is still a playful page, but
            the real experiment is making hardware input feel understandable
            inside a normal website.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <div className="rounded-md border border-accent-300/15 bg-black/25 p-4">
              <p className="text-sm font-semibold text-white">Input</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Phone orientation, permission handling, manual fallback, and
                calibration.
              </p>
            </div>

            <div className="rounded-md border border-accent-300/15 bg-black/25 p-4">
              <p className="text-sm font-semibold text-white">Behavior</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Pour thresholds, direction changes, marble velocity, friction,
                and wall collisions.
              </p>
            </div>

            <div className="rounded-md border border-accent-300/15 bg-black/25 p-4">
              <p className="text-sm font-semibold text-white">Interface</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Touch-friendly controls, clear status messages, optional sound,
                and responsive layouts.
              </p>
            </div>
          </div>
        </section>

        <p className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Cabrera while figuring out how far phone sensors could
          push a browser interface.
        </p>
      </section>
    </main>
  );
}
