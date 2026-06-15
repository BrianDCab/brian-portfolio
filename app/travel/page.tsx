"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Clock,
  DollarSign,
  ExternalLink,
  Globe2,
  Luggage,
  MapPin,
  Plane,
  RefreshCcw,
  Route,
  Sparkles,
} from "lucide-react";

type TravelMode = "overview" | "asia" | "northAmerica" | "tools";

type Stop = {
  city: string;
  country: string;
  region: string;
  note: string;
  tags: string[];
};

type ToolCardProps = {
  title: string;
  label: string;
  icon: typeof BarChart3;
  onReset: () => void;
  children: ReactNode;
};

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

const travelModes = [
  {
    key: "overview" as const,
    title: "Overview",
    label: "Start Here",
    text: "Why I made this page and how the routes and planning tools fit together.",
    icon: Globe2,
  },
  {
    key: "asia" as const,
    title: "Asia 2026",
    label: "Main Route",
    text: "The China and Japan route I organized into a simple stop-by-stop layout.",
    icon: Plane,
  },
  {
    key: "northAmerica" as const,
    title: "North America",
    label: "City Notes",
    text: "A smaller collection of U.S. cities and Mexico City notes.",
    icon: MapPin,
  },
  {
    key: "tools" as const,
    title: "Planning Tools",
    label: "Try the Sliders",
    text: "Four small tools I made for pace, cost, time zones, and packing.",
    icon: BarChart3,
  },
];

const asiaStops: Stop[] = [
  {
    city: "Shanghai",
    country: "China",
    region: "China Route",
    note: "My starting point for the route. I wanted a big arrival city with strong transit, food, and skyline energy before moving inland.",
    tags: ["Arrival", "City", "Food", "Transit"],
  },
  {
    city: "Zhangjiajie",
    country: "China",
    region: "China Route",
    note: "This stop is about slowing down for the national park, mountain views, and a completely different pace from the larger cities.",
    tags: ["Mountains", "Nature", "Views", "Route Planning"],
  },
  {
    city: "Chongqing",
    country: "China",
    region: "China Route",
    note: "One of the cities I was most interested in because of the layered streets, night views, food, and how unusual the city looks to navigate.",
    tags: ["Megacity", "Food", "Night Views", "Urban"],
  },
  {
    city: "Jiuzhaigou",
    country: "China",
    region: "China Route",
    note: "I put this in as a scenic recovery stop with lakes, color, nature, and less city pressure.",
    tags: ["Nature", "Lakes", "Scenic", "Recovery"],
  },
  {
    city: "Beijing",
    country: "China",
    region: "China Route",
    note: "The history-heavy part of the China route, with major landmarks and the long-distance travel needed to close out that side of the trip.",
    tags: ["History", "Landmarks", "Transit", "Culture"],
  },
  {
    city: "Osaka",
    country: "Japan",
    region: "Japan Route",
    note: "I treated Osaka as the food and nightlife stop, plus an easy place to settle into Japan before moving between nearby cities.",
    tags: ["Food", "Nightlife", "Transit", "Shopping"],
  },
  {
    city: "Kyoto",
    country: "Japan",
    region: "Japan Route",
    note: "This is the slower walking section of the route: temples, shrines, Gion, Fushimi Inari, and Arashiyama.",
    tags: ["Temples", "Gion", "Shrines", "Walkable"],
  },
  {
    city: "Tokyo",
    country: "Japan",
    region: "Japan Route",
    note: "The busiest part of the itinerary, with food, shopping, games, character stores, neighborhoods, and late-night options.",
    tags: ["Shopping", "Games", "Food", "Metro"],
  },
  {
    city: "Hakone / Fuji",
    country: "Japan",
    region: "Japan Route",
    note: "I wanted a calmer break around the middle or end of the Japan route for an onsen, ryokan stay, and mountain views.",
    tags: ["Onsen", "Fuji", "Ryokan", "Recovery"],
  },
  {
    city: "Hiroshima",
    country: "Japan",
    region: "Japan Route",
    note: "A more reflective history stop that also adds a longer rail leg and a different pace from Tokyo or Osaka.",
    tags: ["History", "Rail", "Culture", "Day Trip"],
  },
];

