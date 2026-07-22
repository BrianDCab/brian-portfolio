import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import CyberpunkBackground from "../components/CyberpunkBackground";
import SiteFooter from "../components/SiteFooter";
import SiteNav from "../components/SiteNav";
import { createClient } from "../utils/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://briancabrera.io"),
  title: "Brian Cabrera | Software Engineer & Data Systems Developer",
  description:
    "Portfolio for Brian Cabrera, focused on data analytics, automation, programming, dashboards, and interactive projects.",
  keywords: [
    "Brian Cabrera",
    "Data Analyst",
    "Programmer",
    "Software Developer",
    "SQL",
    "Python",
    "React",
    "Next.js",
    "Automation",
    "Business Analytics",
  ],
  authors: [{ name: "Brian Cabrera" }],
  creator: "Brian Cabrera",
  alternates: {
    canonical: "https://briancabrera.io",
  },
  openGraph: {
    title: "Brian Cabrera | Software Engineer & Data Systems Developer",
    description:
      "Data analytics, automation, full-stack development, shipped games, and interactive projects.",
    url: "https://briancabrera.io",
    siteName: "Brian Cabrera Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brian Cabrera | Software Engineer & Data Systems Developer",
    description:
      "Data analytics, automation, full-stack development, shipped games, and interactive projects.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let username: string | null = null;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      username = profile?.username ?? user.email?.split("@")[0] ?? "user";
    }
  } catch {
    username = null;
  }

  return (
    <html
      lang="en"
      className={
        GeistSans.variable +
        " " +
        GeistMono.variable +
        " h-full scroll-smooth antialiased"
      }
    >
      <body className="min-h-full bg-[#05070c] font-sans text-white">
        <CyberpunkBackground />

        <div className="relative z-10">
          <SiteNav username={username} />
          {children}
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

