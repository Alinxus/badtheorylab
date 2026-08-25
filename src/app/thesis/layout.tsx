import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The thesis — BTL",
  description:
    "Intelligence is still at the room stage. Why the models that finish real work run in datacentres, why that is an engineering choice rather than a physical limit, and what BTL is building instead.",
  openGraph: {
    title: "The thesis — BTL",
    description: "Every technology that mattered started out too big to own.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BTL" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The thesis — BTL",
    description: "Every technology that mattered started out too big to own.",
    images: ["/og-image.png"],
  },
};

export default function ThesisLayout({ children }: { children: React.ReactNode }) {
  return children;
}
