import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundSystem from "@/components/BackgroundSystem";
import BootLoader from "@/components/BootLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StartFlow AI | AI Automation Studio & Blog",
  description: "Automate workflows, deploy autonomous AI agents, and build organic authority with StartFlow AI.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "StartFlow AI | AI Automation Studio & Blog",
    description: "Automate workflows, deploy autonomous AI agents, and build organic authority with StartFlow AI.",
    url: "https://startflow.ai",
    siteName: "StartFlow AI",
    images: [{ url: "/icon.png", width: 1200, height: 630, alt: "StartFlow AI" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StartFlow AI",
    description: "AI-powered automation studio and blog.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-300 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <ThemeProvider>
          {/* Global Loading & Background layers */}
          <BootLoader />
          <BackgroundSystem />

          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
