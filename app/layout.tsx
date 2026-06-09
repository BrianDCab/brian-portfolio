import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CyberpunkBackground from "../components/CyberpunkBackground";
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
  title: "Brian Dacell Cabrera | Data Analyst & Programmer",
  description:
    "Portfolio for Brian Dacell Cabrera, focused on data analytics, automation, programming, dashboards, and interactive projects.",
  keywords: [
    "Brian Dacell Cabrera",
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
  authors: [{ name: "Brian Dacell Cabrera" }],
  creator: "Brian Dacell Cabrera",
  openGraph: {
    title: "Brian Dacell Cabrera | Data Analyst & Programmer",
    description:
      "Data analytics, automation, programming, dashboards, and interactive projects.",
    url: "https://brian-portfolio-nine-gilt.vercel.app",
    siteName: "Brian Dacell Cabrera Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <CyberpunkBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}