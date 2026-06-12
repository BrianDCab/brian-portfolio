import Link from "next/link";
import { LogIn } from "lucide-react";

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

export default function LoginPage() {
  return (
    <main className="min-h-screen px-4 py-16 text-white md:px-8">
      <section className="mx-auto max-w-xl">
        <div className={glassPanel + " p-8 md:p-10"}>
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-3 text-cyan-200">
              <LogIn size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300/80">
                Account
              </p>
              <h1 className="text-3xl font-black text-white">Login</h1>
            </div>
          </div>

          <p className="text-sm leading-7 text-zinc-300">
            Log in to access your dashboard and saved portfolio app data.
          </p>

          <form action="/auth/sign-in" method="post" className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/60"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Password</span>
              <input
                name="password"
                type="password"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-300/60"
                placeholder="Your password"
              />
            </label>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-black text-black transition hover:bg-cyan-300"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400">
            Need an account?{" "}
            <Link href="/register" className="font-bold text-cyan-300 hover:text-cyan-200">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
