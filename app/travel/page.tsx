const travelPlaces = [
  {
    place: "Japan",
    date: "2026",
    note: "Explored Tokyo, Kyoto, Osaka, Hakone, and Fuji while learning how different cities organize culture, transit, food, and daily life.",
  },
  {
    place: "China",
    date: "2026",
    note: "Visited major cities and scenic areas while navigating language, logistics, planning, and unfamiliar systems.",
  },
  {
    place: "California",
    date: "Home Base",
    note: "Where I build, work, study, and plan the next project or trip.",
  },
];

export default function TravelPage() {
  return (
    <main className="min-h-screen bg-black px-6 py-8 text-white">
      <section className="mx-auto max-w-5xl">
        <nav className="mb-10 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/80 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-white">
            Brian<span className="text-cyan-300">.</span>
          </a>

          <div className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300">
            <a className="transition hover:text-cyan-300" href="/">
              Home
            </a>
            <a className="transition hover:text-cyan-300" href="/#projects">
              Projects
            </a>
            <a className="transition hover:text-cyan-300" href="/#skills">
              Skills
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

          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
            Places that shaped how I think.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            I like traveling because it forces me to learn quickly, adapt to
            unfamiliar systems, solve problems in real time, and understand how
            people, cities, and cultures work differently.
          </p>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          {travelPlaces.map((trip) => (
            <article
              key={trip.place}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.14)]"
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                {trip.date}
              </p>

              <h2 className="mt-3 text-2xl font-bold">{trip.place}</h2>

              <p className="mt-4 text-sm leading-6 text-zinc-300">
                {trip.note}
              </p>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-950 p-8 md:p-10">
          <h2 className="text-3xl font-bold">Why travel belongs here</h2>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-300">
            Travel is not the main focus of this portfolio, but it is part of
            how I approach work. I enjoy learning new environments, noticing
            patterns, figuring out unfamiliar systems, and turning uncertainty
            into a plan.
          </p>
        </section>
      </section>
    </main>
  );
}