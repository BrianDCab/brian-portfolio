"use client";

import { useMemo, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  CloudSun,
  DollarSign,
  ExternalLink,
  FileText,
  Gauge,
  Upload,
} from "lucide-react";

type RowData = Record<string, string>;

function createSampleRows(): RowData[] {
  const tiers = ["Base", "Bronze", "Silver", "Gold", "Platinum", "VIP"];

  return Array.from({ length: 130 }, (_, index) => {
    const playerNumber = 1001 + index;
    const tier = tiers[index % tiers.length];

    const netADT = Math.min(
      1000,
      Math.round(((index * 47) % 1001) + (index % 7) * 13)
    );

    const trips = 1 + ((index * 3) % 28);
    const theo = Math.round(netADT * (0.75 + (index % 5) * 0.08));
    const offer = Math.max(5, Math.round(netADT * 0.12 + trips * 1.5));

    return {
      PlayerID: String(playerNumber),
      Tier: tier,
      "Net ADT": String(netADT),
      "# Trips": String(trips),
      Theo: String(theo),
      Offer: String(offer),
    };
  });
}

const sampleRows: RowData[] = createSampleRows();

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

function parseCSV(text: string): RowData[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((header) => header.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const row: RowData = {};

    headers.forEach((header, index) => {
      row[header || `Column ${index + 1}`] = values[index] ?? "";
    });

    return row;
  });
}

function toNumber(value: string) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function isMetricColumn(column: string) {
  const lower = column.toLowerCase();

  return !(
    lower === "id" ||
    lower.includes("playerid") ||
    lower.includes("player id") ||
    lower.includes("universalid") ||
    lower.includes("universal id") ||
    lower.endsWith("id")
  );
}

function isMoneyLikeMetric(metric: string) {
  const lower = metric.toLowerCase();

  return (
    lower.includes("adt") ||
    lower.includes("theo") ||
    lower.includes("offer") ||
    lower.includes("amount") ||
    lower.includes("value")
  );
}

function formatMetricValue(metric: string, value: number) {
  if (isMoneyLikeMetric(metric)) {
    return `$${Math.round(value).toLocaleString()}`;
  }

  return Math.round(value).toLocaleString();
}

function formatRangeLabel(metric: string, start: number, end: number) {
  if (isMoneyLikeMetric(metric)) {
    return `$${Math.round(start).toLocaleString()}–$${Math.round(
      end
    ).toLocaleString()}`;
  }

  return `${Math.round(start).toLocaleString()}–${Math.round(
    end
  ).toLocaleString()}`;
}

function DataButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const isInternal = href.startsWith("/");
  const isEmail = href.startsWith("mailto:");

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer"}
    >
      {children}
    </a>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
    >
      {children}
    </button>
  );
}

