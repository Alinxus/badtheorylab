import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BTL-3 Compact — Complete 27B Model in 8.39 GB",
  description: "BTL-3 Compact packages a complete 27B agentic coding model into one 8.39 GB native GGUF with CUDA and Metal execution.",
  openGraph: {
    title: "BTL-3 Compact — 27B in 8.39 GB",
    description: "One native GGUF. 92.2% measured tool-behavior retention. CUDA and Metal runtime.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
