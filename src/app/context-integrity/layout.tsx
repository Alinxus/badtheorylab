import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Context Integrity — Bad Theory Labs",
  description:
    "A Bad Theory Labs benchmark and paper for evaluating whether AI agents preserve, retrieve, update, and use evidence correctly across long-running workflows.",
  openGraph: {
    title: "Context Integrity — Bad Theory Labs",
    description:
      "A benchmark and paper for long-running AI agent memory, evidence retrieval, abstention, and action grounding.",
    url: "https://www.badtheorylabs.com/context-integrity",
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
    title: "Context Integrity — Bad Theory Labs",
    description:
      "A benchmark and paper for long-running AI agent memory, evidence retrieval, abstention, and action grounding.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
