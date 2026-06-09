"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

type MotionPermission = "idle" | "granted" | "denied" | "unsupported";

type TiltState = {
  x: number;
  y: number;
  z: number;
};

type BallState = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatAngle(value: number) {
  return `${value.toFixed(1)}°`;
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-cyan-300">{value}</p>
    </div>
  );
}

function ExperimentCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.06)]">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-400">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function GravityLabPage() {
  const [motionPermission, setMotionPermission] =
    useState<MotionPermission>("idle");
  const [motionActive, setMotionActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const [rawTilt, setRawTilt] = useState<TiltState>({
    x: 0,
    y: 0,
    z: 0,
  });

  const [manualTilt, setManualTilt] = useState<TiltState>({
    x: 0,
    y: 0,
    z: 0,
  });

  const [calibration, setCalibration] = useState<TiltState>({
    x: 0,
    y: 0,
    z: 0,
  });

  const [ball, setBall] = useState<BallState>({
    x: 50,
    y: 50,
  });

  const [statusMessage, setStatusMessage] = useState(
    "Open this page on your phone, tap Enable Motion + Sound, then tilt your phone."
  );

  const [pourCount, setPourCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [bounceCount, setBounceCount] = useState(0);

  const velocityRef = useRef({ x: 0, y: 0 });
  const tiltRef = useRef({ x: 0, y: 0 });
  const audioContextRef = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(false);
  const wasPouringRef = useRef(false);
  const lastHourglassSideRef = useRef<"top" | "bottom">("bottom");

  const usingRealMotion = motionPermission === "granted" && motionActive;

  const effectiveTilt = useMemo(() => {
    if (usingRealMotion) {
      return {
        x: clamp(rawTilt.x - calibration.x, -45, 45),
        y: clamp(rawTilt.y - calibration.y, -45, 45),
        z: rawTilt.z,
      };
    }

    return manualTilt;
  }, [usingRealMotion, rawTilt, calibration, manualTilt]);

  const liquidAngle = clamp(effectiveTilt.x * 0.9, -45, 45);
  const liquidHeight = clamp(52 + effectiveTilt.y * 0.45, 28, 78);
  const isPouring =
    Math.abs(effectiveTilt.x) > 34 || Math.abs(effectiveTilt.y) > 38;
  const pourSide = effectiveTilt.x >= 0 ? "right" : "left";

  const sandBottomFill = clamp(50 + effectiveTilt.y * 1.15, 4, 96);
  const sandTopFill = 100 - sandBottomFill;
  const hourglassSide = sandBottomFill >= 50 ? "bottom" : "top";

  const tiltStrength = Math.round(
    clamp(
      Math.sqrt(effectiveTilt.x * effectiveTilt.x + effectiveTilt.y * effectiveTilt.y) *
        2.2,
      0,
      100
    )
  );

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    tiltRef.current = {
      x: effectiveTilt.x,
      y: effectiveTilt.y,
    };
  }, [effectiveTilt.x, effectiveTilt.y]);

  useEffect(() => {
    if (!motionActive) return;

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
  }, [motionActive]);

  useEffect(() => {
    if (isPouring && !wasPouringRef.current) {
      setPourCount((current) => current + 1);
      setStatusMessage(
        pourSide === "right"
          ? "The cup is pouring to the right."
          : "The cup is pouring to the left."
      );
      playTone(180, 0.1, "sawtooth");
      window.setTimeout(() => playTone(240, 0.08, "sine"), 80);
    }

    wasPouringRef.current = isPouring;
  }, [isPouring, pourSide]);

  useEffect(() => {
    if (lastHourglassSideRef.current !== hourglassSide) {
      lastHourglassSideRef.current = hourglassSide;
      setFlipCount((current) => current + 1);
      setStatusMessage(
        hourglassSide === "bottom"
          ? "Sand is falling toward the bottom."
          : "Sand reversed. The hourglass flipped."
      );
      playTone(hourglassSide === "bottom" ? 420 : 620, 0.08, "triangle");
    }
  }, [hourglassSide]);

  useEffect(() => {
    const interval = window.setInterval(() => {
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
          playTone(280 + Math.random() * 140, 0.045, "square");
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
  }, []);

  function playTone(
    frequency: number,
    duration = 0.08,
    type: OscillatorType = "sine"
  ) {
    if (!soundEnabledRef.current || typeof window === "undefined") return;

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

  async function enableMotionAndSound() {
    setSoundEnabled(true);
    soundEnabledRef.current = true;

    playTone(440, 0.08, "sine");
    window.setTimeout(() => playTone(660, 0.08, "sine"), 90);

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
      setMotionActive(false);
      setStatusMessage(
        "Motion controls are not supported here. Use the manual sliders instead."
      );
      return;
    }

    try {
      if (typeof deviceOrientationEvent?.requestPermission === "function") {
        const permission = await deviceOrientationEvent.requestPermission();

        if (permission === "granted") {
          setMotionPermission("granted");
          setMotionActive(true);
          setStatusMessage(
            "Motion enabled. Tilt your phone to move the liquid, sand, and marble."
          );
        } else {
          setMotionPermission("denied");
          setMotionActive(false);
          setStatusMessage(
            "Motion permission was denied. You can still test it with manual sliders."
          );
        }

        return;
      }

      setMotionPermission("granted");
      setMotionActive(true);
      setStatusMessage(
        "Motion enabled. Tilt your phone to move the liquid, sand, and marble."
      );
    } catch {
      setMotionPermission("denied");
      setMotionActive(false);
      setStatusMessage(
        "Motion controls could not start. Use the manual sliders instead."
      );
    }
  }

  function calibrateMotion() {
    setCalibration(rawTilt);
    setStatusMessage("Calibration saved. This phone angle is now neutral.");
    playTone(520, 0.08, "triangle");
    window.setTimeout(() => playTone(700, 0.08, "triangle"), 90);
  }

  function resetMotionLab() {
    setManualTilt({ x: 0, y: 0, z: 0 });
    setCalibration({ x: 0, y: 0, z: 0 });
    setBall({ x: 50, y: 50 });
    setPourCount(0);
    setFlipCount(0);
    setBounceCount(0);
    velocityRef.current = { x: 0, y: 0 };
    setStatusMessage("Gravity Lab reset. Everything is centered again.");
    playTone(330, 0.08, "sine");
  }

  function updateManualTilt(axis: keyof TiltState, value: string) {
    setManualTilt((current) => ({
      ...current,
      [axis]: Number(value),
    }));
  }

  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)] md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            Brian Dacell Cabrera<span className="text-cyan-300">.</span>
          </a>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
            <a className="transition hover:text-cyan-300" href="/">
              Home
            </a>
            <a className="transition hover:text-cyan-300" href="/projects">
              Projects
            </a>
            <a className="transition hover:text-cyan-300" href="/data-lab">
              Data Lab
            </a>
            <a className="transition hover:text-cyan-300" href="/playground">
              Playground
            </a>
            <a className="transition hover:text-cyan-300" href="/chaos-lab">
              Chaos Lab
            </a>
            <a
              className="text-cyan-300 transition hover:text-cyan-200"
              href="/gravity-lab"
            >
              Gravity Lab
            </a>
            <a className="transition hover:text-cyan-300" href="/travel">
              Travel
            </a>
          </div>
        </nav>

        <section className="rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Mobile Motion Experiment
          </p>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Gravity Lab
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            A mobile-first motion toy using phone tilt, rotation, liquid slosh,
            hourglass-style sand, a gravity marble, and browser-generated sound.
            Open it on your phone for the real version.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={enableMotionAndSound}
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              Enable Motion + Sound
            </button>

            <button
              onClick={calibrateMotion}
              className="rounded-xl border border-cyan-300/50 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-300 hover:text-black"
            >
              Calibrate Neutral
            </button>

            <button
              onClick={resetMotionLab}
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Reset Lab
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-sm font-semibold text-cyan-300">Status</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              {statusMessage}
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox
              label="Motion"
              value={
                motionPermission === "idle"
                  ? "Not Started"
                  : motionPermission === "granted"
                    ? "Enabled"
                    : motionPermission === "denied"
                      ? "Denied"
                      : "Unsupported"
              }
            />
            <StatBox label="Sound" value={soundEnabled ? "On" : "Off"} />
            <StatBox label="Tilt Strength" value={`${tiltStrength}/100`} />
            <StatBox label="Mode" value={usingRealMotion ? "Phone" : "Manual"} />
          </div>
        </section>

        {!usingRealMotion && (
          <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Desktop / Fallback Controls
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Test the physics without phone motion.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-400">
              These sliders simulate phone tilt. On a phone, tap Enable Motion +
              Sound and the real device orientation will take over.
            </p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
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
                  className="mt-3 w-full accent-cyan-300"
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
                  className="mt-3 w-full accent-cyan-300"
                />
              </label>
            </div>
          </section>
        )}
                <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <ExperimentCard
            title="Liquid Cup"
            description="Tilt your phone and the liquid surface rotates. Tilt too far and it starts pouring."
          >
            <div className="relative mx-auto h-80 max-w-sm overflow-hidden rounded-[2rem] border-4 border-zinc-700 bg-zinc-950 shadow-[0_0_45px_rgba(34,211,238,0.08)]">
              <div className="absolute left-6 right-6 top-6 text-center text-sm text-zinc-500">
                Tilt X: {formatAngle(effectiveTilt.x)}
              </div>

              <div
                style={{
                  height: `${liquidHeight}%`,
                  transform: `rotate(${liquidAngle}deg) scaleX(1.35)`,
                  transformOrigin: "center top",
                }}
                className="absolute bottom-[-18%] left-[-20%] right-[-20%] rounded-t-[45%] bg-cyan-300/80 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition-all duration-150"
              />

              <div className="absolute inset-x-0 bottom-6 text-center text-sm font-semibold text-black">
                {isPouring ? "POURING" : "STABLE"}
              </div>

              {isPouring && (
                <div
                  className={`absolute top-28 h-32 w-4 rounded-full bg-cyan-300/80 shadow-[0_0_20px_rgba(34,211,238,0.45)] ${
                    pourSide === "right" ? "right-2" : "left-2"
                  }`}
                />
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatBox label="Pour Count" value={pourCount} />
              <StatBox
                label="Liquid Height"
                value={`${Math.round(liquidHeight)}%`}
              />
            </div>
          </ExperimentCard>

          <ExperimentCard
            title="Phone Tilt Hourglass"
            description="Rotate your phone forward or backward and the sand visually transfers between chambers."
          >
            <div className="mx-auto flex max-w-sm flex-col items-center">
              <div className="relative h-72 w-48">
                <div className="absolute left-1/2 top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/40 bg-black" />

                <div className="absolute left-6 right-6 top-0 h-32 overflow-hidden rounded-b-3xl rounded-t-full border border-zinc-700 bg-black">
                  <div
                    style={{ height: `${sandTopFill}%` }}
                    className="absolute bottom-0 left-0 right-0 rounded-t-[45%] bg-cyan-300/80 transition-all duration-150"
                  />
                </div>

                <div className="absolute left-1/2 top-32 h-8 w-2 -translate-x-1/2 bg-cyan-300/80 shadow-[0_0_16px_rgba(34,211,238,0.5)]" />

                <div className="absolute bottom-0 left-6 right-6 h-32 overflow-hidden rounded-b-full rounded-t-3xl border border-zinc-700 bg-black">
                  <div
                    style={{ height: `${sandBottomFill}%` }}
                    className="absolute bottom-0 left-0 right-0 rounded-t-[45%] bg-cyan-300/80 transition-all duration-150"
                  />
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-zinc-400">
                Sand is mostly in the{" "}
                <span className="font-semibold text-cyan-300">
                  {hourglassSide}
                </span>{" "}
                chamber.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatBox label="Flip Count" value={flipCount} />
              <StatBox label="Tilt Y" value={formatAngle(effectiveTilt.y)} />
            </div>
          </ExperimentCard>

          <ExperimentCard
            title="Gravity Marble"
            description="A little marble rolls based on phone tilt. On desktop, the fallback sliders control gravity."
          >
            <div className="relative h-96 overflow-hidden rounded-3xl border border-zinc-800 bg-black/40">
              <div className="absolute left-1/2 top-0 h-full w-px bg-zinc-800" />
              <div className="absolute left-0 top-1/2 h-px w-full bg-zinc-800" />

              <div
                style={{
                  left: `${ball.x}%`,
                  top: `${ball.y}%`,
                }}
                className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.55)] transition-[background-color]"
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-4 text-sm text-zinc-400">
                Tilt controls the marble. It bounces off the walls with tiny
                sound clicks when sound is enabled.
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <StatBox label="Bounces" value={bounceCount} />
              <StatBox
                label="Position"
                value={`${Math.round(ball.x)}, ${Math.round(ball.y)}`}
              />
            </div>
          </ExperimentCard>

          <ExperimentCard
            title="Live Motion Readout"
            description="Raw phone sensor values and calibrated effective tilt values."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <StatBox label="Raw Gamma" value={formatAngle(rawTilt.x)} />
              <StatBox label="Raw Beta" value={formatAngle(rawTilt.y)} />
              <StatBox label="Raw Alpha" value={formatAngle(rawTilt.z)} />
              <StatBox
                label="Effective X"
                value={formatAngle(effectiveTilt.x)}
              />
              <StatBox
                label="Effective Y"
                value={formatAngle(effectiveTilt.y)}
              />
              <StatBox label="Strength" value={`${tiltStrength}/100`} />
            </div>

            <div className="mt-6 rounded-2xl border border-zinc-800 bg-black/40 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                Mobile note
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                This works best on a real phone over HTTPS. iPhone usually asks
                for permission first. Android often starts immediately after the
                button tap.
              </p>
            </div>
          </ExperimentCard>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Portfolio Value
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            This is a mobile-first frontend experiment.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
            Gravity Lab demonstrates the DeviceOrientation API, permission
            handling, mobile motion input, browser-generated sound,
            physics-like movement, animation, React state, refs, timers,
            calibration, and responsive UI design.
          </p>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera. Tilt responsibly.
        </footer>
      </section>
    </main>
  );
}

  