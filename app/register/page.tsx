"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

function cleanUsername(value: string) {
  return value.trim().replace(/^@+/, "");
}

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const safeUsername = cleanUsername(username);

    if (!/^[a-zA-Z0-9_]{3,24}$/.test(safeUsername)) {
      setError("Username must be 3–24 characters and only use letters, numbers, or underscores.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: safeUsername,
          display_name: displayName.trim() || safeUsername,
        },
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=/dashboard`
            : undefined,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setMessage("Account created. Check your email to confirm your account, then log in.");
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-16 md:px-6">
        <div className={`${glassPanel} w-full p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <UserPlus size={15} />
            Create Account
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Register for Brian Cabrera&apos;s portfolio
          </h1>

          <p className="mt-4 text-sm leading-7 text-zinc-300 md:text-base">
            Create an account so your future game scores, lab progress, travel plans,
            and saved demo data can be stored under your profile.
          </p>

          <form onSubmit={handleRegister} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Email</span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Username</span>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="brian_dev"
                className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
              />
              <p className="mt-2 text-xs text-zinc-500">
                Letters, numbers, and underscores only. 3–24 characters.
              </p>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Display name</span>
              <input
                type="text"
                autoComplete="name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Optional"
                className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-zinc-300">Password</span>
              <div className="mt-2 flex overflow-hidden rounded-2xl border border-cyan-300/20 bg-black/35">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="border-l border-cyan-300/15 px-4 text-cyan-200 transition hover:bg-cyan-300/10"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm text-red-100">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-cyan-300 hover:text-cyan-200">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
