const dataProjects = [
  {
    title: "Loyalty Campaign ROI Dashboard",
    status: "In Progress",
    tools: "SQL • Python • Power BI / Streamlit",
    description:
      "A synthetic casino marketing analytics project focused on campaign performance, redemption rates, customer segments, and return on investment.",
    highlights: [
      "Campaign redemption analysis",
      "Customer segmentation",
      "Offer performance tracking",
      "ROI and business insight reporting",
    ],
  },
  {
    title: "Marketing Export Automation Tool",
    status: "In Progress",
    tools: "Python • Excel • CSV Automation",
    description:
      "A workflow automation project that cleans campaign files, validates offer data, and generates structured exports for marketing operations.",
    highlights: [
      "Automated CSV generation",
      "Offer field validation",
      "Data cleaning workflow",
      "Reduced repetitive manual work",
    ],
  },
  {
    title: "Customer Data Quality Audit Pipeline",
    status: "Planned",
    tools: "Python • SQL • Pandas",
    description:
      "A data quality project designed to detect duplicates, missing IDs, invalid emails, bad dates, and inconsistent customer records.",
    highlights: [
      "Duplicate detection",
      "Missing field checks",
      "Invalid email validation",
      "Cleaned output report",
    ],
  },
];

const gameProjects = [
  {
    title: "Trashfire Games",
    status: "Past Work",
    tools: "C# • Unity • Gameplay Systems",
    description:
      "Gameplay programming work focused on feature implementation, debugging, interactive systems, and technical problem-solving.",
    highlights: [
      "Gameplay feature work",
      "Unity/C# programming",
      "Debugging and iteration",
      "Interactive system development",
    ],
  },
  {
    title: "Personal Game Prototypes",
    status: "Past Work",
    tools: "Unity • C# • Game Design",
    description:
      "Small gameplay prototypes and experiments focused on mechanics, player interaction, and creative programming practice.",
    highlights: [
      "Prototype development",
      "Player mechanics",
      "Game logic systems",
      "Creative technical design",
    ],
  },
];

const futureProjects = [
  {
    title: "Job Application Tracker with Authentication",
    status: "Planned",
    tools: "Next.js • Supabase Auth • PostgreSQL • Tailwind CSS",
    description:
      "A full-stack project where users can register, log in, save job applications, track statuses, and view dashboard statistics.",
    highlights: [
      "User registration and login",
      "Protected dashboard",
      "Database-backed job tracking",
      "Application status analytics",
    ],
  },
];

function ProjectCard({
  title,
  status,
  tools,
  description,
  highlights,
}: {
  title: string;
  status: string;
  tools: string;
  description: string;
  highlights: string[];
}) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]">
      <div className="mb-4 inline-flex rounded-full border border-cyan-300/40 px-3 py-1 text-xs font-semibold text-cyan-300">
        {status}
      </div>

      <h3 className="text-xl font-semibold text-white">{title}</h3>

      <p className="mt-2 text-sm font-medium text-zinc-400">{tools}</p>

      <p className="mt-4 text-sm leading-6 text-zinc-300">{description}</p>

      <ul className="mt-5 space-y-2 text-sm text-zinc-300">
        {highlights.map((highlight) => (
          <li key={highlight} className="flex gap-2">
            <span className="text-cyan-300">•</span>
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        {/* Navbar */}
        <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)] md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            Brian Dacell Cabrera<span className="text-cyan-300">.</span>
          </a>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
            <a className="transition hover:text-cyan-300" href="/">
              Home
            </a>
            <a className="transition hover:text-cyan-300" href="/#skills">
              Skills
            </a>
            <a className="transition hover:text-cyan-300" href="/#about">
              About
            </a>
            <a className="transition hover:text-cyan-300" href="/#contact">
              Contact
            </a>
            <a className="transition hover:text-cyan-300" href="/travel">
              Travel
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Portfolio Projects
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Practical projects built around data, automation, and programming.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            This page collects the technical projects I am building to show how
            I solve real business problems: cleaning data, automating workflows,
            building dashboards, analyzing campaigns, and developing software.
          </p>
        </section>

        {/* Data Projects */}
        <section className="mt-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Data & Analytics
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Featured Data Projects
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {dataProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Game Projects */}
        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Programming Work
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Game Programming Projects
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {gameProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        {/* Future Full-Stack Project */}
        <section className="mt-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Full-Stack Build
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Upcoming Authentication Project
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-1">
            {futureProjects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Dacell Cabrera.
        </footer>
      </section>
    </main>
  );
}