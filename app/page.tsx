const featuredProjects = [
  {
    title: "Interactive Analytics Playground",
    label: "Live Demo",
    description:
      "A browser-based lab with blackjack simulation, snake game analytics, CSV quality checks, histogram generation, weather scoring, local storage, and CSV export workflows.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind", "CSV"],
    href: "/playground",
  },
  {
    title: "CSV Data Quality Analyzer",
    label: "Data Tool",
    description:
      "Uploads CSV files, detects missing cells, duplicate rows, numeric columns, quality score, and renders a histogram/distribution for selected numeric data.",
    stack: ["TypeScript", "CSV Parsing", "Data Profiling", "Visualization"],
    href: "/playground",
  },
  {
    title: "Casino Marketing Data Automation",
    label: "Professional Systems",
    description:
      "Workflow-focused data work involving campaign exports, player lists, offer validation, reporting, audit checks, and cleaner operational outputs.",
    stack: ["SQL", "Excel", "VBA", "Python", "Reporting"],
    href: "/projects",
  },
];

const strengths = [
  {
    title: "SQL & Reporting",
    description:
      "Querying, cleaning, validating, and preparing business data for reports, dashboards, campaign workflows, and decision-making.",
  },
  {
    title: "Python & Automation",
    description:
      "Automating repetitive data tasks, file exports, quality checks, reporting steps, and business processes.",
  },
  {
    title: "Business Analytics",
    description:
      "Turning customer, marketing, operational, and campaign data into useful insights, cleaner processes, and better decisions.",
  },
];

const skills = [
  "Python",
  "SQL",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Excel",
  "VBA",
  "Pandas",
  "Power BI",
  "GitHub",
  "Unity",
  "C#",
  "Data Cleaning",
  "Reporting",
  "Automation",
  "CSV Workflows",
];

function SkillBadge({ skill }: { skill: string }) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-300">
      {skill}
    </span>
  );
}

function ProjectCard({
  title,
  label,
  description,
  stack,
  href,
}: {
  title: string;
  label: string;
  description: string;
  stack: string[];
  href: string;
}) {
  return (
    <article className="group rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.05)] transition hover:border-cyan-300/50 hover:bg-zinc-900/70 hover:shadow-[0_0_45px_rgba(34,211,238,0.12)]">
      <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
        {label}
      </p>

      <h3 className="mt-3 text-2xl font-bold text-white">{title}</h3>

      <p className="mt-4 text-sm leading-7 text-zinc-400">{description}</p>

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

      <a
        href={href}
        className="mt-6 inline-flex text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200"
      >
        View project →
      </a>
    </article>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)] md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            Brian Dacell Cabrera<span className="text-cyan-300">.</span>
          </a>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
            <a className="text-cyan-300 transition" href="/">
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
            <a className="transition hover:text-cyan-300" href="#skills">
              Skills
            </a>
            <a className="transition hover:text-cyan-300" href="#contact">
              Contact
            </a>
          </div>
        </nav>

        <section className="rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Data Analyst • Programmer • Automation Builder
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-bold tracking-tight text-white md:text-7xl">
            Brian Dacell Cabrera
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            I build data tools, reports, dashboards, and automation workflows
            that turn messy business data into clear insights, cleaner
            processes, and better decisions.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/projects"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              View Projects
            </a>

            <a
              href="/playground"
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              Open Playground
            </a>

            <a
              href="https://github.com/BrianDCab"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              GitHub
            </a>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {strengths.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-cyan-300/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]"
            >
              <h2 className="text-xl font-semibold text-white">
                {item.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Featured Work
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Projects that show how I think.
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              My strongest work combines data quality, automation, reporting,
              practical programming, and business decision support.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Interactive Demo
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Analytics Playground
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              I built a live playground to demonstrate browser-based analytics,
              simulations, CSV parsing, histograms, game logic, local storage,
              and export workflows.
            </p>

            <a
              href="/playground"
              className="mt-6 inline-flex rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              Try the Playground
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                CSV Analyzer
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Uploads data, detects quality issues, identifies numeric
                columns, and visualizes distributions.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                Blackjack Simulator
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Tracks live session stats, win rates, busts, blackjacks,
                simulated hands, and exports CSV files.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                Snake Analytics
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Tracks high score, survival time, movement, turns, final length,
                and session history.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <p className="text-sm font-semibold text-cyan-300">
                Weather Scoring
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Turns weather inputs into outdoor, running, comfort, and travel
                decision scores.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" className="mt-20 scroll-mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Technical Toolkit
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Skills
          </h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <SkillBadge key={skill} skill={skill} />
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            About
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            I like building practical systems.
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300">
            I’m a Computer Science graduate with experience in database
            analysis, reporting automation, marketing campaign data, gameplay
            programming, and business analytics. I enjoy building tools that
            make messy workflows cleaner, faster, and easier to understand.
          </p>

          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Outside of work, I enjoy games, travel, and learning how different
            systems — technical, cultural, and creative — fit together.
          </p>
        </section>

        <section
          id="contact"
          className="mt-20 scroll-mt-10 rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 text-center shadow-[0_0_45px_rgba(34,211,238,0.10)] md:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
            Let’s connect.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
            I’m interested in data analyst, BI analyst, reporting analyst,
            automation, and programming roles where I can help teams work
            smarter with data.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:briandacellcabrera@gmail.com"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              Email Me
            </a>

            <a
              href="https://github.com/BrianDCab"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              GitHub
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