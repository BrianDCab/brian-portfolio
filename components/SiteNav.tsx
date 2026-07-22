"use client";

import {
  useState,
  type FocusEvent,
  type MouseEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText, Menu, X } from "lucide-react";

export const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Travel", href: "/travel" },
];

export const labNavLinks = [
  {
    label: "Data Lab",
    href: "/data-lab",
    description: "CSV tools, dashboards, and data experiments",
  },
  {
    label: "Geo Lab",
    href: "/geo-lab",
    description: "Interactive mapping and location tools",
  },
  {
    label: "Security Lab",
    href: "/security-lab",
    description: "Security-focused projects and demonstrations",
  },
  {
    label: "Playground",
    href: "/playground",
    description: "Games and interactive coding projects",
  },
  {
    label: "Chaos Lab",
    href: "/chaos-lab",
    description: "Experimental interfaces and interactions",
  },
  {
    label: "Gravity Lab",
    href: "/gravity-lab",
    description: "Physics and motion experiments",
  },
];

export const siteNavLinks = [...primaryNavLinks, ...labNavLinks];

function isLinkActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function ResumeNavButton({
  compact = false,
  fullWidth = false,
}: {
  compact?: boolean;
  fullWidth?: boolean;
}) {
  const sizeClasses = compact
    ? "px-3 py-2 text-xs"
    : "px-4 py-2 text-sm";

  return (
    <a
      href="/Brian_Cabrera_Resume.pdf"
      target="_blank"
      rel="noreferrer"
      className={[
        "group inline-flex shrink-0 items-center justify-center gap-2 rounded-sm",
        "border border-fuchsia-400/50 bg-fuchsia-500/10 font-semibold text-fuchsia-200",
        "",
        "transition duration-300",
        "hover:border-fuchsia-300 hover:bg-fuchsia-500/80",
        "hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-fuchsia-300 focus-visible:ring-offset-2",
        "focus-visible:ring-offset-black",
        sizeClasses,
        fullWidth ? "w-full" : "",
      ].join(" ")}
    >
      <FileText
        size={compact ? 14 : 15}
        className="transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"
      />

      Resume
    </a>
  );
}

