import Link from "next/link";
import SiteNav from "@/components/SiteNav";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

const cards = [
  ["7", "task families", "memory writes, retrieval, updates, abstention, reasoning, action, causal action"],
  ["13", "metrics", "accuracy, evidence precision/recall, unsupported claims, stale facts, cost, latency"],
  ["5+", "baselines", "long context, truncation, vector RAG, hybrid RAG, memory, memory plus critic"],
  ["0", "fabricated results", "this is a benchmark protocol until real evaluations are run"],
];

const tasks = [
  {
    title: "Selective Write",
    body: "The system receives noisy sessions and must store durable facts without turning every sentence into memory.",
  },
  {
    title: "Evidence Retrieval",
    body: "The system must retrieve the minimum sufficient evidence set, not a vague pile of semantically similar context.",
  },
  {
    title: "Knowledge Update",
    body: "New evidence may supersede old evidence. The agent must use current facts while preserving history when asked.",
  },
  {
    title: "Abstention",
    body: "When evidence is missing, the correct behavior is to say so. Unsupported confidence counts as failure.",
  },
  {
    title: "Multi-Session Reasoning",
    body: "The answer requires combining evidence from separate sessions without importing unrelated project context.",
  },
  {
    title: "Action Grounding",
    body: "The chosen action must follow from retrieved evidence, not from a plausible guess about what the user probably wants.",
  },
  {
    title: "Causal Action",
    body: "Agents that act must distinguish observed correlation from evidence that an intervention will work.",
  },
];

const metrics = [
  "answer accuracy",
  "action accuracy",
  "evidence recall",
  "evidence precision",
  "retrieval sufficiency",
  "unsupported claim rate",
  "stale fact error rate",
  "abstention precision",
  "abstention recall",
  "write precision",
  "write recall",
  "latency",
  "token cost",
];

const sources = [
  ["RAG", "https://arxiv.org/abs/2005.11401"],
  ["Lost in the Middle", "https://arxiv.org/abs/2307.03172"],
  ["MemGPT", "https://arxiv.org/abs/2310.08560"],
  ["LongMemEval", "https://arxiv.org/abs/2410.10813"],
  ["CLadder", "https://arxiv.org/abs/2312.04350"],
  ["ReAct", "https://arxiv.org/abs/2210.03629"],
  ["Toolformer", "https://arxiv.org/abs/2302.04761"],
  ["SWE-bench", "https://arxiv.org/abs/2310.06770"],
  ["Model Context Protocol", "https://www.anthropic.com/news/model-context-protocol"],
];

