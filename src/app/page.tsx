import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import styles from "./home.module.css";

const githubUrl = "https://github.com/Badtheorylabs";

const evidence = [
  { value: "94.1%", label: "Behavior retention", note: "111 / 118 · BTL-4 Compact" },
  { value: "9.96 GB", label: "35.1B MoE GGUF", note: "2.30 bpw · stock format" },
  { value: "2.1B", label: "Active parameters", note: "per token · routed MoE" },
  { value: "31.9 t/s", label: "MacBook decode", note: "M4 · full Metal offload" },
];

const coreOutputs = [
  {
    number: "01",
    kind: "Open-weight MoE",
    name: "BTL-4 Compact",
    title: "A 35.1B mixture-of-experts model released as a 9.96 GB stock GGUF.",
    body: "BTL-4 Compact keeps the model in a standard llama.cpp-compatible format while preserving 111 of 118 teacher-correct behaviors on the release gate. The paper records the range-selection result, expert-level ablations, and the boundary of the claim.",
    facts: ["35.1B MoE", "9.96 GB GGUF", "94.1% retention"],
    href: "/papers/range-before-representation",
    action: "Read BTL-4",
    featured: true,
  },
  {
    number: "02",
    kind: "Open-weight model",
    name: "BTL-3",
    title: "A 27B model trained to act, verify, recover, and know when to stop.",
    body: "The frozen RL-0013 release combines agentic coding with structured tool use. It ships with complete evaluation evidence, a full-quality adapter, and a native compact edition.",
    facts: ["88.5% BFCL v4", "95.12% HumanEval", "262K architecture"],
    href: "/btl-3",
    action: "Explore BTL-3",
  },
  {
    number: "03",
    kind: "Inference infrastructure",
    name: "Runtime",
    title: "One production API for models across providers.",
    body: "OpenAI-compatible chat and responses APIs with provider routing, usage accounting, billing, caching, rate limits, and self-serve workspace keys.",
    facts: ["Multi-provider", "Streaming + tools", "Usage ledger"],
    href: "https://rntm.sh",
    action: "Open Runtime",
    external: true,
  },
  {
    number: "04",
    kind: "Agent memory",
    name: "RetainDB",
    title: "Persistent context with evidence, scope, and retrieval built in.",
    body: "A memory layer for agents that need to remember across sessions without turning every old fact into current truth.",
    facts: ["79% LongMemEval", "0% stored-fact hallucination", "Managed API"],
    href: "https://retaindb.com",
    action: "Open RetainDB",
    external: true,
  },
];

const research = [
  {
    index: "R/01",
    name: "Context Integrity",
    state: "Benchmark + paper",
    body: "CIB tests whether long-running agents preserve, update, retrieve, and act on the right evidence across sessions. The v0 release contains 250 deterministic tasks and an auditable evaluation pipeline.",
    href: "/context-integrity",
  },
  {
    index: "R/02",
    name: "ESP",
    state: "Runtime + thesis",
    body: "Echo-Skeleton Perception lets a text-only model operate a graphical interface through persistent structure, OCR, affordance probes, and typed change events instead of screenshots.",
    href: "/esp",
  },
  {
    index: "R/03",
    name: "Low-bit model systems",
    state: "Papers + artifact",
    body: "BTL-4 Compact ships a 35.1B MoE as a 9.96 GB stock GGUF, while BRQ records the one-bit recovery lane and its non-promoted boundary.",
    href: "/papers/range-before-representation",
  },
  {
    index: "R/04",
    name: "The Reasoning Gap",
    state: "Benchmark",
    body: "Controlled evaluations that separate observational pattern completion from interventional causal reasoning, with exact baselines and reproducible tasks.",
    href: "/reasoning-gap",
  },
];

const systems = [
  {
    status: "Open source",
    name: "Prism",
    body: "A local-first exoskeleton that gives small models explicit context, planning, tools, verification, critique, traces, and memory.",
    href: "https://github.com/Badtheorylabs/Prism",
  },
  {
    status: "Deployed system",
    name: "Maya",
    body: "An always-on lab operator with event ingestion, approvals, business loops, durable memory, founder briefs, and safe action boundaries.",
  },
  {
    status: "Open source",
    name: "Talos",
    body: "A privacy-first general agent with browser automation, files, shell, Python, scheduling, plugins, and messaging integrations.",
    href: "https://github.com/Badtheorylabs/talos",
  },
  {
    status: "Open model",
    name: "BTL-2 Coder",
    body: "Our 7B code-review model produces structured security and correctness findings with file evidence and numeric confidence.",
    href: "/btl-2-coder",
  },
  {
    status: "Experimental runtime",
    name: "ESP Runtime",
    body: "A reusable Playwright and Tesseract implementation with stable screen nodes, event deltas, guarded actions, and external task verification.",
    href: "/esp",
  },
  {
    status: "In development",
    name: "Marrow",
    body: "A local, ambient desktop agent built around selective attention, persistent context, permissioned action, and restraint.",
    href: "/marrow",
  },
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function ProjectLink({ href, external, children }: { href: string; external?: boolean; children: React.ReactNode }) {
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer">{children}</a>;
  }
  return <Link href={href}>{children}</Link>;
}

