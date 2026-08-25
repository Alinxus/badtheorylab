import type { Metadata } from "next";

const title = "Behaviour-Relearned Quantization — BRQ";
const description =
  "BTL's BRQ paper: one-bit MoE recovery experiments, binary expert relearning receipts, and the boundary before a promoted release artifact.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "article",
    url: "https://www.badtheorylabs.com/papers/behaviour-relearned-quantization",
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
