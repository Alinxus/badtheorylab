import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reasoning Test — Bad Theory Labs",
  description:
    "12 causal reasoning questions. Observational vs interventional. How do you compare against GPT-5.4?",
  openGraph: {
    title: "Reasoning Test — Bad Theory Labs",
    description:
      "12 causal reasoning questions. Observational vs interventional. How do you compare against GPT-5.4?",
    url: "https://www.badtheorylabs.com/reasoning-test",
    images: [{ url: "https://www.badtheorylabs.com/api/og/reasoning-test", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reasoning Test — Bad Theory Labs",
    description:
      "12 causal reasoning questions. Observational vs interventional. How do you compare against GPT-5.4?",
    images: [{ url: "https://www.badtheorylabs.com/api/og/reasoning-test" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
