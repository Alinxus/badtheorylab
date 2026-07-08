import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ESP: Echo-Skeleton Perception — Bad Theory Labs",
  description:
    "A Bad Theory Labs thesis paper: a small text-only language model operates a GUI with no images — sensing structure, text, and change through a skeleton and an event stream.",
  openGraph: {
    title: "ESP: Echo-Skeleton Perception — Bad Theory Labs",
    description:
      "Stateful, event-driven screen sensing for blind language models. Pre-registered thesis: architecture, four falsifiable hypotheses, fixed decision rule.",
    url: "https://www.badtheorylabs.com/esp",
    images: [
      {
        url: "https://www.badtheorylabs.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ESP: Echo-Skeleton Perception — Bad Theory Labs",
    description:
      "A small blind model drives a GUI through echoes, not screenshots. Pre-registered thesis paper.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
