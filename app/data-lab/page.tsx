"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type CsvData = {
  headers: string[];
  rows: string[][];
  fileName: string;
};

type HistogramBin = {
  label: string;
  count: number;
};

type CategoryCount = {
  label: string;
  count: number;
};

const demoCsv = `PlayerID,Tier,AgeGroup,CampaignName,OfferAmount,FreePlayAmount,TheoWin,ActualWin,Visits,Redeemed
1001,Gold,35-44,June Free Play,50,25,340,280,7,Yes
1002,Silver,25-34,June Free Play,25,10,115,90,3,No
1003,Platinum,45-54,VIP Weekend,150,75,920,1100,12,Yes
1004,Bronze,21-24,New Member Offer,15,5,45,20,1,No
1005,Gold,55-64,Food Credit Push,60,20,410,360,8,Yes
1006,Silver,35-44,June Free Play,30,15,180,140,4,Yes
1007,Platinum,45-54,VIP Weekend,175,100,1200,980,15,Yes
1008,Bronze,25-34,New Member Offer,20,5,70,55,2,No
1009,Gold,35-44,Food Credit Push,75,25,500,610,9,Yes
1010,Silver,55-64,June Free Play,35,10,210,160,5,No
1011,Platinum,65+,VIP Weekend,200,100,1400,1500,18,Yes
1012,Bronze,21-24,New Member Offer,10,5,30,25,1,No
1013,Gold,45-54,June Free Play,80,30,560,490,10,Yes
1014,Silver,35-44,Food Credit Push,40,15,240,210,6,Yes
1015,Platinum,55-64,VIP Weekend,160,80,1000,870,13,Yes
1016,Bronze,25-34,New Member Offer,20,10,85,100,3,Yes
1017,Gold,65+,Food Credit Push,90,35,650,720,11,Yes
1018,Silver,45-54,June Free Play,45,20,310,260,6,No
1019,Platinum,35-44,VIP Weekend,140,70,880,940,12,Yes
1020,Bronze,21-24,New Member Offer,15,5,50,35,2,No`;

function parseCsvText(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      currentCell += '"';
      i += 1;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i += 1;
      }

      currentRow.push(currentCell.trim());
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
    } else {
      currentCell += char;
    }
  }

  currentRow.push(currentCell.trim());
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

function loadDemoData(): CsvData {
  const parsed = parseCsvText(demoCsv);
  const headers = parsed[0] ?? [];
  const rows = parsed.slice(1);

  return {
    headers,
    rows,
    fileName: "demo-casino-campaign-data.csv",
  };
}

function isNumeric(value: string) {
  return value.trim() !== "" && !Number.isNaN(Number(value));
}

