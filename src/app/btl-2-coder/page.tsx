import Link from "next/link";

const HF_URL = "https://huggingface.co/badtheorylabs/btl-2-coder";
const GH_URL = "https://github.com/Badtheorylabs/btl-2-coder";
const CAL_URL = "https://cal.com/alameenpd/quick-chat";

// the bug classes the adapter was actually trained to find. straight from the model card —
// no padding the list with stuff it wasn't tuned on.
const catches = [
  "SQL injection",
  "Path traversal",
  "Authorization bypass",
  "Missing error handling",
  "Boundary / off-by-one logic",
  "Related security & correctness issues",
];

// the eval table is the whole point of the "receipts" claim — these are the reported numbers
// from reports/EVAL_SUMMARY.md, H200 / 4-bit, strict schema prompting.
const evals = [
  { name: "Heldout 100 strict", parse: "1.00", schema: "0.95", cat: "0.78", file: "0.84" },
  { name: "Heldout 30 strict v2", parse: "1.00", schema: "0.98", cat: "0.87", file: "0.87" },
  { name: "Seeded 15 strict", parse: "1.00", schema: "1.00", cat: "0.93", file: "1.00" },
  { name: "Seeded 15 strict v2", parse: "1.00", schema: "1.00", cat: "—", file: "—" },
];

const specs = [
  { k: "Base model", v: "Qwen2.5-Coder-7B-Instruct" },
  { k: "Method", v: "LoRA SFT · Unsloth · r64 / α128" },
  { k: "Training mix", v: "4k API traces + 1k templates" },
  { k: "Runtime", v: "TypeScript agent · OpenAI-compatible" },
];

