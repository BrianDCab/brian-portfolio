"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BarChart3,
  Database,
  ExternalLink,
  Gamepad2,
  Globe2,
  MapPinned,
  Plane,
  Shield,
  Smartphone,
  Sparkles,
  UserRoundCheck,
} from "lucide-react";

type ProjectLink = {
  href: string;
  label: string;
};

type ProjectItem = {
  title: string;
  href: string;
  label: string;
  text: string;
  icon: typeof BarChart3;
  tags: string[];
  button: string;
  status?: string;
};

type WorkItem = {
  title: string;
  text: string;
  tags: string[];
  button: ProjectLink;
};

const featuredProjects: ProjectItem[] = [
  {
    title: "An Eternity Gone By",
    href: "https://store.steampowered.com/app/2735110/An_Eternity_Gone_By/",
    label: "Steam Published Game",
    status: "Released",
    text: "Steam-published team game project with Trashfire Games LLC. A strong proof point for shipped gameplay work, production collaboration, and playable software.",
    icon: Gamepad2,
    tags: ["Steam", "Game Dev", "Gameplay", "Team Project", "Released"],
    button: "View on Steam",
  },
  {
    title: "Brian Cabrera Portfolio Platform",
    href: "/",
    label: "Full-Stack Web Platform",
    status: "Live",
    text: "A custom Next.js portfolio built as a connected application rather than a static résumé. It combines responsive navigation, interactive labs, data tools, game systems, deployment workflows, Supabase integration, and ongoing full-stack feature development.",
    icon: Globe2,
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel", "Supabase"],
    button: "View Live Platform",
  },
  {
    title: "Data Lab",
    href: "/data-lab",
    label: "Analytics Tool",
    status: "Live",
    text: "Interactive data tools for CSV review, data quality checks, charts, scoring ideas, analyst-style workflows, correlation analysis, and plain-English interpretation of what the data suggests.",
    icon: BarChart3,
    tags: ["CSV", "Charts", "Data QA", "Analytics", "Correlation"],
    button: "Open Data Lab",
  },
  {
    title: "Geo Lab",
    href: "/geo-lab",
    label: "ArcGIS Geospatial Lab",
    status: "WIP",
    text: "An interactive geospatial project using ArcGIS for on-demand 3D terrain, address search, elevation readings, browser location consent, geofence testing, event logging, and CSV snapshot export. The ArcGIS runtime stays unloaded until the visitor activates the map.",
    icon: MapPinned,
    tags: [
      "ArcGIS",
      "GIS",
      "3D Terrain",
      "Geofencing",
      "Geolocation",
      "CSV Export",
    ],
    button: "Open Geo Lab",
  },
  {
    title: "Playground",
    href: "/playground",
    label: "Interactive Builds",
    status: "Live",
    text: "Browser experiments with React state, game logic, betting simulation, Snake controls, and launch-readiness scoring.",
    icon: Sparkles,
    tags: ["React", "TypeScript", "Games", "UI Logic"],
    button: "Open Playground",
  },
  {
    title: "Gravity Lab",
    href: "/gravity-lab",
    label: "Mobile Development",
    status: "Live",
    text: "A phone-first frontend experiment showing I can build for mobile sensors: device motion, touch-friendly UI, browser audio, calibration, and responsive controls.",
    icon: Smartphone,
    tags: ["Mobile UI", "Device Motion", "Audio", "React", "Sensors"],
    button: "Open Gravity Lab",
  },
];

const gameProjects: WorkItem[] = [
  {
    title: "Steam Published Game — An Eternity Gone By",
    text: "A released Steam game project developed and published by Trashfire Games LLC. Framed as team game-development work, not a solo claim, and used to show shipped software experience.",
    tags: ["Steam", "Published Game", "Gameplay Programming", "Production"],
    button: {
      href: "https://store.steampowered.com/app/2735110/An_Eternity_Gone_By/",
      label: "View Steam Page",
    },
  },
  {
    title: "itch.io Game Prototypes",
    text: "A collection of browser-playable and prototype game projects, including Froggee Toadems, AstralBlade, ChromaThoth, and Marion. These show fast iteration, game feel, and mechanics under smaller scopes.",
    tags: ["itch.io", "Game Jams", "Prototypes", "Browser Games"],
    button: {
      href: "https://briancabrera.itch.io/",
      label: "View itch.io",
    },
  },
  {
    title: "Gameplay Systems & Interactive Experiments",
    text: "Smaller gameplay and frontend experiments that connect game logic, animation, controls, scoring, and browser interaction into portfolio-ready demos.",
    tags: ["Game Logic", "Controls", "UI", "Iteration"],
    button: {
      href: "/playground",
      label: "Open Playground",
    },
  },
];

