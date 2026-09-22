import type { Metadata } from "next";

const desc =
  "Run Tinfield 1, Bad Theory Labs' open-weight flagship, through Runtime's OpenAI-compatible API at $0.15/M input tokens and $0.60/M output tokens.";

export const metadata: Metadata = {
  title: "Tinfield 1 on Runtime · BTL",
  description: desc,
  openGraph: {
    title: "Tinfield 1 on Runtime · BTL",
    description: desc,
    url: "https://www.badtheorylabs.com/runtime",
    images: [
      { url: "https://www.badtheorylabs.com/og-image.png", width: 1200, height: 630 },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tinfield 1 on Runtime · BTL",
    description: desc,
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
