import Link from "next/link";
import { styles } from "./styles";
import {
  HF_MLX, HF_FULL, GH_URL, DISCORD_URL, CAL_URL, BASE_LICENSE,
  headline, specStrip, editions, evals, boundaries, qs,
} from "./data";

const sevClass = (s: string) =>
  s === "crit" ? "mw-sev-crit" : s === "warn" ? "mw-sev-warn" : "mw-sev-note";

export default function MacawPage() {
  return (
    <main className="mw">
      <style>{styles}</style>

      <nav className="mw-nav">
        <Link href="/" className="mw-brand">Bad Theory Labs</Link>
        <div className="mw-nav-links">
          <Link href="/#products">Products</Link>
          <Link href="/runtime">Runtime</Link>
          <Link href="/btl-3">BTL-3</Link>
          <Link href="/macaw" className="mw-active">Macaw</Link>
          <Link href="/papers">Papers</Link>
        </div>
        <div className="mw-nav-cta">
          <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={HF_MLX} target="_blank" rel="noreferrer" className="mw-solid">Get the model</a>
        </div>
      </nav>

      {/* hero */}
      <section className="mw-hero">
        <div className="mw-hero-copy">
          <p className="mw-eyebrow"><span className="mw-dot" />Open weights · On-device agent · MACAW-V1</p>
          <h1 className="mw-h1">Mac<em>aw</em></h1>
          <p className="mw-lede">
            A <b>2.7B</b> model that lives on your Mac, calls <b>97</b> real tools,
            and never phones home. No cloud. No accounts. No payments.
          </p>
          <p className="mw-sub">
            Fine-tuned from Liquid AI's LFM2.5 to emit a tool call straight after
            the assistant turn, so a request → tool → answer round-trip finishes in
            about a second. Every number on this page is measured on the frozen
            checkpoint.
          </p>
          <div className="mw-hero-actions">
            <a href={HF_MLX} target="_blank" rel="noreferrer" className="mw-btn mw-btn-solid">Download Macaw →</a>
            <a href={HF_FULL} target="_blank" rel="noreferrer" className="mw-btn mw-btn-outline">BF16 weights</a>
            <a href={GH_URL} target="_blank" rel="noreferrer" className="mw-btn mw-btn-outline">Source</a>
          </div>
        </div>

        <div className="mw-readout">
          <div className="mw-readout-head">
            <span /><span /><span />
            <span className="mw-readout-label">frozen · macaw-v1 · 2.7B</span>
          </div>
          {headline.map((h) => (
            <div key={h.k} className="mw-readout-row">
              <span className="mw-readout-k">{h.k}</span>
              <span className="mw-readout-v">{h.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* spec strip */}
      <section className="mw-strip">
        {specStrip.map((s) => (
          <div key={s.k} className="mw-strip-cell">
            <div className="mw-strip-k">{s.k}</div>
            <div className="mw-strip-v">{s.v}</div>
          </div>
        ))}
      </section>

      {/* two editions */}
      <section className="mw-block">
        <div className="mw-block-head">
          <p className="mw-label">Two editions</p>
          <h2 className="mw-h2">One model,<br /><em>two ways to run it.</em></h2>
          <p className="mw-body">
            The on-device MLX build is the product — 4-bit, Metal, no server except
            the one on localhost. The BF16 build is the exact checkpoint, for people
            who want the weights as trained.
          </p>
        </div>
        <div className="mw-editions">
          {editions.map((e) => (
            <div key={e.id} className={`mw-card${e.primary ? " mw-card-feat" : ""}`}>
              <span className="mw-card-tag">{e.tag}</span>
              <div className="mw-card-name">{e.name}</div>
              <p className="mw-card-blurb">{e.blurb}</p>
              <ul className="mw-speclist">
                {e.rows.map(([k, v]) => (
                  <li key={k}>
                    <span className="mw-spec-k">{k}</span>
                    <span className="mw-spec-v">{v}</span>
                  </li>
                ))}
              </ul>
              <a
                href={e.href}
                target="_blank"
                rel="noreferrer"
                className={`mw-btn ${e.primary ? "mw-btn-solid" : "mw-btn-outline"}`}
              >
                {e.primary ? "Get Macaw →" : "BF16 weights →"}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* measured */}
      <section className="mw-block mw-block-alt">
        <div className="mw-block-head">
          <p className="mw-label">Receipts</p>
          <h2 className="mw-h2">Measured, on an M2.</h2>
          <p className="mw-body">
            bench.py, one representative request per capability, top-12 tool
            retrieval. No hand-tuning between rows, no numbers borrowed from
            another checkpoint.
          </p>
        </div>
        <div className="mw-bench">
          {evals.map((e) => (
            <div key={e.name} className="mw-bench-row">
              <div className="mw-bench-name">{e.name}<small>{e.sub}</small></div>
              <div className="mw-bench-pct">{e.label}</div>
              <div className="mw-gauge">
                <div className="mw-gauge-track" />
                <div className="mw-gauge-fill" style={{ width: `${e.pct}%` }} />
                {[0, 25, 50, 75, 100].map((t) => (
                  <span key={t} className="mw-gauge-tick" style={{ left: `${t}%` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* boundaries */}
      <section className="mw-block">
        <div className="mw-block-head">
          <p className="mw-label">Boundaries</p>
          <h2 className="mw-h2">The asterisks, stated plainly.</h2>
          <p className="mw-body">
            Macaw is honest about being a small on-device model. If a claim on
            this page has a catch, the catch is here.
          </p>
        </div>
        <div className="mw-bounds">
          {boundaries.map((b) => (
            <div key={b.h} className="mw-bnd">
              <div className="mw-bnd-h">
                <span className={`mw-sev ${sevClass(b.sev)}`} />{b.h}
              </div>
              <p>{b.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* quickstart */}
      <section className="mw-block mw-block-alt">
        <div className="mw-block-head">
          <p className="mw-label">Quickstart</p>
          <h2 className="mw-h2">Pull it. Serve it.</h2>
          <p className="mw-body">
            Server, library, or the menu-bar app. The app auto-starts the server —
            point <code>MACAW_PYTHON</code> at a Python with mlx-lm if it isn't on PATH.
          </p>
        </div>
        <div className="mw-qs">
          <div className="mw-qs-panel">
            <div className="mw-qs-tag">Serve · OpenAI-compatible</div>
            <pre className="mw-qs-code">{qs.serve}</pre>
          </div>
          <div className="mw-qs-panel">
            <div className="mw-qs-tag">Generate · Python</div>
            <pre className="mw-qs-code">{qs.py}</pre>
          </div>
          <div className="mw-qs-panel">
            <div className="mw-qs-tag">App · macOS</div>
            <pre className="mw-qs-code">{qs.app}</pre>
          </div>
        </div>
      </section>

      {/* integrity */}
      <section className="mw-block">
        <div className="mw-block-head">
          <p className="mw-label">Integrity</p>
          <h2 className="mw-h2">Frozen, verifiable.</h2>
          <p className="mw-body">
            Weights hash to the files on Hugging Face. The code is MIT; the weights
            inherit the <a href={BASE_LICENSE} target="_blank" rel="noreferrer">LFM Open License v1.0</a> from the LFM2.5 base.
          </p>
        </div>
        <div className="mw-two">
          <div className="mw-tbl-wrap">
            <div className="mw-cap">MLX 4-bit · SHA-256</div>
            <div className="mw-hash"><code className="mw-hash-sha">aa045fad2ddadc73f204e0b795b57ab37c73c829e0f63e09fde6abc1be93e238</code></div>
            <p className="mw-note">model.safetensors in badtheorylabs/Macaw-4bit-MLX</p>
          </div>
          <div className="mw-tbl-wrap">
            <div className="mw-cap">BF16 · SHA-256</div>
            <div className="mw-hash"><code className="mw-hash-sha">966d206651b96446f6a4c415d118049f478a8df79be3fa45bfd04959a4d68be0</code></div>
            <p className="mw-note">model.safetensors in badtheorylabs/Macaw</p>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="mw-cta">
        <h2 className="mw-cta-title">Your Mac, with hands.</h2>
        <p className="mw-cta-sub">Runs fully local. Weights are live today. None of it is a black box.</p>
        <div className="mw-hero-actions" style={{ justifyContent: "center" }}>
          <a href={HF_MLX} target="_blank" rel="noreferrer" className="mw-btn mw-btn-light">Download Macaw →</a>
          <a href={HF_FULL} target="_blank" rel="noreferrer" className="mw-btn mw-btn-ghost">BF16 weights</a>
        </div>
      </section>

      <footer className="mw-footer">
        <div className="mw-foot-note">
          Macaw MACAW-V1 · base LFM2.5-2.6B · measured 2026-08-05 on Apple M2 (MLX 4-bit).<br />
          The tool-call suite is 10 requests, not a frontier benchmark. Run generated actions in a sandbox;
          destructive tools always ask first.
        </div>
        <div className="mw-foot-links">
          <Link href="/">Home</Link>
          <a href={GH_URL} target="_blank" rel="noreferrer">GitHub</a>
          <a href={HF_MLX} target="_blank" rel="noreferrer">Hugging Face</a>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer">Talk to us</a>
        </div>
      </footer>
    </main>
  );
}
