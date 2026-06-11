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
    label: "Trip Story",
    text: "A polished travel log showing route planning, city grouping, timeline logic, and personal context.",
    icon: Globe2,
  },
  {
    key: "asia" as const,
    title: "Asia 2026",
    label: "Major Route",
    text: "China and Japan route cards, city clusters, highlights, and travel-planning notes.",
    icon: Plane,
  },
  {
    key: "northAmerica" as const,
    title: "North America",
    label: "City Log",
    text: "U.S. cities and Mexico City organized into a clean travel collection.",
    icon: MapPin,
  },
  {
    key: "tools" as const,
    title: "Travel Tools",
    label: "Data Logic",
    text: "Small frontend calculators for trip pace, budget forecasting, time zones, and packing load.",
    icon: BarChart3,
  },
];

const asiaStops: Stop[] = [
  {
    city: "Shanghai",
    country: "China",
    region: "China Route",
    note: "Arrival city, skyline energy, food, transit, and first major landing point.",
    tags: ["Arrival", "City", "Food", "Transit"],
  },
  {
    city: "Zhangjiajie",
    country: "China",
    region: "China Route",
    note: "Mountain scenery, national park planning, nature routes, and high-impact visuals.",
    tags: ["Mountains", "Nature", "Views", "Route Planning"],
  },
  {
    city: "Chongqing",
    country: "China",
    region: "China Route",
    note: "Dense urban layout, food culture, night views, and layered city logistics.",
    tags: ["Megacity", "Food", "Night Views", "Urban"],
  },
  {
    city: "Jiuzhaigou",
    country: "China",
    region: "China Route",
    note: "Scenic landscape stop focused on lakes, color, nature, and slower pacing.",
    tags: ["Nature", "Lakes", "Scenic", "Recovery"],
  },
  {
    city: "Beijing",
    country: "China",
    region: "China Route",
    note: "History, major landmarks, long-distance transit, and route-closing logistics.",
    tags: ["History", "Landmarks", "Transit", "Culture"],
  },
  {
    city: "Osaka",
    country: "Japan",
    region: "Japan Route",
    note: "Food-heavy city stop, nightlife, shopping, and easy connection point.",
    tags: ["Food", "Nightlife", "Transit", "Shopping"],
  },
  {
    city: "Kyoto",
    country: "Japan",
    region: "Japan Route",
    note: "Temples, shrines, Gion, Fushimi Inari, Arashiyama, and slower visual storytelling.",
    tags: ["Temples", "Gion", "Shrines", "Walkable"],
  },
  {
    city: "Tokyo",
    country: "Japan",
    region: "Japan Route",
    note: "Dense itinerary hub for shopping, food, games, character stores, and late-night options.",
    tags: ["Shopping", "Games", "Food", "Metro"],
  },
  {
    city: "Hakone / Fuji",
    country: "Japan",
    region: "Japan Route",
    note: "Onsen, ryokan energy, mountain views, recovery pacing, and Fuji-area planning.",
    tags: ["Onsen", "Fuji", "Ryokan", "Recovery"],
  },
  {
    city: "Hiroshima",
    country: "Japan",
    region: "Japan Route",
    note: "History, day-trip potential, reflective pacing, and long-distance rail planning.",
    tags: ["History", "Rail", "Culture", "Day Trip"],
  },
];