export default function Home() {
  return (
    <main className={styles.page}>
      <SiteNav />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}><span />Independent AI lab · Lagos</p>
          <h1>We ship the model,<br />the system, <em>and the proof.</em></h1>
          <p className={styles.lede}>
            Bad Theory Labs builds open models, agent infrastructure, runtimes, and benchmarks.
            The work is public, runnable, and measured against the thing it claims to do.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryButton} href="/papers/range-before-representation">Read BTL-4 <Arrow /></Link>
            <a className={styles.secondaryButton} href={githubUrl} target="_blank" rel="noreferrer">See the work</a>
          </div>
        </div>

        <div className={styles.releasePanel}>
          <div className={styles.panelTop}>
            <span className={styles.liveDot} />
            <span>Latest release · August 2026</span>
            <span>2.30 bpw</span>
          </div>
          <div className={styles.panelModel}>BTL<span>–</span>4</div>
          <p>35.1B MoE in a 9.96 GB stock GGUF</p>
          <div className={styles.panelRows}>
            <div><span>Full model</span><b>35.1B MoE</b></div>
            <div><span>Active path</span><b>~2.1B / token</b></div>
            <div><span>Compact artifact</span><b>9.96 GB</b></div>
            <div><span>Evidence</span><b>111 / 118 retained</b></div>
          </div>
          <Link href="/papers/range-before-representation" className={styles.panelLink}>Release dossier <Arrow /></Link>
        </div>
      </section>

      <div className={styles.ticker}>
        <span>OPEN WEIGHTS</span><i />
        <span>NATIVE INFERENCE</span><i />
        <span>AGENT RUNTIMES</span><i />
        <span>EXECUTION-VERIFIED EVALS</span><i />
        <span>REPRODUCIBLE RESEARCH</span>
      </div>

      <section className={styles.evidence} aria-label="Measured results">
        {evidence.map((item) => (
          <div key={item.label} className={styles.evidenceCell}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
            <small>{item.note}</small>
          </div>
        ))}
      </section>

      <section className={styles.section} id="products">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Selected output</p>
            <h2>The lab is already<br /><em>in production.</em></h2>
          </div>
          <p>Models are one layer. We also build the runtime, memory, agent scaffolding, evaluation, and deployment path around them.</p>
        </div>

        <div className={styles.outputGrid}>
          {coreOutputs.map((output) => (
            <article key={output.name} className={`${styles.outputCard} ${output.featured ? styles.featured : ""}`}>
              <div className={styles.outputMeta}><span>{output.number}</span><span>{output.kind}</span></div>
              <h3>{output.name}</h3>
              <h4>{output.title}</h4>
              <p>{output.body}</p>
              <ul>{output.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
              <ProjectLink href={output.href} external={output.external}>{output.action} <Arrow /></ProjectLink>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`} id="research">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Research with artifacts</p>
            <h2>No hand-waving.<br /><em>Build the test.</em></h2>
          </div>
          <p>Our research produces papers, datasets, environments, runtimes, model artifacts, and explicit failure reports—not just a thesis page.</p>
        </div>

        <div className={styles.researchList}>
          {research.map((item) => (
            <Link href={item.href} className={styles.researchRow} key={item.name}>
              <span className={styles.researchIndex}>{item.index}</span>
              <div><span className={styles.researchState}>{item.state}</span><h3>{item.name}</h3></div>
              <p>{item.body}</p>
              <Arrow />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section} id="open-source">
        <div className={styles.sectionHead}>
          <div>
            <p className={styles.label}>Models, agents, infrastructure</p>
            <h2>A lab should leave<br /><em>working systems behind.</em></h2>
          </div>
          <p>Each project attacks a different failure mode: weak tool mechanics, forgotten context, unsafe autonomy, expensive inference, or perception that starts over every frame.</p>
        </div>

        <div className={styles.systemGrid}>
          {systems.map((system) => {
            const body = <><span>{system.status}</span><h3>{system.name}</h3><p>{system.body}</p>{system.href ? <b>Open project <Arrow /></b> : <b>Running inside BTL</b>}</>;
            return system.href ? <ProjectLink key={system.name} href={system.href} external={system.href.startsWith("http")}>{body}</ProjectLink> : <article key={system.name}>{body}</article>;
          })}
        </div>
      </section>

      <section className={styles.manifesto}>
        <p>THE OPERATING PRINCIPLE</p>
        <blockquote>
          Build ambitious systems.<br />Measure them without mercy.<br /><em>Ship what survives.</em>
        </blockquote>
        <div>
          <Link className={styles.primaryButton} href="/papers">Read the research <Arrow /></Link>
          <a className={styles.secondaryButton} href="https://discord.gg/QJBCcB7bF" target="_blank" rel="noreferrer">Join the lab</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>Bad Theory Labs</strong>
          <p>Models, systems, and research for agents that can actually do the work.</p>
          <small>Lagos, Nigeria · Est. 2025</small>
        </div>
        <div className={styles.footerLinks}>
          <div><span>Build</span><Link href="/papers/range-before-representation">BTL-4</Link><Link href="/papers/behaviour-relearned-quantization">BRQ</Link><Link href="/btl-3">BTL-3</Link><Link href="/macaw">Macaw</Link><Link href="/runtime">Runtime</Link><a href="https://retaindb.com">RetainDB</a><Link href="/marrow">Marrow</Link></div>
          <div><span>Research</span><Link href="/context-integrity">Context Integrity</Link><Link href="/esp">ESP</Link><Link href="/reasoning-gap">Reasoning Gap</Link><Link href="/papers">Papers</Link></div>
          <div><span>Lab</span><a href={githubUrl}>GitHub</a><a href="https://discord.gg/QJBCcB7bF">Discord</a><Link href="/contact">Contact</Link><a href="https://cal.com/alameenpd/quick-chat">Schedule a call</a></div>
        </div>
        <div className={styles.footerBottom}><span>© 2026 Bad Theory Labs</span><span>Built in Lagos. Open to the world.</span></div>
      </footer>
    </main>
  );
}
