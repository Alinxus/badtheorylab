import Link from "next/link";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const BENCHMARK_URL = "https://retaindb.com/benchmark";
const OSS_URL = "https://github.com/RetainDB";
const DISCORD_URL = "https://discord.gg/eEKNE5M8W";

export default function BriefPage() {
  return (
    <main className="brief-page">
      <style>{styles}</style>

      <nav className="top-nav">
        <Link href="/" className="brand">Bad Theory Labs</Link>
        <div className="nav-links">
          <Link href="/#research">Research</Link>
          <Link href="/#products">Products</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/brief" aria-current="page">Brief</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-cta">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Join community</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule call</a>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">Investor Brief</p>
        <h1>Building the infrastructure and products for the next interface to computing.</h1>
        <p className="hero-copy">Bad Theory Labs is building for a world where software remembers, reasons, and acts with restraint.</p>
        <div className="hero-actions">
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule investor call</a>
          <Link href="/contact" className="ghost">Send a note</Link>
        </div>
      </section>

      <section className="doc">
        <article>
          <h2>1. What We Are</h2>
          <p>
            Bad Theory Labs is a product and research lab built around one thesis: we research how intelligence
            perceives, reasons, and acts, then build infrastructure that makes that useful in real workflows.
            We are not a model company and not an AI wrapper. We are building the substrate layer: memory,
            retrieval, context, and ambient presence.
          </p>
          <p>
            Our two foundational products are RetainDB and Marrow. RetainDB gives agents durable memory and
            precise context across sessions. Marrow turns continuity into selective native action on the machine.
            Together they reflect a simple belief: AI is only truly useful when it can remember, reason over
            changing context, and act without becoming noisy.
          </p>

          <h2>2. The Thesis</h2>
          <p>
            The current generation of AI products forgets too much, retrieves the wrong context, interrupts without
            judgment, and rarely follows through. Users repeatedly restate context and become the system integrator.
          </p>
          <p>
            We believe the next wave will be built around four capabilities: persistent context, selective attention,
            native action, and continuous improvement.
          </p>

          <h2>3. Why Now</h2>
          <p>
            AI is moving from chat surfaces into real products and operating environments. Enterprises now care about
            memory quality, retrieval precision, and context governance. Users want capable systems, not chat demos.
            The stack is still immature, and the gap between model intelligence and product usefulness is large.
          </p>

          <h2>4. Product One: RetainDB</h2>
          <p>
            RetainDB is persistent memory and hybrid retrieval infrastructure for AI agents. It combines pgvector
            semantic search and BM25 lexical matching to return only relevant context, with no training on customer
            data and no compromise on speed.
          </p>

          <div className="card">
            <p className="mini">Benchmark snapshot</p>
            <table>
              <thead>
                <tr>
                  <th>Benchmark</th>
                  <th>RetainDB</th>
                  <th>Zep</th>
                  <th>Supermemory</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>LongMemEval (overall)</td>
                  <td>79%</td>
                  <td>56.7%</td>
                  <td>70%</td>
                </tr>
                <tr>
                  <td>Single-session preference recall</td>
                  <td>88%</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>Code hallucination rate</td>
                  <td>0%</td>
                  <td>-</td>
                  <td>95.5% (baseline)</td>
                </tr>
              </tbody>
            </table>
            <p className="meta">Hallucination grounding matters most for trust at scale.</p>
            <p className="meta">
              Live: <a href="https://retaindb.com" target="_blank" rel="noreferrer">retaindb.com</a> · Benchmark:
              {" "}<a href={BENCHMARK_URL} target="_blank" rel="noreferrer">retaindb.com/benchmark</a> · Open source:
              {" "}<a href={OSS_URL} target="_blank" rel="noreferrer">github.com/RetainDB</a>
            </p>
          </div>

          <p>
            Early traction is strong for a new product in an emerging market, with growing developer pull and
            reproducible benchmark advantage around memory quality and trust.
          </p>

          <h2>5. Product Two: Marrow</h2>
          <p>
            Marrow is an ambient intelligence layer that lives on your laptop. It observes workflow context over time,
            decides whether interruption is justified, and when signal is high enough, executes across browser, apps,
            files, and code environments.
          </p>
          <p>
            Core architecture: gate (interrupt or not), generator (action), critic (evaluate before user sees output).
            The goal is taste and trust, not engagement.
          </p>

          <h2>6. Why These Products Belong Together</h2>
          <p>RetainDB solves continuity. Marrow solves agency.</p>
          <div className="flow">
            <span>Observe what matters</span>
            <span>Retain the right information</span>
            <span>Retrieve the right context</span>
            <span>Decide whether action is warranted</span>
            <span>Execute effectively</span>
            <span>Improve from repeated behavior</span>
          </div>

          <h2>7. Early Roadmap</h2>
          <p>
            RetainDB near-term: improve onboarding and activation, deepen retrieval precision, publish stronger
            benchmarks, ship managed cloud tier, launch task-aware retrieval API with LangChain/LangGraph adapters.
          </p>
          <p>
            Marrow near-term: build on-device observation layer, ship gate/generator/critic architecture, expand action
            capability across desktop workflows, and validate low-noise high-trust UX.
          </p>

          <h2>8. Why Us</h2>
          <p>
            Al-ameen is 19, solo, building from Nigeria. RetainDB was built from scratch: architecture, benchmarks,
            SDK, landing page, and distribution. The benchmark numbers are reproducible. Background spans mathematics,
            low-level AI systems, CUDA, GPU kernels, and inference engineering.
          </p>

          <h2>9. What We Are Looking For</h2>
          <p>
            We are raising pre-seed to accelerate Marrow and RetainDB development, ship private beta, grow managed
            cloud, and make first engineering hire. We are looking for alignment, strategic feedback, network support,
            and patient belief alongside capital.
          </p>

          <h2>10. Closing</h2>
          <p>
            Bad Theory Labs is building for a world where software does more than wait for instructions. Agents
            remember the right things, context survives across time, assistance stays selective, and systems follow
            through.
          </p>

          <div className="card">
            <h3>Appendix A · One Paragraph</h3>
            <p>
              Bad Theory Labs is a product and research lab building toward AI-native computing. RetainDB provides
              memory and context infrastructure for agents with strong benchmark performance and a 0% hallucination
              rate on stored facts. Marrow is a proactive desktop agent that builds context from your workflow and
              intervenes selectively, then executes end-to-end tasks directly on your machine.
            </p>
            <h3>Appendix B · 3-Sentence Version</h3>
            <p>
              Bad Theory Labs builds infrastructure and products for AI systems that can remember, decide, and act.
              RetainDB is memory and context infrastructure benchmarked above current alternatives. Marrow is a
              proactive desktop agent with taste: a ghost in your computer that stays quiet until signal is high,
              then executes.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; }
.brief-page { background:var(--bg); color:var(--ink); min-height:100vh; }
.top-nav { position:sticky; top:0; z-index:20; height:58px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.nav-links, .nav-cta { display:flex; gap:16px; align-items:center; }
.nav-links a, .nav-cta a { text-decoration:none; color:var(--body); font-family:var(--font-s); font-size:13px; }
.nav-cta .solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }
.hero { border-bottom:1px solid var(--border); padding:72px 28px 60px; max-width:1120px; margin:0 auto; }
.eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:12px; }
.hero h1 { font-family:var(--font-d); font-size:clamp(40px,6vw,68px); letter-spacing:-.03em; line-height:1.02; max-width:920px; margin-bottom:18px; }
.hero-copy { max-width:680px; color:var(--body); line-height:1.7; font-size:16px; }
.hero-actions { margin-top:24px; display:flex; gap:10px; }
.hero-actions a { text-decoration:none; font-size:14px; padding:11px 16px; border-radius:8px; }
.hero-actions .solid { background:var(--ink); color:var(--bg); }
.hero-actions .ghost { border:1px solid var(--border); color:var(--body); }
.doc { max-width:920px; margin:0 auto; padding:38px 28px 70px; }
article h2 { font-family:var(--font-d); font-size:35px; letter-spacing:-.02em; margin:42px 0 10px; }
article p { color:var(--body); line-height:1.82; font-size:16px; margin-bottom:14px; }
.card { border:1px solid var(--border); background:var(--surface); border-radius:14px; padding:20px; margin:20px 0; }
.mini { font-family:var(--font-m); font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:8px; }
table { width:100%; border-collapse:collapse; margin-bottom:10px; }
th, td { text-align:left; font-size:13px; padding:10px 8px; border-bottom:1px solid var(--border); color:var(--body); }
th { font-family:var(--font-m); color:var(--ink); font-size:11px; letter-spacing:.08em; text-transform:uppercase; }
.meta { font-size:13px; color:var(--faint); margin-bottom:6px; }
.meta a { color:var(--body); }
.flow { display:grid; gap:10px; margin:14px 0 20px; }
.flow span { border:1px solid var(--border); border-radius:10px; padding:10px 12px; background:var(--surface); font-size:14px; color:var(--body); }
.card h3 { font-family:var(--font-d); font-size:23px; margin-bottom:10px; }
@media (max-width: 900px) {
  .nav-links { display:none; }
  .top-nav { padding:0 16px; }
  .hero, .doc { padding-left:16px; padding-right:16px; }
}
`;