const northAmericaStops: Stop[] = [
  {
    city: "Atlanta",
    country: "United States",
    region: "U.S. Cities",
    note: "A city note built around food, airport logistics, and how I would organize a short urban visit.",
    tags: ["U.S.", "Food", "City", "Airport"],
  },
  {
    city: "Chicago",
    country: "United States",
    region: "U.S. Cities",
    note: "The things I would build the visit around are architecture, the lakefront, transit, food, and skyline views.",
    tags: ["Architecture", "Food", "Lakefront", "Transit"],
  },
  {
    city: "New York City",
    country: "United States",
    region: "U.S. Cities",
    note: "A dense trip where the real planning problem is grouping neighborhoods, food, museums, and transit without wasting the day crossing the city.",
    tags: ["Transit", "Food", "Museums", "Neighborhoods"],
  },
  {
    city: "Philadelphia",
    country: "United States",
    region: "U.S. Cities",
    note: "A more compact East Coast stop with history, food, and a lot that can be organized around walking.",
    tags: ["History", "Walkable", "Food", "East Coast"],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    region: "International Cities",
    note: "A city I would plan around food, museums, neighborhoods, culture, and enough time to avoid turning it into a rushed checklist.",
    tags: ["International", "Food", "Culture", "Museums"],
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

function formatHour(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "PM" : "AM";
  const twelveHour = normalized % 12 === 0 ? 12 : normalized % 12;
  return `${twelveHour}:00 ${suffix}`;
}

function ProjectButton({
  href,
  children,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  const isInternal = href.startsWith("/");

  const className = subtle
    ? "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
    : "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
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
      className={`min-w-0 overflow-hidden rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <p className="truncate text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </p>

      <p
        className={`mt-2 break-words leading-tight ${
          accent
            ? "text-3xl font-black text-cyan-200"
            : "text-2xl font-black text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-cyan-300/20 bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function StopCard({ stop, index }: { stop: Stop; index: number }) {
  return (
    <div className={`${glassCard} relative overflow-hidden p-6`}>
      <div className="absolute right-5 top-4 text-5xl font-black text-cyan-300/10">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
          {stop.region}
        </p>

        <h3 className="mt-3 pr-12 text-2xl font-black text-white">
          {stop.city}
        </h3>

        <p className="mt-1 text-sm font-bold text-zinc-500">{stop.country}</p>

        <p className="mt-4 text-sm leading-7 text-zinc-300">{stop.note}</p>

        <TagList tags={stop.tags} />
      </div>
    </div>
  );
}

function ToolCard({
  title,
  label,
  icon: Icon,
  onReset,
  children,
}: ToolCardProps) {
  return (
    <div className={`${glassCard} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
            {label}
          </p>

          <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>
        </div>

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-6">{children}</div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-black text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
      >
        <RefreshCcw size={14} />
        Reset this tool
      </button>
    </div>
  );
}

function RangeInput({
  label,
  value,
  min,
  max,
  step = 1,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between gap-3 text-sm font-bold text-zinc-300">
        <span>{label}</span>
        <span className="text-cyan-300">
          {value}
          {suffix}
        </span>
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full accent-cyan-300"
      />
    </label>
  );
}

function ResultNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
        What this means
      </p>

      <p className="mt-2 text-sm leading-6 text-zinc-300">{children}</p>
    </div>
  );
}

export default function TravelPage() {
  const [activeMode, setActiveMode] = useState<TravelMode>("overview");

  const [tripDays, setTripDays] = useState(27);
  const [cityCount, setCityCount] = useState(10);
  const [travelDays, setTravelDays] = useState(8);
  const [restDays, setRestDays] = useState(3);

  const [dailyBudget, setDailyBudget] = useState(145);
  const [flightBudget, setFlightBudget] = useState(2200);
  const [bufferPercent, setBufferPercent] = useState(15);

  const [homeHour, setHomeHour] = useState(19);
  const [timezoneOffset, setTimezoneOffset] = useState(16);

  const [outfits, setOutfits] = useState(7);
  const [laundryDays, setLaundryDays] = useState(5);
  const [souvenirSpace, setSouvenirSpace] = useState(20);

  const allStops = [...asiaStops, ...northAmericaStops];

  const activeModeDetails =
    travelModes.find((mode) => mode.key === activeMode) ?? travelModes[0];

  const tripPace = useMemo(() => {
    const activeDays = Math.max(tripDays - travelDays, 1);
    const nightsPerCity = activeDays / Math.max(cityCount, 1);

    const paceScore = Math.round(
      clamp(nightsPerCity * 24 + restDays * 6 - travelDays * 2.5, 0, 100)
    );

    const paceLabel =
      paceScore >= 75
        ? "Comfortable"
        : paceScore >= 55
          ? "Balanced"
          : paceScore >= 35
            ? "Rushed"
            : "Too Rushed";

    return {
      activeDays,
      nightsPerCity: nightsPerCity.toFixed(1),
      paceScore,
      paceLabel,
    };
  }, [tripDays, cityCount, travelDays, restDays]);

  const tripPaceExplanation = useMemo(() => {
    if (tripPace.paceScore >= 75) {
      return `This leaves about ${tripPace.nightsPerCity} non-transit nights per city, so the route has room to breathe.`;
    }

    if (tripPace.paceScore >= 55) {
      return `This is workable at about ${tripPace.nightsPerCity} non-transit nights per city, but longer travel legs could still make a few stops feel short.`;
    }

    if (tripPace.paceScore >= 35) {
      return `At roughly ${tripPace.nightsPerCity} non-transit nights per city, the route is starting to feel rushed. I would cut a stop or add more days.`;
    }

    return `This only leaves about ${tripPace.nightsPerCity} non-transit nights per city. I would simplify the route before booking it.`;
  }, [tripPace.nightsPerCity, tripPace.paceScore]);

  const budgetForecast = useMemo(() => {
    const baseTotal = dailyBudget * tripDays + flightBudget;
    const buffer = baseTotal * (bufferPercent / 100);
    const total = baseTotal + buffer;

    return {
      baseTotal,
      buffer,
      total,
      averagePerDayWithFlights: total / tripDays,
    };
  }, [dailyBudget, tripDays, flightBudget, bufferPercent]);

  const budgetExplanation = useMemo(() => {
    return `The working total is ${formatMoney(
      budgetForecast.total
    )}. That includes ${formatMoney(
      budgetForecast.buffer
    )} set aside so one expensive travel day does not throw off the whole trip.`;
  }, [budgetForecast.buffer, budgetForecast.total]);

  const timezonePlanner = useMemo(() => {
    const destinationHour = ((homeHour + timezoneOffset) % 24 + 24) % 24;

    const callQuality =
      destinationHour >= 8 && destinationHour <= 22
        ? "Good call window"
        : destinationHour >= 6 && destinationHour <= 23
          ? "Possible, but awkward"
          : "Bad call window";

    return {
      destinationHour,
      callQuality,
    };
  }, [homeHour, timezoneOffset]);

  const timezoneExplanation = useMemo(() => {
    return `${formatHour(homeHour)} at home becomes ${formatHour(
      timezonePlanner.destinationHour
    )} at the destination. That makes it a ${timezonePlanner.callQuality.toLowerCase()}.`;
  }, [homeHour, timezonePlanner.callQuality, timezonePlanner.destinationHour]);

  const packingScore = useMemo(() => {
    const laundryPressure = laundryDays <= 3 ? 30 : laundryDays <= 5 ? 18 : 8;
    const outfitPressure = outfits > 10 ? 30 : outfits > 7 ? 18 : 8;
    const souvenirPressure =
      souvenirSpace < 10 ? 25 : souvenirSpace < 20 ? 14 : 5;

    const score = Math.round(
      clamp(100 - laundryPressure - outfitPressure - souvenirPressure, 0, 100)
    );

    const label =
      score >= 75
        ? "Light Pack"
        : score >= 55
          ? "Balanced"
          : score >= 35
            ? "Heavy"
            : "Overpacked";

    return {
      score,
      label,
    };
  }, [outfits, laundryDays, souvenirSpace]);

  const packingExplanation = useMemo(() => {
    if (packingScore.score >= 75) {
      return `This is a light setup with enough flexibility for laundry and about ${souvenirSpace}% of the bag left open.`;
    }

    if (packingScore.score >= 55) {
      return `This is a reasonable middle ground, but the bag may feel tight once purchases and weather changes are added.`;
    }

    return `This setup is getting heavy. I would cut outfits, plan laundry more carefully, or leave more room for the return trip.`;
  }, [packingScore.score, souvenirSpace]);

  function resetPace() {
    setTripDays(27);
    setCityCount(10);
    setTravelDays(8);
    setRestDays(3);
  }

  function resetBudget() {
    setDailyBudget(145);
    setFlightBudget(2200);
    setBufferPercent(15);
  }

  function resetTimezone() {
    setHomeHour(19);
    setTimezoneOffset(16);
  }

  function resetPacking() {
    setOutfits(7);
    setLaundryDays(5);
    setSouvenirSpace(20);
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} overflow-hidden p-6 md:p-10`}>
          <div className="relative">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
            <div className="absolute -bottom-28 left-1/3 h-56 w-56 rounded-full bg-fuchsia-400/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                <Plane size={15} />
                My Travel Map
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                The places I think about, plan around, and want to remember
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
                I wanted one part of the site to feel more personal. This page
                is where I organize routes, city notes, and the little planning
                problems I actually think about before a trip.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ProjectButton href="/projects">
                  View Projects <ExternalLink size={15} />
                </ProjectButton>

                <ProjectButton href="/data-lab" subtle>
                  Open Data Lab <ExternalLink size={15} />
                </ProjectButton>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatBox label="Asia Route" value={asiaStops.length} accent />
                <StatBox
                  label="North America"
                  value={northAmericaStops.length}
                />
                <StatBox label="Cities Listed" value={allStops.length} />
                <StatBox label="Planning Tools" value="4" />
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {travelModes.map((mode) => {
            const Icon = mode.icon;
            const active = activeMode === mode.key;

            return (
              <button
                key={mode.key}
                type="button"
                onClick={() => setActiveMode(mode.key)}
                aria-pressed={active}
                className={`group flex h-full flex-col text-left ${glassCard} p-6 ${
                  active
                    ? "border-cyan-300/60 bg-cyan-300/[0.11] shadow-[0_0_30px_rgba(34,211,238,0.14)]"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                      {mode.label}
                    </p>

                    <h2 className="mt-3 text-2xl font-black text-white">
                      {mode.title}
                    </h2>
                  </div>

                  <div
                    className={`rounded-2xl border p-3 ${
                      active
                        ? "border-cyan-200/60 bg-cyan-300 text-black"
                        : "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <p className="mt-4 flex-1 text-sm leading-6 text-zinc-300">
                  {mode.text}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                    {active ? "Currently Open" : "Open Model"}
                    <ArrowRight size={15} />
                  </span>

                  {active && (
                    <span className="rounded-full bg-cyan-400 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black">
                      Selected
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </section>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-4">
          <Sparkles className="mt-0.5 shrink-0 text-cyan-300" size={18} />

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
              Currently open
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {activeModeDetails.title}
            </p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {activeModeDetails.text}
            </p>
          </div>
        </div>

        {activeMode === "overview" && (
          <section className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Why I made this
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                I did not want the whole site to feel like a résumé
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
                Travel is one of the easiest ways for me to mix personal
                interests with the kind of interface work I like building. I
                get to organize places, route order, timing, cost, and the small
                choices that make a trip feel realistic.
              </p>

              <p className="mt-4 text-sm leading-7 text-zinc-400">
                The route notes are meant to be simple. The tools are there
                because I naturally turn planning problems into sliders,
                scores, and quick comparisons.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatBox label="China Route" value="5 stops" accent />
                <StatBox label="Japan Route" value="5 stops" />
                <StatBox label="U.S. Cities" value="4 stops" />
                <StatBox label="Mexico" value="1 stop" />
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                What I was testing
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Turning structured city data into reusable cards.",
                  "Keeping a route readable on both desktop and mobile.",
                  "Using state and derived values for practical planning tools.",
                  "Making a personal page feel connected to the rest of the portfolio.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm leading-6 text-zinc-300"
                  >
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeMode === "asia" && (
          <section className="mt-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  Asia 2026
                </p>

                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  China and Japan, stop by stop
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
                The numbers show the route order I used when laying out the
                itinerary.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {asiaStops.map((stop, index) => (
                <StopCard
                  key={`${stop.city}-${stop.country}`}
                  stop={stop}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {activeMode === "northAmerica" && (
          <section className="mt-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  City Notes
                </p>

                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  U.S. cities and Mexico City
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
                A smaller collection focused on how I would organize each city,
                not a generic list of attractions.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {northAmericaStops.map((stop, index) => (
                <StopCard
                  key={`${stop.city}-${stop.country}`}
                  stop={stop}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {activeMode === "tools" && (
          <section className="mt-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  How I plan trips
                </p>

                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  Four small tools I would actually use
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
                Move the sliders and the numbers, labels, and explanation update
                immediately.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <ToolCard
                title="Trip Pace"
                label="Route Planner"
                icon={Route}
                onReset={resetPace}
              >
                <div className="space-y-5">
                  <RangeInput
                    label="Trip Days"
                    value={tripDays}
                    min={3}
                    max={45}
                    onChange={setTripDays}
                  />
                  <RangeInput
                    label="City Count"
                    value={cityCount}
                    min={1}
                    max={18}
                    onChange={setCityCount}
                  />
                  <RangeInput
                    label="Transit Days"
                    value={travelDays}
                    min={0}
                    max={18}
                    onChange={setTravelDays}
                  />
                  <RangeInput
                    label="Rest Days"
                    value={restDays}
                    min={0}
                    max={12}
                    onChange={setRestDays}
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox
                    label="Pace Score"
                    value={`${tripPace.paceScore}/100`}
                    accent
                  />
                  <StatBox label="Pace" value={tripPace.paceLabel} />
                  <StatBox
                    label="Nights / City"
                    value={tripPace.nightsPerCity}
                  />
                </div>

                <ResultNote>{tripPaceExplanation}</ResultNote>
              </ToolCard>

              <ToolCard
                title="Budget Forecast"
                label="Cost Model"
                icon={DollarSign}
                onReset={resetBudget}
              >
                <div className="space-y-5">
                  <RangeInput
                    label="Daily Budget"
                    value={dailyBudget}
                    min={40}
                    max={350}
                    step={5}
                    suffix="/day"
                    onChange={setDailyBudget}
                  />
                  <RangeInput
                    label="Flight / Transit Budget"
                    value={flightBudget}
                    min={0}
                    max={5000}
                    step={100}
                    onChange={setFlightBudget}
                  />
                  <RangeInput
                    label="Buffer"
                    value={bufferPercent}
                    min={0}
                    max={40}
                    suffix="%"
                    onChange={setBufferPercent}
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox
                    label="Forecast"
                    value={formatMoney(budgetForecast.total)}
                    accent
                  />
                  <StatBox
                    label="Buffer"
                    value={formatMoney(budgetForecast.buffer)}
                  />
                  <StatBox
                    label="Avg / Day"
                    value={formatMoney(budgetForecast.averagePerDayWithFlights)}
                  />
                </div>

                <ResultNote>{budgetExplanation}</ResultNote>
              </ToolCard>

              <ToolCard
                title="Time Zone Call Planner"
                label="Schedule Logic"
                icon={Clock}
                onReset={resetTimezone}
              >
                <div className="space-y-5">
                  <RangeInput
                    label="Home Hour"
                    value={homeHour}
                    min={0}
                    max={23}
                    suffix=":00"
                    onChange={setHomeHour}
                  />
                  <RangeInput
                    label="Destination Offset"
                    value={timezoneOffset}
                    min={-18}
                    max={18}
                    suffix="h"
                    onChange={setTimezoneOffset}
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox label="Home" value={formatHour(homeHour)} />
                  <StatBox
                    label="Destination"
                    value={formatHour(timezonePlanner.destinationHour)}
                    accent
                  />
                  <StatBox label="Quality" value={timezonePlanner.callQuality} />
                </div>

                <ResultNote>{timezoneExplanation}</ResultNote>
              </ToolCard>

              <ToolCard
                title="Packing Load"
                label="Packing Logic"
                icon={Luggage}
                onReset={resetPacking}
              >
                <div className="space-y-5">
                  <RangeInput
                    label="Outfits Packed"
                    value={outfits}
                    min={2}
                    max={18}
                    onChange={setOutfits}
                  />
                  <RangeInput
                    label="Laundry Every"
                    value={laundryDays}
                    min={2}
                    max={14}
                    suffix=" days"
                    onChange={setLaundryDays}
                  />
                  <RangeInput
                    label="Souvenir Space"
                    value={souvenirSpace}
                    min={0}
                    max={40}
                    suffix="%"
                    onChange={setSouvenirSpace}
                  />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatBox
                    label="Pack Score"
                    value={`${packingScore.score}/100`}
                    accent
                  />
                  <StatBox label="Load" value={packingScore.label} />
                  <StatBox label="Souvenir Room" value={`${souvenirSpace}%`} />
                </div>

                <ResultNote>{packingExplanation}</ResultNote>
              </ToolCard>
            </div>
          </section>
        )}

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <div className="flex items-start gap-4">
            <CalendarDays className="mt-1 shrink-0 text-cyan-300" size={24} />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Why I put this here
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                It gives the portfolio some personality without becoming random
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
                This is still a technical page, but it is built around something
                I genuinely care about. The routes show structured data and
                reusable components. The tools show state, calculations, and
                responsive interface work. The personal side is what makes it
                feel like my site instead of a template.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Cabrera. Routes, notes, and planning experiments.
        </footer>
      </section>
    </main>
  );
}