export default function DataLabPage() {
  const [rows, setRows] = useState<RowData[]>(sampleRows);
  const [selectedMetric, setSelectedMetric] = useState("Net ADT");
  const [betAmount, setBetAmount] = useState(25);
  const [winChance, setWinChance] = useState(42);
  const [temperature, setTemperature] = useState(72);
  const [rainChance, setRainChance] = useState(15);
  const [windSpeed, setWindSpeed] = useState(8);

  const columns = useMemo(() => {
    const first = rows[0] ?? {};
    return Object.keys(first);
  }, [rows]);

  const numericColumns = useMemo(() => {
    return columns.filter(
      (column) =>
        isMetricColumn(column) &&
        rows.some(
          (row) => row[column] !== "" && !Number.isNaN(Number(row[column]))
        )
    );
  }, [columns, rows]);

  const activeMetric = numericColumns.includes(selectedMetric)
    ? selectedMetric
    : numericColumns[0] ?? "";

  const metricValues = useMemo(() => {
    if (!activeMetric) return [];

    return rows
      .map((row) => Number(row[activeMetric]))
      .filter((value) => Number.isFinite(value));
  }, [activeMetric, rows]);

  const metricStats = useMemo(() => {
    if (metricValues.length === 0) {
      return {
        average: 0,
        min: 0,
        max: 0,
      };
    }

    const total = metricValues.reduce((sum, value) => sum + value, 0);

    return {
      average: Math.round(total / metricValues.length),
      min: Math.min(...metricValues),
      max: Math.max(...metricValues),
    };
  }, [metricValues]);

  const chartData = useMemo(() => {
    if (!activeMetric) return [];

    return rows.slice(0, 12).map((row, index) => ({
      label: `Player ${row.PlayerID || row.ID || index + 1}`,
      value: toNumber(row[activeMetric]),
    }));
  }, [activeMetric, rows]);

  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);

  const histogramData = useMemo(() => {
    if (!activeMetric) return [];

    const values = rows
      .map((row) => Number(row[activeMetric]))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) return [];

    const min = Math.floor(Math.min(...values));
    const max = Math.ceil(Math.max(...values));

    if (min === max) {
      return [
        {
          label: formatRangeLabel(activeMetric, min, max),
          count: values.length,
        },
      ];
    }

    const bucketCount = Math.min(8, Math.max(5, Math.ceil(Math.sqrt(values.length))));
    const bucketSize = Math.max(1, Math.ceil((max - min + 1) / bucketCount));

    const buckets = Array.from({ length: bucketCount }, (_, index) => {
      const start = min + index * bucketSize;
      const end = Math.min(max, start + bucketSize - 1);

      return {
        start,
        end,
        label: formatRangeLabel(activeMetric, start, end),
        count: 0,
      };
    }).filter((bucket) => bucket.start <= max);

    values.forEach((value) => {
      const index = Math.min(
        buckets.length - 1,
        Math.floor((value - min) / bucketSize)
      );

      buckets[index].count += 1;
    });

    return buckets;
  }, [activeMetric, rows]);

  const maxHistogramCount = Math.max(
    ...histogramData.map((bucket) => bucket.count),
    1
  );

  const strongestBucket = useMemo(() => {
    if (histogramData.length === 0) return null;

    return histogramData.reduce((best, bucket) =>
      bucket.count > best.count ? bucket : best
    );
  }, [histogramData]);

  const qualityStats = useMemo(() => {
    const totalCells = rows.length * Math.max(columns.length, 1);

    const emptyCells = rows.reduce((count, row) => {
      return (
        count +
        columns.filter((column) => String(row[column] ?? "").trim() === "").length
      );
    }, 0);

    const duplicateIds =
      columns.includes("PlayerID") || columns.includes("ID")
        ? rows.length -
          new Set(rows.map((row) => row.PlayerID || row.ID).filter(Boolean)).size
        : 0;

    const completeness =
      totalCells === 0
        ? 100
        : Math.round(((totalCells - emptyCells) / totalCells) * 100);

    return {
      players: rows.length,
      columns: columns.length,
      emptyCells,
      duplicateIds: Math.max(duplicateIds, 0),
      completeness,
    };
  }, [columns, rows]);

  const scoring = useMemo(() => {
    const expectedValue = betAmount * (winChance / 100);
    const riskScore = Math.round((betAmount * (100 - winChance)) / 100);
    const confidence =
      winChance >= 65 ? "High" : winChance >= 40 ? "Medium" : "Low";

    return {
      expectedValue: expectedValue.toFixed(2),
      riskScore,
      confidence,
    };
  }, [betAmount, winChance]);

  const weatherScore = useMemo(() => {
    let score = 100;

    if (temperature > 90) score -= 18;
    if (temperature < 50) score -= 14;
    score -= Math.round(rainChance * 0.35);
    score -= Math.round(windSpeed * 0.8);

    return Math.max(0, Math.min(100, score));
  }, [temperature, rainChance, windSpeed]);

  function handleCSVUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const text = String(reader.result ?? "");
      const parsed = parseCSV(text);

      if (parsed.length > 0) {
        setRows(parsed);

        const firstNumericMetric = Object.keys(parsed[0]).find(
          (column) =>
            isMetricColumn(column) &&
            parsed.some((row) => !Number.isNaN(Number(row[column])))
        );

        if (firstNumericMetric) setSelectedMetric(firstNumericMetric);
      }
    };

    reader.readAsText(file);
  }

  function resetSampleData() {
    setRows(sampleRows);
    setSelectedMetric("Net ADT");
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={`${glassPanel} p-6 md:p-10`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <BarChart3 size={15} />
              Data Lab
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              CSV, charts, scoring, and analyst tools
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
              A live data playground for uploading CSV files, checking data
              quality, charting player metrics, and testing simple scoring
              logic.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <DataButton href="/projects">
                View Projects <ExternalLink size={15} />
              </DataButton>

              <DataButton href="/security-lab">
                Open Security Lab <ExternalLink size={15} />
              </DataButton>
            </div>
          </div>

          <div className={`${glassPanel} p-6 md:p-8`}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Dataset
            </p>

            <h2 className="mt-4 text-3xl font-black text-white">
              130 sample players
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              The sample data includes PlayerID, Tier, Net ADT, # Trips, Theo,
              and Offer. Upload your own CSV or reset back to the demo data.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300">
                <Upload size={16} />
                Upload CSV
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
              </label>

              <GhostButton onClick={resetSampleData}>
                <FileText size={16} />
                Reset Sample Data
              </GhostButton>
            </div>
          </div>
        </div>

        <section className="mt-12 grid gap-5 md:grid-cols-4">
          <div className={`${glassCard} p-6`}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Players
            </p>
            <div className="mt-3 text-4xl font-black text-white">
              {qualityStats.players}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Columns
            </p>
            <div className="mt-3 text-4xl font-black text-white">
              {qualityStats.columns}
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Complete
            </p>
            <div className="mt-3 text-4xl font-black text-white">
              {qualityStats.completeness}%
            </div>
          </div>

          <div className={`${glassCard} p-6`}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
              Empty Cells
            </p>
            <div className="mt-3 text-4xl font-black text-white">
              {qualityStats.emptyCells}
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-[2rem] border border-cyan-300/20 bg-cyan-950/[0.14] p-6 shadow-2xl shadow-black/20 backdrop-blur-md md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Current Story
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Reading {activeMetric}
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
                The bar chart compares individual players. The histogram groups
                all {qualityStats.players} players into ranges so you can see
                where the group is concentrated.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Average
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {formatMetricValue(activeMetric, metricStats.average)}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Low
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {formatMetricValue(activeMetric, metricStats.min)}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  High
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {formatMetricValue(activeMetric, metricStats.max)}
                </p>
              </div>
            </div>
          </div>

          {strongestBucket && (
            <p className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm leading-6 text-zinc-300">
              Most players are currently in the{" "}
              <span className="font-bold text-cyan-200">
                {strongestBucket.label}
              </span>{" "}
              range, with{" "}
              <span className="font-bold text-cyan-200">
                {strongestBucket.count} players
              </span>{" "}
              in that bucket.
            </p>
          )}
        </section>

        <section className="mt-12 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
          <div className={`${glassPanel} p-6 md:p-8`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                  Bar Chart
                </p>

                <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                  {activeMetric} by player
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
                  Each row is one player. The number on the right is that
                  player&apos;s selected metric value.
                </p>
              </div>

              <select
                value={activeMetric}
                onChange={(event) => setSelectedMetric(event.target.value)}
                className="rounded-full border border-cyan-300/25 bg-black/40 px-4 py-3 text-sm font-bold text-cyan-100 outline-none"
              >
                {numericColumns.map((column) => (
                  <option key={column} value={column} className="bg-black">
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 space-y-4">
              {chartData.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2 md:grid-cols-[120px_1fr_90px] md:items-center"
                >
                  <div className="truncate text-sm font-bold text-zinc-300">
                    {item.label}
                  </div>

                  <div className="h-4 overflow-hidden rounded-full border border-cyan-300/20 bg-black/30">
                    <div
                      className="h-full rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                      style={{
                        width: `${Math.max(
                          (item.value / maxChartValue) * 100,
                          4
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="text-sm font-black text-cyan-200 md:text-right">
                    {formatMetricValue(activeMetric, item.value)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Histogram
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Player count by {activeMetric} range
              </h2>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                Each bar shows how many players fall inside that non-overlapping
                value range.
              </p>

              <div className="mt-8 overflow-x-auto">
                <div className="flex h-72 min-w-[520px] items-end gap-3 rounded-3xl border border-cyan-300/15 bg-black/20 p-4">
                  {histogramData.map((bucket) => (
                    <div
                      key={bucket.label}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    >
                      <div className="text-center text-[11px] font-black leading-4 text-cyan-200">
                        {bucket.count}
                        <br />
                        players
                      </div>

                      <div
                        className="w-full rounded-t-2xl border border-cyan-300/30 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.35)]"
                        style={{
                          height: `${Math.max(
                            (bucket.count / maxHistogramCount) * 100,
                            8
                          )}%`,
                        }}
                      />

                      <div className="h-12 text-center text-[10px] font-bold leading-4 text-zinc-400">
                        {bucket.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <GhostButton onClick={resetSampleData}>
                  <FileText size={16} />
                  Reset Histogram Data
                </GhostButton>
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Quality Check
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Quick audit
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 text-cyan-300" size={20} />
                  <p className="text-sm leading-6 text-zinc-300">
                    Dataset has {qualityStats.players} players and{" "}
                    {qualityStats.columns} columns.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-1 text-cyan-300" size={20} />
                  <p className="text-sm leading-6 text-zinc-300">
                    Found {qualityStats.emptyCells} empty cells and{" "}
                    {qualityStats.duplicateIds} possible duplicate IDs.
                  </p>
                </div>
              </div>

              <div className="mt-7">
                <DataButton href="/projects">
                  Add to Portfolio <ExternalLink size={15} />
                </DataButton>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className={`${glassPanel} p-6 md:p-8`}>
            <div className="flex items-center gap-3">
              <DollarSign className="text-cyan-300" size={24} />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Bet / Scoring Model
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-black text-white">
              Simple risk score
            </h2>

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-bold text-zinc-300">
                  Bet Amount: ${betAmount}
                </span>
                <input
                  type="range"
                  min="5"
                  max="250"
                  value={betAmount}
                  onChange={(event) => setBetAmount(Number(event.target.value))}
                  className="w-full"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-bold text-zinc-300">
                  Win Chance: {winChance}%
                </span>
                <input
                  type="range"
                  min="1"
                  max="99"
                  value={winChance}
                  onChange={(event) => setWinChance(Number(event.target.value))}
                  className="w-full"
                />
              </label>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  EV
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  ${scoring.expectedValue}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Risk
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {scoring.riskScore}
                </p>
              </div>

              <div className="rounded-2xl border border-cyan-300/20 bg-black/25 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                  Confidence
                </p>
                <p className="mt-2 text-2xl font-black text-white">
                  {scoring.confidence}
                </p>
              </div>
            </div>

            <div className="mt-7">
              <DataButton href="/security-lab">
                Connect to Secure App Later <ExternalLink size={15} />
              </DataButton>
            </div>
          </div>

          <div className={`${glassPanel} p-6 md:p-8`}>
            <div className="flex items-center gap-3">
              <CloudSun className="text-cyan-300" size={24} />
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Weather Analyzer
              </p>
            </div>

            <h2 className="mt-4 text-3xl font-black text-white">
              Event comfort score
            </h2>

            <div className="mt-7 space-y-5">
              <label className="block space-y-2">
                <span className="text-sm font-bold text-zinc-300">
                  Temperature: {temperature}°F
                </span>
                <input
                  type="range"
                  min="30"
                  max="110"
                  value={temperature}
                  onChange={(event) => setTemperature(Number(event.target.value))}
                  className="w-full"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-zinc-300">
                  Rain Chance: {rainChance}%
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainChance}
                  onChange={(event) => setRainChance(Number(event.target.value))}
                  className="w-full"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-bold text-zinc-300">
                  Wind: {windSpeed} mph
                </span>
                <input
                  type="range"
                  min="0"
                  max="45"
                  value={windSpeed}
                  onChange={(event) => setWindSpeed(Number(event.target.value))}
                  className="w-full"
                />
              </label>
            </div>

            <div className="mt-7 rounded-2xl border border-cyan-300/20 bg-black/25 p-5">
              <div className="flex items-center gap-3">
                <Gauge className="text-cyan-300" size={22} />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
                    Comfort Score
                  </p>
                  <p className="mt-1 text-4xl font-black text-white">
                    {weatherScore}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7">
              <DataButton href="/travel">
                Open Travel Page <ExternalLink size={15} />
              </DataButton>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}