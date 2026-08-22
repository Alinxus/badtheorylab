import type { Metadata } from "next";

const title = "Range Before Representation — BTL-4 Compact Research";
const description =
  "A behavior-gated two-bit quantization report for BTL-4 Compact: a released 9.96 GB GGUF of a 35.1B-parameter mixture-of-experts model.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "article",
    url: "https://www.badtheorylabs.com/papers/range-before-representation",
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
