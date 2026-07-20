import Link from "next/link";
import { styles } from "./styles";
import {
  HF_FULL, HF_COMPACT, GH_URL, DISCORD_URL, CAL_URL,
  headline, specStrip, editions, evals, bfcl, retention, perf, boundaries, hashes,
} from "./data";

// three quickstart panels. kept as literals here rather than in data.ts because
// they're really markup — indentation matters and i'd rather see it next to the <pre>.
const QS_VLLM = `# evaluated with vLLM 0.23.0
vllm serve Qwen/Qwen3.6-27B \\
  --revision 6a9e13bd6fc8f0983b9b99948120bc37f49c13e9 \\
  --served-model-name BTL-3 \\
  --enable-lora --max-lora-rank 32 \\
  --lora-modules BTL-3=/path/to/BTL-3 \\
  --reasoning-parser qwen3 \\
  --language-model-only --max-model-len 32768`;

const QS_TF = `from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

base = "Qwen/Qwen3.6-27B"
rev  = "6a9e13bd6fc8f0983b9b99948120bc37f49c13e9"
adapter = "badtheorylabs/BTL-3"

tok = AutoTokenizer.from_pretrained(adapter)
m = AutoModelForCausalLM.from_pretrained(
    base, revision=rev, device_map="auto")
m = PeftModel.from_pretrained(m, adapter)
# enable_thinking=True in the chat template for coding`;

const QS_COMPACT = `# native OpenAI-compatible server (macOS arm64)
BTL3_MODEL="$PWD/model/BTL-3-Compact-AVQ2.gguf" \\
BTL3_CTX_SIZE=4096 \\
  runtimes/supported/\\
  BTL-3-Compact-macos-arm64/bin/btl3-server

curl http://127.0.0.1:8080/v1/chat/completions \\
  -H 'Content-Type: application/json' \\
  -d '{"model":"BTL-3","messages":[{
       "role":"user","content":"Write a
       retrying fetch helper with tests."}]}'`;

const sevClass = (s: string) =>
  s === "crit" ? "b3-sev-crit" : s === "warn" ? "b3-sev-warn" : "b3-sev-note";

