type Project = {
  title: string;
  category: string;
  description: string;
  highlights: string[];
  href?: string;
  cta?: string;
};

const featuredProjects: Project[] = [
  {
    title: "Data Visualization Lab",
    category: "Analytics Dashboard",
    description:
      "An interactive CSV dashboard that turns raw campaign-style data into readable charts, histograms, category counts, data quality metrics, and exportable reports.",
    highlights: [
      "CSV parsing",
      "Histogram generation",
      "Category bar charts",
      "Data quality scoring",
      "Summary statistics",
      "Report export",
    ],
    href: "/data-lab",
    cta: "Open Data Lab",
  },
  {
    title: "Interactive Analytics Playground",
    category: "React + TypeScript Demo",
    description:
      "A browser-based playground with blackjack simulation, Snake analytics, CSV quality checks, and weather activity scoring.",
    highlights: [
      "React state",
      "Game logic",
      "CSV exports",
      "Keyboard controls",
      "Mobile touch controls",
      "Dashboard metrics",
    ],
    href: "/playground",
    cta: "Open Playground",
  },
  {
    title: "Chaos Lab",
    category: "Frontend Interaction Lab",
    description:
      "A intentionally annoying UI experiment page with runaway buttons, cursed sliders, fake loading bars, bad autocorrect, and mobile-friendly nuisance interactions.",
    highlights: [
      "Mouse events",
      "Touch events",
      "Timers",
      "Dynamic positioning",
      "Controlled inputs",
      "Reusable components",
    ],
    href: "/chaos-lab",
    cta: "Open Chaos Lab",
  },
];

const professionalProjects: Project[] = [
  {
    title: "Casino Marketing Data Automation",
    category: "SQL + Excel + Campaign Operations",
    description:
      "Built workflow support for casino marketing campaigns, offer exports, kiosk promotions, direct mail lists, app targeting, and player segmentation.",
    highlights: [
      "Offer exports",
      "Player segmentation",
      "Campaign IDs",
      "Excel automation",
      "CSV workflows",
      "Data validation",
    ],
  },
  {
    title: "Active / Inactive Offer Export Automation",
    category: "VBA + Reporting Workflow",
    description:
      "Created repeatable export systems for monthly active and inactive player campaigns, separating offers by month, source system, and delivery format.",
    highlights: [
      "VBA automation",
      "Monthly exports",
      "Offer windows",
      "Oasis IDs",
      "App IDs",
      "Folder generation",
    ],
  },
  {
    title: "Entertainment Comps Comparison Report",
    category: "Data Matching + Reporting",
    description:
      "Compared entertainment comp data across multiple reporting sources to identify missing matches, mismatched event names, and reporting differences.",
    highlights: [
      "Fuzzy matching",
      "Comp comparison",
      "Event normalization",
      "Excel reporting",
      "Data cleanup",
      "Variance checks",
    ],
  },
  {
    title: "PURL Campaign Prototype",
    category: "Web + Campaign Personalization",
    description:
      "Built a prototype personalized URL workflow using campaign data, player identifiers, image links, PDFs, and dynamic web delivery concepts.",
    highlights: [
      "Personalized links",
      "Google Sheets data",
      "Campaign fields",
      "Dynamic content",
      "Cloudflare Worker concept",
      "Prototype delivery",
    ],
  },
];

const gameProjects: Project[] = [
  {
    title: "Gameplay Programmer — Trashfire Games",
    category: "Game Development",
    description:
      "Worked on gameplay programming tasks with a focus on interactive systems, player-facing logic, and implementation support.",
    highlights: [
      "Gameplay logic",
      "C#",
      "Unity",
      "Debugging",
      "Player systems",
      "Team development",
    ],
  },
  {
    title: "Blackjack Simulation Dashboard",
    category: "Game Logic + Analytics",
    description:
      "A playable blackjack tool that tracks session history, win rates, busts, blackjacks, streaks, and runs simulated hands for probability-style insight.",
    highlights: [
      "Card logic",
      "Aces handling",
      "Dealer rules",
      "Session analytics",
      "Simulation",
      "CSV export",
    ],
    href: "/playground",
    cta: "View in Playground",
  },
  {
    title: "Snake Analytics Game",
    category: "Game Input + Metrics",
    description:
      "A Snake game that tracks score, movement, turns, survival time, high score, and exports game-session data.",
    highlights: [
      "Keyboard input",
      "Touch input",
      "Local storage",
      "Collision detection",
      "Game loop",
      "CSV export",
    ],
    href: "/playground",
    cta: "View in Playground",
  },
];

function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <article
      className={`rounded-3xl border p-6 transition hover:-translate-y-1 ${
        featured
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_35px_rgba(34,211,238,0.10)]"
          : "border-zinc-800 bg-zinc-950 hover:border-cyan-300/40 hover:bg-zinc-900/70"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
        {project.category}
      </p>

      <h2 className="mt-4 text-2xl font-bold text-white">{project.title}</h2>

      <p className="mt-4 text-sm leading-7 text-zinc-400">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.highlights.map((highlight) => (
          <span
            key={highlight}
            className="rounded-full border border-zinc-700 bg-black/40 px-3 py-1 text-xs text-zinc-300"
          >
            {highlight}
          </span>
        ))}
      </div>

      {project.href && (
        <a
          href={project.href}
          className="mt-6 inline-flex rounded-xl border border-cyan-300/50 px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-300 hover:text-black"
        >
          {project.cta ?? "View Project"}
        </a>
      )}
    </article>
  );
}

export default function ProjectsPage() {
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
            <a className="text-cyan-300 transition hover:text-cyan-200" href="/projects">
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
            Projects
          </p>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-7xl">
            Data, automation, dashboards, games, and frontend experiments.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            A collection of professional systems, analytics tools, interactive
            demos, and programming projects showing how I turn messy workflows
            into readable, usable, and repeatable tools.
          </p>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Featured Work
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Interactive portfolio projects
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              These are the strongest public-facing pieces because they are
              live, visual, interactive, and easy for someone to test directly.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} featured />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Professional Systems
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Casino marketing, reporting, and automation work
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
              These projects represent the type of operational work I have done:
              campaign data, exports, reporting cleanup, offer logic, and
              workflow automation.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {professionalProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Game Development + Logic
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Interactive logic and gameplay projects
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
              These projects show programming fundamentals like state machines,
              rules, input handling, loops, collision detection, and live
              feedback.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {gameProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.08)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Best Project to Show Recruiters
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white">
            Data Visualization Lab
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
            The Data Visualization Lab is one of the strongest portfolio pieces
            because it is both technical and easy to understand. It shows CSV
            parsing, data quality checks, summary statistics, histograms,
            category aggregation, dynamic charts, TypeScript data modeling,
            React state, and dashboard design in one live project.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="/data-lab"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              Open Data Lab
            </a>

            <a
              href="/playground"
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Open Playground
            </a>
          </div>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera.
        </footer>
      </section>
    </main>
  );
}