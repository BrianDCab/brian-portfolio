"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

type Position = {
  x: number;
  y: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  label: string;
};

const bubbleCount = 32;

const roastMessages = [
  "You thought that would work?",
  "Legally, this button does nothing.",
  "Task failed successfully.",
  "Please wait while we waste your time.",
  "Feature shipped. User happiness reduced.",
  "This UI was designed by a raccoon with Jira access.",
  "Excellent click. Unfortunately, no.",
];

const fidgetMessages = [
  "That was unnecessarily satisfying.",
  "Tiny dopamine acquired.",
  "Clean click. Clean soul.",
  "A small win, but emotionally important.",
  "The UI has apologized for earlier behavior.",
  "Perfect little interaction.",
  "Order has been temporarily restored.",
];

const badCorrections: Record<string, string> = {
  hello: "hell no",
  portfolio: "portabello",
  react: "regret",
  typescript: "type suffering",
  data: "drama",
  button: "buttton",
  professional: "professionally annoying",
  brian: "Brian the Bug Tamer",
  casino: "chaosino",
  project: "procrastination",
};

function randomPosition(): Position {
  return {
    x: Math.floor(Math.random() * 58) + 5,
    y: Math.floor(Math.random() * 58) + 10,
  };
}

function randomMessage() {
  return roastMessages[Math.floor(Math.random() * roastMessages.length)]!;
}

function randomFidgetMessage() {
  return fidgetMessages[Math.floor(Math.random() * fidgetMessages.length)]!;
}

function ChaosCard({
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

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-black/40 p-4">
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-cyan-300">{value}</p>
    </div>
  );
}