function AuthNavLinks({
  username,
  compact = false,
  fullWidth = false,
}: {
  username?: string | null;
  compact?: boolean;
  fullWidth?: boolean;
}) {
  const pathname = usePathname();
  const isLoggedIn = Boolean(username);

  const baseButton = [
    "inline-flex shrink-0 items-center justify-center rounded-sm font-semibold transition",
    compact ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm",
    fullWidth ? "w-full" : "",
  ].join(" ");

  const neutralButton =
    "border border-white/10 bg-white/5 text-zinc-300 hover:border-accent-300/40 hover:bg-accent-400/10 hover:text-white";

  const activeButton =
    "border border-accent-400/60 bg-accent-500/15 text-accent-200";

  // One subdued account entry either way. Recruiters don't need two
  // competing auth buttons in the main nav.
  if (isLoggedIn) {
    return (
      <>
        <Link
          href="/dashboard"
          className={[
            baseButton,
            pathname.startsWith("/dashboard") ? activeButton : neutralButton,
          ].join(" ")}
        >
          Dashboard
        </Link>

        <form action="/logout" method="post" className={fullWidth ? "w-full" : ""}>
          <button type="submit" className={`${baseButton} ${neutralButton}`}>
            Logout
          </button>
        </form>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className={[
        baseButton,
        pathname.startsWith("/login") || pathname.startsWith("/register")
          ? activeButton
          : neutralButton,
      ].join(" ")}
    >
      Account
    </Link>
  );
}

function DesktopLabsDropdown({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [suppressHover, setSuppressHover] = useState(false);

  const isLabsActive = labNavLinks.some((link) =>
    isLinkActive(pathname, link.href),
  );

  function handleMouseEnter() {
    if (!suppressHover) {
      setIsOpen(true);
    }
  }

  function handleMouseLeave() {
    setIsOpen(false);
    setSuppressHover(false);
  }

  function handleLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    setIsOpen(false);
    setSuppressHover(true);
    event.currentTarget.blur();
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget as Node | null;

    if (
      !nextFocusedElement ||
      !event.currentTarget.contains(nextFocusedElement)
    ) {
      setIsOpen(false);
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={() => {
        if (!suppressHover) {
          setIsOpen(true);
        }
      }}
      onBlurCapture={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
          setSuppressHover(true);

          const activeElement =
            document.activeElement as HTMLElement | null;

          activeElement?.blur();
        }
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={[
          "inline-flex items-center gap-1.5 rounded-sm px-4 py-2",
          "text-sm font-semibold transition",
          isLabsActive
            ? "border border-accent-400/60 bg-accent-500/15 text-accent-200"
            : "border border-white/10 bg-white/5 text-zinc-300 hover:border-accent-300/40 hover:bg-accent-400/10 hover:text-white",
        ].join(" ")}
      >
        Labs

        <ChevronDown
          size={15}
          className={[
            "transition-transform duration-200",
            isOpen ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-3",
          "transition duration-200",
          isOpen
            ? "visible translate-y-0 opacity-100 pointer-events-auto"
            : "invisible translate-y-2 opacity-0 pointer-events-none",
        ].join(" ")}
      >
        <div
          role="menu"
          className="rounded-md border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          <div className="px-3 pb-2 pt-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-300/70">
              Interactive Labs
            </p>
          </div>

          <div className="grid gap-1">
            {labNavLinks.map((link) => {
              const isActive = isLinkActive(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={
                    link.href === "/geo-lab" ? false : undefined
                  }
                  role="menuitem"
                  onClick={handleLinkClick}
                  className={[
                    "rounded-md border px-3 py-3 transition",
                    isActive
                      ? "border-accent-300/40 bg-accent-400/15"
                      : "border-transparent hover:border-white/10 hover:bg-white/5",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "text-sm font-semibold",
                      isActive ? "text-accent-200" : "text-white",
                    ].join(" ")}
                  >
                    {link.label}
                  </div>

                  <div className="mt-1 text-xs leading-relaxed text-zinc-500">
                    {link.description}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SiteNav({
  username,
}: {
  username?: string | null;
}) {
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLabsOpen, setMobileLabsOpen] = useState(false);

  // Close the mobile menu when the route changes, without an effect
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setMobileMenuOpen(false);
    setMobileLabsOpen(false);
  }

  const isLabsActive = labNavLinks.some((link) =>
    isLinkActive(pathname, link.href),
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="hidden items-center justify-between gap-6 py-4 lg:flex">
          <Link href="/" className="group shrink-0">
            <div className="font-mono font-mono text-sm font-semibold tracking-[0.2em] text-white transition group-hover:text-accent-300">
              BC
            </div>

            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-300/70">
              data / code / systems
            </div>
          </Link>

          <nav className="flex items-center justify-end gap-2">
            {primaryNavLinks
              .filter((link) => link.href !== "/travel")
              .map((link) => {
                const isActive = isLinkActive(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={[
                      "rounded-sm px-4 py-2 text-sm font-semibold transition",
                      isActive
                        ? "border border-accent-400/60 bg-accent-500/15 text-accent-200"
                        : "border border-white/10 bg-white/5 text-zinc-300 hover:border-accent-300/40 hover:bg-accent-400/10 hover:text-white",
                    ].join(" ")}
                  >
                    {link.label}
                  </Link>
                );
              })}

            <DesktopLabsDropdown pathname={pathname} />

            <Link
              href="/travel"
              className={[
                "rounded-sm px-4 py-2 text-sm font-semibold transition",
                isLinkActive(pathname, "/travel")
                  ? "border border-accent-400/60 bg-accent-500/15 text-accent-200"
                  : "border border-white/10 bg-white/5 text-zinc-300 hover:border-accent-300/40 hover:bg-accent-400/10 hover:text-white",
              ].join(" ")}
            >
              Travel
            </Link>

            <ResumeNavButton />

            <AuthNavLinks username={username} />

            <a
              href="mailto:briandacellcabrera@gmail.com"
              className="rounded-sm border border-accent-400/60 bg-accent-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-400"
            >
              Contact
            </a>
          </nav>
        </div>

        <div className="lg:hidden">
          <div className="flex items-center justify-between gap-3 py-3">
            <Link href="/" className="shrink-0">
              <div className="font-mono text-sm font-semibold tracking-[0.2em] text-white">
                BC
              </div>

              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-300/70">
                Portfolio
              </div>
            </Link>

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen((current) => !current)
              }
              aria-label={
                mobileMenuOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-white transition hover:border-accent-300/40 hover:bg-accent-400/10"
            >
              {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="border-t border-white/10 pb-4 pt-3">
              <div className="grid gap-2">
                {primaryNavLinks
                  .filter((link) => link.href !== "/travel")
                  .map((link) => {
                    const isActive = isLinkActive(
                      pathname,
                      link.href,
                    );

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={[
                          "rounded-md border px-4 py-3 text-sm font-semibold transition",
                          isActive
                            ? "border-accent-400/60 bg-accent-500/15 text-accent-200"
                            : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
                        ].join(" ")}
                      >
                        {link.label}
                      </Link>
                    );
                  })}

                <div className="overflow-hidden rounded-md border border-white/10 bg-white/5">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileLabsOpen((current) => !current)
                    }
                    aria-expanded={mobileLabsOpen}
                    className={[
                      "flex w-full items-center justify-between px-4 py-3",
                      "text-left text-sm font-semibold transition",
                      isLabsActive
                        ? "text-accent-200"
                        : "text-zinc-300",
                    ].join(" ")}
                  >
                    <span>Labs</span>

                    <ChevronDown
                      size={16}
                      className={[
                        "transition-transform duration-200",
                        mobileLabsOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {mobileLabsOpen && (
                    <div className="grid gap-1 border-t border-white/10 p-2">
                      {labNavLinks.map((link) => {
                        const isActive = isLinkActive(
                          pathname,
                          link.href,
                        );

                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            prefetch={
                              link.href === "/geo-lab"
                                ? false
                                : undefined
                            }
                            className={[
                              "rounded-lg px-3 py-3 transition",
                              isActive
                                ? "bg-accent-400/15 text-accent-200"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white",
                            ].join(" ")}
                          >
                            <div className="text-sm font-semibold">
                              {link.label}
                            </div>

                            <div className="mt-1 text-xs leading-relaxed text-zinc-500">
                              {link.description}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Link
                  href="/travel"
                  className={[
                    "rounded-md border px-4 py-3 text-sm font-semibold transition",
                    isLinkActive(pathname, "/travel")
                      ? "border-accent-400/60 bg-accent-500/15 text-accent-200"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  Travel
                </Link>

                <div className="my-1 h-px bg-white/10" />

                <ResumeNavButton compact fullWidth />

                <AuthNavLinks
                  username={username}
                  compact
                  fullWidth
                />

                <a
                  href="mailto:briandacellcabrera@gmail.com"
                  className="inline-flex w-full items-center justify-center rounded-sm border border-accent-400/60 bg-accent-500/90 px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-400"
                >
                  Contact
                </a>
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}