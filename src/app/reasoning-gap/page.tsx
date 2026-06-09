import Link from "next/link";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/eEKNE5M8W";

export default function ReasoningGapPage() {
  return (
    <main className="rg-page">
      <style>{styles}</style>

      <nav className="top-nav">
        <Link href="/" className="brand">Bad Theory Labs</Link>
        <div className="nav-links">
          <Link href="/#research">Research</Link>
          <Link href="/#products">Products</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/brief">Brief</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-cta">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Join community</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule call</a>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">Research Paper · June 2026</p>
        <h1>The Reasoning Gap</h1>
        <p className="hero-subtitle">Frontier LLMs Fail at Interventional Causal Inference from Probability Tables</p>
        <p className="hero-byline">Olajide Al-ameen · Bad Theory Labs, Lagos</p>
        <div className="hero-actions">
          <a href="https://github.com/Badtheorylabs/reasoning-gap" target="_blank" rel="noreferrer" className="btn btn-solid">View on GitHub</a>
          <a href="/reasoning-test" className="btn btn-outline">Take the Test</a>
          <a href="https://github.com/Badtheorylabs/reasoning-gap/blob/main/paper/main.tex" target="_blank" rel="noreferrer" className="btn btn-outline">Read Paper (LaTeX)</a>
        </div>
      </section>

      <section className="paper-wrap">
        <article className="paper">

          <header>
            <p className="paper-meta">Published June 2026 · Bad Theory Labs</p>
            <h2>The Reasoning Gap: Frontier LLMs Fail at Interventional Causal Inference from Probability Tables</h2>
            <p className="paper-authors">Olajide Al-ameen</p>
          </header>

          <h3>Headline Results</h3>

          <div className="result-cards">
            <div className="result-card">
              <span className="result-stat">25.0%</span>
              <span className="result-label">GPT-5.4 accuracy</span>
              <span className="result-ci">95% CI [22.2, 28.0]</span>
            </div>
            <div className="result-card highlight">
              <span className="result-stat">25.7%</span>
              <span className="result-label">GPT-4o mini accuracy</span>
              <span className="result-ci">95% CI [22.9, 28.8]</span>
            </div>
            <div className="result-card">
              <span className="result-stat">100%</span>
              <span className="result-label">Exact solver baseline</span>
              <span className="result-ci">Verifies benchmark correctness</span>
            </div>
            <div className="result-card">
              <span className="result-stat">97.8%</span>
              <span className="result-label">Human experts (CounterBench)</span>
              <span className="result-ci">PhD-level annotators on comparable tasks</span>
            </div>
          </div>

          <p className="result-summary">
            All three evaluated models — GPT-5.4, GPT-4o mini, and Gemini 2.0 Flash — perform at or near the
            25% random-chance baseline on 840 four-choice causal inference questions. None of the models
            achieve statistically significant above-chance performance. Scale does not help: the frontier model
            (GPT-5.4) performs no better than the budget model (GPT-4o mini).
          </p>

          <h3>Abstract</h3>
          <p>
            We introduce a causal reasoning benchmark that cleanly separates observational from interventional
            queries over the same causal graphs and probability tables. Across 840 four-choice questions spanning
            seven canonical graph templates, we evaluate three frontier large language models. All three perform at
            or near random chance (25.0% [22.2, 28.0], 25.7% [22.9, 28.8], and 29.2% [14.9, 49.2] respectively,
            95% Wilson confidence intervals), while an exact inference baseline achieves 100%. Human experts
            achieve 97.8% on similar formal causal reasoning tasks.
          </p>
          <p>
            Notably, models also fail at observational queries, suggesting a broader inability to compute
            probabilities from conditional probability tables rather than a deficit specific to interventional
            reasoning. This finding has direct implications for deploying LLMs in settings that require
            probabilistic reasoning: scientific discovery, medical diagnosis, policy analysis, and experimental
            design.
          </p>

          <div className="cta-box">
            <p><strong>Read the full paper</strong> for methodology, benchmark design, example questions, result breakdowns by graph type, and discussion of limitations.</p>
            <div className="cta-links">
              <a href="https://github.com/Badtheorylabs/reasoning-gap" target="_blank" rel="noreferrer" className="btn btn-solid">Research Repository</a>
              <a href="/reasoning-test" className="btn btn-outline">Take the Live Test</a>
            </div>
          </div>

          <h3>What We Measured</h3>
          <p>
            The benchmark uses 7 canonical causal graph templates — chain, fork, collider, M-bias,
            instrumental variable, front-door, and back-door — each instantiated with 20 random seeded
            conditional probability tables. For each instantiation, models answer 6 four-choice questions
            spanning observational, interventional, and counterfactual queries.
          </p>
          <p>
            Every question provides complete information: the full causal graph (variables and edges) and all
            CPTs. The only variable is the query type. This design eliminates confounds such as missing
            information, ambiguous language, or the need for commonsense knowledge retrieval.
          </p>

          <h3>Results by Question Type</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Observational</th>
                  <th>Interventional</th>
                  <th>Counterfactual</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>GPT-4o mini</td>
                  <td>24.2% (110/455)</td>
                  <td>27.0% (85/315)</td>
                  <td>30.0% (21/70)</td>
                </tr>
                <tr>
                  <td>GPT-5.4</td>
                  <td>24.2% (110/455)</td>
                  <td>24.8% (78/315)</td>
                  <td>31.4% (22/70)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="table-note">
            Models fail uniformly across all three levels. The primary difficulty is not specifically about
            interventions but rather a broader inability to compute probabilities from CPTs presented in text.
          </p>

          <h3>Why This Matters</h3>
          <p>
            If LLMs are to serve as autonomous agents that act on the world, they must be able to predict the
            effects of their actions — which is precisely the interventional reasoning task we evaluate. Our results
            suggest that this capability may not be present in current frontier architectures.
          </p>
          <p>
            The failure is striking because the task is straightforward for humans: given a causal graph and
            complete probability tables, compute a probability. An undergraduate statistics student can solve
            these problems. Human experts score 97.8% on comparable tasks. The exact inference engine
            achieves 100%. Yet every evaluated model — including the most capable available — performs at
            random chance.
          </p>

          <h3>Access</h3>
          <ul>
            <li><strong>Paper:</strong> Preprint available on arXiv (endorsement pending).</li>
            <li><strong>Code:</strong> Full benchmark, evaluation code, and analysis at <a href="https://github.com/Badtheorylabs/reasoning-gap" target="_blank" rel="noreferrer">github.com/Badtheorylabs/reasoning-gap</a>.</li>
            <li><strong>Live test:</strong> Try the benchmark yourself at <a href="/reasoning-test">badtheorylabs.com/reasoning-test</a>.</li>
            <li><strong>Data:</strong> Raw responses stored via Supabase; results dashboard at <a href="/reasoning-test/results">badtheorylabs.com/reasoning-test/results</a>.</li>
          </ul>

          <blockquote>
            &ldquo;The field has been teaching systems to predict the world. We are trying to build systems that
            understand it. The difference is not scale. It is the objective.&rdquo;
          </blockquote>
          <p className="paper-submeta">Bad Theory Labs, Lagos · June 2026</p>
        </article>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; --accent:#2563eb; }
.rg-page { min-height:100vh; background:var(--bg); color:var(--ink); }
.top-nav { position:sticky; top:0; z-index:20; height:58px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.nav-links, .nav-cta { display:flex; gap:16px; align-items:center; }
.nav-links a, .nav-cta a { text-decoration:none; color:var(--body); font-family:var(--font-s); font-size:13px; }
.nav-cta .solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }
.hero { max-width:1080px; margin:0 auto; padding:72px 28px 48px; border-bottom:1px solid var(--border); }
.eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:10px; }
.hero h1 { font-family:var(--font-d); font-size:clamp(42px,6vw,72px); letter-spacing:-.03em; line-height:1.02; margin-bottom:8px; }
.hero-subtitle { color:var(--body); font-size:18px; max-width:720px; line-height:1.5; margin-bottom:6px; }
.hero-byline { font-family:var(--font-m); font-size:12px; color:var(--faint); margin-bottom:24px; }
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.btn { text-decoration:none; font-family:var(--font-s); font-size:13px; padding:10px 18px; border-radius:8px; display:inline-block; }
.btn-solid { background:var(--ink); color:var(--bg); }
.btn-outline { border:1px solid var(--border); color:var(--body); }
.btn-outline:hover { border-color:var(--ink); color:var(--ink); }
.paper-wrap { max-width:1080px; margin:0 auto; padding:30px 28px 70px; }
.paper { max-width:920px; border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:24px; }
.paper-meta { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; font-size:10px; color:var(--faint); margin-bottom:8px; }
.paper h2 { font-family:var(--font-d); font-size:clamp(28px,4vw,44px); letter-spacing:-.02em; line-height:1.1; margin-bottom:6px; }
.paper-authors { font-family:var(--font-m); font-size:12px; color:var(--body); margin-bottom:20px; }
.paper h3 { font-family:var(--font-d); font-size:28px; margin:28px 0 12px; }
.paper p { color:var(--body); line-height:1.8; margin-bottom:12px; }
.paper ul { margin:6px 0 0 18px; color:var(--body); line-height:1.8; }
.paper ul li { margin-bottom:6px; }
.paper a { color:var(--accent); }
.result-cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:14px; margin:16px 0; }
.result-card { background:var(--bg); border:1px solid var(--border); border-radius:10px; padding:18px; display:flex; flex-direction:column; }
.result-card.highlight { border-color:var(--accent); background:#eff6ff; }
.result-stat { font-family:var(--font-d); font-size:36px; letter-spacing:-.03em; line-height:1; margin-bottom:4px; }
.result-label { font-family:var(--font-s); font-size:13px; color:var(--body); }
.result-ci { font-family:var(--font-m); font-size:11px; color:var(--faint); margin-top:4px; }
.result-summary { font-size:15px; padding:12px 16px; background:var(--bg); border-radius:8px; border:1px solid var(--border); margin:10px 0 16px; }
.cta-box { background:var(--bg); border:1px solid var(--border); border-radius:12px; padding:20px; margin:24px 0; }
.cta-box p { margin-bottom:14px; }
.cta-links { display:flex; gap:10px; flex-wrap:wrap; }
.table-wrap { overflow-x:auto; border:1px solid var(--border); border-radius:10px; margin:12px 0; }
table { width:100%; border-collapse:collapse; font-family:var(--font-m); font-size:13px; }
thead { background:var(--bg); }
th { padding:10px 14px; text-align:left; font-weight:500; color:var(--faint); text-transform:uppercase; letter-spacing:.06em; font-size:11px; border-bottom:1px solid var(--border); }
td { padding:10px 14px; border-bottom:1px solid var(--border); color:var(--body); }
tr:last-child td { border-bottom:none; }
.table-note { font-family:var(--font-s); font-size:12px; color:var(--faint); margin-top:4px; }
blockquote { margin-top:24px; border-left:2px solid var(--border); padding-left:14px; color:var(--ink); font-family:var(--font-d); font-size:24px; letter-spacing:-.01em; }
.paper-submeta { font-family:var(--font-m); font-size:11px; color:var(--faint); letter-spacing:.06em; text-transform:uppercase; margin-top:8px; }
@media (max-width: 900px) {
  .nav-links { display:none; }
  .top-nav { padding:0 16px; }
  .hero, .paper-wrap { padding-left:16px; padding-right:16px; }
  .result-cards { grid-template-columns:1fr 1fr; }
}
@media (max-width: 640px) {
  .result-cards { grid-template-columns:1fr; }
  .hero-actions { flex-direction:column; }
  .hero-actions .btn { text-align:center; }
}
`;
