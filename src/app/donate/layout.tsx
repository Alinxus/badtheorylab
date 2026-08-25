import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate · BTL",
  description: "Support independent AI reasoning research. Every dollar goes to compute. Every result gets published.",
  openGraph: {
    title: "BTL Research Fund · BTL",
    description: "Support independent AI reasoning research. No VC. No paywalls.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BTL Research Fund" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL Research Fund · BTL",
    description: "Support independent AI reasoning research. No VC. No paywalls.",
    images: ["/og-image.png"],
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
