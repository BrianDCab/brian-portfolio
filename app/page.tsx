const featuredProjects = [
  {
    title: "Loyalty Campaign ROI Dashboard",
    status: "In Progress",
    tools: "SQL • Python • Power BI / Streamlit",
    description:
      "A synthetic casino marketing analytics project focused on campaign performance, redemption rates, customer segments, and ROI.",
  },
  {
    title: "Marketing Export Automation Tool",
    status: "In Progress",
    tools: "Python • Excel • CSV Automation",
    description:
      "A workflow tool that cleans campaign files, validates offer data, and generates structured exports for marketing operations.",
  },
  {
    title: "Customer Data Quality Audit Pipeline",
    status: "Planned",
    tools: "Python • SQL • Pandas",
    description:
      "A data quality project that detects duplicates, missing IDs, invalid emails, bad dates, and inconsistent customer records.",
  },
];

const gameProjects = [
  {
    title: "Trashfire Games",
    role: "Gameplay Programmer",
    tools: "C# • Unity • Gameplay Systems",
    description:
      "Worked on gameplay programming tasks, feature implementation, debugging, and interactive systems for game projects.",
  },
  {
    title: "Personal Game Projects",
    role: "Programmer",
    tools: "Unity • C# • Game Design",
    description:
      "Built and experimented with small gameplay prototypes focused on mechanics, player interaction, and technical problem-solving.",
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
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <section className="mx-auto max-w-6xl">
        {/* Navbar */}
        <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 shadow-[0_0_30px_rgba(34,211,238,0.08)] md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            Brian Dacell Cabrera<span className="text-cyan-300">.</span>
          </a>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
            <a className="transition hover:text-cyan-300" href="#projects">
              Projects
            </a>
            <a className="transition hover:text-cyan-300" href="#game-work">
              Game Work
            </a>
            <a className="transition hover:text-cyan-300" href="/playground">
              Playground
            </a>
            <a className="transition hover:text-cyan-300" href="#skills">
              Skills
            </a>
            <a className="transition hover:text-cyan-300" href="#about">
              About
            </a>
            <a className="transition hover:text-cyan-300" href="#contact">
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
            Data Analyst • Programmer • Automation Builder
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
            Brian Dacell Cabrera
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
            I build data tools, reports, and automation workflows that turn
            messy business data into clear insights, cleaner processes, and
            better decisions.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              View Projects
            </a>

            <a
              href="/resume"
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              Resume
            </a>

            <a
              href="https://github.com/BrianDCab"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
            >
              GitHub
            </a>
          </div>
        </section>

        {/* Main strengths */}
        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]">
            <h2 className="text-xl font-semibold text-white">
              SQL & Reporting
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Querying, cleaning, validating, and preparing business data for
              reports, dashboards, and campaign workflows.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]">
            <h2 className="text-xl font-semibold text-white">
              Python Automation
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Automating repetitive data tasks, file exports, quality checks,
              and business processes.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_25px_rgba(34,211,238,0.12)]">
            <h2 className="text-xl font-semibold text-white">
              Business Analytics
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Turning customer, marketing, and operational data into useful
              insights and decisions.
            </p>
          </div>
        </section>

        {/* Featured Projects */}
        <section id="projects" className="mt-20 scroll-mt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Portfolio
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Featured Data Projects
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Projects focused on data cleaning, business reporting, campaign
              analytics, automation, and practical decision-making.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => (
              <article
                key={project.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]"
              >
                <div className="mb-4 inline-flex rounded-full border border-cyan-300/40 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {project.status}
                </div>

                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-zinc-400">
                  {project.tools}
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {project.description}
                </p>

                <a
                  href="/projects"
                  className="mt-5 inline-block text-sm font-semibold text-cyan-300 transition group-hover:text-cyan-200"
                >
                  View case study →
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Game Programming Work */}
        <section id="game-work" className="mt-20 scroll-mt-10">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Past Work
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Game Programming Work
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Programming work focused on gameplay systems, debugging,
              interactive features, and creative technical problem-solving.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {gameProjects.map((project) => (
              <article
                key={project.title}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]"
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  {project.role}
                </p>

                <h3 className="mt-3 text-xl font-semibold text-white">
                  {project.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-zinc-400">
                  {project.tools}
                </p>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {project.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Playground Preview */}
        <section className="mt-20 rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.10)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Interactive Playground
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Browser-based experiments in logic, UI, and simulation.
          </h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300">
            I use the playground to build small interactive projects that
            demonstrate frontend state management, game logic, simulations, and
            practical programming concepts.
          </p>

          <a
            href="/playground"
            className="mt-8 inline-block rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
          >
            Visit Playground
          </a>
        </section>

        {/* Skills */}
        <section id="skills" className="mt-20 scroll-mt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Technical Toolkit
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">Skills</h2>

          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:border-cyan-300 hover:text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* About */}
        <section
          id="about"
          className="mt-20 scroll-mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 md:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            About Me
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            I like building practical systems.
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-zinc-300">
            I’m a Computer Science graduate with experience in database
            analysis, reporting automation, marketing campaign data, gameplay
            programming, and business analytics. I enjoy building tools that
            make messy workflows cleaner, faster, and easier to understand.
          </p>

          <p className="mt-4 max-w-3xl text-base leading-8 text-zinc-300">
            Outside of work, I enjoy travel, games, and learning how different
            systems — technical, cultural, and creative — fit together.
          </p>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="mt-20 scroll-mt-10 rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 text-center shadow-[0_0_45px_rgba(34,211,238,0.10)] md:p-10"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
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
              className="rounded-xl border border-zinc-600 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10"
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