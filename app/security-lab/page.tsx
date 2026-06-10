import Link from "next/link";
import {
  ArrowRight,
  Code2,
  ExternalLink,
  Mail,
  Server,
  Shield,
  UserPlus,
} from "lucide-react";

const demoSteps = [
  {
    title: "1. Register",
    text: "Create a user account with validation, safe password handling, and clear error states.",
    button: "View Register Plan",
  },
  {
    title: "2. Login",
    text: "Authenticate the user, create a session, and control what the frontend is allowed to see.",
    button: "View Login Flow",
  },
  {
    title: "3. Protected Dashboard",
    text: "Send authenticated users to a protected page while blocking public access.",
    button: "View Dashboard Plan",
  },
];

const securityConcepts = [
  {
    title: "Server-Side Secrets",
    text: "API keys and private values should stay in server-side environment variables, not browser code.",
  },
  {
    title: "Password Safety",
    text: "Passwords should be hashed before storage. The app should never store plain-text passwords.",
  },
  {
    title: "Session Control",
    text: "The frontend should know only what it needs. Sensitive checks should happen on the server.",
  },
  {
    title: "Frontend vs Backend",
    text: "This demo will show what is safe to expose publicly and what should stay protected.",
  },
];

const plannedFeatures = [
  "Registration form",
  "Login form",
  "Protected route",
  "Session cookie flow",
  "Password hashing notes",
  "Server-only API keys",
  "Environment variables",
  "Frontend/backend boundaries",
  "Safe error messages",
  "Security checklist",
];

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isEmail = href.startsWith("mailto:");
  const isInternal = href.startsWith("/");

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
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
      {children}
    </a>
  );
}

function GhostButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isInternal = href.startsWith("/");

  const className =
    "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10";

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

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07] ${className}`}
    >
      {children}
    </div>
  );
}

export default function SecurityLab() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
          <div className="rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] p-6 shadow-2xl shadow-cyan-950/30 backdrop-blur-md md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
              <Shield size={15} />
              Security Lab
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Auth & Safe Key Handling Demo
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
              A planned full-stack demo for registration, login, protected
              routes, server-side secrets, and safer handling patterns for
              sensitive values.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="/projects">
                <ExternalLink size={16} />
                Back to Projects
              </PrimaryButton>

              <PrimaryButton href="mailto:briandacellcabrera@gmail.com">
                <Mail size={16} />
                Ask About This
              </PrimaryButton>
            </div>
          </div>

          <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-950/[0.14] p-6 shadow-2xl shadow-black/20 backdrop-blur-md md:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
              Why this matters
            </p>

            <h2 className="mt-4 text-3xl font-black text-white">
              Security is about boundaries.
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
              The goal is not to hide frontend code. The goal is to keep private
              logic, keys, and sensitive checks on the server where users cannot
              inspect them.
            </p>

            <div className="mt-6">
              <GhostButton href="#planned-build">
                View Planned Features <ArrowRight size={15} />
              </GhostButton>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Demo Flow
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                The app flow this will demonstrate
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400 md:text-right">
              Built as a learning/demo project, not a place for real user
              secrets yet.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {demoSteps.map((step) => (
              <GlassCard key={step.title} className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                  <UserPlus size={20} />
                </div>

                <h3 className="mt-5 text-xl font-black text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {step.text}
                </p>

                <div className="mt-6">
                  <GhostButton href="#planned-build">
                    {step.button} <ArrowRight size={15} />
                  </GhostButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Security Concepts
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                What this page is meant to prove
              </h2>
            </div>

            <GhostButton href="/data-lab">
              Open Data Lab <ExternalLink size={15} />
            </GhostButton>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {securityConcepts.map((concept) => (
              <GlassCard key={concept.title} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                    {concept.title.includes("Server") ? (
                      <Server size={20} />
                    ) : (
                      <Code2 size={20} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-white">
                      {concept.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                      {concept.text}
                    </p>

                    <div className="mt-5">
                      <GhostButton href="#planned-build">
                        See Plan <ArrowRight size={15} />
                      </GhostButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section
          id="planned-build"
          className="mt-12 rounded-[2rem] border border-cyan-300/20 bg-cyan-950/[0.14] p-6 shadow-2xl shadow-black/20 backdrop-blur-md md:p-8"
        >
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Planned Build
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            What this will eventually include
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
            This page is intentionally not storing real secrets yet. The final
            version should demonstrate the pattern safely, with sensitive logic
            kept server-side instead of exposed in browser code.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {plannedFeatures.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-sm font-semibold text-zinc-200 backdrop-blur-sm"
              >
                {feature}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="/projects">
              <ExternalLink size={16} />
              Back to Projects
            </PrimaryButton>

            <PrimaryButton href="mailto:briandacellcabrera@gmail.com">
              <Mail size={16} />
              Contact Me
            </PrimaryButton>
          </div>
        </section>
      </section>
    </main>
  );
}