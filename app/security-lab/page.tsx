"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Route,
  Server,
  Shield,
  UserCheck,
  UserCog,
  XCircle,
} from "lucide-react";

type ToolKey = "password" | "auth" | "secrets" | "permissions";
type AuthRole = "Guest" | "User" | "Admin";
type SessionState = "none" | "active" | "expired";
type RouteKey = "public" | "dashboard" | "admin" | "export";
type PillTone = "default" | "good" | "warn" | "bad";

type SecretFinding = {
  lineNumber: number;
  label: string;
  severity: "high" | "medium" | "low";
  preview: string;
};

type PermissionAction = {
  key: string;
  label: string;
  description: string;
};

const glassPanel =
  "rounded-[2rem] border border-cyan-300/25 bg-cyan-950/[0.16] shadow-2xl shadow-cyan-950/30 backdrop-blur-md";

const glassCard =
  "rounded-3xl border border-cyan-300/20 bg-cyan-950/[0.14] shadow-2xl shadow-black/20 backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]";

const tools = [
  {
    key: "password" as const,
    title: "Password Auditor",
    label: "Credential Safety",
    text: "I built this to show how I would give someone useful password feedback without storing or transmitting what they type.",
    icon: KeyRound,
  },
  {
    key: "auth" as const,
    title: "Auth Flow Visualizer",
    label: "Broken Access Control",
    text: "Use this to test whether a route should open, redirect, or fail closed based on the session and role.",
    icon: Route,
  },
  {
    key: "secrets" as const,
    title: "Secret Exposure Scanner",
    label: "Leak Prevention",
    text: "Paste fake environment-variable text and I will flag secret-like names, public exposure risks, and values that should stay server-side.",
    icon: Server,
  },
  {
    key: "permissions" as const,
    title: "Permissions Matrix",
    label: "Least Privilege",
    text: "This models how I separate normal users, guests, and administrators instead of trusting the frontend to decide access.",
    icon: UserCog,
  },
];

const securityPrinciples = [
  {
    title: "Deny by default",
    text: "If the session, role, or route requirement is unclear, I would rather block the action than guess and expose something.",
  },
  {
    title: "Enforce it on the server",
    text: "Hiding a button is not security. Protected reads, writes, exports, and role checks still need server-side enforcement.",
  },
  {
    title: "Keep secrets out of the browser",
    text: "Public environment variables are visible to users. Private keys, service credentials, and tokens belong behind a server boundary.",
  },
  {
    title: "Give every role only what it needs",
    text: "The smaller the permission set, the smaller the damage if an account or session is misused.",
  },
];

const passwordChecks = [
  { key: "length", label: "At least 12 characters" },
  { key: "upper", label: "Uppercase letter" },
  { key: "lower", label: "Lowercase letter" },
  { key: "number", label: "Number" },
  { key: "symbol", label: "Symbol" },
  { key: "noCommon", label: "Not a common weak pattern" },
];

const routeRules: Record<RouteKey, { label: string; requiredRole: AuthRole | null }> = {
  public: {
    label: "Public Landing Page",
    requiredRole: null,
  },
  dashboard: {
    label: "Protected Dashboard",
    requiredRole: "User",
  },
  admin: {
    label: "Admin Console",
    requiredRole: "Admin",
  },
  export: {
    label: "Data Export",
    requiredRole: "Admin",
  },
};

const permissionActions: PermissionAction[] = [
  {
    key: "viewPublic",
    label: "View public pages",
    description: "Open marketing pages, public docs, and normal site content.",
  },
  {
    key: "viewDashboard",
    label: "View dashboard",
    description: "Access authenticated user dashboard content.",
  },
  {
    key: "editProfile",
    label: "Edit own profile",
    description: "Update only the signed-in user's own profile fields.",
  },
  {
    key: "exportData",
    label: "Export data",
    description: "Download or export operational records.",
  },
  {
    key: "manageUsers",
    label: "Manage users",
    description: "Change roles, disable users, or adjust account access.",
  },
  {
    key: "deleteRecords",
    label: "Delete records",
    description: "Delete sensitive or business-critical records.",
  },
  {
    key: "viewSecrets",
    label: "View secrets",
    description: "See API keys, tokens, or private infrastructure values.",
  },
];

