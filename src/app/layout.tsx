import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import PresenceBeacon from "@/components/PresenceBeacon";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-d",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-s",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-m",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bad Theory Labs",
  description: "An independent AI lab shipping open models, agent infrastructure, native runtimes, and reproducible research.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/btl-favicon.svg",
    shortcut: "/btl-favicon.svg",
    apple: "/btl-favicon.svg",
  },
  openGraph: {
    title: "Bad Theory Labs",
    description: "Open models, agent infrastructure, native runtimes, and research you can run.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bad Theory Labs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bad Theory Labs",
    description: "Open models, agent infrastructure, native runtimes, and research you can run.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        {children}
        <PresenceBeacon />
      </body>
    </html>
  );
}
