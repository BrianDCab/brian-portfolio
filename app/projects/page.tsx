const featuredProjects = [
  {
    title: "Interactive Analytics Playground",
    category: "Web App / Data Visualization",
    description:
      "A browser-based lab with blackjack simulation, snake game analytics, CSV quality analysis, histogram generation, weather scoring, local storage, and CSV export workflows.",
    impact:
      "Shows front-end engineering, TypeScript logic, state management, data transformation, and dashboard-style presentation.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "CSV Export"],
    href: "/playground",
  },
  {
    title: "Casino Marketing Data Automation",
    category: "Data Automation / Business Operations",
    description:
      "Built workflows for casino marketing data involving player lists, campaign exports, offer validation, app offers, kiosk offers, and reporting automation.",
    impact:
      "Helped turn high-volume campaign data into cleaner, more reliable outputs for marketing and operational decisions.",
    stack: ["SQL", "Excel", "VBA", "Python", "Crystal Reports", "CSV"],
    href: "#casino-automation",
  },
  {
    title: "CSV Data Quality Analyzer",
    category: "Data Quality / Analytics Tool",
    description:
      "A portfolio tool that reads uploaded CSV files, detects missing cells, duplicate rows, numeric columns, quality scores, and renders a histogram for numeric distributions.",
    impact:
      "Demonstrates practical analyst skills: profiling raw data, identifying quality issues, and turning files into quick insights.",
    stack: ["TypeScript", "CSV Parsing", "Data Profiling", "Histogram Logic"],
    href: "/playground",
  },
];

const professionalProjects = [
  {
    title: "Active / Inactive Offer Export Automation",
    description:
      "Created repeatable export workflows for monthly casino campaign files, including active and inactive player offer groups, valid windows, player identifiers, and campaign-ready CSV outputs.",
    stack: ["VBA", "Excel", "CSV", "Data Validation"],
  },
  {
    title: "Entertainment Comps Comparison Report",
    description:
      "Worked on comparing event, comp, RSVP, and attendance-related data across multiple sources to identify mismatches and support cleaner reporting.",
    stack: ["Excel", "Reporting", "Data Matching", "Analysis"],
  },
  {
    title: "PURL Campaign Prototype",
    description:
      "Built a prototype for personalized campaign links using spreadsheet data, generated personalized URLs, and explored automated creative/PDF injection workflows.",
    stack: ["Cloudflare Worker", "Google Sheets", "JavaScript", "CSV"],
  },
  {
    title: "SpeedMedia Promotions Testing",
    description:
      "Documented and tested casino floor promotion features, including card-in behavior, point accumulation, random reward behavior, display orientations, and campaign testing limitations.",
    stack: ["QA Testing", "Technical Documentation", "Promotions", "Reporting"],
  },
];

const gameProjects = [
  {
    title: "Gameplay Programmer — Trashfire Games",
    description:
      "Worked on gameplay programming tasks in a remote development environment, contributing to interactive systems and gameplay-focused implementation.",
    stack: ["Gameplay Programming", "C#", "Unity", "Game Systems"],
  },
  {
    title: "Blackjack Simulation Dashboard",
    description:
      "Built blackjack game logic with dealer rules, ace handling, win/loss/push detection, live session stats, simulation stats, and CSV export.",
    stack: ["React", "TypeScript", "Simulation", "Analytics"],
  },
  {
    title: "Snake Analytics Game",
    description:
      "Built a playable Snake game with keyboard input, persistent high score, survival timer, movement tracking, turn tracking, and CSV export.",
    stack: ["React", "TypeScript", "Local Storage", "Game Logic"],
  },
];

function ProjectCard({
  title,
  category,
  description,
  impact,
  stack,
  href,
}: {
  title: string;
  category?: string;
  description: string;
  impact?: string;
  stack: string[];
  href?: string;
}) {
  return (
    <div className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.05)] transition hover:border-cyan-300/50 hover:bg-zinc-900/70 hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
      {category && (
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
          {category}
        </p>
      )}

      <h3 className="mt-3 text-2xl font-bold text-white">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>

      {impact && (
        <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/5 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
            Why it matters
          </p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{impact}</p>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {stack.map((item) => (
          <span
            key={item}
            className="rounded-full border border-zinc-700 bg-black/40 px-3 py-1 text-xs text-zinc-300"
          >
            {item}
          </span>
        ))}
      </div>

      {href && (
        <a
          href={href}
          className="mt-6 inline-flex rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-300"
        >
          View Project
        </a>
      )}
    </div>
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
            <a className="text-cyan-300 transition" href="/projects">
              Projects
            </a>
            <a className="transition hover:text-cyan-300" href="/#skills">
              Skills
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
            Projects
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-bold tracking-tight text-white md:text-7xl">
            Data tools, automation workflows, games, and interactive analytics.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            A collection of projects that show how I work with messy data,
            business processes, reporting systems, programming logic, and user
            interfaces. My strongest work combines data analysis, automation,
            validation, and practical decision-making.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/playground"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              Open Playground
            </a>

            <a
              href="https://github.com/BrianDCab"
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              GitHub
            </a>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Featured Work
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Portfolio-ready projects
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              These are the projects I would point recruiters to first because
              they show real technical range: analytics, automation, UI,
              TypeScript, data quality, and business logic.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        <section
          id="casino-automation"
          className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8"
        >
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Professional Systems
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Data automation and business reporting
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Work inspired by real business data problems: repeated exports,
              data validation, campaign preparation, reconciliation, reporting,
              and quality control.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {professionalProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                stack={project.stack}
              />
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Game Development
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Gameplay, simulations, and interactive systems
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              I like building interactive systems because they make logic easy
              to see. Games are a strong way to demonstrate state management,
              event handling, rules, scoring, and analytics.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {gameProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                description={project.description}
                stack={project.stack}
              />
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Strength
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Data validation
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              I focus on checking outputs, catching mismatches, and making sure
              data is reliable before it supports decisions.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Strength
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Automation mindset
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              I look for repeated manual work and turn it into cleaner workflows,
              repeatable exports, and reusable tools.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Strength
            </p>
            <h3 className="mt-3 text-2xl font-bold text-white">
              Business translation
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              I like connecting technical work to practical outcomes: cleaner
              campaigns, better reports, faster checks, and clearer decisions.
            </p>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 text-center shadow-[0_0_35px_rgba(34,211,238,0.07)]">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Next
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white">
            Want to see the interactive version?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
            The playground page turns several of these ideas into working
            browser demos with live stats, generated CSV files, and dashboard
            views.
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href="/playground"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              View Interactive Playground
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