import Link from "next/link";
import {
  BarChart3,
  Code2,
  Database,
  ExternalLink,
  Gamepad2,
  Plane,
  Shield,
  Sparkles,
} from "lucide-react";

const featuredProjects = [
  {
    title: "Data Lab",
    href: "/data-lab",
    label: "Analytics Tool",
    text: "CSV review, data quality checks, charts, scoring ideas, and analyst-style workflows.",
    icon: BarChart3,
    tags: ["CSV", "Charts", "Data QA", "Analytics"],
  },
  {
    title: "Security Lab",
    href: "/security-lab",
    label: "Auth & Safe Keys",
    text: "Planned demo for registration, login, protected routes, and server-side secrets.",
    icon: Shield,
    tags: ["Auth", "Sessions", "Server Secrets", "Security"],
  },
  {
    title: "Playground",
    href: "/playground",
    label: "Interactive Builds",
    text: "Browser experiments with React state, game logic, and UI interaction.",
    icon: Gamepad2,
    tags: ["React", "TypeScript", "Games", "UI"],
  },
  {
    title: "Chaos Lab",
    href: "/chaos-lab",
    label: "UI Experiments",
    text: "A small lab for testing motion, browser behavior, and intentionally strange interfaces.",
    icon: Sparkles,
    tags: ["Motion", "UI", "Events", "Web APIs"],
  },
];

const professionalWork = [
  {
    title: "Casino Offer & Campaign Reporting",
    text: "Built workflows for offer exports, validations, and reporting across player groups, campaign data, and operational lists.",
    tags: ["SQL", "Excel", "Reporting", "Data Validation"],
  },
  {
    title: "Automation & Audit Scripts",
    text: "Created scripts and checks to reduce manual review, catch mismatches, and make repeated processes easier to verify.",
    tags: ["Python", "VBA", "Automation", "QA Checks"],
  },
  {
    title: "Dashboard & Data Workflow Concepts",
    text: "Designed data views and workflows focused on clearer summaries, cleaner handoffs, and faster business decisions.",
    tags: ["Dashboards", "Analytics", "Data Cleaning", "Operations"],
  },
];

const additionalProjects = [
  {
    title: "Travel",
    href: "/travel",
    label: "Travel Page",
    text: "A visual travel page that will be cleaned up and connected into the same portfolio style.",
    icon: Plane,
  },
  {
    title: "Gravity Lab",
    href: "/gravity-lab",
    label: "Physics / Motion",
    text: "A motion-focused experiment page planned for cleanup, better sound controls, and mobile tuning.",
    icon: Code2,
  },
  {
    title: "GitHub",
    href: "https://github.com/BrianDCab",
    label: "Code Profile",
    text: "My public GitHub profile with portfolio code and programming projects.",
    icon: Database,
  },
];

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

function ProjectButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isInternal = href.startsWith("/");

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
    <a href={href} className={className} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
            Projects
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            Data, automation, and interactive builds
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            A focused collection of portfolio projects showing analytics,
            automation, frontend logic, reporting workflows, and interactive
            browser tools.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ProjectButton href="/data-lab">
              Open Data Lab <ExternalLink size={15} />
            </ProjectButton>

            <ProjectButton href="/security-lab">
              Open Security Lab <ExternalLink size={15} />
            </ProjectButton>
          </div>
        </div>

        <section className="mt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Featured
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Interactive project pages
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
              Live pages someone can click through, test, and understand
              quickly.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((project) => {
              const Icon = project.icon;

              return (
                <div key={project.title} className={`${glassCard} p-6`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                    <Icon size={22} />
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                    {project.label}
                  </p>

                  <h3 className="mt-3 text-2xl font-black text-white">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {project.text}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-cyan-300/20 bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6">
                    <ProjectButton href={project.href}>
                      Open <ExternalLink size={15} />
                    </ProjectButton>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Professional Work
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Business systems and data workflows
              </h2>
            </div>

            <ProjectButton href="mailto:briandacellcabrera@gmail.com">
              Contact Me <ExternalLink size={15} />
            </ProjectButton>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {professionalWork.map((project) => (
              <div key={project.title} className={`${glassCard} p-6`}>
                <h3 className="text-xl font-black text-white">
                  {project.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {project.text}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-cyan-300/20 bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6">
                  <ProjectButton href="mailto:briandacellcabrera@gmail.com">
                    Ask About This <ExternalLink size={15} />
                  </ProjectButton>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Additional Pages
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              More portfolio areas
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {additionalProjects.map((project) => {
              const Icon = project.icon;

              return (
                <div key={project.title} className={`${glassCard} p-6`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                    <Icon size={22} />
                  </div>

                  <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                    {project.label}
                  </p>

                  <h3 className="mt-3 text-2xl font-black text-white">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    {project.text}
                  </p>

                  <div className="mt-6">
                    <ProjectButton href={project.href}>
                      Open <ExternalLink size={15} />
                    </ProjectButton>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}