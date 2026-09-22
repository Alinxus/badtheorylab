import type { Metadata } from "next";

const title = "Where a Hybrid MoE Spends Its Bytes — Bad Theory Labs";
const description =
  "A measured compression allocation for Tinfield 1: a 176.94B-parameter hybrid model reduced to a 61.5 GiB GGUF with a 34.67 GiB GPU-resident core.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "article",
    url: "https://www.badtheorylabs.com/papers/where-a-hybrid-moe-spends-its-bytes",
    images: [{ url: "https://www.badtheorylabs.com/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.badtheorylabs.com/og-image.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