const professionalWork: WorkItem[] = [
  {
    title: "Casino Offer & Campaign QA",
    text: "Used MySQL, Excel, VBA, and Python to clean campaign data, formulate player offer groups, validate assigned offers, and support marketing exports. Work included checking player eligibility, offer accuracy, tier segmentation, and audit outputs before campaign launch.",
    tags: ["MySQL", "Python", "VBA", "Offer Validation", "Campaign QA"],
    button: {
      href: "mailto:briandacellcabrera@gmail.com",
      label: "Ask About This",
    },
  },
  {
    title: "Player Segmentation & Tier Logic",
    text: "Built segmentation workflows that grouped players into tiers based on campaign rules, database outputs, and offer logic. Created VBA scripts and Python programs to verify IDs, groups, tiers, and offer assignments so mismatches could be caught before launch.",
    tags: ["MySQL", "Excel", "Tier Logic", "Segmentation", "Audit Outputs"],
    button: {
      href: "mailto:briandacellcabrera@gmail.com",
      label: "Discuss Workflow",
    },
  },
  {
    title: "Aeternum Trading Co. — Virtual Economy Analytics",
    text: "Company work focused on virtual economy tracking, pricing research, supply and demand analysis, market spreadsheets, reporting, and data-backed decisions around digital goods and in-game market behavior.",
    tags: ["Aeternum Trading Co.", "Market Analysis", "Pricing", "Dashboards"],
    button: {
      href: "mailto:briandacellcabrera@gmail.com",
      label: "Discuss Case Study",
    },
  },
];

const labProjects: ProjectItem[] = [
  {
    title: "User Accounts & Dashboard",
    href: "/dashboard",
    label: "Full-Stack Feature",
    status: "WIP",
    text: "An active work-in-progress for registration, email confirmation, login, logout, user profiles, protected dashboard routes, and account-specific saved data. The feature is intentionally labeled WIP while session handling and persistence are being hardened.",
    icon: UserRoundCheck,
    tags: ["Supabase Auth", "Profiles", "Sessions", "Protected Routes", "RLS"],
    button: "View Dashboard WIP",
  },
  {
    title: "Gravity Lab",
    href: "/gravity-lab",
    label: "Phone / Sensor Demo",
    status: "Live",
    text: "A mobile-first frontend lab that specifically shows phone development: device orientation, sensor permission handling, touch-friendly controls, browser audio, and responsive layouts.",
    icon: Smartphone,
    tags: ["Phone Dev", "Device Motion", "Touch UI", "Audio"],
    button: "Open Gravity Lab",
  },
  {
    title: "Chaos Lab",
    href: "/chaos-lab",
    label: "UI Experiments",
    status: "Prototype",
    text: "A small lab for testing motion, browser behavior, and intentionally strange interfaces.",
    icon: Sparkles,
    tags: ["Motion", "UI", "Events", "Web APIs"],
    button: "Open Chaos Lab",
  },
  {
    title: "Security Lab",
    href: "/security-lab",
    label: "Security Engineering Lab",
    status: "WIP",
    text: "A work-in-progress security area focused on secure authentication patterns, password recovery, session visibility, protected routes, Row Level Security, safe environment variables, and practical account-security checks.",
    icon: Shield,
    tags: ["Auth Security", "RLS", "Password Reset", "Sessions", "Secrets"],
    button: "Open Security Lab",
  },
  {
    title: "Travel",
    href: "/travel",
    label: "Personal / UI",
    status: "Live",
    text: "A responsive travel timeline covering Asia 2026, U.S. cities, Mexico City, and interactive trip-planning ideas.",
    icon: Plane,
    tags: ["Timeline", "Cards", "Responsive UI", "Personal"],
    button: "Open Travel",
  },
];

const profileLinks: ProjectItem[] = [
  {
    title: "GitHub",
    href: "https://github.com/BrianDCab",
    label: "Code Profile",
    status: "External",
    text: "Public code profile with portfolio work and programming projects.",
    icon: Database,
    tags: ["Code", "Repos", "Git", "Portfolio"],
    button: "Open GitHub",
  },
  {
    title: "itch.io",
    href: "https://briancabrera.itch.io/",
    label: "Game Profile",
    status: "External",
    text: "Public game profile with browser-playable prototypes and jam-style projects.",
    icon: Gamepad2,
    tags: ["Games", "Prototypes", "Browser Play", "Game Jams"],
    button: "Open itch.io",
  },
];

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

