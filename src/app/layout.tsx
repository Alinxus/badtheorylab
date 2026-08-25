import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PresenceBeacon from "@/components/PresenceBeacon";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-d",
  display: "swap",
});

const archivoBody = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-s",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-m",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BTL",
  description: "Intelligence efficient enough to own. BTL is an independent research lab building open models, native runtimes, agent infrastructure, and benchmarks you can run.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/btl-favicon.svg",
    shortcut: "/btl-favicon.svg",
    apple: "/btl-favicon.svg",
  },
  openGraph: {
    title: "BTL",
    description: "Intelligence efficient enough to own.",
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
    title: "BTL",
    description: "Intelligence efficient enough to own.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoBody.variable} ${jetbrains.variable}`}>
      <body>
        {children}
        <PresenceBeacon />
      </body>
    </html>
  );
}
