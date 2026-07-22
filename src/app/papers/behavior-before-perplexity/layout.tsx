import type { Metadata } from "next";

const title = "Behavior Before Perplexity — BTL-3 Compression Research";
const description =
  "How Bad Theory Labs compressed BTL-3 into an 8.39 GB native GGUF while retaining 92.2% of teacher-correct tool behavior on a sealed gate.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "article",
    url: "https://www.badtheorylabs.com/papers/behavior-before-perplexity",
    images: [{ url: "https://www.badtheorylabs.com/btl-3-og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["https://www.badtheorylabs.com/btl-3-og.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
