import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BarChart3,
  Database,
  ExternalLink,
  Gamepad2,
  LogOut,
  Shield,
  UserCircle2,
} from "lucide-react";
import { createClient } from "../../utils/supabase/server";
import SaveDemoDataButton from "./save-demo-data-button";

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
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
                <UserCircle2 size={15} />
                User Dashboard
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
                Welcome, {displayName}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
                This protected page proves your portfolio can support real
                registered users, profiles, sessions, and saved app data.
              </p>
            </div>

            <Link
              href="/logout"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-300/25 bg-red-300/10 px-4 py-2 text-sm font-bold text-red-100 transition hover:bg-red-300/20"
            >
              <LogOut size={15} />
              Logout
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox label="Username" value={`@${username}`} accent />
            <StatBox label="Email" value={user.email ?? "No email"} />
            <StatBox label="Saved Rows" value={savedRows.length} />
            <StatBox label="Auth" value="Supabase" />
          </div>
        </div>

        <section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className={`${glassPanel} p-6 md:p-8`}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Save Test Data
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              First saved data check
            </h2>

            <p className="mt-4 text-sm leading-7 text-zinc-300">
              Press this once to store a demo row under your account in the
              user_app_data table. Later, we can connect this same pattern to
              Snake scores, Blackjack bankroll, Travel plans, and Security Lab
              results.
            </p>

            <div className="mt-6">
              <SaveDemoDataButton />
            </div>
          </div>

          <div className={`${glassPanel} p-6 md:p-8`}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              Saved App Data
            </p>

            {savedRows.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/25 p-5 text-sm leading-7 text-zinc-300">
                No saved app data yet. Save a demo row to test your account data.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {savedRows.map((row) => (
                  <div
                    key={`${row.app_key}-${row.data_key}`}
                    className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
                  >
                    <p className="text-sm font-black text-white">
                      {row.app_key} / {row.data_key}
                    </p>
                    <p className="mt-2 break-words font-mono text-xs leading-5 text-zinc-400">
                      {JSON.stringify(row.data)}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Updated: {row.updated_at ? new Date(row.updated_at).toLocaleString() : "Unknown"}
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
              text: "Later: save Snake high scores, Blackjack bankroll, and launch-readiness audits.",
              icon: Gamepad2,
            },
            {
              title: "Data Lab",
              href: "/data-lab",
              text: "Later: save CSV summaries, scoring presets, and report snapshots.",
              icon: BarChart3,
            },
            {
              title: "Security Lab",
              href: "/security-lab",
              text: "Later: save checklist results and account security progress.",
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
                Backend Proof
              </p>

              <h2 className="mt-3 text-3xl font-black text-white">
                User Save Data and Authentication.
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
                Users such as yourself can now register, log in, keep a profile, and store app data
                behind Row Level Security. 
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

