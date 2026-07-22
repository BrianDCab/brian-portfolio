import Link from "next/link";

// Shared footer so every page ends the same way
export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300/70">
            Brian Cabrera
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Built and maintained by me. Next.js, TypeScript, Tailwind, Supabase,
            Vercel.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/projects" className="text-zinc-400 transition hover:text-accent-200">
            Projects
          </Link>
          <a
            href="https://github.com/BrianDCab"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition hover:text-accent-200"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/briandacellcabrera/"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition hover:text-accent-200"
          >
            LinkedIn
          </a>
          <a
            href="https://briancabrera.itch.io/"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition hover:text-accent-200"
          >
            itch.io
          </a>
          <a
            href="mailto:briandacellcabrera@gmail.com"
            className="text-zinc-400 transition hover:text-accent-200"
          >
            Email
          </a>
          <a
            href="/Brian_Cabrera_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-400 transition hover:text-accent-200"
          >
            Resume
          </a>
        </nav>
      </div>
    </footer>
  );
}
