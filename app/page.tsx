import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  Gamepad2,
  Mail,
} from "lucide-react";

const strengths = [
  {
    title: "SQL & Reporting",
    text: "Clean queries, exports, audits, and reporting workflows.",
  },
  {
    title: "Python & Automation",
    text: "Scripts that reduce manual work and catch mistakes earlier.",
  },
  {
    title: "Business Analytics",
    text: "Dashboards and summaries that turn messy data into decisions.",
  },
];

const featuredProjects = [
  {
    title: "Data Lab",
    href: "/data-lab",
    label: "Analytics Playground",
    text: "Upload data, inspect quality, chart patterns, and test scoring ideas.",
  },
  {
    title: "Security Lab",
    href: "/security-lab",
    label: "Auth & Safe Keys",
    text: "Planned demo for login, protected routes, server-side secrets, and safe handling patterns.",
  },
  {
    title: "Projects",
    href: "/projects",
    label: "Portfolio Work",
    text: "A focused view of my technical, data, programming, and automation projects.",
  },
  {
    title: "Playground",
    href: "/playground",
    label: "Interactive Builds",
    text: "Small browser experiments built with React state, game logic, and UI behavior.",
  },
];

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "C#",
  "SQL",
  "HTML",
  "CSS",
  "React",
  "Next.js",
  "Tailwind",
  "Excel",
  "VBA",
  "Git",
  "GitHub",
  "Dashboards",
  "Automation",
  "Data Cleaning",
  "QA Checks",
  "Reporting",
  "CSV Workflows",
  "Web Interfaces",
  "Desktop App Concepts",
  "Mobile-Responsive UI",
];

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

function PrimaryButton({
  href,
  children,
  icon,
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const isInternal = href.startsWith("/");
  const isEmail = href.startsWith("mailto:");

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {icon}
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
      {icon}
      {children}
    </a>
  );
}

function SoftCard({ title, text }: { title: string; text: string }) {
  return (
    <div className={`${glassCard} p-5 md:p-6`}>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{text}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className={`${glassPanel} p-6 md:p-9 lg:p-10`}>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
              Data Analyst • Programmer • Automation Builder
            </p>

            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Brian Dacell Cabrera
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              I build data tools, reports, dashboards, and automation workflows
              that make business work cleaner and easier to trust.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/projects" icon={<ExternalLink size={16} />}>
                View Projects
              </PrimaryButton>

              <PrimaryButton href="/data-lab" icon={<BarChart3 size={16} />}>
                Open Data Lab
              </PrimaryButton>

              <PrimaryButton
                href="https://github.com/BrianDCab"
                icon={<Code2 size={16} />}
              >
                GitHub
              </PrimaryButton>
            </div>
          </div>

          <div className={`${glassPanel} p-5 md:p-7`}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Current Focus
            </p>

            <div className="mt-5 space-y-4">
              {strengths.map((item) => (
                <SoftCard
                  key={item.title}
                  title={item.title}
                  text={item.text}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Featured Work
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              Interactive portfolio projects
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
            Live, visual, and interactive pieces someone can test directly.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {featuredProjects.map((project) => (
            <Link
              key={project.title}
              href={project.href}
              className={`${glassCard} group p-6`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                {project.label}
              </p>

              <h3 className="mt-4 text-2xl font-black text-white">
                {project.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-zinc-300">
                {project.text}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition group-hover:text-cyan-200">
                Open <ExternalLink size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="skills"
        className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12"
      >
        <div className={`${glassPanel} p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Skills
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            My Skills & Tools
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
            Programming, analytics, reporting, automation, and interface work
            across data-focused and web-focused projects.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-sm font-semibold text-zinc-200 backdrop-blur-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8 md:grid-cols-2 md:px-6 md:py-12">
        <div className={`${glassPanel} p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            About
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Data, code, and systems
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-300 md:text-base">
            My work sits between business data and technical execution. I like
            building tools that make reporting faster, reduce manual cleanup,
            and make results easier to explain.
          </p>
        </div>

        <div id="contact" className={`${glassPanel} p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Let’s connect
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-300 md:text-base">
            Open to data analyst, programmer, automation, reporting, and
            technical operations opportunities.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <PrimaryButton
              href="mailto:briandacellcabrera@gmail.com"
              icon={<Mail size={16} />}
            >
              Email Me
            </PrimaryButton>

            <PrimaryButton
              href="https://www.linkedin.com/in/briandacellcabrera/"
              icon={<BriefcaseBusiness size={16} />}
            >
              LinkedIn
            </PrimaryButton>

            <PrimaryButton
              href="https://github.com/BrianDCab"
              icon={<Code2 size={16} />}
            >
              GitHub
            </PrimaryButton>

            <PrimaryButton
              href="https://briancabrera.itch.io/"
              icon={<Gamepad2 size={16} />}
            >
              itch.io
            </PrimaryButton>
          </div>
        </div>
      </section>
    </main>
  );
}