export default function ContextIntegrityPage() {
  return (
    <main className="ci-page">
      <style>{styles}</style>
      <SiteNav />

      <section className="ci-hero">
        <p className="ci-eyebrow">Research Draft · June 2026</p>
        <h1>Context Integrity</h1>
        <p className="ci-subtitle">A benchmark for long-running AI agent memory and action.</p>
        <p className="ci-byline">Olajide Al-ameen · Bad Theory Labs, Lagos</p>
        <div className="ci-actions">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="ci-btn ci-solid">Discuss in Discord</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="ci-btn ci-outline">Schedule call</a>
          <Link href="/reasoning-gap" className="ci-btn ci-outline">Read Reasoning Gap</Link>
        </div>
      </section>

      <section className="ci-paper-wrap">
        <article className="ci-paper">
          <header>
            <p className="ci-paper-meta">Bad Theory Labs · Benchmark Proposal v0.1</p>
            <h2>The agent stack has a context integrity problem.</h2>
            <p className="ci-lede">
              Long context is capacity. Memory is continuity. Retrieval is access. Reasoning is use.
              Current systems often conflate these. Context Integrity Benchmark separates them.
            </p>
          </header>

          <div className="ci-result-cards">
            {cards.map(([stat, label, note]) => (
              <div className="ci-result-card" key={label}>
                <span className="ci-result-stat">{stat}</span>
                <span className="ci-result-label">{label}</span>
                <span className="ci-result-note">{note}</span>
              </div>
            ))}
          </div>

          <h3>Abstract</h3>
          <p>
            AI agents are increasingly expected to operate across long-running workflows: reading documents,
            remembering user preferences, updating stale facts, retrieving evidence, and choosing actions.
            Existing evaluations usually isolate one piece of this system. Long-context benchmarks test whether
            a model can attend over a fixed prompt. Retrieval benchmarks test whether a relevant passage can be
            found. Agent benchmarks test whether a model can call tools. None of these alone measures whether
            an agent preserves context integrity across time.
          </p>
          <p>
            We define context integrity as the property that every answer or action can be traced to the right
            stored evidence, updated against newer evidence, bounded by uncertainty, and executed only when the
            evidence supports it. This draft defines the benchmark, the metrics, and the evaluation protocol.
            It does not report model results yet.
          </p>

          <div className="ci-callout">
            <p><strong>Core claim:</strong> AI agents fail when their context pipeline fails. The bottleneck is not only model intelligence, but the integrity of memory, retrieval, evidence, and action over time.</p>
          </div>

          <h3>Why This Exists</h3>
          <p>
            Real work does not arrive as a single prompt with all relevant facts attached. A user changes their
            mind. A document supersedes an older document. A preference applies in one situation but not another.
            An instruction is remembered, then contradicted. The agent must decide what to store, what to ignore,
            what to retrieve, what to update, when to ask for clarification, and whether an action is justified.
          </p>

          <h3>Task Families</h3>
          <div className="ci-task-grid">
            {tasks.map((task, index) => (
              <div className="ci-task" key={task.title}>
                <div className="ci-task-n">{String(index + 1).padStart(2, "0")}</div>
                <h4>{task.title}</h4>
                <p>{task.body}</p>
              </div>
            ))}
          </div>

          <h3>Evaluation Pipeline</h3>
          <div className="ci-flow">
            {["Ingest events", "Write memory", "Retrieve evidence", "Answer or act", "Audit sources"].map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>
          <p>
            A benchmark item is a multi-session workflow with timestamped events, evidence sources, distractors,
            contradictions, user preferences, documents, possible tool actions, and final questions. The system
            must process events over time, maintain memory, retrieve evidence, and answer or act later.
          </p>

          <h3>Metrics</h3>
          <div className="ci-metrics">
            {metrics.map((metric) => <span key={metric}>{metric}</span>)}
          </div>
          <p>
            The production metric is grounded utility per token: supported correct outcomes divided by total
            billable tokens. This ties memory quality to actual deployment pressure.
          </p>

          <h3>Example Task</h3>
          <div className="ci-example">
            <div>
              <p className="ci-example-label">Session 1</p>
              <p>For finance exports, group invoices by client, not by month.</p>
              <p className="ci-example-label">Session 2</p>
              <p>Actually, for audit exports only, group invoices by month.</p>
            </div>
            <div>
              <p className="ci-example-label">Question</p>
              <p>How should the agent format a normal finance invoice export?</p>
              <p className="ci-example-label">Gold action</p>
              <p>Group by client. The audit exception does not globally replace the original preference.</p>
            </div>
          </div>

          <h3>Baselines</h3>
          <ul>
            <li><strong>Full-history prompting:</strong> pass the entire available history when it fits.</li>
            <li><strong>Long-context truncation:</strong> pass the most recent history up to the model limit.</li>
            <li><strong>Naive vector RAG:</strong> chunk, embed, and retrieve top-k similar chunks.</li>
            <li><strong>Hybrid retrieval:</strong> combine lexical BM25 and vector retrieval.</li>
            <li><strong>Memory system:</strong> use explicit write, update, and retrieve operations.</li>
            <li><strong>Memory plus critic:</strong> verify retrieval and answer support before final output.</li>
          </ul>

          <h3>Falsifiable Claims</h3>
          <div className="ci-claims">
            <p><strong>Claim 1:</strong> Long context alone is insufficient for durable agent memory.</p>
            <p><strong>Claim 2:</strong> Hybrid retrieval improves evidence precision over naive vector retrieval.</p>
            <p><strong>Claim 3:</strong> A critic reduces unsupported claims and stale-fact errors.</p>
            <p><strong>Claim 4:</strong> Causal-action tasks expose failures not visible in recall tasks.</p>
          </div>

          <h3>How It Connects to BTL</h3>
          <p>
            This is the bridge between the lab&apos;s research and products. RetainDB can be evaluated as the memory
            and retrieval layer. BTL Runtime can measure model, latency, and token-cost effects. Marrow can be
            evaluated as the action layer that must decide when evidence is strong enough to intervene.
          </p>

          <h3>Related Work</h3>
          <div className="ci-sources">
            {sources.map(([label, href]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer">{label}</a>
            ))}
          </div>

          <blockquote>
            Memory is not the ability to recall a sentence. It is the ability to maintain an auditable state that
            supports correct decisions over time.
          </blockquote>
          <p className="ci-paper-meta">Bad Theory Labs, Lagos · June 2026</p>
        </article>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; --accent:#2563eb; }
.ci-page { min-height:100vh; background:var(--bg); color:var(--ink); font-family:'DM Sans',system-ui,sans-serif; }
.ci-hero { max-width:1080px; margin:0 auto; padding:72px 28px 48px; border-bottom:1px solid var(--border); }
.ci-eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:10px; }
.ci-hero h1 { font-family:var(--font-d); font-size:clamp(44px,7vw,84px); letter-spacing:-.03em; line-height:1; margin-bottom:8px; }
.ci-subtitle { color:var(--body); font-size:18px; max-width:720px; line-height:1.5; margin-bottom:6px; }
.ci-byline { font-family:var(--font-m); font-size:12px; color:var(--faint); margin-bottom:24px; }
.ci-actions { display:flex; gap:12px; flex-wrap:wrap; }
.ci-btn { text-decoration:none; font-family:var(--font-s); font-size:13px; padding:10px 18px; border-radius:8px; display:inline-block; }
.ci-solid { background:var(--ink); color:var(--bg); }
.ci-outline { border:1px solid var(--border); color:var(--body); }
.ci-outline:hover { border-color:var(--ink); color:var(--ink); }
.ci-paper-wrap { max-width:1080px; margin:0 auto; padding:30px 28px 70px; }
.ci-paper { max-width:920px; border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:24px; }
.ci-paper-meta { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; font-size:10px; color:var(--faint); margin-bottom:8px; }
.ci-paper h2 { font-family:var(--font-d); font-size:clamp(31px,4vw,48px); letter-spacing:-.02em; line-height:1.08; margin-bottom:10px; }
.ci-paper h3 { font-family:var(--font-d); font-size:29px; margin:30px 0 12px; letter-spacing:-.015em; }
.ci-paper h4 { font-family:var(--font-d); font-size:22px; margin-bottom:8px; letter-spacing:-.01em; }
.ci-paper p { color:var(--body); line-height:1.8; margin-bottom:12px; }
.ci-paper ul { margin:8px 0 0 18px; color:var(--body); line-height:1.8; }
.ci-paper li { margin-bottom:6px; }
.ci-lede { font-size:16px; max-width:740px; }
.ci-result-cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px; margin:18px 0 8px; }
.ci-result-card { background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:18px; display:flex; flex-direction:column; min-height:148px; }
.ci-result-stat { font-family:var(--font-d); font-size:42px; letter-spacing:-.03em; line-height:1; margin-bottom:4px; }
.ci-result-label { font-family:var(--font-s); font-size:13px; color:var(--ink); margin-bottom:8px; }
.ci-result-note { font-family:var(--font-m); font-size:10.5px; line-height:1.5; color:var(--faint); }
.ci-callout { background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:18px; margin:22px 0; }
.ci-callout p { margin:0; }
.ci-task-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(230px,1fr)); gap:12px; }
.ci-task { background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:16px; }
.ci-task-n { font-family:var(--font-m); font-size:10px; color:var(--faint); margin-bottom:10px; letter-spacing:.12em; }
.ci-task p { font-size:13.5px; line-height:1.65; margin:0; }
.ci-flow { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; margin:12px 0 16px; }
.ci-flow span { border:1px solid var(--border); background:var(--bg); border-radius:9px; padding:12px 10px; color:var(--body); font-size:13px; text-align:center; }
.ci-metrics { display:flex; flex-wrap:wrap; gap:8px; margin:12px 0 16px; }
.ci-metrics span { border:1px solid var(--border); background:var(--bg); color:var(--body); border-radius:999px; padding:7px 10px; font-size:12px; }
.ci-example { display:grid; grid-template-columns:1fr 1fr; gap:14px; background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:18px; }
.ci-example p { margin-bottom:8px; }
.ci-example-label { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint)!important; font-size:10px; margin-bottom:4px!important; }
.ci-claims { background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:16px; }
.ci-claims p { margin-bottom:8px; }
.ci-claims p:last-child { margin-bottom:0; }
.ci-sources { display:flex; flex-wrap:wrap; gap:9px; margin:8px 0 20px; }
.ci-sources a { border:1px solid var(--border); background:var(--bg); color:var(--accent); border-radius:8px; padding:8px 10px; text-decoration:none; font-size:13px; }
.ci-sources a:hover { border-color:var(--accent); }
blockquote { margin-top:24px; border-left:2px solid var(--border); padding-left:14px; color:var(--ink); font-family:var(--font-d); font-size:24px; letter-spacing:-.01em; line-height:1.4; }
@media (max-width: 900px) {
  .ci-hero, .ci-paper-wrap { padding-left:16px; padding-right:16px; }
  .ci-flow { grid-template-columns:1fr; }
  .ci-example { grid-template-columns:1fr; }
}
`;
