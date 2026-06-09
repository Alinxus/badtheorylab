import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Reasoning Gap — Bad Theory Labs",
  description:
    "Frontier LLMs (GPT-5.4, GPT-4o mini, Gemini 2.0 Flash) perform at random chance on interventional causal inference from probability tables — 25% on 840 four-choice questions.",
  openGraph: {
    title: "The Reasoning Gap — Bad Theory Labs",
    description:
      "Frontier LLMs (GPT-5.4, GPT-4o mini, Gemini 2.0 Flash) perform at random chance on interventional causal inference from probability tables — 25% on 840 four-choice questions.",
    url: "https://www.badtheorylabs.com/reasoning-gap",
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
    title: "The Reasoning Gap — Bad Theory Labs",
    description:
      "Frontier LLMs (GPT-5.4, GPT-4o mini, Gemini 2.0 Flash) perform at random chance on interventional causal inference from probability tables — 25% on 840 four-choice questions.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