export default function ChaosLabPage() {
  const [chaosScore, setChaosScore] = useState(0);

  const [volume, setVolume] = useState(37);
  const [volumePosition, setVolumePosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [volumeMessage, setVolumeMessage] = useState(
    "Try setting the volume normally. I dare you."
  );

  const [buttonPosition, setButtonPosition] = useState<Position>({
    x: 38,
    y: 45,
  });
  const [buttonDodges, setButtonDodges] = useState(0);
  const [buttonMessage, setButtonMessage] = useState(
    "This button has commitment issues."
  );

  const [loading, setLoading] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState(
    "Start the perfectly legitimate loading bar."
  );

  const [text, setText] = useState("");
  const [corruptedText, setCorruptedText] = useState("");

  const [cookieVisible, setCookieVisible] = useState(true);
  const [cookieAccepts, setCookieAccepts] = useState(0);

  const [checkboxPosition, setCheckboxPosition] = useState<Position>({
    x: 20,
    y: 45,
  });
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);
  const [switches, setSwitches] = useState([
    false,
    false,
    true,
    false,
    true,
    false,
    false,
    true,
  ]);
  const [pressCount, setPressCount] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [calmSlider, setCalmSlider] = useState(50);
  const [fidgetMessage, setFidgetMessage] = useState(
    "After the nonsense above, decompress here."
  );

  const audioContextRef = useRef<AudioContext | null>(null);

  const chaosRating = useMemo(() => {
    if (chaosScore < 5) return "Mildly cursed";
    if (chaosScore < 12) return "Annoying";
    if (chaosScore < 22) return "HR complaint";
    if (chaosScore < 35) return "Villain UI";
    return "Unemployable genius";
  }, [chaosScore]);

  const poppedBubbleSet = useMemo(
    () => new Set(poppedBubbles),
    [poppedBubbles]
  );

  const switchesOn = switches.filter(Boolean).length;

  const fidgetRating = useMemo(() => {
    const score = poppedBubbles.length + pressCount + switchesOn;

    if (score < 8) return "Warming up";
    if (score < 20) return "Satisfying";
    if (score < 40) return "Oddly peaceful";
    return "Fully decompressed";
  }, [poppedBubbles.length, pressCount, switchesOn]);

  function addChaos(amount = 1) {
    setChaosScore((current) => current + amount);
  }

  function playTone(
    frequency: number,
    duration = 0.08,
    type: OscillatorType = "sine"
  ) {
    if (!soundEnabled || typeof window === "undefined") return;

    const audioContextConstructor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!audioContextConstructor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new audioContextConstructor();
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

  function toggleSound() {
    setSoundEnabled((current) => !current);

    setFidgetMessage(
      soundEnabled
        ? "Sound disabled. Silent chaos restored."
        : "Sound enabled. Browser approved tiny beeps after your click."
    );
  }

  function handleVolumeChange(event: ChangeEvent<HTMLInputElement>) {
    const rawValue = Number(event.target.value);
    const annoyingValue = 100 - rawValue;

    setVolume(annoyingValue);
    setVolumeMessage(
      `You selected ${rawValue}. So naturally I set it to ${annoyingValue}.`
    );
    addChaos();
  }

  function annoyVolume() {
    setVolumePosition({
      x: Math.floor(Math.random() * 28) - 14,
      y: Math.floor(Math.random() * 20) - 10,
    });

    setVolume((current) => {
      const newValue = current > 50 ? current - 17 : current + 23;
      return Math.max(0, Math.min(100, newValue));
    });

    setVolumeMessage(randomMessage());
    addChaos();
  }

  function dodgeButton() {
    setButtonPosition(randomPosition());
    setButtonDodges((current) => current + 1);
    setButtonMessage(randomMessage());
    addChaos();
  }

  function catchButton() {
    setButtonMessage("Wait. You actually clicked it? Fine. You win nothing.");
    addChaos(5);
  }

  function startLoading() {
    setLoadingMessage("Loading...");
    setLoading(0);
    addChaos();

    let progress = 0;

    const interval = window.setInterval(() => {
      progress += Math.floor(Math.random() * 16) + 5;

      if (progress >= 99) {
        progress = 99;
        setLoading(99);
        setLoadingMessage(
          "Almost done. Please enjoy being emotionally trapped at 99%."
        );
        window.clearInterval(interval);
        return;
      }

      setLoading(progress);
    }, 250);
  }

  function handleBadTyping(value: string) {
    setText(value);

    const changed = value
      .split(" ")
      .map((word) => {
        const cleanWord = word.toLowerCase().replace(/[^a-z]/g, "");
        return badCorrections[cleanWord] ?? word;
      })
      .join(" ");

    setCorruptedText(changed);
    addChaos();
  }

  function acceptCookies() {
    setCookieAccepts((current) => current + 1);
    setCookieVisible(false);
    addChaos(2);

    window.setTimeout(() => {
      setCookieVisible(true);
    }, 900);
  }

  function moveCheckbox(event: SyntheticEvent<HTMLLabelElement>) {
    event.preventDefault();

    setCheckboxPosition(randomPosition());
    setCheckboxChecked(false);
    addChaos();
  }

  function popBubble(index: number) {
    if (poppedBubbleSet.has(index)) return;

    const newPopped = [...poppedBubbles, index];

    setPoppedBubbles(newPopped);
    setFidgetMessage(
      newPopped.length === bubbleCount
        ? "Full sheet cleared. That was spiritually necessary."
        : randomFidgetMessage()
    );

    playTone(520 + Math.random() * 240, 0.055, "sine");
  }

  function resetBubbles() {
    setPoppedBubbles([]);
    setFidgetMessage("Fresh bubble sheet loaded.");
    playTone(260, 0.12, "triangle");
  }

  function toggleSwitch(index: number) {
    setSwitches((current) =>
      current.map((switchValue, switchIndex) =>
        switchIndex === index ? !switchValue : switchValue
      )
    );

    setFidgetMessage(randomFidgetMessage());
    playTone(420 + index * 40, 0.08, "triangle");
  }

  function satisfyingPress() {
    const newCount = pressCount + 1;
    const newParticles = Array.from({ length: 8 }, (_, index) => ({
      id: Date.now() + index + Math.random(),
      x: Math.floor(Math.random() * 80) + 10,
      y: Math.floor(Math.random() * 55) + 15,
      label: ["+", "✨", "pop", "nice", "✓"][index % 5]!,
    }));

    const newIds = newParticles.map((particle) => particle.id);

    setPressCount(newCount);
    setParticles((current) => [...current, ...newParticles].slice(-24));
    setFidgetMessage(
      newCount % 10 === 0
        ? `Perfect. ${newCount} clean presses.`
        : randomFidgetMessage()
    );

    playTone(330 + (newCount % 8) * 55, 0.075, "sine");

    window.setTimeout(() => {
      setParticles((current) =>
        current.filter((particle) => !newIds.includes(particle.id))
      );
    }, 900);
  }

  function handleCalmSlider(value: string) {
    const numericValue = Number(value);

    setCalmSlider(numericValue);

    if (numericValue === 50) {
      setFidgetMessage("Perfectly balanced. Extremely correct.");
      playTone(440, 0.08, "sine");
    } else if (Math.abs(numericValue - 50) <= 5) {
      setFidgetMessage("Almost centered. Very respectable.");
    } else {
      setFidgetMessage("Slide it toward the middle. The UI demands balance.");
    }
  }

  function cleanEverything() {
    setPoppedBubbles(Array.from({ length: bubbleCount }, (_, index) => index));
    setSwitches([true, true, true, true, true, true, true, true]);
    setCalmSlider(50);
    setFidgetMessage("Everything is clean, aligned, popped, and peaceful.");

    playTone(330, 0.07, "triangle");
    window.setTimeout(() => playTone(440, 0.07, "triangle"), 90);
    window.setTimeout(() => playTone(660, 0.09, "triangle"), 180);
  }

  function resetChaos() {
    setChaosScore(0);
    setVolume(37);
    setVolumePosition({ x: 0, y: 0 });
    setVolumeMessage("Try setting the volume normally. I dare you.");
    setButtonPosition({ x: 38, y: 45 });
    setButtonDodges(0);
    setButtonMessage("This button has commitment issues.");
    setLoading(0);
    setLoadingMessage("Start the perfectly legitimate loading bar.");
    setText("");
    setCorruptedText("");
    setCookieVisible(true);
    setCookieAccepts(0);
    setCheckboxPosition({ x: 20, y: 45 });
    setCheckboxChecked(false);
    setPoppedBubbles([]);
    setSwitches([false, false, true, false, true, false, false, true]);
    setPressCount(0);
    setParticles([]);
    setCalmSlider(50);
    setFidgetMessage("After the nonsense above, decompress here.");
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
            <a className="text-cyan-300 transition hover:text-cyan-200" href="/chaos-lab">
              Chaos Lab
            </a>
            <a className="transition hover:text-cyan-300" href="/travel">
              Travel
            </a>
            <a className="transition hover:text-cyan-300" href="/#contact">
              Contact
            </a>
          </div>
        </nav>

        <section className="rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Intentionally Annoying UI Experiments
          </p>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Chaos Lab
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            A collection of cursed buttons, disrespectful sliders, fake loading
            bars, questionable interface decisions, and a satisfying recovery
            zone built with React, TypeScript, state, events, timers, touch
            interactions, and terrible judgment.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatBox label="Chaos Score" value={chaosScore} />
            <StatBox label="Current Rating" value={chaosRating} />
            <StatBox label="Button Dodges" value={buttonDodges} />
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={resetChaos}
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Reset the nonsense
            </button>

            <button
              onClick={toggleSound}
              className="rounded-xl border border-cyan-300/50 px-5 py-3 font-semibold text-cyan-300 transition hover:bg-cyan-300 hover:text-black"
            >
              Sound: {soundEnabled ? "On" : "Off"}
            </button>
          </div>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-2">
          <ChaosCard
            title="The Disrespectful Volume Slider"
            description="A volume slider that refuses to respect your actual input. On mobile, touching it also makes it act stupid."
          >
            <div
              onMouseEnter={annoyVolume}
              onTouchStart={annoyVolume}
              style={{
                transform: `translate(${volumePosition.x}px, ${volumePosition.y}px)`,
              }}
              className="transition-transform duration-200"
            >
              <div className="flex items-center justify-between text-sm text-zinc-400">
                <span>Volume</span>
                <span>{volume}%</span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="mt-4 w-full accent-cyan-300"
              />

              <p className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-4 text-sm text-zinc-300">
                {volumeMessage}
              </p>
            </div>
          </ChaosCard>

          <ChaosCard
            title="The Button That Runs Away"
            description="A button that knows you want to click it and takes that personally. It dodges hover, focus, and mobile touch."
          >
            <div className="relative h-72 overflow-hidden rounded-2xl border border-zinc-800 bg-black/40">
              <button
                onMouseEnter={dodgeButton}
                onTouchStart={dodgeButton}
                onFocus={dodgeButton}
                onClick={catchButton}
                style={{
                  left: `${buttonPosition.x}%`,
                  top: `${buttonPosition.y}%`,
                }}
                className="absolute rounded-xl bg-cyan-300 px-5 py-3 font-black text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition-all duration-200 hover:bg-cyan-200"
              >
                Click me
              </button>

              <p className="absolute bottom-4 left-4 right-4 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-sm text-zinc-300">
                {buttonMessage}
              </p>
            </div>
          </ChaosCard>

          <ChaosCard
            title="The 99% Loading Bar"
            description="A progress bar that makes strong promises and weak deliveries."
          >
            <button
              onClick={startLoading}
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black transition hover:bg-cyan-200"
            >
              Start loading
            </button>

            <div className="mt-6 h-5 overflow-hidden rounded-full bg-zinc-900">
              <div
                style={{ width: `${loading}%` }}
                className="h-full rounded-full bg-cyan-300 transition-all duration-300"
              />
            </div>

            <div className="mt-3 flex justify-between gap-4 text-sm text-zinc-400">
              <span>{loadingMessage}</span>
              <span>{loading}%</span>
            </div>
          </ChaosCard>

          <ChaosCard
            title="Bad Autocorrect"
            description="A text box that edits your writing like it has beef with you."
          >
            <textarea
              value={text}
              onChange={(event) => handleBadTyping(event.target.value)}
              placeholder="Try typing: hello brian this react portfolio project is professional"
              className="min-h-32 w-full rounded-2xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300"
            />

            <div className="mt-4 rounded-2xl border border-zinc-800 bg-black/40 p-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500">
                Corrected Output
              </p>
              <p className="mt-2 min-h-8 text-zinc-300">
                {corruptedText || "Your ruined sentence will appear here."}
              </p>
            </div>
          </ChaosCard>

          <ChaosCard
            title="The Checkbox That Refuses Consent"
            description="A checkbox that simply does not want to be part of your form. It now runs away on mobile too."
          >
            <div className="relative h-64 overflow-hidden rounded-2xl border border-zinc-800 bg-black/40">
              <label
                onMouseEnter={moveCheckbox}
                onTouchStart={moveCheckbox}
                onClick={moveCheckbox}
                style={{
                  left: `${checkboxPosition.x}%`,
                  top: `${checkboxPosition.y}%`,
                }}
                className="absolute flex cursor-pointer items-center gap-3 rounded-xl border border-cyan-300/40 bg-zinc-950 px-4 py-3 text-sm text-zinc-200 transition-all duration-200"
              >
                <input
                  type="checkbox"
                  checked={checkboxChecked}
                  onChange={(event) => setCheckboxChecked(event.target.checked)}
                  className="accent-cyan-300"
                />
                I agree to be annoyed
              </label>

              <p className="absolute bottom-4 left-4 right-4 text-sm text-zinc-500">
                Spoiler: it will not agree.
              </p>
            </div>
          </ChaosCard>

          <ChaosCard
            title="Cookies That Come Back"
            description="A cookie banner that accepts your answer and then completely ignores it."
          >
            <div className="min-h-64 rounded-2xl border border-zinc-800 bg-black/40 p-5">
              <p className="text-sm text-zinc-400">
                Accept count:{" "}
                <span className="font-bold text-cyan-300">{cookieAccepts}</span>
              </p>

              {!cookieVisible && (
                <p className="mt-10 text-center text-zinc-500">
                  Finally. Peace and quiet.
                </p>
              )}

              {cookieVisible && (
                <div className="mt-8 rounded-2xl border border-cyan-300/30 bg-zinc-950 p-5 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
                  <p className="font-bold text-white">We value your privacy.</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    That is why this banner will return immediately after you
                    accept it.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={acceptCookies}
                      className="rounded-xl bg-cyan-300 px-4 py-2 font-semibold text-black transition hover:bg-cyan-200"
                    >
                      Accept
                    </button>

                    <button
                      onClick={acceptCookies}
                      className="rounded-xl border border-zinc-600 px-4 py-2 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
                    >
                      Also Accept
                    </button>
                  </div>
                </div>
              )}
            </div>
          </ChaosCard>
        </section>

        <section className="mt-10 rounded-3xl border border-cyan-400/30 bg-zinc-950 p-6 shadow-[0_0_45px_rgba(34,211,238,0.10)] md:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Satisfying Recovery Zone
              </p>

              <h2 className="mt-3 text-4xl font-black text-white">
                Tiny fidget interactions after the UI trauma.
              </h2>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
                Pop bubbles, flip clean switches, press a nice button, center a
                slider, and optionally turn on tiny browser-generated sound
                bites.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 md:min-w-[420px]">
              <StatBox label="Bubbles Popped" value={`${poppedBubbles.length}/${bubbleCount}`} />
              <StatBox label="Clean Presses" value={pressCount} />
              <StatBox label="Fidget Rating" value={fidgetRating} />
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-zinc-800 bg-black/40 p-5">
            <p className="text-sm font-semibold text-cyan-300">Current Mood</p>
            <p className="mt-2 text-zinc-300">{fidgetMessage}</p>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-zinc-800 bg-black/30 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold">Bubble Wrap Grid</h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Tap bubbles. They stay popped until reset.
                  </p>
                </div>

                <button
                  onClick={resetBubbles}
                  className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
                >
                  Reset bubbles
                </button>
              </div>

              <div className="mt-6 grid grid-cols-8 gap-2">
                {Array.from({ length: bubbleCount }, (_, index) => {
                  const popped = poppedBubbleSet.has(index);

                  return (
                    <button
                      key={index}
                      onClick={() => popBubble(index)}
                      className={`aspect-square rounded-full border transition active:scale-90 ${
                        popped
                          ? "border-zinc-800 bg-zinc-900 shadow-inner"
                          : "border-cyan-300/40 bg-cyan-300/20 shadow-[0_0_18px_rgba(34,211,238,0.16)] hover:bg-cyan-300/30"
                      }`}
                      aria-label={`Bubble ${index + 1}`}
                    >
                      <span className="sr-only">
                        {popped ? "Popped" : "Unpopped"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/30 p-6">
              <h3 className="text-2xl font-bold">The Perfect Button</h3>
              <p className="mt-2 text-sm text-zinc-400">
                This one actually wants to be clicked.
              </p>

              <div className="relative mt-6 flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    style={{
                      left: `${particle.x}%`,
                      top: `${particle.y}%`,
                    }}
                    className="pointer-events-none absolute animate-pulse text-sm font-bold text-cyan-300"
                  >
                    {particle.label}
                  </span>
                ))}

                <button
                  onClick={satisfyingPress}
                  className="rounded-2xl bg-cyan-300 px-8 py-5 text-xl font-black text-black shadow-[0_0_35px_rgba(103,232,249,0.35)] transition active:scale-90 hover:bg-cyan-200"
                >
                  Press me
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/30 p-6">
              <h3 className="text-2xl font-bold">Clean Toggle Board</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Flip the switches. Make the board glow.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {switches.map((isOn, index) => (
                  <button
                    key={index}
                    onClick={() => toggleSwitch(index)}
                    className={`rounded-2xl border p-4 transition active:scale-95 ${
                      isOn
                        ? "border-cyan-300/50 bg-cyan-300/20 shadow-[0_0_25px_rgba(34,211,238,0.14)]"
                        : "border-zinc-800 bg-zinc-950"
                    }`}
                  >
                    <div
                      className={`mx-auto h-10 w-16 rounded-full p-1 transition ${
                        isOn ? "bg-cyan-300" : "bg-zinc-800"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full bg-white transition ${
                          isOn ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </div>

                    <p className="mt-3 text-xs font-semibold text-zinc-400">
                      Switch {index + 1}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-black/30 p-6">
              <h3 className="text-2xl font-bold">Balance Slider</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Center it at 50. The UI will be pleased.
              </p>

              <div className="mt-8">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Chaotic</span>
                  <span className="font-bold text-cyan-300">{calmSlider}</span>
                  <span>Balanced</span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={calmSlider}
                  onChange={(event) => handleCalmSlider(event.target.value)}
                  className="mt-5 w-full accent-cyan-300"
                />

                <div className="mt-6 h-4 overflow-hidden rounded-full bg-zinc-900">
                  <div
                    style={{
                      width: `${Math.max(5, 100 - Math.abs(calmSlider - 50) * 2)}%`,
                    }}
                    className="h-full rounded-full bg-cyan-300 transition-all"
                  />
                </div>

                <button
                  onClick={cleanEverything}
                  className="mt-8 w-full rounded-xl bg-cyan-300 px-5 py-4 font-black text-black shadow-[0_0_25px_rgba(103,232,249,0.30)] transition hover:bg-cyan-200"
                >
                  Make Everything Satisfying
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Why this is still portfolio-worthy
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            It is dumb, but it shows real frontend skills.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
            This page uses React state, controlled inputs, mouse events, focus
            events, mobile touch events, timers, conditional rendering, dynamic
            inline positioning, reusable components, Web Audio API sound, and
            responsive Tailwind styling. It is also annoying on purpose, which
            technically makes the bugs features.
          </p>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera. Chaos responsibly.
        </footer>
      </section>
    </main>
  );
}