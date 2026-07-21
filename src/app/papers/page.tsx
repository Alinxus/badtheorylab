import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import styles from "./papers.module.css";

const papers = [
  {
    date: "July 2026",
    type: "Benchmark paper · released",
    title: "Context Integrity",
    summary: "An auditable benchmark for whether long-running agents preserve, retrieve, update, and use evidence correctly across sessions.",
    artifacts: ["250 deterministic tasks", "Dataset", "Evaluation harness", "PDF"],
    href: "/context-integrity",
    pdf: "/context-integrity/paper.pdf",
  },
  {
    date: "July 2026",
    type: "Thesis paper · runtime implemented",
    title: "ESP: Echo-Skeleton Perception",
    summary: "A stateful perception architecture that lets text-only models operate graphical interfaces through structure, OCR, affordance probes, and change events.",
    artifacts: ["Pre-registered hypotheses", "Working runtime", "Browser tasks", "PDF"],
    href: "/esp",
    pdf: "/esp/paper.pdf",
  },
  {
    date: "July 2026",
    type: "Model systems report · released",
    title: "BTL-3 Compact",
    summary: "The engineering record behind a complete 27B agentic coding model in one 8.39 GB native GGUF: allocation, packing, behavior repair, kernels, and artifact-faithful validation.",
    artifacts: ["8.39 GB artifact", "Native CUDA + Metal", "92.2% tool retention", "Open model"],
    href: "/btl-3",
  },
  {
    date: "June 2026",
    type: "Evaluation program · released",
    title: "The Reasoning Gap",
    summary: "Controlled tasks for separating observational pattern completion from interventional causal reasoning, with exact inference baselines.",
    artifacts: ["Interventional tasks", "Exact baselines", "Public test", "Reproducible"],
    href: "/reasoning-gap",
  },
];

export default function PapersPage() {
  return (
    <main className={styles.page}>
      <SiteNav />
      <header className={styles.hero}>
        <p>Bad Theory Labs · Research index</p>
        <h1>Research should end in<br /><em>something you can run.</em></h1>
        <div>
          <p>We publish the question, the method, the artifacts, the failures, and the code needed to reproduce the result.</p>
          <span>Updated July 2026</span>
        </div>
      </header>

      <section className={styles.index}>
        <div className={styles.indexHead}>
          <span>Research output</span><span>Status</span><span>Artifacts</span><span>Open</span>
        </div>
        {papers.map((paper, index) => (
          <article className={styles.paper} key={paper.title}>
            <div className={styles.number}>0{index + 1}</div>
            <div className={styles.title}>
              <span>{paper.type}</span>
              <h2>{paper.title}</h2>
              <p>{paper.summary}</p>
            </div>
            <time>{paper.date}</time>
            <ul>{paper.artifacts.map((artifact) => <li key={artifact}>{artifact}</li>)}</ul>
            <div className={styles.links}>
              <Link href={paper.href}>Open dossier ↗</Link>
              {paper.pdf ? <a href={paper.pdf}>PDF ↓</a> : null}
            </div>
          </article>
        ))}
      </section>

      <section className={styles.method}>
        <p>HOW WE WORK</p>
        <h2>Pre-register when the claim is uncertain.<br />Execute when the claim is mechanical.<br /><em>Report both wins and failures.</em></h2>
        <div>
          <p>Benchmarks stay sealed until representation and training choices freeze. Model claims carry denominators and protocol. Runtime claims come from the exact deployed artifact.</p>
          <p>Experiments that fail remain part of the record. Research is useful when another builder can see exactly where the method worked—and exactly where it stopped.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <strong>Bad Theory Labs</strong>
        <p>Independent AI research and product lab · Lagos, Nigeria</p>
        <div><Link href="/">Home</Link><a href="https://github.com/Badtheorylabs">GitHub</a><a href="mailto:hello@badtheorylabs.com">Email</a></div>
      </footer>
    </main>
  );
}
