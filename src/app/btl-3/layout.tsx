import type { Metadata } from "next";

const desc =
  "BTL-3 is a 27B agentic coding and tool-use model from Bad Theory Labs — 95.1% HumanEval, 88.5% BFCL v4 AST — plus BTL-3 Compact, the complete model in one 8.39 GB native GGUF at 43 tok/s. Open weights, stated boundaries.";

const title = "BTL-3 — 27B agentic coding model + 8.39 GB Compact · Bad Theory Labs";

export const metadata: Metadata = {
  title,
  description: desc,
  openGraph: {
    title,
    description: desc,
    url: "https://www.badtheorylabs.com/btl-3",
    images: [
      { url: "https://www.badtheorylabs.com/btl-3-og.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: desc,
    images: ["https://www.badtheorylabs.com/btl-3-og.png"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