const rolePermissions: Record<AuthRole, string[]> = {
  Guest: ["viewPublic"],
  User: ["viewPublic", "viewDashboard", "editProfile"],
  Admin: [
    "viewPublic",
    "viewDashboard",
    "editProfile",
    "exportData",
    "manageUsers",
    "deleteRecords",
  ],
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function redactSecretLine(line: string) {
  const separatorIndex = line.indexOf("=");

  if (separatorIndex === -1) {
    return line.length > 52 ? `${line.slice(0, 52)}...` : line;
  }

  const key = line.slice(0, separatorIndex).trim();
  return `${key}=••••••••`;
}

function ProjectButton({
  href,
  children,
  subtle = false,
}: {
  href: string;
  children: ReactNode;
  subtle?: boolean;
}) {
  const isEmail = href.startsWith("mailto:");
  const isInternal = href.startsWith("/");

  const className = subtle
    ? "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-300/10"
    : "inline-flex items-center justify-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-black shadow-[0_0_22px_rgba(34,211,238,0.25)] transition hover:-translate-y-0.5 hover:bg-cyan-300";

  if (isInternal) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer"}
    >
      {children}
    </a>
  );
}

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
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/80">
        {label}
      </p>

      <p
        className={
          accent
            ? "mt-2 break-words text-3xl font-black leading-tight text-cyan-200"
            : "mt-2 break-words text-2xl font-black leading-tight text-white"
        }
      >
        {value}
      </p>
    </div>
  );
}