export default function ModelPage() {
  return (
    <main className="md-page">
      <style>{styles}</style>

      <nav className="md-nav">
        <Link href="/" className="md-brand">Bad Theory Labs</Link>
        <div className="md-nav-links">
          <Link href="/#products">Products</Link>
          <Link href="/runtime">Runtime</Link>
          <Link href="/btl-2-coder" className="md-active">BTL-2 Coder</Link>
          <Link href="/papers">Papers</Link>
        </div>
        <div className="md-nav-cta">
          <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={HF_URL} target="_blank" rel="noreferrer" className="md-solid">Download weights</a>
        </div>
      </nav>

      <section className="md-hero">
        <div className="md-hero-copy">
          <p className="md-eyebrow">Open model · Code review</p>
          <h1 className="md-h1">BTL-2 <em>Coder</em> 7B</h1>
          <p className="md-lede">
            A small open blade — <em>local, inspectable, and built for code-review findings.</em>
          </p>
          <p className="md-sub">
            A 7B LoRA adapter on Qwen2.5-Coder that returns structured security and
            correctness findings with file-level evidence and numeric confidence. Not a
            frontier clone. A downloadable model that ships with weights, evals, and receipts.
          </p>
          <div className="md-hero-actions">
            <a href={HF_URL} target="_blank" rel="noreferrer" className="md-btn md-btn-solid">Download weights →</a>
            <a href={GH_URL} target="_blank" rel="noreferrer" className="md-btn md-btn-outline">View on GitHub</a>
          </div>
        </div>

        <div className="md-hero-code">
          <div className="md-code-head">
            <span className="md-dot" /><span className="md-dot" /><span className="md-dot" />
            <span className="md-code-label">one finding, machine-readable</span>
          </div>
          <pre className="md-code">
{`{
  "severity": "critical",
  "file": "src/users.ts",
  "line": 42,
  "title": "SQL injection through
            string-built query",
  "evidence": "User id is concatenated
               directly into the SQL string.",
  "recommendation": "Use a parameterized
                     query.",
  "confidence": 0.96
}`}
          </pre>
        </div>
      </section>

      <section className="md-strip">
        {specs.map((s) => (
          <div key={s.k} className="md-strip-cell">
            <div className="md-strip-k">{s.k}</div>
            <div className="md-strip-v">{s.v}</div>
          </div>
        ))}
      </section>

      <section className="md-block">
        <div className="md-two">
          <div className="md-two-left">
            <p className="md-label">What it catches</p>
            <h2 className="md-h2">Narrow on purpose.<br/><em>Tuned for findings.</em></h2>
            <p className="md-block-body">
              It is not a general chat model wearing a security hat. The adapter is trained
              to emit one thing well: a JSON array of findings, each with a severity, the
              file and line, concrete evidence, a recommendation, and a confidence number
              you can threshold on.
            </p>
          </div>
          <div className="md-two-right">
            <div className="md-chips">
              {catches.map((c) => (
                <div key={c} className="md-chip">
                  <span className="md-chip-dot" />{c}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="md-block md-block-alt">
        <div className="md-block-head">
          <p className="md-label">Receipts</p>
          <h2 className="md-h2">Evals, not vibes.</h2>
          <p className="md-block-body">
            Measured on an NVIDIA H200 with 4-bit adapter inference under strict schema
            prompting. Strict schema validity climbs from <code>0.43</code> to{" "}
            <code>0.95</code> once the prompt contract is included — the runtime ships
            that contract by default.
          </p>
        </div>
        <div className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                <th>Eval</th>
                <th>JSON parse</th>
                <th>Schema valid</th>
                <th>Category hit</th>
                <th>File hit</th>
              </tr>
            </thead>
            <tbody>
              {evals.map((e) => (
                <tr key={e.name}>
                  <td className="md-eval-name">{e.name}</td>
                  <td>{e.parse}</td>
                  <td>{e.schema}</td>
                  <td>{e.cat}</td>
                  <td>{e.file}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="md-foot-note">
          Seeded controlled benchmark reaches 0.933 precision / 0.933 recall and 0.956
          weighted severity recall. Full breakdown in <code>reports/EVAL_SUMMARY.md</code>.
        </p>
      </section>

      <section className="md-block">
        <div className="md-block-head">
          <p className="md-label">Not a Mythos clone</p>
          <h2 className="md-h2">If Mythos is the locked frontier giant,<br/><em>this is the small open one.</em></h2>
          <p className="md-block-body">
            We are not claiming frontier-class capability or piggybacking on a brand. The
            claim is narrower and stronger: a model you can actually download, inspect, and
            run on your own hardware — with the training recipe and evals in the open.
          </p>
        </div>
        <div className="md-grid">
          {[
            { n: "01", t: "Local", b: "Runs on a laptop-class GPU via Ollama or llama.cpp. Your code never leaves the machine." },
            { n: "02", t: "Inspectable", b: "Open weights, open adapter config, open eval scripts. Nothing about the result is a black box." },
            { n: "03", t: "Receipts", b: "Published numbers on heldout and seeded benchmarks — format adherence, file hits, precision and recall." },
            { n: "04", t: "Structured", b: "Machine-readable findings with numeric confidence, so you can gate a CI step on severity and score." },
          ].map((p) => (
            <div key={p.n} className="md-card">
              <div className="md-card-n">{p.n}</div>
              <div className="md-card-title">{p.t}</div>
              <div className="md-card-body">{p.b}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="md-block md-block-alt">
        <div className="md-block-head">
          <p className="md-label">Quickstart</p>
          <h2 className="md-h2">Pull it. Run it.</h2>
        </div>
        <div className="md-qs">
          <div className="md-qs-panel">
            <div className="md-qs-tag">Load the adapter</div>
            <pre className="md-qs-code">
{`from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

base = "unsloth/Qwen2.5-Coder-7B-Instruct"
adapter = "badtheorylabs/btl-2-coder"

tok = AutoTokenizer.from_pretrained(adapter)
m = AutoModelForCausalLM.from_pretrained(base, device_map="auto")
m = PeftModel.from_pretrained(m, adapter)`}
            </pre>
          </div>
          <div className="md-qs-panel">
            <div className="md-qs-tag">Or local, OpenAI-compatible</div>
            <pre className="md-qs-code">
{`ollama pull qwen2.5-coder:7b

curl http://localhost:8787/v1/agents/code/runs \\
  -H 'content-type: application/json' \\
  -d '{
    "task": "Review for security bugs",
    "workspaceRoot": "/path/to/repo",
    "mode": "review"
  }'`}
            </pre>
          </div>
        </div>
      </section>

      <section className="md-cta">
        <h2 className="md-cta-title">Weights, evals, and receipts.</h2>
        <p className="md-cta-sub">All of it is downloadable. None of it is a black box.</p>
        <div className="md-hero-actions">
          <a href={HF_URL} target="_blank" rel="noreferrer" className="md-btn md-btn-light">Download on Hugging Face →</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="md-btn md-btn-ghost">Talk to us</a>
        </div>
      </section>

      <footer className="md-footer">
        <span>© 2025 Bad Theory Labs · Lagos, Nigeria</span>
        <div className="md-footer-links">
          <Link href="/">Home</Link>
          <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={HF_URL} target="_blank" rel="noreferrer">Hugging Face</a>
        </div>
      </footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.md-page {
  --bg:#FAFAF9; --surface:#F3F2EF; --border:#E8E6E1; --border2:#D6D3CC;
  --ink:#0E0D0C; --body:#5C5954; --faint:#9C9890; --gold:#A85E1A;
  background:var(--bg); color:var(--ink);
  font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; min-height:100vh;
}
.md-page *,.md-page *::before,.md-page *::after { box-sizing:border-box; }
.md-page em { font-style:italic; font-weight:400; }
.md-page code { font-family:'JetBrains Mono',monospace; font-size:0.85em; background:var(--surface); padding:1px 5px; border-radius:4px; color:var(--gold); }

.md-nav {
  position:sticky; top:0; z-index:50; height:56px; padding:0 clamp(20px,4vw,52px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(250,250,249,0.85); backdrop-filter:blur(24px) saturate(1.4);
  border-bottom:1px solid var(--border);
}
.md-brand { font-family:'EB Garamond',serif; font-size:16px; font-weight:500; letter-spacing:-0.02em; color:var(--ink); text-decoration:none; }
.md-nav-links { display:flex; gap:26px; }
.md-nav-links a { font-size:13px; color:var(--body); text-decoration:none; transition:color .15s; }
.md-nav-links a:hover,.md-nav-links a.md-active { color:var(--ink); }
.md-nav-cta { display:flex; align-items:center; gap:10px; }
.md-nav-cta a { font-size:13px; color:var(--body); text-decoration:none; }
.md-solid { background:var(--ink); color:var(--bg)!important; padding:7px 16px; border-radius:7px; font-weight:500; transition:opacity .12s; }
.md-solid:hover { opacity:.85; }
@media (max-width:760px){ .md-nav-links{ display:none; } }

.md-hero { display:grid; grid-template-columns:1.05fr 0.95fr; border-bottom:1px solid var(--border); }
.md-hero-copy { padding:clamp(48px,7vw,96px) clamp(24px,4vw,56px); border-right:1px solid var(--border); }
.md-eyebrow { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:28px; }
.md-h1 { font-family:'EB Garamond',serif; font-size:clamp(48px,6.5vw,86px); font-weight:500; letter-spacing:-0.04em; line-height:0.98; margin-bottom:24px; }
.md-lede { font-family:'EB Garamond',serif; font-size:clamp(20px,2.4vw,28px); font-weight:500; letter-spacing:-0.02em; line-height:1.3; color:var(--ink); max-width:470px; margin-bottom:20px; }
.md-sub { font-size:15px; font-weight:300; line-height:1.78; color:var(--body); max-width:450px; margin-bottom:36px; }
.md-hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.md-btn { font-size:14px; font-weight:500; text-decoration:none; padding:13px 26px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; transition:opacity .12s,border-color .15s,color .15s,background .15s; }
.md-btn-solid { background:var(--ink); color:var(--bg); }
.md-btn-solid:hover { opacity:.85; }
.md-btn-outline { border:1px solid var(--border); color:var(--body); }
.md-btn-outline:hover { border-color:var(--ink); color:var(--ink); background:rgba(14,13,12,0.025); }

.md-hero-code { background:var(--ink); padding:clamp(32px,4vw,52px); display:flex; flex-direction:column; justify-content:center; }
.md-code-head { display:flex; align-items:center; gap:7px; margin-bottom:22px; }
.md-dot { width:9px; height:9px; border-radius:50%; background:rgba(250,250,249,0.18); }
.md-code-label { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(250,250,249,0.35); letter-spacing:0.1em; text-transform:uppercase; margin-left:8px; }
.md-code { font-family:'JetBrains Mono',monospace; font-size:12.5px; line-height:1.7; color:rgba(250,250,249,0.82); white-space:pre; overflow-x:auto; margin:0; }

.md-strip { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--border); background:var(--surface); }
.md-strip-cell { padding:26px clamp(20px,3vw,36px); border-right:1px solid var(--border); }
.md-strip-cell:last-child { border-right:none; }
.md-strip-k { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--faint); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
.md-strip-v { font-family:'EB Garamond',serif; font-size:clamp(16px,1.7vw,21px); font-weight:500; letter-spacing:-0.02em; color:var(--ink); }

.md-block { padding:clamp(56px,7vw,96px) clamp(24px,4vw,56px); border-bottom:1px solid var(--border); max-width:1320px; margin:0 auto; }
.md-block-alt { background:var(--surface); max-width:none; }
.md-block-head { max-width:680px; margin-bottom:48px; }
.md-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:10px; }
.md-label::before { content:''; width:24px; height:1px; background:var(--border); }
.md-h2 { font-family:'EB Garamond',serif; font-size:clamp(30px,3.8vw,50px); font-weight:500; letter-spacing:-0.035em; line-height:1.06; margin-bottom:24px; }
.md-block-body { font-size:15.5px; font-weight:300; line-height:1.78; color:var(--body); }

.md-two { display:grid; grid-template-columns:1fr 1fr; gap:clamp(40px,6vw,80px); max-width:1320px; margin:0 auto; }
.md-chips { display:flex; flex-direction:column; }
.md-chip { display:flex; align-items:center; gap:14px; padding:18px 0; border-bottom:1px solid var(--border); font-size:15px; color:var(--ink); }
.md-chip:first-child { border-top:1px solid var(--border); }
.md-chip-dot { width:6px; height:6px; border-radius:50%; background:var(--gold); flex-shrink:0; }

.md-table-wrap { border:1px solid var(--border); border-radius:12px; overflow:hidden; overflow-x:auto; }
.md-table { width:100%; border-collapse:collapse; min-width:560px; }
.md-table th { font-family:'JetBrains Mono',monospace; font-size:9.5px; color:var(--faint); font-weight:500; letter-spacing:0.08em; text-transform:uppercase; padding:13px 18px; text-align:right; border-bottom:1px solid var(--border); background:rgba(14,13,12,0.02); }
.md-table th:first-child { text-align:left; }
.md-table td { padding:15px 18px; font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--body); text-align:right; border-bottom:1px solid var(--border); }
.md-table tr:last-child td { border-bottom:none; }
.md-eval-name { text-align:left!important; font-family:'DM Sans',sans-serif!important; font-size:14px!important; color:var(--ink)!important; }
.md-foot-note { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); line-height:1.7; margin-top:18px; }

.md-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.md-card { background:var(--bg); padding:32px clamp(20px,2vw,28px); transition:background .2s; }
.md-block-alt .md-card { background:var(--surface); }
.md-card:hover { background:var(--surface); }
.md-card-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--gold); letter-spacing:0.1em; margin-bottom:16px; }
.md-card-title { font-family:'EB Garamond',serif; font-size:24px; font-weight:500; letter-spacing:-0.02em; margin-bottom:10px; }
.md-card-body { font-size:13.5px; font-weight:300; line-height:1.7; color:var(--body); }

.md-qs { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.md-qs-panel { background:var(--ink); border-radius:12px; overflow:hidden; }
.md-qs-tag { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(250,250,249,0.4); letter-spacing:0.1em; text-transform:uppercase; padding:16px 20px 0; }
.md-qs-code { font-family:'JetBrains Mono',monospace; font-size:12px; line-height:1.7; color:rgba(250,250,249,0.82); white-space:pre; overflow-x:auto; padding:14px 20px 22px; margin:0; }

.md-cta { background:var(--ink); padding:clamp(64px,8vw,112px) clamp(24px,4vw,56px); text-align:center; }
.md-cta-title { font-family:'EB Garamond',serif; font-size:clamp(32px,4.5vw,60px); font-weight:500; letter-spacing:-0.04em; color:rgba(250,250,249,0.94); margin-bottom:16px; }
.md-cta-sub { font-size:15px; font-weight:300; color:rgba(250,250,249,0.45); margin-bottom:36px; }
.md-cta .md-hero-actions { justify-content:center; }
.md-btn-light { background:var(--bg); color:var(--ink); }
.md-btn-light:hover { opacity:.88; }
.md-btn-ghost { border:1px solid rgba(255,255,255,0.18); color:rgba(250,250,249,0.7); }
.md-btn-ghost:hover { border-color:rgba(255,255,255,0.5); color:var(--bg); }

.md-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; padding:28px clamp(24px,4vw,56px); font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); }
.md-footer-links { display:flex; gap:24px; }
.md-footer-links a { color:var(--faint); text-decoration:none; transition:color .12s; }
.md-footer-links a:hover { color:var(--ink); }

@media (max-width:820px){
  .md-hero { grid-template-columns:1fr; }
  .md-hero-copy { border-right:none; border-bottom:1px solid var(--border); }
  .md-strip { grid-template-columns:1fr 1fr; }
  .md-strip-cell:nth-child(2) { border-right:none; }
  .md-strip-cell:nth-child(1),.md-strip-cell:nth-child(2) { border-bottom:1px solid var(--border); }
  .md-two { grid-template-columns:1fr; }
  .md-grid { grid-template-columns:1fr 1fr; }
  .md-qs { grid-template-columns:1fr; }
}
@media (max-width:520px){ .md-grid { grid-template-columns:1fr; } }
`;
