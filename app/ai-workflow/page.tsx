import Link from "next/link";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  FlaskConical,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

const uses = [
  {
    title: "Concepts and technical blueprints",
    text: "When I have an idea but have not decided how to structure it yet, I use AI to sketch possible flows, components, data structures, and implementation plans. I treat those as blueprints to test and revise, not finished answers.",
    icon: BrainCircuit,
  },
  {
    title: "Learning new syntax",
    text: "I use AI to break down unfamiliar syntax, explain why a pattern works, and compare it with languages or tools I already know. I still verify the details with documentation and test the code myself.",
    icon: Code2,
  },
  {
    title: "Prototyping and testing ideas",
    text: "I use it to turn rough concepts into small prototypes so I can see whether an idea actually works. Once I understand the direction, I change the structure, improve the interface, and build the version that fits the project.",
    icon: FlaskConical,
  },
  {
    title: "Debugging",
    text: "When something breaks, I use AI to help me reason through the error, identify likely failure points, and compare possible fixes. I still inspect the code, logs, requests, and production behavior myself.",
    icon: Wrench,
  },
  {
    title: "Review and cleanup",
    text: "It helps me find duplicated logic, unclear writing, missing edge cases, and parts of an interface that could be easier to understand or use.",
    icon: SearchCheck,
  },
  {
    title: "Explaining ideas more clearly",
    text: "Sometimes I understand what I want to build but need help putting the idea into clearer technical language. I use AI to expand the concept, question my assumptions, and help me explain the final approach to another person.",
    icon: Eye,
  },
];

const responsibilities = [
  "I decide what the project should do and what belongs in the final version.",
  "I review and edit generated code before keeping it.",
  "I run builds, test the interface, and check the result in the real environment.",
  "I verify calculations, data interpretations, security decisions, and technical claims.",
  "I remove suggestions that do not fit the project or that I cannot confidently explain.",
  "I use official documentation when I need to confirm syntax, APIs, package behavior, or security guidance.",
];

const cautionAreas = [
  {
    title: "Authentication and security",
    text: "I do not assume generated authentication or security code is safe. I review the flow, test failure cases, and check the official documentation.",
    icon: ShieldCheck,
  },
  {
    title: "Databases and destructive changes",
    text: "I slow down around migrations, deletes, permissions, Row Level Security, and anything that could damage or expose data.",
    icon: LockKeyhole,
  },
  {
    title: "Analytics and conclusions",
    text: "I verify formulas and interpretations instead of trusting a confident-looking answer. Correlation, scoring models, and business conclusions still need judgment.",
    icon: Eye,
  },
];

export default function AIWorkflowPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <Sparkles size={15} />
            AI-Assisted Workflow
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            How I use AI without handing over the work
          </h1>

          <p className="mt-5 max-w-4xl text-base leading-8 text-zinc-300 md:text-lg">
            I use AI the same way I use documentation, debugging tools, code
            review, and search: as another tool in the process. It helps me test
            blueprints, learn unfamiliar syntax, explore ideas in more detail,
            and move faster, but I still decide what gets built, review the
            output, test the result, and take responsibility for the finished
            work.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </Link>

            <Link
              href="/data-lab"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
            >
              Open Data Lab
              <ExternalLink size={15} />
            </Link>
          </div>
        </div>

        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Where it helps
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            The parts of my workflow where I use it
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
            I use it most when I am exploring a new concept, learning a pattern,
            testing a rough blueprint, or trying to explain an idea more clearly
            before I commit to the final implementation.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {uses.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className={`${glassCard} p-6`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <div className="flex items-start gap-4">
            <CheckCircle2
              className="mt-1 shrink-0 text-cyan-300"
              size={24}
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                What stays my responsibility
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                I am still responsible for the final result
              </h2>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {responsibilities.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
                  >
                    <CheckCircle2
                      className="mt-0.5 shrink-0 text-cyan-300"
                      size={17}
                    />

                    <p className="text-sm leading-6 text-zinc-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <div className="flex items-start gap-4">
            <BrainCircuit
              className="mt-1 shrink-0 text-cyan-300"
              size={24}
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Learning and exploration
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Sometimes I use it to understand the idea before I build the
                idea
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
                When I am learning new syntax or working with an unfamiliar API,
                I use AI to break the problem into smaller pieces, compare the
                new pattern with something I already understand, and show me a
                few possible approaches. I do not stop at the explanation. I
                rewrite examples, test them in the project, check the official
                documentation, and make sure I can explain why the final code
                works.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Where I slow down
          </p>

          <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
            I do not trust every answer just because it sounds confident
          </h2>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {cautionAreas.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className={`${glassCard} p-6`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-300/20 bg-yellow-300/10 text-yellow-200">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-zinc-300">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <div className="flex items-start gap-4">
            <LockKeyhole
              className="mt-1 shrink-0 text-cyan-300"
              size={24}
            />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Privacy
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                Private data does not belong in a public AI prompt
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
                I avoid sharing passwords, API secrets, private customer or
                player information, employee data, proprietary files, internal
                campaign details, or other confidential business material. When
                I need examples, I anonymize the information or use synthetic
                data instead.
              </p>
            </div>
          </div>
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            This portfolio
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            AI helped with parts of the process. I still built, tested, and
            maintained the site.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            I used AI while brainstorming interfaces, testing technical
            blueprints, learning new syntax, restructuring copy, reviewing
            code, and troubleshooting development issues. I still made the final
            design decisions, connected the pages, reviewed the code, ran
            production builds, tested the features, handled deployment, and
            decided what was accurate enough to publish.
          </p>
        </section>
      </section>
    </main>
  );
}
