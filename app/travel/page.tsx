const travelHighlights = [
  {
    place: "Japan",
    route: "Osaka → Kyoto → Hakone → Fuji → Tokyo",
    description:
      "Explored temples, city districts, food markets, mountain views, onsen areas, and dense transit-heavy travel planning.",
    tags: ["Japan", "Transit", "Food", "Culture", "Photography"],
  },
  {
    place: "China",
    route: "Shanghai → Zhangjiajie → Chongqing → Jiuzhaigou → Beijing",
    description:
      "Planned a multi-city route across major cities, national parks, mountain landscapes, and long-distance transportation windows.",
    tags: ["China", "Route Planning", "Nature", "Cities", "Logistics"],
  },
  {
    place: "Kyoto",
    route: "Gion, Fushimi Inari, Arashiyama, Nishiki Market",
    description:
      "Balanced historic districts, shrines, night walks, food stops, and slower scenic exploration.",
    tags: ["Kyoto", "Shrines", "Walking", "Food"],
  },
  {
    place: "Hakone / Fuji Area",
    route: "Onsen stay, mountain scenery, Fuji-area planning",
    description:
      "Focused on slower travel, scenic stays, weather-dependent planning, and choosing the right base for views and rest.",
    tags: ["Hakone", "Fuji", "Onsen", "Weather Planning"],
  },
];

const travelSkills = [
  {
    title: "Route Planning",
    description:
      "Breaking a large trip into realistic city blocks, travel days, transportation windows, and backup plans.",
  },
  {
    title: "Decision Making",
    description:
      "Choosing what to do based on time, weather, distance, cost, energy, and the experience I actually want.",
  },
  {
    title: "Research",
    description:
      "Comparing neighborhoods, transit options, tickets, closures, restaurants, attractions, and timing.",
  },
  {
    title: "Adaptability",
    description:
      "Changing plans when weather, fatigue, crowds, delays, or better opportunities show up.",
  },
];

const travelIdeas = [
  "Trip cost tracker by city",
  "Travel itinerary optimizer",
  "Weather-based activity scorer",
  "Food map and restaurant ranking tool",
  "Photo location database",
  "Transit time comparison dashboard",
];

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-zinc-700 bg-black/40 px-3 py-1 text-xs text-zinc-300">
      {children}
    </span>
  );
}

export default function TravelPage() {
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
            <a className="transition hover:text-cyan-300" href="/projects">
              Projects
            </a>
            <a className="transition hover:text-cyan-300" href="/#skills">
              Skills
            </a>
            <a className="transition hover:text-cyan-300" href="/playground">
              Playground
            </a>
            <a className="text-cyan-300 transition" href="/travel">
              Travel
            </a>
            <a className="transition hover:text-cyan-300" href="/#contact">
              Contact
            </a>
          </div>
        </nav>

        <section className="rounded-3xl border border-cyan-400/30 bg-zinc-950 p-8 shadow-[0_0_45px_rgba(34,211,238,0.12)] md:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Travel
          </p>

          <h1 className="mt-6 max-w-5xl text-5xl font-bold tracking-tight text-white md:text-7xl">
            Travel, planning, logistics, and curiosity.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            Travel is one of the ways I practice planning, research, pattern
            recognition, and decision-making. I like building routes, comparing
            options, working around constraints, and turning messy information
            into a real plan.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/playground"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              View Weather Analyzer
            </a>

            <a
              href="/projects"
              className="rounded-xl border border-zinc-700 px-5 py-3 font-semibold text-white transition hover:border-cyan-300 hover:bg-cyan-300/10 hover:text-cyan-300"
            >
              View Projects
            </a>
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Travel Style
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Dense but intentional
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-300">
              I like trips that mix big cities, food, culture, scenic areas,
              walking, and enough flexibility to adapt when the plan changes.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Planning Mindset
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Research first
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              I compare routes, weather, transit, neighborhoods, timing,
              closures, costs, and energy levels before locking in a plan.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Data Angle
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white">
              Trips become systems
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Travel naturally creates data: budgets, routes, ratings,
              timelines, weather, transit options, and decision tradeoffs.
            </p>
          </div>
        </section>

        <section className="mt-20">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Highlights
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Places I have planned, explored, or studied
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              This page keeps travel personal without turning the site into a
              vacation blog. The goal is to show curiosity, planning ability,
              and personality alongside technical work.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {travelHighlights.map((item) => (
              <article
                key={item.place}
                className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-[0_0_35px_rgba(34,211,238,0.05)] transition hover:border-cyan-300/50 hover:bg-zinc-900/70"
              >
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                  {item.place}
                </p>

                <h3 className="mt-3 text-2xl font-bold text-white">
                  {item.route}
                </h3>

                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {item.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Transferable Skills
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                What travel shows about how I think
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Travel planning is basically project planning: constraints,
              priorities, risks, resources, timing, and execution.
            </p>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {travelSkills.map((skill) => (
              <div
                key={skill.title}
                className="rounded-2xl border border-zinc-800 bg-black/40 p-5"
              >
                <h3 className="text-xl font-bold text-white">{skill.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
              Future Project Ideas
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white">
              Travel tools I could build
            </h2>

            <p className="mt-4 text-sm leading-6 text-zinc-400">
              These are realistic ideas that connect travel with programming,
              analytics, and dashboards.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {travelIdeas.map((idea) => (
              <div
                key={idea}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 transition hover:border-cyan-300/50 hover:bg-zinc-900/70"
              >
                <p className="text-sm font-semibold text-white">{idea}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-cyan-300/30 bg-cyan-300/10 p-8 text-center shadow-[0_0_35px_rgba(34,211,238,0.08)]">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
            Live Demo
          </p>

          <h2 className="mt-4 text-3xl font-bold text-white">
            Weather Activity Analyzer
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-300">
            I added a weather scoring tool in the playground because travel
            decisions often depend on conditions: temperature, rain, wind,
            humidity, UV index, visibility, and activity type.
          </p>

          <div className="mt-6 flex justify-center">
            <a
              href="/playground"
              className="rounded-xl bg-cyan-300 px-5 py-3 font-semibold text-black shadow-[0_0_25px_rgba(103,232,249,0.35)] transition hover:bg-cyan-200"
            >
              Open Playground
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