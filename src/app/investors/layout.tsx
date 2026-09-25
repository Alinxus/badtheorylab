import type { Metadata } from "next";

const blurb =
  "Bad Theory Labs trains open models and does the research that lets them do more with less. Interference Search, our models, our results, and the $1.5M pre-seed.";

export const metadata: Metadata = {
  title: "Investors | BTL",
  description: blurb,
  openGraph: {
    title: "Investors | BTL",
    description: blurb,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BTL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investors | BTL",
    description: blurb,
    images: ["/og-image.png"],
  },
};

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