function getStatusClass(status: string) {
  if (status === "Released" || status === "Live") {
    return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
  }

  if (status === "WIP" || status === "Next Cleanup") {
    return "border-yellow-300/35 bg-yellow-300/10 text-yellow-100";
  }

  if (status === "Prototype") {
    return "border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200";
  }

  return "border-cyan-300/20 bg-black/25 text-cyan-200";
}

function ProjectButton({
  href,
  children,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  const isInternal = href.startsWith("/");

  const className = subtle
    ? "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
    : "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,211,238,0.22)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link
        href={href}
        prefetch={href === "/geo-lab" ? false : undefined}
        className={className}
      >
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

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-cyan-300/20 bg-black/25 px-3 py-1 text-xs font-semibold text-zinc-300"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const Icon = project.icon;

  return (
    <div className={`${glassCard} flex h-full flex-col p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
          <Icon size={22} />
        </div>

        {project.status && (
          <span
            className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${getStatusClass(
              project.status
            )}`}
          >
            {project.status}
          </span>
        )}
      </div>

      <p className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
        {project.label}
      </p>

      <h3 className="mt-3 text-2xl font-black text-white">{project.title}</h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-300">
        {project.text}
      </p>

      <TagList tags={project.tags} />

      <div className="mt-6">
        <ProjectButton href={project.href}>
          {project.button} <ExternalLink size={15} />
        </ProjectButton>
      </div>
    </div>
  );
}

function WorkCard({ project }: { project: WorkItem }) {
  return (
    <div className={`${glassCard} flex h-full flex-col p-6`}>
      <h3 className="text-xl font-black text-white">{project.title}</h3>

      <p className="mt-4 flex-1 text-sm leading-6 text-zinc-300">
        {project.text}
      </p>

      <TagList tags={project.tags} />

      <div className="mt-6">
        <ProjectButton href={project.button.href} subtle>
          {project.button.label} <ExternalLink size={15} />
        </ProjectButton>
      </div>
    </div>
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
            Data automation, geospatial tools, shipped games, and full-stack builds
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            A focused collection of professional data workflows, gameplay work,
            analytics tools, ArcGIS experiments, mobile-first interfaces, and
            the portfolio platform itself. Live work is separated clearly from
            prototypes and active work-in-progress systems.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ProjectButton href="https://store.steampowered.com/app/2735110/An_Eternity_Gone_By/">
              View Steam Game <ExternalLink size={15} />
            </ProjectButton>

            <ProjectButton href="/data-lab">
              Open Data Lab <ExternalLink size={15} />
            </ProjectButton>

            <ProjectButton href="/geo-lab">
              Open Geo Lab <ExternalLink size={15} />
            </ProjectButton>

            <ProjectButton href="/" subtle>
              View Portfolio Platform <ExternalLink size={15} />
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
                Strongest portfolio proof
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
              Shipped game work, live analytics tools, an ArcGIS geospatial
              lab, a custom full-stack portfolio platform, interactive demos,
              and phone-first frontend development.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Game Development
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Published game work and prototypes
              </h2>
            </div>

            <ProjectButton href="https://briancabrera.itch.io/" subtle>
              Open itch.io <ExternalLink size={15} />
            </ProjectButton>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {gameProjects.map((project) => (
              <WorkCard key={project.title} project={project} />
            ))}
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

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400">
            These case studies are intentionally anonymized. They describe the
            technical work without exposing private player data, internal
            screenshots, campaign IDs, proprietary folders, or confidential
            business rules.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {professionalWork.map((project) => (
              <WorkCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Labs and Supporting Pages
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              More interactive portfolio areas
            </h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
              Work-in-progress labels are intentional. They show what is
              currently functional, what is being hardened, and which systems
              are still under active development.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {labProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Profiles
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              External links
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {profileLinks.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            What this page is meant to show
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            I build practical tools, playable systems, and full-stack web
            experiences.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            My work sits between software engineering, analytics, automation,
            geospatial development, mobile frontend work, game development, and
            full-stack web architecture. The portfolio itself is part of that
            proof: a live deployed application with interactive tools, ArcGIS
            integration, responsive design, and an actively developing account
            system.
          </p>
        </section>
      </section>
    </main>
  );
}
