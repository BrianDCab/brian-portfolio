import Link from "next/link";
import { LogIn } from "lucide-react";
import { loginAction } from "./actions";

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const params = searchParams ? await searchParams : {};

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 md:px-6">
        <div className={`${glassPanel} w-full p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <LogIn size={15} />
            Login
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Welcome back
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
            Log in to access your dashboard and saved portfolio app data.
          </p>

          <form action={loginAction} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
              />
            </label>

            {params?.error && (
              <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
                {params.error}
              </div>
            )}

            {params?.message && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                {params.message}
              </div>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
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