function getMedian(values: number[]) {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
  }

  return sorted[middle] ?? 0;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function csvValue(value: string | number) {
  const stringValue = String(value);
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function downloadCsv(fileName: string, rows: Array<Array<string | number>>) {
  const csv = rows.map((row) => row.map(csvValue).join(",")).join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function StatCard({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: string | number;
  detail?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-zinc-800 bg-black/40"
      }`}
    >
      <p className="text-xs uppercase tracking-widest text-zinc-500">{label}</p>
      <p
        className={
          accent
            ? "mt-2 text-3xl font-black text-cyan-300"
            : "mt-2 text-2xl font-bold text-white"
        }
      >
        {value}
      </p>
      {detail && <p className="mt-2 text-xs text-zinc-500">{detail}</p>}
    </div>
  );
}

export default function DataLabPage() {
  const [csvData, setCsvData] = useState<CsvData>(() => loadDemoData());
  const [selectedNumericColumn, setSelectedNumericColumn] =
    useState("FreePlayAmount");
  const [selectedCategoryColumn, setSelectedCategoryColumn] = useState("Tier");
  const [error, setError] = useState("");

  const analysis = useMemo(() => {
    const { headers, rows } = csvData;

    const rowCount = rows.length;
    const columnCount = headers.length;

    let missingCells = 0;

    for (const row of rows) {
      for (let i = 0; i < columnCount; i++) {
        if (!row[i] || row[i].trim() === "") {
          missingCells += 1;
        }
      }
    }

    const seenRows = new Set<string>();
    let duplicateRows = 0;

    for (const row of rows) {
      const key = row.join("|").toLowerCase();

      if (seenRows.has(key)) {
        duplicateRows += 1;
      } else {
        seenRows.add(key);
      }
    }

    const numericColumns = headers.filter((_, columnIndex) => {
      const values = rows
        .map((row) => row[columnIndex] ?? "")
        .filter((value) => value.trim() !== "");

      if (values.length === 0) return false;

      const numericCount = values.filter(isNumeric).length;
      return numericCount / values.length >= 0.8;
    });

    const categoryColumns = headers.filter(
      (header) => !numericColumns.includes(header)
    );

    const totalCells = Math.max(rowCount * columnCount, 1);
    const missingRate = missingCells / totalCells;
    const duplicateRate = rowCount === 0 ? 0 : duplicateRows / rowCount;

    const qualityScore = Math.round(
      Math.max(0, Math.min(100, 100 - missingRate * 55 - duplicateRate * 35))
    );

    return {
      rowCount,
      columnCount,
      missingCells,
      duplicateRows,
      numericColumns,
      categoryColumns,
      qualityScore,
    };
  }, [csvData]);

  const numericColumn =
    selectedNumericColumn &&
    analysis.numericColumns.includes(selectedNumericColumn)
      ? selectedNumericColumn
      : analysis.numericColumns[0] ?? "";

  const categoryColumn =
    selectedCategoryColumn &&
    csvData.headers.includes(selectedCategoryColumn)
      ? selectedCategoryColumn
      : analysis.categoryColumns[0] ?? csvData.headers[0] ?? "";

  const numericStats = useMemo(() => {
    const columnIndex = csvData.headers.indexOf(numericColumn);

    const values =
      columnIndex === -1
        ? []
        : csvData.rows
            .map((row) => Number(row[columnIndex]))
            .filter((value) => !Number.isNaN(value));

    const min = values.length ? Math.min(...values) : 0;
    const max = values.length ? Math.max(...values) : 0;
    const average =
      values.length > 0
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : 0;
    const median = getMedian(values);

    return {
      values,
      min,
      max,
      average,
      median,
    };
  }, [csvData, numericColumn]);

  const histogram = useMemo(() => {
    const values = numericStats.values;

    if (values.length === 0) return [] as HistogramBin[];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const binCount = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(values.length))));
    const range = max - min || 1;
    const binSize = range / binCount;

    return Array.from({ length: binCount }, (_, index) => {
      const start = min + index * binSize;
      const end = index === binCount - 1 ? max : start + binSize;

      const count = values.filter((value) => {
        if (index === binCount - 1) {
          return value >= start && value <= end;
        }

        return value >= start && value < end;
      }).length;

      return {
        label: `${formatNumber(start)} - ${formatNumber(end)}`,
        count,
      };
    });
  }, [numericStats.values]);

  const categoryCounts = useMemo(() => {
    const columnIndex = csvData.headers.indexOf(categoryColumn);

    if (columnIndex === -1) return [] as CategoryCount[];

    const counts = new Map<string, number>();

    for (const row of csvData.rows) {
      const value = row[columnIndex]?.trim() || "Missing";
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }

    return [...counts.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [csvData, categoryColumn]);

  const histogramMax = Math.max(...histogram.map((bin) => bin.count), 1);
  const categoryMax = Math.max(...categoryCounts.map((item) => item.count), 1);

  function handleCsvUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = String(reader.result ?? "");
        const parsed = parseCsvText(text);

        if (parsed.length < 2) {
          setError("This CSV needs at least one header row and one data row.");
          return;
        }

        const headers = parsed[0] ?? [];
        const rows = parsed.slice(1);

        setCsvData({
          headers,
          rows,
          fileName: file.name,
        });

        setSelectedNumericColumn("");
        setSelectedCategoryColumn("");
      } catch {
        setError("Could not parse this CSV file.");
      }
    };

    reader.readAsText(file);
  }

  function exportReport() {
    downloadCsv("data-lab-report.csv", [
      ["Metric", "Value"],
      ["File Name", csvData.fileName],
      ["Rows", analysis.rowCount],
      ["Columns", analysis.columnCount],
      ["Missing Cells", analysis.missingCells],
      ["Duplicate Rows", analysis.duplicateRows],
      ["Numeric Columns", analysis.numericColumns.length],
      ["Quality Score", analysis.qualityScore],
      ["Selected Numeric Column", numericColumn],
      ["Minimum", numericStats.min],
      ["Maximum", numericStats.max],
      ["Average", numericStats.average],
      ["Median", numericStats.median],
      ["Selected Category Column", categoryColumn],
    ]);
  }

  function resetDemoData() {
    const demo = loadDemoData();
    setCsvData(demo);
    setSelectedNumericColumn("FreePlayAmount");
    setSelectedCategoryColumn("Tier");
    setError("");
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
            <a className="transition hover:text-cyan-300" href="/chaos-lab">
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
            Data Visualization Lab
          </p>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Turn raw CSV data into readable charts.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Upload a CSV or use the fake demo campaign dataset. This page finds
            numeric columns, builds a histogram, summarizes the data, counts
            categories, checks data quality, and exports a simple report.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <label className="cursor-pointer rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200">
              Upload CSV
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleCsvUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={resetDemoData}
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Reset Demo Data
            </button>

            <button
              onClick={exportReport}
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Export Report
            </button>
          </div>

          <p className="mt-5 text-sm text-zinc-400">
            Current file:{" "}
            <span className="font-semibold text-cyan-300">
              {csvData.fileName}
            </span>
          </p>

          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Rows" value={analysis.rowCount} />
          <StatCard label="Columns" value={analysis.columnCount} />
          <StatCard label="Missing Cells" value={analysis.missingCells} />
          <StatCard
            label="Quality Score"
            value={`${analysis.qualityScore}/100`}
            accent
          />
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_420px]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  Histogram
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Distribution of {numericColumn || "numeric values"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  A histogram groups numeric values into ranges so patterns,
                  outliers, and common value bands are easier to see.
                </p>
              </div>

              <select
                value={numericColumn}
                onChange={(event) => setSelectedNumericColumn(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              >
                {analysis.numericColumns.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 space-y-4">
              {histogram.map((bin) => (
                <div key={bin.label}>
                  <div className="mb-2 flex justify-between text-sm text-zinc-400">
                    <span>{bin.label}</span>
                    <span>{bin.count}</span>
                  </div>

                  <div className="h-6 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      style={{
                        width: `${(bin.count / histogramMax) * 100}%`,
                      }}
                      className="h-full rounded-full bg-cyan-300 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-cyan-400/20 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Numeric Summary
            </p>

            <div className="mt-5 grid gap-4">
              <StatCard
                label="Average"
                value={formatNumber(numericStats.average)}
              />
              <StatCard label="Median" value={formatNumber(numericStats.median)} />
              <StatCard label="Minimum" value={formatNumber(numericStats.min)} />
              <StatCard label="Maximum" value={formatNumber(numericStats.max)} />
            </div>
          </aside>
        </section>

        <section className="mt-10 grid gap-6 xl:grid-cols-[420px_minmax(0,1.4fr)]">
          <aside className="rounded-3xl border border-cyan-400/20 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Data Health
            </p>

            <div className="mt-5 grid gap-4">
              <StatCard label="Duplicate Rows" value={analysis.duplicateRows} />
              <StatCard
                label="Numeric Columns"
                value={analysis.numericColumns.length}
              />
              <StatCard
                label="Category Columns"
                value={analysis.categoryColumns.length}
              />
              <StatCard
                label="Selected Category"
                value={categoryColumn || "--"}
              />
            </div>
          </aside>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  Category Bar Chart
                </p>
                <h2 className="mt-3 text-3xl font-bold">
                  Counts by {categoryColumn || "category"}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
                  This bar chart makes categorical data readable by showing
                  which groups appear the most often.
                </p>
              </div>

              <select
                value={categoryColumn}
                onChange={(event) =>
                  setSelectedCategoryColumn(event.target.value)
                }
                className="rounded-xl border border-zinc-700 bg-black px-4 py-3 text-white outline-none transition focus:border-cyan-300"
              >
                {csvData.headers.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-8 space-y-4">
              {categoryCounts.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm text-zinc-400">
                    <span>{item.label}</span>
                    <span>{item.count}</span>
                  </div>

                  <div className="h-6 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      style={{
                        width: `${(item.count / categoryMax) * 100}%`,
                      }}
                      className="h-full rounded-full bg-cyan-300 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Portfolio Value
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            This shows data analytics and frontend skill at the same time.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
            This project demonstrates CSV parsing, data cleaning checks, dynamic
            chart generation, histograms, category aggregation, summary metrics,
            report export, TypeScript data modeling, React state, and responsive
            dashboard design.
          </p>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera.
        </footer>
      </section>
    </main>
  );
}