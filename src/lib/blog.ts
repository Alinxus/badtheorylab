import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "blog");

export type Post = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  excerpt: string;
  author: string;
  tag: string;
  image?: string;
  imageAlt?: string;
  html: string;
  minutes: number;
};

type Front = {
  title?: string;
  date?: string | Date;
  excerpt?: string;
  author?: string;
  tag?: string;
  image?: string;
  imageAlt?: string;
  draft?: boolean;
};

// "4th September 2026"
function pretty(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const n = d.getUTCDate();
  const teen = n > 3 && n < 21;
  const suffix = teen ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th";
  const month = d.toLocaleString("en-GB", { month: "long", timeZone: "UTC" });
  return `${n}${suffix} ${month} ${d.getUTCFullYear()}`;
}

function toIso(v: string | Date | undefined, slug: string) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && v.trim()) return v.trim();
  throw new Error(`content/blog/${slug}.md needs a date in its frontmatter`);
}

function files() {
  if (!fs.existsSync(DIR)) return [];
  // README and anything underscored is authoring scaffolding, not a post
  return fs
    .readdirSync(DIR)
    .filter((f) => /\.mdx?$/.test(f) && !f.startsWith("_") && f.toLowerCase() !== "readme.md");
}

function read(file: string): { post: Post; draft: boolean } {
  const slug = file.replace(/\.mdx?$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  const front = data as Front;

  if (!front.title) throw new Error(`content/blog/${file} needs a title in its frontmatter`);

  const date = toIso(front.date, slug);
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    draft: front.draft === true,
    post: {
      slug,
      title: front.title,
      date,
      displayDate: pretty(date),
      excerpt: front.excerpt?.trim() || "",
      author: front.author?.trim() || "Bad Theory Labs",
      tag: front.tag?.trim() || "Note",
      image: front.image,
      imageAlt: front.imageAlt,
      html: marked.parse(content, { async: false }) as string,
      minutes: Math.max(1, Math.round(words / 220)),
    },
  };
}

export function allPosts(): Post[] {
  return files()
    .map(read)
    .filter((r) => !r.draft)
    .map((r) => r.post)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  const hit = files().find((f) => f.replace(/\.mdx?$/, "") === slug);
  if (!hit) return null;
  const r = read(hit);
  return r.draft ? null : r.post;
}
