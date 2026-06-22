import type { Metadata } from "next";

const desc =
  "BTL-2 Coder 7B is a local, open 7B code-review model. A LoRA adapter on Qwen2.5-Coder that returns structured security and correctness findings with file evidence and numeric confidence — weights, evals, and receipts included.";

export const metadata: Metadata = {
  title: "BTL-2 Coder 7B — Open code-review model · Bad Theory Labs",
  description: desc,
  openGraph: {
    title: "BTL-2 Coder 7B — Open code-review model · Bad Theory Labs",
    description: desc,
    url: "https://www.badtheorylabs.com/btl-2-coder",
    images: [
      { url: "https://www.badtheorylabs.com/og-image.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BTL-2 Coder 7B — Open code-review model · Bad Theory Labs",
    description: desc,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
