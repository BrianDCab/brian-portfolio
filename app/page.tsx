import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  ExternalLink,
  FileText,
  Gamepad2,
  Globe2,
  Mail,
  MapPinned,
} from "lucide-react";

type FeaturedProject = {
  title: string;
  href: string;
  label: string;
  text: string;
  status: string;
  external?: boolean;
};

type SkillGroup = {
  title: string;
  skills: string[];
};

const strengths = [
  {
    title: "Monthly Segmentation & Reporting",
    text: "Recurring SQL, Excel, and campaign workflows across large player populations, offer groups, and monthly production files.",
  },
  {
    title: "Automation & Quality Control",
    text: "Python and VBA tools that reduce repetitive work, validate combinations, and catch errors before launch.",
  },
  {
    title: "Interactive Software",
    text: "Next.js applications, browser tools, mobile-first experiments, and gameplay systems.",
  },
];

const proofPoints = [
  {
    value: "100K+",
    label:
      "Player records handled during recurring monthly segmentation and reporting cycles",
  },
  {
    value: "500+",
    label:
      "Player, offer, and campaign groups reviewed across monthly production workflows",
  },
  {
    value: "50+",
    label:
      "Validation combinations checked through repeatable monthly audit logic",
  },
  {
    value: "1",
    label: "Steam-published team game project",
  },
];

const featuredProjects: FeaturedProject[] = [
  {
    title: "An Eternity Gone By",
    href: "https://store.steampowered.com/app/2735110/An_Eternity_Gone_By/",
    label: "Steam-Published Game",
    status: "Released",
    external: true,
    text: "A shipped team game project showing gameplay development, production collaboration, and experience working on released software.",
  },
  {
    title: "Data Lab",
    href: "/data-lab",
    label: "Analytics Application",
    status: "Live",
    text: "Import CSV data, inspect quality, analyze distributions and correlations, and turn the results into plain-English findings.",
  },
  {
    title: "Portfolio Platform",
    href: "/projects",
    label: "Full-Stack Web Project",
    status: "Live + Evolving",
    text: "The site itself is one of my projects: a Next.js platform combining data tools, games, responsive interfaces, mobile experiments, deployment, and Supabase development.",
  },
  {
    title: "Geo Lab",
    href: "/geo-lab",
    label: "ArcGIS & Geospatial Analysis",
    status: "Live + Evolving",
    text: "An interactive ArcGIS project with 3D terrain, elevation readings, address search, browser location consent, geofence testing, and CSV snapshot export.",
  },
];

const skillGroups: SkillGroup[] = [
  {
    title: "Data & Analytics",
    skills: [
      "SQL",
      "SQL Server",
      "Excel",
      "Dashboards",
      "Reporting",
      "Data Cleaning",
      "QA Checks",
      "Segmentation",
      "Quantitative Analysis",
    ],
  },
  {
    title: "Automation",
    skills: [
      "Python",
      "VBA",
      "CSV Workflows",
      "Process Automation",
      "Audit Logic",
    ],
  },
  {
    title: "Web Development",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind",
      "HTML",
      "CSS",
      "Responsive UI",
    ],
  },
  {
    title: "Geospatial & Mapping",
    skills: [
      "ArcGIS",
      "GIS",
      "3D Terrain",
      "Geospatial Analysis",
      "Browser Geolocation",
      "Geofencing",
      "Elevation Data",
      "Map-Based UI",
    ],
  },
  {
    title: "Programming & Tools",
    skills: ["Java", "C++", "C#", "Git", "GitHub", "Supabase", "Vercel"],
  },
];

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

