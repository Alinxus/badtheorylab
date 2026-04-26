import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Building the infrastructure and products for the next interface to computing",
  icons: {
    icon: "/btl-favicon.svg",
    shortcut: "/btl-favicon.svg",
    apple: "/btl-favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
