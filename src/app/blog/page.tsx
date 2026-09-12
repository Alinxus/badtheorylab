import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { allPosts } from "@/lib/blog";
import s from "./blog.module.css";

export const metadata: Metadata = {
  title: "Newsroom · Bad Theory Labs",
  description: "Research notes, releases and company news from Bad Theory Labs.",
};

export default function BlogIndex() {
  const posts = allPosts();

  return (
    <main className={s.page}>
      <SiteNav />

      <header className={s.head}>
        <h1 className={s.bigTitle}>Newsroom</h1>
        <p className={s.standfirst}>
          Research notes, model releases and company news from Bad Theory Labs, a lab studying
          capability efficiency.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className={s.empty}>
          Nothing published yet. Posts are markdown files in <code>content/blog</code>.
        </p>
      ) : (
        <div className={s.grid}>
          {posts.map((p) => (
            <article className={s.card} key={p.slug}>
              <Link href={`/blog/${p.slug}`} className={s.cardLink}>
                <span className={s.thumb} data-has={p.image ? "1" : "0"}>
                  {p.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={p.image} alt={p.imageAlt || ""} loading="lazy" />
                  ) : (
                    <span className={s.thumbTag}>{p.tag}</span>
                  )}
                </span>
                <span className={s.cardDate}>{p.displayDate}</span>
                <h2 className={s.cardTitle}>{p.title}</h2>
                {p.excerpt ? <p className={s.cardExcerpt}>{p.excerpt}</p> : null}
                <span className={s.readMore}>
                  Read more <i aria-hidden="true">&#8594;</i>
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
