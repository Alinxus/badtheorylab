import Link from "next/link";
import { styles } from "./styles";
import {
  HF_MLX, HF_FULL, GH_URL, DISCORD_URL, CAL_URL, BASE_LICENSE,
  headline, specStrip, capabilities, comparison, steps,
  compatibility, evals, boundaries, qs,
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

      {/* hero — the promise first */}
      <section className="mw-hero">
        <div className="mw-hero-copy">
          <p className="mw-eyebrow"><span className="mw-dot" />Live today · Open source · Runs 100% on your Mac</p>
          <h1 className="mw-h1">The Siri you<br />always <em>wanted.</em></h1>
          <p className="mw-lede">
            <b>Macaw</b> is your own AI model that controls your Mac — 97 verified
            tools for mail, files, calendar, music, and settings, in plain English.
            No cloud. No accounts. No payments.
          </p>
          <p className="mw-sub">
            Runs entirely on your machine on Apple Silicon. Free to download right
            now — not a waitlist, not "pricing at launch."
          </p>
          <div className="mw-hero-actions">
            <a href={HF_MLX} target="_blank" rel="noreferrer" className="mw-btn mw-btn-solid">Download Macaw →</a>
            <a href="#capabilities" className="mw-btn mw-btn-outline">See what it can do</a>
          </div>
        </div>

        <div className="mw-readout">
          <div className="mw-readout-head">
            <span /><span /><span />
            <span className="mw-readout-label">macaw-v1 · measured on m2</span>
          </div>
          {headline.map((h) => (
            <div key={h.k} className="mw-readout-row">
              <span className="mw-readout-k">{h.k}</span>
              <span className="mw-readout-v">{h.v}</span>
            </div>
          ))}
          <div className="mw-readout-demo">
            <span className="mw-readout-demo-k">"email daisy the agenda"</span>
            <span className="mw-readout-demo-v">→ sent in 0.9 s</span>
          </div>
        </div>
      </section>

      {/* capabilities */}
      <section className="mw-block" id="capabilities">
        <div className="mw-block-head">
          <p className="mw-label">Capabilities</p>
          <h2 className="mw-h2">Your own model<br /><em>that controls your Mac.</em></h2>
          <p className="mw-body">
            One sentence in, a real action out. Every card below is a tool family
            in <code>tools.json</code> — verified, not aspirational.
          </p>
        </div>
        <div className="mw-caps">
          {capabilities.map((c) => (
            <div key={c.title} className="mw-cap-card">
              <span className="mw-cap-ask">"{c.ask}"</span>
              <h3 className="mw-cap-title">{c.title}</h3>
              <p className="mw-cap-body">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* comparison */}
      <section className="mw-block mw-block-alt">
        <div className="mw-block-head">
          <p className="mw-label">Why Macaw</p>
          <h2 className="mw-h2">Everything Siri can't do.<br /><em>Macaw does.</em></h2>
          <p className="mw-body">
            Same Mac, different brain. And unlike the waitlisted "coming soon"
            assistants, Macaw is live today with the source in the open.
          </p>
        </div>
        <div className="mw-tbl-wrap" style={{ maxWidth: 640 }}>
          <table className="mw-tbl">
            <tbody>
              {comparison.rows.map((r) => (
                <tr key={r[0]}>
                  <td className="name">{r[0]}</td>
                  <td className="col2">{r[1]}</td>
                  <td className="col3">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* how it works */}
      <section className="mw-block">
        <div className="mw-block-head">
          <p className="mw-label">How it works</p>
          <h2 className="mw-h2">Running in<br /><em>three steps.</em></h2>
        </div>
        <div className="mw-steps">
          {steps.map((s) => (
            <div key={s.n} className="mw-step">
              <div className="mw-step-n">{s.n}</div>
              <h3 className="mw-step-title">{s.title}</h3>
              <p className="mw-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* receipts */}
      <section className="mw-block mw-block-alt">
        <div className="mw-block-head">
          <p className="mw-label">Receipts</p>
          <h2 className="mw-h2">Measured, on an M2.</h2>
          <p className="mw-body">
            We measure without mercy. bench.py, one request per capability,
            top-12 retrieval — no hand-tuning between rows.
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

      {/* compatibility */}
      <section className="mw-block">
        <div className="mw-block-head">
          <p className="mw-label">Compatibility</p>
          <h2 className="mw-h2">Runs on your Mac.<br /><em>Not theirs.</em></h2>
        </div>
        <div className="mw-compat">
          {compatibility.map((c) => (
            <div key={c.chip} className="mw-compat-chip">
              <b>{c.chip}</b>
              <span>{c.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section className="mw-cta">
        <h2 className="mw-cta-title">Live today. Open source. Yours.</h2>
        <p className="mw-cta-sub">
          Weights on Hugging Face, code on GitHub, runs fully local. No waitlist, no pricing-at-launch.
        </p>
        <div className="mw-hero-actions" style={{ justifyContent: "center" }}>
          <a href={HF_MLX} target="_blank" rel="noreferrer" className="mw-btn mw-btn-light">Download Macaw →</a>
          <a href={GH_URL} target="_blank" rel="noreferrer" className="mw-btn mw-btn-ghost">Read the source</a>
        </div>
      </section>

      {/* boundaries — compact, honest */}
      <section className="mw-block">
        <div className="mw-block-head">
          <p className="mw-label">The small print</p>
          <h2 className="mw-h2">Honest asterisks.</h2>
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
          <div className="mw-bnd">
            <div className="mw-bnd-h">
              <span className="mw-sev mw-sev-note" />License & integrity
            </div>
            <p>
              Code is <a href={GH_URL} target="_blank" rel="noreferrer">MIT</a>; weights inherit the{" "}
              <a href={BASE_LICENSE} target="_blank" rel="noreferrer">LFM Open License v1.0</a> from LFM2.5.
              MLX: <code className="mw-hash-sha">aa045fad…e238</code> · BF16: <code className="mw-hash-sha">966d2066…8be0</code>.
            </p>
          </div>
        </div>
      </section>

      <footer className="mw-footer">
        <div className="mw-foot-note">
          Macaw MACAW-V1 · base LFM2.5-2.6B · measured 2026-08-05 on Apple M2 (MLX 4-bit).<br />
          Tool suite is 10 requests, not a frontier benchmark. Run generated actions in a sandbox;
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
