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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/btl-favicon.svg",
    shortcut: "/btl-favicon.svg",
    apple: "/btl-favicon.svg",
  },
  openGraph: {
    title: "Bad Theory Labs",
    description: "Building the infrastructure and products for the next interface to computing",
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
    description: "Building the infrastructure and products for the next interface to computing",
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
        <div style={{ background: '#111', color: '#fff', textAlign: 'center', padding: '8px 16px', fontSize: '13px', fontFamily: 'DM Mono, monospace', borderBottom: '1px solid #333', wordBreak: 'break-all', lineHeight: 1.5 }}>
          CA: 3bBQrzzq9DRXXFfC9nUno9m1MBm9Y7dVnBBK44bVpump
        </div>
        {children}
      </body>
    </html>
  );
}
