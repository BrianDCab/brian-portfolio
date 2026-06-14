export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  BarChart3,
  Construction,
  Database,
  ExternalLink,
  Gamepad2,
  LogOut,
  Shield,
  UserCircle2,
} from "lucide-react";
import { createClient } from "../../utils/supabase/server";

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

function StatBox({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-2xl border p-4 ${
        accent
          ? "border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_25px_rgba(34,211,238,0.10)]"
          : "border-cyan-300/15 bg-black/25"
      }`}
    >
      <p className="truncate text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </p>

      <p
        className={`mt-2 min-w-0 break-words leading-tight text-white ${
          accent ? "text-2xl font-black text-cyan-200" : "text-xl font-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, created_at")
    .eq("id", user.id)
    .single();

  const { data: savedData } = await supabase
    .from("user_app_data")
    .select("app_key, data_key, data, updated_at")
    .order("updated_at", { ascending: false })
    .limit(8);

  const username = profile?.username ?? "user";
  const displayName = profile?.display_name ?? username;
  const savedRows = savedData ?? [];

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-yellow-100">
                <Construction size={15} />
                Dashboard — Active WIP
              </div>

              <h1 className="mt-6 break-words text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                Hey, {displayName}.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
                I’m still building this part of the site. Registration, email
                confirmation, profiles, and the protected dashboard are in
                place, but I’m still tightening session handling and
                account-based saves before I call it finished.
              </p>
            </div>

            <a
              href="/logout"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-300/25 bg-red-300/10 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-300/20"
            >
              <LogOut size={15} />
              Logout
            </a>
          </div>

          <div className="mt-7 flex gap-3 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 text-sm leading-6 text-yellow-50">
            <AlertTriangle className="mt-0.5 shrink-0 text-yellow-300" size={19} />
            <p>
              Heads up: this page is under active development. Some account
              features may behave inconsistently while I finish the production
              auth and persistence flow.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox label="Username" value={`@${username}`} accent />
            <StatBox label="Email" value={user.email ?? "No email"} />
            <StatBox label="Saved Rows" value={savedRows.length} />
            <StatBox label="Backend" value="Supabase" />
          </div>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`${glassPanel} p-6 md:p-8`}>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-yellow-100">
              <Construction size={14} />
              Save System — WIP
            </div>

            <h2 className="mt-4 text-3xl font-black text-white">
              Account saves are the next big piece
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              The goal is to let each account keep Snake scores, Blackjack
              stats, Data Lab reports, Travel settings, and Security Lab
              progress. The database pieces are here, but I’m not calling this
              finished until the save flow works reliably across sessions and
              production deployments.
            </p>

            <button
              type="button"
              disabled
              className="mt-6 inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-yellow-300/25 bg-yellow-300/10 px-5 py-3 text-sm font-bold text-yellow-100 opacity-80"
            >
              <Database size={16} />
              Save data — WIP
            </button>

            <p className="mt-3 text-xs leading-5 text-zinc-500">
              I’ve disabled the public test button for now instead of leaving a
              feature live that I know still needs work.
            </p>
          </div>

          <div className={`${glassPanel} p-6 md:p-8`}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Current Saved Data
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              What this account already has
            </h2>

            {savedRows.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/25 p-5 text-sm leading-7 text-zinc-300">
                Nothing is saved for this account yet. This section will fill in
                once the account save flow is ready.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {savedRows.map((row) => (
                  <div
                    key={`${row.app_key}-${row.data_key}`}
                    className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
                  >
                    <p className="break-words text-sm font-black text-white">
                      {row.app_key} / {row.data_key}
                    </p>

                    <p className="mt-2 break-words font-mono text-xs leading-5 text-zinc-400">
                      {JSON.stringify(row.data)}
                    </p>

                    <p className="mt-2 text-xs text-zinc-500">
                      Updated:{" "}
                      {row.updated_at
                        ? new Date(row.updated_at).toLocaleString()
                        : "Unknown"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Playground",
              href: "/playground",
              text: "I’m planning to connect Snake scores, Blackjack stats, and launch-readiness results to each account.",
              icon: Gamepad2,
            },
            {
              title: "Data Lab",
              href: "/data-lab",
              text: "I want users to eventually save CSV summaries, selected metrics, interpretations, and report snapshots.",
              icon: BarChart3,
            },
            {
              title: "Security Lab",
              href: "/security-lab",
              text: "This will eventually track security checklist progress, account settings, and session-related tools.",
              icon: Shield,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] p-6 shadow-2xl shadow-black/20 backdrop-blur-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-black/25 text-cyan-300">
                  <Icon size={22} />
                </div>

                <h3 className="mt-5 text-2xl font-black text-white">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {item.text}
                </p>

                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-sm font-bold text-black transition hover:bg-cyan-300"
                >
                  Open <ExternalLink size={15} />
                </Link>
              </div>
            );
          })}
        </section>

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <div className="flex items-start gap-4">
            <Database className="mt-1 shrink-0 text-cyan-300" size={24} />

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                What I’m Working On
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                The foundation is here. I’m still making it reliable.
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
                I’ve already built registration, email confirmation, user
                profiles, protected routes, Supabase tables, and Row Level
                Security. What I’m working through now is the production side:
                consistent sessions, clean logout behavior, and saved app data
                that follows each user without breaking between pages.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-200">
                    Built
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">
                    Registration, email confirmation, profiles, database tables,
                    protected pages, and Row Level Security.
                  </p>
                </div>

                <div className="rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-100">
                    Still in progress
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-200">
                    Production session consistency, account saves, game-data
                    syncing, and a finished dashboard experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
