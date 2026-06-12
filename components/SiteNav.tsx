"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const siteNavLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Data Lab", href: "/data-lab" },
  { label: "Security", href: "/security-lab" },
  { label: "Playground", href: "/playground" },
  { label: "Chaos Lab", href: "/chaos-lab" },
  { label: "Gravity Lab", href: "/gravity-lab" },
  { label: "Travel", href: "/travel" },
];

function AuthNavLinks({
  username,
  compact = false,
}: {
  username?: string | null;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const isLoggedIn = Boolean(username);

  const baseButton = compact
    ? "inline-flex shrink-0 items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition"
    : "inline-flex shrink-0 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition";

  const neutralButton =
    "border border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white";

  const activeButton =
    "bg-cyan-400 text-black shadow-[0_0_24px_rgba(34,211,238,0.35)]";

  const registerButton =
    "border border-cyan-300/40 bg-cyan-400 text-black hover:bg-cyan-300";

  const logoutButton =
    "border border-red-300/25 bg-red-300/10 text-red-100 hover:bg-red-300/20";

  if (isLoggedIn) {
    return (
      <>
        <a
          href="/dashboard"
          className={
            baseButton +
            " " +
            (pathname.startsWith("/dashboard") ? activeButton : neutralButton) +
            " max-w-[170px] truncate"
          }
        >
          @{username}
        </a>

        <a href="/logout" className={baseButton + " " + logoutButton}>
          Logout
        </a>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className={
          baseButton +
          " " +
          (pathname.startsWith("/login") ? activeButton : neutralButton)
        }
      >
        Login
      </Link>

      <Link
        href="/register"
        className={
          baseButton +
          " " +
          (pathname.startsWith("/register") ? activeButton : registerButton)
        }
      >
        Register
      </Link>
    </>
  );
}

export default function SiteNav({ username }: { username?: string | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="hidden items-center justify-between gap-6 py-4 lg:flex">
          <Link href="/" className="group shrink-0">
            <div className="text-sm font-black tracking-[0.32em] text-white transition group-hover:text-cyan-300">
              BC
            </div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-cyan-300/70">
              Data • Code • Systems
            </div>
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-2">
            {siteNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "rounded-full px-4 py-2 text-sm font-semibold transition " +
                    (isActive
                      ? "bg-cyan-400 text-black shadow-[0_0_24px_rgba(34,211,238,0.35)]"
                      : "border border-white/10 bg-white/5 text-zinc-300 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white")
                  }
                >
                  {link.label}
                </Link>
              );
            })}

            <AuthNavLinks username={username} />

            <a
              href="mailto:briandacellcabrera@gmail.com"
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-300"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-3 py-3">
            <Link href="/" className="shrink-0">
              <div className="text-sm font-black tracking-[0.3em] text-white">
                BC
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">
                Portfolio
              </div>
            </Link>

            <a
              href="mailto:briandacellcabrera@gmail.com"
              className="rounded-full bg-cyan-400 px-4 py-2 text-xs font-bold text-black"
            >
              Contact
            </a>
          </div>

          <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3">
            {siteNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition " +
                    (isActive
                      ? "bg-cyan-400 text-black"
                      : "border border-white/10 bg-white/5 text-zinc-300")
                  }
                >
                  {link.label}
                </Link>
              );
            })}

            <AuthNavLinks username={username} compact />
          </nav>
        </div>
      </div>
    </header>
  );
}
