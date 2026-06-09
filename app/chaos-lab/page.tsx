"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";

type Position = {
  x: number;
  y: number;
};

const roastMessages = [
  "You thought that would work?",
  "Legally, this button does nothing.",
  "Task failed successfully.",
  "Please wait while we waste your time.",
  "Feature shipped. User happiness reduced.",
  "This UI was designed by a raccoon with Jira access.",
  "Excellent click. Unfortunately, no.",
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

  const chaosRating = useMemo(() => {
    if (chaosScore < 5) return "Mildly cursed";
    if (chaosScore < 12) return "Annoying";
    if (chaosScore < 22) return "HR complaint";
    if (chaosScore < 35) return "Villain UI";
    return "Unemployable genius";
  }, [chaosScore]);

  function addChaos(amount = 1) {
    setChaosScore((current) => current + amount);
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
            <a className="transition hover:text-cyan-300" href="/playground">
              Playground
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
            bars, and questionable interface decisions built with React,
            TypeScript, state, events, timers, mobile touch events, and terrible
            judgment.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatBox label="Chaos Score" value={chaosScore} />
            <StatBox label="Current Rating" value={chaosRating} />
            <StatBox label="Button Dodges" value={buttonDodges} />
          </div>

          <button
            onClick={resetChaos}
            className="mt-8 rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
          >
            Reset the nonsense
          </button>
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
                  <p className="font-bold text-white">
                    We value your privacy.
                  </p>
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
            inline positioning, reusable components, and responsive Tailwind
            styling. It is also annoying on purpose, which technically makes the
            bugs features.
          </p>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera. Chaos responsibly.
        </footer>
      </section>
    </main>
  );
}