function Pill({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: PillTone;
}) {
  const styles =
    tone === "good"
      ? "border-emerald-300/25 bg-emerald-300/10 text-emerald-200"
      : tone === "warn"
        ? "border-amber-300/25 bg-amber-300/10 text-amber-200"
        : tone === "bad"
          ? "border-red-300/25 bg-red-300/10 text-red-200"
          : "border-cyan-300/20 bg-black/25 text-zinc-300";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${styles}`}
    >
      {children}
    </span>
  );
}

function CheckRow({
  passed,
  children,
}: {
  passed: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-cyan-300/10 bg-black/25 p-4 text-sm leading-6 text-zinc-300">
      {passed ? (
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={18} />
      ) : (
        <XCircle className="mt-0.5 shrink-0 text-red-300" size={18} />
      )}
      <span>{children}</span>
    </div>
  );
}

export default function SecurityLab() {
  const [activeTool, setActiveTool] = useState<ToolKey>("password");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [authRole, setAuthRole] = useState<AuthRole>("User");
  const [sessionState, setSessionState] = useState<SessionState>("active");
  const [selectedRoute, setSelectedRoute] = useState<RouteKey>("dashboard");

  const [secretInput, setSecretInput] = useState(
    "NEXT_PUBLIC_ANALYTICS_ID=demo_public_value\nAPI_KEY=replace_with_fake_value\nDATABASE_URL=postgres://fake.example\nSESSION_SECRET=super_fake_demo_secret"
  );

  const [selectedPermissionRole, setSelectedPermissionRole] =
    useState<AuthRole>("User");

  const passwordAudit = useMemo(() => {
    const commonPatterns = ["password", "qwerty", "admin", "letmein", "123456"];
    const lowerPassword = password.toLowerCase();

    const checks = {
      length: password.length >= 12,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
      noCommon: !commonPatterns.some((pattern) =>
        lowerPassword.includes(pattern)
      ),
    };

    const varietyScore =
      Number(checks.upper) +
      Number(checks.lower) +
      Number(checks.number) +
      Number(checks.symbol);

    const lengthScore = clamp(password.length * 4, 0, 45);
    const varietyBonus = varietyScore * 11;
    const commonPenalty = checks.noCommon ? 0 : 25;
    const repeatPenalty = /(.)\1{2,}/.test(password) ? 12 : 0;

    const score = Math.round(
      clamp(lengthScore + varietyBonus - commonPenalty - repeatPenalty, 0, 100)
    );

    const label =
      password.length === 0
        ? "Waiting"
        : score >= 85
          ? "Strong"
          : score >= 65
            ? "Decent"
            : score >= 40
              ? "Weak"
              : "Very Weak";

    const tone: PillTone =
      score >= 85
        ? "good"
        : score >= 65
          ? "warn"
          : password.length === 0
            ? "default"
            : "bad";

    return {
      checks,
      score,
      label,
      tone,
    };
  }, [password]);

  const authDecision = useMemo(() => {
    const route = routeRules[selectedRoute];

    if (!route.requiredRole) {
      return {
        allowed: true,
        title: "Allowed",
        reason: "This route is public and does not require a session.",
      };
    }

    if (sessionState === "none") {
      return {
        allowed: false,
        title: "Redirect to login",
        reason: "The route is protected and no active session exists.",
      };
    }

    if (sessionState === "expired") {
      return {
        allowed: false,
        title: "Session expired",
        reason:
          "The user should re-authenticate before viewing protected content.",
      };
    }

    if (route.requiredRole === "Admin" && authRole !== "Admin") {
      return {
        allowed: false,
        title: "Blocked",
        reason:
          "This route requires an Admin role. A normal user should not access it.",
      };
    }

    return {
      allowed: true,
      title: "Allowed",
      reason: "The active session and role satisfy this route requirement.",
    };
  }, [authRole, sessionState, selectedRoute]);

  const secretFindings = useMemo<SecretFinding[]>(() => {
    const riskyPatterns = [
      {
        label: "API key",
        regex: /(^|\s)(API_KEY|OPENAI_API_KEY|STRIPE_SECRET_KEY)\s*=/i,
        severity: "high" as const,
      },
      {
        label: "Token",
        regex: /(^|\s)(TOKEN|ACCESS_TOKEN|REFRESH_TOKEN|JWT_SECRET)\s*=/i,
        severity: "high" as const,
      },
      {
        label: "Secret",
        regex: /(^|\s)(SECRET|CLIENT_SECRET|SESSION_SECRET)\s*=/i,
        severity: "high" as const,
      },
      {
        label: "Password",
        regex: /(^|\s)(PASSWORD|DB_PASSWORD)\s*=/i,
        severity: "high" as const,
      },
      {
        label: "Database URL",
        regex: /(^|\s)(DATABASE_URL|DB_URL)\s*=/i,
        severity: "medium" as const,
      },
      {
        label: "Publicly exposed secret-like variable",
        regex: /^NEXT_PUBLIC_.*(SECRET|KEY|TOKEN|PASSWORD|DATABASE_URL)/i,
        severity: "high" as const,
      },
      {
        label: "Public env var",
        regex: /^NEXT_PUBLIC_/i,
        severity: "low" as const,
      },
      {
        label: "Private key",
        regex: /PRIVATE_KEY|BEGIN\s+(RSA|OPENSSH|PRIVATE)/i,
        severity: "high" as const,
      },
    ];

    return secretInput
      .split("\n")
      .flatMap((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return [];

        return riskyPatterns
          .filter((pattern) => pattern.regex.test(trimmed))
          .map((pattern) => ({
            lineNumber: index + 1,
            label: pattern.label,
            severity: pattern.severity,
            preview: redactSecretLine(trimmed),
          }));
      });
  }, [secretInput]);

  const permissionStats = useMemo(() => {
    const allowed = rolePermissions[selectedPermissionRole];
    const total = permissionActions.length;
    const allowedCount = allowed.length;
    const leastPrivilegeScore = Math.round(
      clamp(100 - (allowedCount / total) * 55, 0, 100)
    );

    return {
      allowed,
      allowedCount,
      deniedCount: total - allowedCount,
      leastPrivilegeScore,
    };
  }, [selectedPermissionRole]);

  const highSeverityCount = secretFindings.filter(
    (finding) => finding.severity === "high"
  ).length;

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16 lg:py-24">
        <div className={`${glassPanel} p-6 md:p-10`}>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">
            <Shield size={15} />
            Security Lab
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
            Here is how I think through common web security mistakes
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
            I built this page to make my security thinking visible instead of
            just listing “authentication” or “secure coding” as skills. You can
            test password feedback, route decisions, secret handling, and role
            permissions to see where I draw the line between normal frontend
            behavior and security that must be enforced on the server.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ProjectButton href="/projects">
              Back to Projects <ExternalLink size={15} />
            </ProjectButton>

            <ProjectButton href="mailto:briandacellcabrera@gmail.com" subtle>
              Contact Me <Mail size={15} />
            </ProjectButton>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatBox label="Hands-On Demos" value="4" accent />
            <StatBox label="Approach" value="Defensive" />
            <StatBox label="Real Secrets Stored" value="Never" />
            <StatBox label="Default Decision" value="Deny" />
          </div>
        </div>

        <section className="mt-12">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
              What I am trying to prevent
            </p>

            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
              The failures behind these demos
            </h2>

            <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400 md:text-base">
              These are not random widgets. Each one maps to a real class of
              mistake: weak credential guidance, broken access control, leaked
              secrets, and accounts with more power than they need.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {securityPrinciples.map((principle) => (
              <div key={principle.title} className={`${glassCard} p-5`}>
                <h3 className="text-lg font-black text-white">
                  {principle.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {principle.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const active = activeTool === tool.key;

            return (
              <button
                key={tool.key}
                type="button"
                onClick={() => setActiveTool(tool.key)}
                className={`text-left ${glassCard} p-6 ${
                  active
                    ? "border-cyan-300/60 bg-cyan-300/[0.11] shadow-[0_0_30px_rgba(34,211,238,0.12)]"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                      {tool.label}
                    </p>

                    <h2 className="mt-3 text-2xl font-black text-white">
                      {tool.title}
                    </h2>
                  </div>

                  <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 p-3 text-cyan-200">
                    <Icon size={24} />
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-zinc-300">
                  {tool.text}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-cyan-300">
                  Open tool <ArrowRight size={15} />
                </div>
              </button>
            );
          })}
        </section>

        {activeTool === "password" && (
          <section className="mt-12 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Password Auditor
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                I can score the input without ever keeping it
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Type a sample password and the checks run entirely in your
                browser. I do not send it to an API, save it, log it, or place it
                in local storage. This is the kind of feedback I would use to
                guide a user without collecting more sensitive data than I need.
              </p>

              <label className="mt-6 block">
                <span className="text-sm font-bold text-zinc-300">
                  Test password
                </span>

                <div className="mt-2 flex overflow-hidden rounded-2xl border border-cyan-300/20 bg-black/35">
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Type a sample password..."
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600"
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

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatBox
                  label="Strength"
                  value={`${passwordAudit.score}/100`}
                  accent
                />
                <StatBox label="Rating" value={passwordAudit.label} />
                <StatBox label="Length" value={password.length} />
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <Pill tone={passwordAudit.tone}>{passwordAudit.label}</Pill>
                <Pill>Local only</Pill>
                <Pill>No storage</Pill>
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Checklist
              </p>

              <div className="mt-6 space-y-3">
                {passwordChecks.map((check) => (
                  <CheckRow
                    key={check.key}
                    passed={
                      passwordAudit.checks[
                        check.key as keyof typeof passwordAudit.checks
                      ]
                    }
                  >
                    {check.label}
                  </CheckRow>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
                <strong>My rule:</strong> the application should never store a
                plain-text password. A real system should use a proven auth
                provider or a slow password-hashing algorithm, plus rate limits
                and breach-aware protections around the login endpoint.
              </div>
            </div>
          </section>
        )}

        {activeTool === "auth" && (
          <section className="mt-12 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Auth Flow Visualizer
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Test whether the request should be trusted
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Change the role, session state, and route. I use the same basic
                questions when protecting an application: Is the session valid?
                Does this role belong here? If either answer is no, the request
                should be blocked or redirected before sensitive data is read.
              </p>

              <div className="mt-6 grid gap-4">
                <label className="block">
                  <span className="text-sm font-bold text-zinc-300">Role</span>
                  <select
                    value={authRole}
                    onChange={(event) =>
                      setAuthRole(event.target.value as AuthRole)
                    }
                    className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none"
                  >
                    <option>Guest</option>
                    <option>User</option>
                    <option>Admin</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-zinc-300">
                    Session State
                  </span>
                  <select
                    value={sessionState}
                    onChange={(event) =>
                      setSessionState(event.target.value as SessionState)
                    }
                    className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none"
                  >
                    <option value="none">No session</option>
                    <option value="active">Active session</option>
                    <option value="expired">Expired session</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-zinc-300">Route</span>
                  <select
                    value={selectedRoute}
                    onChange={(event) =>
                      setSelectedRoute(event.target.value as RouteKey)
                    }
                    className="mt-2 w-full rounded-2xl border border-cyan-300/20 bg-black/35 px-4 py-3 text-sm font-bold text-white outline-none"
                  >
                    <option value="public">Public Landing Page</option>
                    <option value="dashboard">Protected Dashboard</option>
                    <option value="admin">Admin Console</option>
                    <option value="export">Data Export</option>
                  </select>
                </label>
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    authDecision.allowed
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                      : "border-red-300/30 bg-red-300/10 text-red-200"
                  }`}
                >
                  {authDecision.allowed ? (
                    <UserCheck size={22} />
                  ) : (
                    <LockKeyhole size={22} />
                  )}
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">
                    Decision
                  </p>
                  <h3 className="text-3xl font-black text-white">
                    {authDecision.title}
                  </h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-300">
                {authDecision.reason}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatBox label="Role" value={authRole} />
                <StatBox
                  label="Session"
                  value={
                    sessionState === "none"
                      ? "None"
                      : sessionState === "active"
                        ? "Active"
                        : "Expired"
                  }
                />
                <StatBox
                  label="Route"
                  value={routeRules[selectedRoute].label}
                />
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm leading-6 text-zinc-300">
                I would still enforce this on the server. A hidden link or a
                client-side redirect can improve the experience, but neither one
                prevents someone from calling the route directly.
              </div>
            </div>
          </section>
        )}

        {activeTool === "secrets" && (
          <section className="mt-12 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Secret Safety Checker
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Catch secret exposure before it reaches a repository
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Use fake text only. I scan the variable names locally, flag
                values that look private, warn when a secret-like name is marked
                public, and redact the value in the findings panel so the tool
                does not repeat sensitive text back onto the screen.
              </p>

              <textarea
                value={secretInput}
                onChange={(event) => setSecretInput(event.target.value)}
                spellCheck={false}
                className="mt-6 min-h-72 w-full rounded-3xl border border-cyan-300/20 bg-black/35 p-4 font-mono text-sm leading-6 text-cyan-100 outline-none placeholder:text-zinc-600"
              />

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSecretInput("")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                >
                  Clear Text
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setSecretInput(
                      "NEXT_PUBLIC_ANALYTICS_ID=demo_public_value\nAPI_KEY=replace_with_fake_value\nDATABASE_URL=postgres://fake.example\nSESSION_SECRET=super_fake_demo_secret"
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-300/25 bg-black/25 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                >
                  Load Demo Text
                </button>
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Findings
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatBox label="Findings" value={secretFindings.length} accent />
                <StatBox label="High Severity" value={highSeverityCount} />
              </div>

              <div className="mt-6 space-y-3">
                {secretFindings.length === 0 ? (
                  <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-100">
                    No risky patterns found in the current text.
                  </div>
                ) : (
                  secretFindings.map((finding) => (
                    <div
                      key={`${finding.lineNumber}-${finding.label}-${finding.preview}`}
                      className="rounded-2xl border border-cyan-300/15 bg-black/25 p-4"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill
                          tone={
                            finding.severity === "high"
                              ? "bad"
                              : finding.severity === "medium"
                                ? "warn"
                                : "default"
                          }
                        >
                          {finding.severity}
                        </Pill>
                        <p className="text-sm font-black text-white">
                          Line {finding.lineNumber}: {finding.label}
                        </p>
                      </div>

                      <p className="mt-3 break-words font-mono text-xs leading-5 text-zinc-400">
                        {finding.preview}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-red-300/20 bg-red-300/10 p-4 text-sm leading-6 text-red-100">
                <AlertTriangle className="mb-2" size={18} />
                Do not paste a real key here. If a secret has already appeared
                in a public repository, screenshot, build log, or browser
                bundle, hiding the file later is not enough—the credential
                should be rotated.
              </div>
            </div>
          </section>
        )}

        {activeTool === "permissions" && (
          <section className="mt-12 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Permissions Matrix
              </p>

              <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">
                Give the account only the access it actually needs
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-300">
                Pick a role and compare what it can do. I intentionally keep the
                normal user narrow, reserve destructive operations for admins,
                and keep direct secret access outside the dashboard entirely.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {(["Guest", "User", "Admin"] as AuthRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedPermissionRole(role)}
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                      selectedPermissionRole === role
                        ? "bg-cyan-400 text-black"
                        : "border border-cyan-300/25 bg-black/25 text-cyan-200 hover:border-cyan-300/50"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <StatBox
                  label="Least Privilege"
                  value={`${permissionStats.leastPrivilegeScore}/100`}
                  accent
                />
                <StatBox label="Allowed" value={permissionStats.allowedCount} />
                <StatBox label="Denied" value={permissionStats.deniedCount} />
              </div>
            </div>

            <div className={`${glassPanel} p-6 md:p-8`}>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
                Access Rules
              </p>

              <div className="mt-6 space-y-3">
                {permissionActions.map((action) => {
                  const allowed = permissionStats.allowed.includes(action.key);

                  return (
                    <div
                      key={action.key}
                      className="grid gap-3 rounded-2xl border border-cyan-300/10 bg-black/25 p-4 md:grid-cols-[110px_1fr]"
                    >
                      <div>
                        <Pill tone={allowed ? "good" : "bad"}>
                          {allowed ? "Allowed" : "Denied"}
                        </Pill>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-white">
                          {action.label}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-zinc-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-cyan-300/15 bg-black/25 p-4 text-sm leading-6 text-zinc-300">
                Even the Admin role does not get “view secrets.” Administrative
                power should not automatically mean unrestricted access to
                infrastructure credentials. Those values should stay in
                controlled server-side systems with separate auditing and access
                rules.
              </div>
            </div>
          </section>
        )}

        <section className={`${glassPanel} mt-12 p-6 md:p-8`}>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">
            Why I built this
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            I wanted to show the decisions behind the code, not just a list of
            security buzzwords.
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 md:text-base">
            This lab shows how I think about credentials, sessions, route
            protection, secret exposure, and least privilege. It is still a
            portfolio demo and not just a penetration testing suite. However, the rules behind
            it are the same ones I would carry into a real application: collect
            less, expose less, verify on the server, and deny access when the
            state is uncertain.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ProjectButton href="/projects">
              Back to Projects <ExternalLink size={15} />
            </ProjectButton>

            <ProjectButton href="/data-lab" subtle>
              Open Data Lab <ExternalLink size={15} />
            </ProjectButton>
          </div>
        </section>

        <footer className="mt-12 pb-6 text-center text-sm text-zinc-500">
          Built by Brian Cabrera. Everything here is defensive and uses local demo data only.
        </footer>
      </section>
    </main>
  );
}