function PrimaryButton({
  href,
  children,
  icon,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  subtle?: boolean;
}) {
  const isInternal = href.startsWith("/");
  const isEmail = href.startsWith("mailto:");

  const className = subtle
    ? "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
    : "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

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

function ResumeButton() {
  return (
    <a
      href="/Brian_Cabrera_Resume.pdf"
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center justify-center gap-2 rounded-full border border-rose-400/60 bg-rose-500/15 px-5 py-3 text-sm font-black text-rose-100 shadow-[0_0_28px_rgba(244,63,94,0.30)] transition duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-500 hover:text-white hover:shadow-[0_0_42px_rgba(244,63,94,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
    >
      <FileText
        size={16}
        className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"
      />
      View Resume
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

function FeaturedProjectCard({ project }: { project: FeaturedProject }) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
          {project.label}
        </p>

        <span className="shrink-0 rounded-full border border-cyan-300/20 bg-black/25 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
          {project.status}
        </span>
      </div>

      <h3 className="mt-4 text-2xl font-black text-white">{project.title}</h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-300">
        {project.text}
      </p>

      <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition group-hover:text-cyan-200">
        Open <ExternalLink size={14} />
      </div>
    </>
  );

  const className = `${glassCard} group flex h-full flex-col p-6`;

  if (project.external) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={project.href}
      prefetch={project.href === "/geo-lab" ? false : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-9 lg:p-12`}>
          <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">
            Data Analyst • Programmer • Automation Builder
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-8xl">
            Brian Cabrera
          </h1>

          <p className="mt-5 max-w-4xl text-base leading-7 text-zinc-300 md:text-xl md:leading-9">
            I’m a data analyst and programmer who builds SQL reporting, Python
            and VBA automation, data-quality checks, and interactive web tools.
            My professional work includes recurring monthly segmentation,
            campaign validation, audit workflows, and quantitative reporting
            across large production datasets.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PrimaryButton href="/projects" icon={<ExternalLink size={16} />}>
              View Projects
            </PrimaryButton>

            <ResumeButton />

            <PrimaryButton href="/data-lab" icon={<BarChart3 size={16} />}>
              Open Data Lab
            </PrimaryButton>

            <PrimaryButton
              href="https://www.linkedin.com/in/briandacellcabrera/"
              icon={<BriefcaseBusiness size={16} />}
              subtle
            >
              LinkedIn
            </PrimaryButton>

            <PrimaryButton
              href="https://github.com/BrianDCab"
              icon={<Code2 size={16} />}
              subtle
            >
              GitHub
            </PrimaryButton>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {proofPoints.map((item) => (
              <div
                key={item.label}
                className="min-w-0 rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
              >
                <p className="text-3xl font-black text-cyan-200">{item.value}</p>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
              Recurring monthly production work
            </p>

            <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-300">
              These were not one-time portfolio numbers. Each month I worked
              through large player populations, hundreds of campaign and offer
              groups, and dozens of validation combinations before files and
              offers moved forward.
            </p>
          </div>
        </div>

        <div className={`${glassPanel} mt-8 p-5 md:p-7`}>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
            What I Do
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {strengths.map((item) => (
              <SoftCard key={item.title} title={item.title} text={item.text} />
            ))}
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
              Projects worth opening first
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
            Shipped software, live analytics tools, geospatial experiments,
            and the portfolio platform itself.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <FeaturedProjectCard key={project.title} project={project} />
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
            Skills & tools
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-zinc-400 md:text-base">
            The main tools I use across data work, automation, software
            development, geospatial mapping, and interactive portfolio projects.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {skillGroups.map((group) => (
              <div
                key={group.title}
                className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5"
              >
                <h3 className="text-lg font-black text-white">{group.title}</h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-zinc-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
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
            catch bad data earlier, and make the final result easier to explain.
          </p>

          <p className="mt-4 text-sm leading-7 text-zinc-400">
            This website is also one of those projects. I built it to show the
            work directly instead of only describing it on a résumé. Geo Lab is
            one example of that approach because it combines ArcGIS, 3D terrain,
            browser permissions, location data, and geofence logic in something
            a visitor can actually test.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PrimaryButton href="/projects" icon={<Globe2 size={16} />} subtle>
              See How the Site Was Built
            </PrimaryButton>

            <PrimaryButton href="/geo-lab" icon={<MapPinned size={16} />} subtle>
              Open Geo Lab
            </PrimaryButton>

            <PrimaryButton
              href="/ai-workflow"
              icon={<BrainCircuit size={16} />}
              subtle
            >
              How I Use AI
            </PrimaryButton>
          </div>
        </div>

        <div id="contact" className={`${glassPanel} p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Contact
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Let’s connect
          </h2>

          <p className="mt-5 text-sm leading-7 text-zinc-300 md:text-base">
            I’m open to data analyst, programmer, engineering, automation, reporting, and
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
              subtle
            >
              GitHub
            </PrimaryButton>

            <PrimaryButton
              href="https://briancabrera.itch.io/"
              icon={<Gamepad2 size={16} />}
              subtle
            >
              itch.io
            </PrimaryButton>

            <div className="sm:col-span-2">
              <ResumeButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
