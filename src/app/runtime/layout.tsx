import type { Metadata } from "next";

const desc =
  "BTL Runtime is a drop-in, OpenAI-compatible inference gateway. Route across OpenAI, Anthropic, Bedrock, Vertex, and OpenRouter, cut token waste, and watch the savings — without rewriting your app.";

export const metadata: Metadata = {
  title: "BTL Runtime — Inference Gateway · Bad Theory Labs",
  description: desc,
  openGraph: {
    title: "BTL Runtime — Inference Gateway · Bad Theory Labs",
    description: desc,
    url: "https://www.badtheorylabs.com/runtime",
    images: [
      { url: "https://www.badtheorylabs.com/og-image.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL Runtime — Inference Gateway · Bad Theory Labs",
    description: desc,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