const northAmericaStops: Stop[] = [
  {
    city: "Atlanta",
    country: "United States",
    region: "U.S. Cities",
    note: "Southern city stop with food, airport logistics, and urban exploration potential.",
    tags: ["U.S.", "Food", "City", "Airport"],
  },
  {
    city: "Chicago",
    country: "United States",
    region: "U.S. Cities",
    note: "Architecture, lakefront routes, city food, transit, and skyline views.",
    tags: ["Architecture", "Food", "Lakefront", "Transit"],
  },
  {
    city: "New York City",
    country: "United States",
    region: "U.S. Cities",
    note: "Dense city itinerary with neighborhoods, food, museums, and transit-heavy planning.",
    tags: ["Transit", "Food", "Museums", "Neighborhoods"],
  },
  {
    city: "Philadelphia",
    country: "United States",
    region: "U.S. Cities",
    note: "East Coast city stop with history, walkable planning, and food notes.",
    tags: ["History", "Walkable", "Food", "East Coast"],
  },
  {
    city: "Mexico City",
    country: "Mexico",
    region: "International Cities",
    note: "Major international city target with food, culture, museums, neighborhoods, and planning depth.",
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
      className={`rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
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

function StopCard({ stop }: { stop: Stop }) {
  return (
    <div className={`${glassCard} p-6`}>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
        {stop.region}
      </p>

      <h3 className="mt-3 text-2xl font-black text-white">{stop.city}</h3>

      <p className="mt-1 text-sm font-bold text-zinc-500">{stop.country}</p>

      <p className="mt-4 text-sm leading-6 text-zinc-300">{stop.note}</p>

      <TagList tags={stop.tags} />
    </div>
  );
}

function ToolCard({ title, label, children }: ToolCardProps) {
  return (
    <div className={`${glassCard} p-6`}>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-black text-white">{title}</h3>

      <div className="mt-6">{children}</div>
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

  const packingScore = useMemo(() => {
    const laundryPressure = laundryDays <= 3 ? 30 : laundryDays <= 5 ? 18 : 8;
    const outfitPressure = outfits > 10 ? 30 : outfits > 7 ? 18 : 8;
    const souvenirPressure = souvenirSpace < 10 ? 25 : souvenirSpace < 20 ? 14 : 5;

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

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <Plane size={15} />
            Travel Log
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            Routes, cities, and travel planning logic
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            A polished travel page that mixes personal route history with
            frontend data tools: trip pace scoring, budget forecasting, time
            zone planning, and packing-load logic.
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
            <StatBox label="Asia Stops" value={asiaStops.length} accent />
            <StatBox label="North America" value={northAmericaStops.length} />
            <StatBox label="Total Cities" value={allStops.length} />
            <StatBox label="Planning Tools" value="4" />
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
                className={`text-left ${glassCard} p-6 ${
                  active
                    ? "border-cyan-300/60 bg-cyan-300/[0.11] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
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

                  <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-3 text-cyan-200">
                    <Icon size={24} />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {mode.text}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                  Open section <ArrowRight size={15} />
                </div>
              </button>
            );
          })}
        </section>

        {activeMode === "overview" && (
          <section className="mt-12 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Overview
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                More than a travel scrapbook
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
                This page is designed like a route-planning interface. It shows
                city grouping, travel pacing, trip constraints, and small data
                tools that turn a personal page into a frontend portfolio piece.
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
                Portfolio Value
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Responsive card layouts and clean information architecture.",
                  "Structured city data mapped into reusable UI components.",
                  "Simple planning models for route pace, budget, time zones, and packing.",
                  "Personal storytelling that still supports a professional portfolio.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm leading-6 text-zinc-300"
                  >
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
                  China and Japan route
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
                A larger multi-country itinerary broken into cities, travel
                notes, and route categories.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {asiaStops.map((stop) => (
                <StopCard key={`${stop.city}-${stop.country}`} stop={stop} />
              ))}
            </div>
          </section>
        )}

        {activeMode === "northAmerica" && (
          <section className="mt-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  City Log
                </p>

                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  U.S. cities and Mexico City
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
                A cleaner city collection for North America stops and future
                travel notes.
              </p>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {northAmericaStops.map((stop) => (
                <StopCard key={`${stop.city}-${stop.country}`} stop={stop} />
              ))}
            </div>
          </section>
        )}

        {activeMode === "tools" && (
          <section className="mt-12">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  Travel Data Logic
                </p>

                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  Small planning apps
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
                These are intentionally simple, portfolio-friendly calculators
                that show state, derived values, and useful travel logic.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              <ToolCard title="Trip Pace Score" label="Route Planner">
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
              </ToolCard>

              <ToolCard title="Budget Forecast" label="Cost Model">
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
              </ToolCard>

              <ToolCard title="Time Zone Call Planner" label="Schedule Logic">
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
              </ToolCard>

              <ToolCard title="Packing Load Score" label="Packing Logic">
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
              </ToolCard>
            </div>
          </section>
        )}

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Why this belongs on the portfolio
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Personal page, but built like a data product.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            Travel gives the site personality, while the tools show reusable UI
            components, structured data, state management, derived metrics, and
            practical logic. It is not the main career proof, but it makes the
            portfolio feel more complete and memorable.
          </p>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Cabrera. Routes, notes, and experiments.
        </footer>
      </section>
    </main>
  );
}
