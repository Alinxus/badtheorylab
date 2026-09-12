import type { Metadata } from "next";
import { Martian_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import PresenceBeacon from "@/components/PresenceBeacon";

// Switzer is self-hosted. Fontshare's CDN is fine but one less third party
// on the critical path is one less thing that can be slow.
const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-d",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const switzerBody = localFont({
  src: [
    { path: "./fonts/Switzer-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Switzer-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Switzer-600.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-s",
  display: "swap",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

const martian = Martian_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-m",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BTL",
  description: "Bad Theory Labs is an AI research and deployment company building frontier models and systems around capability efficiency.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/btl-favicon.svg",
    shortcut: "/btl-favicon.svg",
    apple: "/btl-favicon.svg",
  },
  openGraph: {
    title: "BTL · Frontier AI. Efficient enough to own.",
    description: "Open-weight models and deployable AI systems built for organizations that need control.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BTL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL · Frontier AI. Efficient enough to own.",
    description: "Open-weight models and deployable AI systems built for organizations that need control.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${switzer.variable} ${switzerBody.variable} ${martian.variable}`}>
      <body>
        {children}
        <PresenceBeacon />
      </body>
    </html>
  );
}
