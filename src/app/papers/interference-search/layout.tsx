import type { Metadata } from "next";

const title = "Interference Search | Bad Theory Labs";
const description =
  "Reasoning over merged states, many branches at once. On 30 hard Countdown problems, with the same judge and budget, a frontier of states solves 30 and a single line of thought solves 21.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "article",
    url: "https://www.badtheorylabs.com/papers/interference-search",
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