export default function Btl3Page() {
  return (
    <main className="b3">
      <style>{styles}</style>

      <nav className="b3-nav">
        <Link href="/" className="b3-brand">Bad Theory Labs</Link>
        <div className="b3-nav-links">
          <Link href="/#products">Products</Link>
          <Link href="/runtime">Runtime</Link>
          <Link href="/btl-2-coder">BTL-2 Coder</Link>
          <Link href="/btl-3" className="b3-active">BTL-3</Link>
          <Link href="/papers">Papers</Link>
        </div>
        <div className="b3-nav-cta">
          <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={HF_FULL} target="_blank" rel="noreferrer" className="b3-solid">Download weights</a>
        </div>
      </nav>

      {/* hero */}
      <section className="b3-hero">
        <div className="b3-hero-copy">
          <p className="b3-eyebrow">Open weights · Frozen release RL-0013</p>
          <h1 className="b3-h1">BTL<em>-</em>3</h1>
          <p className="b3-lede">
            A <b>27B</b> agentic coding and tool-use model — and its complete{" "}
            <b>8.39&nbsp;GB</b> native edition that runs the whole thing locally.
          </p>
          <p className="b3-sub">
            Post-trained from Qwen3.6-27B to reason, call tools, inspect results,
            recover from failure, and stop when no action is needed. Every number on
            this page is a measured value with a stated protocol.
          </p>
          <div className="b3-hero-actions">
            <a href={HF_FULL} target="_blank" rel="noreferrer" className="b3-btn b3-btn-solid">Download BTL-3 →</a>
            <a href={HF_COMPACT} target="_blank" rel="noreferrer" className="b3-btn b3-btn-outline">Get Compact</a>
            <a href={GH_URL} target="_blank" rel="noreferrer" className="b3-btn b3-btn-outline">Runtime source</a>
          </div>
        </div>

        <div className="b3-readout">
          <div className="b3-readout-head">
            <span className="b3-dot" /><span className="b3-dot" /><span className="b3-dot" />
            <span className="b3-readout-label">frozen · rl-0013 · 27B</span>
          </div>
          {headline.map((h) => (
            <div key={h.k} className="b3-readout-row">
              <span className="b3-readout-k">{h.k}</span>
              <span className="b3-readout-v">{h.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* spec strip */}
      <section className="b3-strip">
        {specStrip.map((s) => (
          <div key={s.k} className="b3-strip-cell">
            <div className="b3-strip-k">{s.k}</div>
            <div className="b3-strip-v">{s.v}</div>
          </div>
        ))}
      </section>

      {/* two editions */}
      <section className="b3-block">
        <div className="b3-block-head">
          <p className="b3-label">Two editions</p>
          <h2 className="b3-h2">One model,<br /><em>two ways to run it.</em></h2>
          <p className="b3-body">
            The full adapter for servers, and a byte-verified 8.39&nbsp;GB native GGUF
            for local machines. They have different runtimes and limitations and are
            <em> not</em> interchangeable.
          </p>
        </div>
        <div className="b3-editions">
          {editions.map((e) => (
            <div key={e.id} className={`b3-card${e.primary ? " b3-card-feat" : ""}`}>
              <span className="b3-card-tag">{e.tag}</span>
              <div className="b3-card-name">{e.name}</div>
              <p className="b3-card-blurb">{e.blurb}</p>
              <ul className="b3-speclist">
                {e.rows.map(([k, v]) => (
                  <li key={k}>
                    <span className="b3-spec-k">{k}</span>
                    <span className="b3-spec-v">{v}</span>
                  </li>
                ))}
              </ul>
              <a
                href={e.href}
                target="_blank"
                rel="noreferrer"
                className={`b3-btn ${e.primary ? "b3-btn-solid" : "b3-btn-outline"}`}
              >
                {e.primary ? "Get Compact →" : "Open weights →"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* results */}
      <section className="b3-block b3-block-alt">
        <div className="b3-block-head">
          <p className="b3-label">Receipts</p>
          <h2 className="b3-h2">Measured results.</h2>
          <p className="b3-body">
            All values belong to the frozen BTL-3 RL-0013 checkpoint, 27B. Bars run a
            flat 0–100 scale, so a weak result reads as plainly as a strong one.
          </p>
        </div>

        <div className="b3-bench">
          {evals.map((e) => (
            <div key={e.name} className="b3-bench-row">
              <div className="b3-bench-name">{e.name}<small>{e.sub}</small></div>
              <div className="b3-bench-pct">{e.label}</div>
              <div className="b3-gauge">
                <div className="b3-gauge-track" />
                <div className="b3-gauge-fill" style={{ width: `${e.pct}%` }} />
                {[0, 25, 50, 75, 100].map((t) => (
                  <span key={t} className="b3-gauge-tick" style={{ left: `${t}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="b3-two" style={{ marginTop: 36 }}>
          <div className="b3-tbl-wrap">
            <div className="b3-cap">BFCL v4 AST — category breakdown</div>
            <table className="b3-tbl">
              <tbody>
                {bfcl.map((c) => (
                  <tr key={c.cat} className={c.strong ? "strong" : ""}>
                    <td className="name">{c.cat}</td>
                    <td className="frac">{c.frac}</td>
                    <td className="barcell">
                      <b>{c.label}</b>
                      <span className="bar" style={{ width: `${c.pct}%` }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="b3-tbl-wrap">
            <div className="b3-cap">Native performance — exact GGUF (tok/s)</div>
            <table className="b3-tbl">
              <tbody>
                {perf.map((p) => (
                  <tr key={p.dev}>
                    <td className="name">{p.dev}
                      <small style={{ display: "block", color: "var(--faint)", fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{p.note}</small>
                    </td>
                    <td className="frac">{p.pp}</td>
                    <td className="barcell">{p.star ? <b>{p.gen}</b> : p.gen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="b3-note">
              Exact-artifact measurements. Not a projection for RTX 4090 / 5090, DGX
              Spark, Windows, or newer Apple silicon.
            </p>
          </div>
        </div>
      </section>

      {/* compact retention */}
      <section className="b3-block">
        <div className="b3-block-head">
          <p className="b3-label">Compression</p>
          <h2 className="b3-h2">What survives<br /><em>the squeeze.</em></h2>
          <p className="b3-body">
            A fresh 100-turn tool-contract gate, authored <em>after</em> the compression
            choices were frozen. This is an internal compression-retention measurement —
            not BFCL, and not a public frontier benchmark.
          </p>
        </div>
        <div className="b3-two">
          <div className="b3-tbl-wrap">
            <div className="b3-cap">Conditional retention vs. full-precision teacher</div>
            <table className="b3-tbl">
              <tbody>
                {retention.map((r) => (
                  <tr key={r.cat} className={`${r.strong ? "strong" : ""}${r.weak ? " b3-weak" : ""}`}>
                    <td className="name">{r.cat}</td>
                    <td className="barcell">
                      <b>{r.label}</b>
                      <span className="bar" style={{ width: `${r.pct}%` }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, justifyContent: "center" }}>
            <div className="b3-callout">
              <div className="b3-callout-k">Absolute accuracy · sealed gate</div>
              <div className="b3-callout-nums">
                <div>
                  <div className="b3-bignum">90<small>/100</small></div>
                  <div className="b3-bignum-k">Full-precision teacher</div>
                </div>
                <div className="b3-arrow">→</div>
                <div>
                  <div className="b3-bignum gold">83<small>/100</small></div>
                  <div className="b3-bignum-k">BTL-3 Compact</div>
                </div>
              </div>
            </div>
            <p className="b3-body" style={{ fontSize: 14 }}>
              Single, parallel, sequential and abstention behavior transfer intact —
              Compact keeps 83 of the 90 cases the teacher got right. Parallel-multiple
              composition is the disclosed weak point at 30% retention. Do not assume
              uniformly preserved behavior.
            </p>
          </div>
        </div>
      </section>

      {/* boundaries */}
      <section className="b3-block b3-block-alt">
        <div className="b3-block-head">
          <p className="b3-label">Boundaries</p>
          <h2 className="b3-h2">The asterisks, stated plainly.</h2>
          <p className="b3-body">
            The scope of every claim, in the open. If a number has a star anywhere on
            this page, this is the star.
          </p>
        </div>
        <div className="b3-bounds">
          {boundaries.map((b) => (
            <div key={b.h} className="b3-bnd">
              <div className="b3-bnd-h">
                <span className={`b3-sev ${sevClass(b.sev)}`} />{b.h}
              </div>
              <p>{b.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* quickstart */}
      <section className="b3-block">
        <div className="b3-block-head">
          <p className="b3-label">Quickstart</p>
          <h2 className="b3-h2">Pull it. Serve it.</h2>
          <p className="b3-body">
            Full model via vLLM or Transformers; Compact via its native OpenAI-compatible
            server. Stock Ollama and the stock LM Studio GGUF engine do not decode AVQ2 —
            the release ships a native runner plus LM&nbsp;Studio and Ollama&nbsp;CLI bridges.
          </p>
        </div>
        <div className="b3-qs">
          <div className="b3-qs-panel">
            <div className="b3-qs-tag">vLLM · full</div>
            <pre className="b3-qs-code">{QS_VLLM}</pre>
          </div>
          <div className="b3-qs-panel">
            <div className="b3-qs-tag">Transformers · full</div>
            <pre className="b3-qs-code">{QS_TF}</pre>
          </div>
          <div className="b3-qs-panel">
            <div className="b3-qs-tag">Native server · compact</div>
            <pre className="b3-qs-code">{QS_COMPACT}</pre>
          </div>
        </div>
      </section>

      {/* integrity */}
      <section className="b3-block b3-block-alt">
        <div className="b3-block-head">
          <p className="b3-label">Integrity</p>
          <h2 className="b3-h2">Frozen identities.</h2>
          <p className="b3-body">
            Verify the full release directory with <code>shasum -a 256 -c SHA256SUMS</code>.
          </p>
        </div>
        <div className="b3-hashes">
          {hashes.map((h) => (
            <div key={h.lab} className="b3-hash">
              <div className="b3-hash-lab">{h.lab}</div>
              <div className="b3-hash-tag">SHA-256</div>
              <div className="b3-hash-sha">{h.sha}</div>
              <div className="b3-hash-meta">{h.meta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="b3-cta">
        <h2 className="b3-cta-title">Open weights. Stated boundaries.</h2>
        <p className="b3-cta-sub">Both editions are downloadable today. None of it is a black box.</p>
        <div className="b3-hero-actions">
          <a href={HF_FULL} target="_blank" rel="noreferrer" className="b3-btn b3-btn-light">Download BTL-3 →</a>
          <a href={HF_COMPACT} target="_blank" rel="noreferrer" className="b3-btn b3-btn-ghost">Download Compact</a>
        </div>
      </section>

      <footer className="b3-footer">
        <div className="b3-foot-note">
          * LiveCodeBench v6 reported as a completed 193-of-442-case slice, not a full score.<br />
          BTL-3 RL-0013 · base Qwen3.6-27B @ 6a9e13bd6fc8f0983b9b99948120bc37f49c13e9 · results dated 2026-07-19.<br />
          Run generated code and tool calls in a sandbox; require confirmation for destructive or high-impact actions.
        </div>
        <div className="b3-foot-links">
          <Link href="/">Home</Link>
          <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer">Talk to us</a>
        </div>
      </footer>
    </main>
  );
}
