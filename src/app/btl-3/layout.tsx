import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BTL-3 — 27B Agentic Coding Model | Bad Theory Labs",
  description: "BTL-3 is an open 27B coding and tool-use model trained to act, verify, recover, and abstain.",
  openGraph: {
    title: "BTL-3 — 27B Agentic Coding Model",
    description: "88.5% BFCL v4 AST. 95.12% HumanEval. Open weights and measured evidence.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
