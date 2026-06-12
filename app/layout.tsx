import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CyberpunkBackground from "../components/CyberpunkBackground";
import SiteNav from "../components/SiteNav";
import { createClient } from "../utils/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Brian Cabrera | Data Analyst & Programmer",
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
  openGraph: {
    title: "Brian Cabrera | Data Analyst & Programmer",
    description:
      "Data analytics, automation, programming, dashboards, and interactive projects.",
    url: "https://briancabrera.io",
    siteName: "Brian Cabrera Portfolio",
    type: "website",
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
        geistSans.variable +
        " " +
        geistMono.variable +
        " h-full scroll-smooth antialiased"
      }
    >
      <body className="min-h-full bg-black text-white">
        <CyberpunkBackground />

        <div className="relative z-10">
          <SiteNav username={username} />
          {children}
        </div>
      </body>
    </html>
  );
}
