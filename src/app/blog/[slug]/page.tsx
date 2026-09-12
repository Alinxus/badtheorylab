import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { allPosts, getPost } from "@/lib/blog";
import s from "../blog.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} · Bad Theory Labs`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = allPosts().filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <main className={s.page}>
      <SiteNav />

      <article className={s.post}>
        <Link href="/blog" className={s.back}>
          <i aria-hidden="true">&#8592;</i> Back to Newsroom
        </Link>

        <p className={s.postMeta}>
          {post.displayDate} · {post.tag} · {post.minutes} min read
        </p>
        <h1 className={s.postTitle}>{post.title}</h1>
        <p className={s.byline}>By {post.author}</p>

        {post.image ? (
          <figure className={s.hero}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.image} alt={post.imageAlt || ""} />
          </figure>
        ) : null}

        <div className={s.prose} dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      {more.length > 0 ? (
        <section className={s.more}>
          <h2 className={s.moreHead}>More from the newsroom</h2>
          <div className={s.grid}>
            {more.map((p) => (
              <article className={s.card} key={p.slug}>
                <Link href={`/blog/${p.slug}`} className={s.cardLink}>
                  <span className={s.cardDate}>{p.displayDate}</span>
                  <h3 className={s.cardTitle}>{p.title}</h3>
                  {p.excerpt ? <p className={s.cardExcerpt}>{p.excerpt}</p> : null}
                  <span className={s.readMore}>
                    Read more <i aria-hidden="true">&#8594;</i>
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
