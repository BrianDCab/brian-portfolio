import Link from "next/link";
import { LogIn } from "lucide-react";

const glassPanel =
  "rounded-lg border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/40 backdrop-blur-md";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <main className="min-h-screen px-4 py-16 text-white md:px-6">
      <section className="mx-auto max-w-xl">
        <div className={glassPanel + " p-6 md:p-10"}>
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-md border border-accent-400/30 bg-accent-500/10 p-3 text-accent-200">
              <LogIn size={22} />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent-300/80">
                Account
              </p>
              <h1 className="text-3xl font-semibold text-white">Login</h1>
            </div>
          </div>

          <p className="text-sm leading-7 text-zinc-300">
            Log in to access your dashboard and saved portfolio app data.
          </p>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-md border border-accent-400/30 bg-accent-500/10 p-4 text-sm text-accent-100"
            >
              {error}
            </div>
          )}

          {message && (
            <div
              role="status"
              className="mt-6 rounded-md border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100"
            >
              {message}
            </div>
          )}

          <form action="/auth/sign-in" method="post" className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-zinc-300">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-accent-400/70"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-zinc-300">
                Password
              </span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-md border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-accent-400/70"
                placeholder="Your password"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-accent-400/60 bg-accent-500/90 px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400">
            Need an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-accent-300 hover:text-accent-200"
            >
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
