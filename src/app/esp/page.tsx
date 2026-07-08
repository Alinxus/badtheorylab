import Link from "next/link";

const PDF_URL = "/esp/paper.pdf";
const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

// the three passes are the whole idea. keep the copy here matched to the paper's
// section 3 — if the paper and the page drift, the paper wins.
const passes = [
  {
    n: "01",
    name: "Skeleton",
    tag: "structure from echoes",
    body:
      "Recursive decomposition carves the screen into an adaptive region tree — big lazy cells over empty space, tiny dense ones around content. Then it probes: hit-tests, hover sweeps, cursor changes. Where the cursor flips to a hand, the system just told you something is clickable.",
  },
  {
    n: "02",
    name: "Populate",
    tag: "the skeleton learns to read",
    body:
      "OCR runs only inside the cells the skeleton already found — faster and more accurate than reading a whole page, and every word is born attached to a node. Icons get named by their hover tooltip, once, then cached. Now the model knows exactly what the page says and where.",
  },
  {
    n: "03",
    name: "Echo",
    tag: "perception of change",
    body:
      "The screen is diffed at millisecond scale — straight from the VNC/RDP dirty-rectangle stream where one exists. A progress bar advancing, a modal appearing, a click that silently did nothing all arrive as ten-token events against a skeleton the model already holds. Waiting becomes a sense, not a guessed timer.",
  },
];

// four numbered hypotheses, each with a number attached, each falsifiable. lifted
// verbatim-ish from section 5 so nobody can claim the site softened them.
const hypotheses = [
  {
    id: "H1",
    name: "Sufficiency",
    claim:
      "A 4B–14B text model on ESP completes real multi-step web tasks within 10 points of the same model driving a full accessibility tree, and above a same-size screenshot + vision baseline.",
  },
  {
    id: "H2",
    name: "Economy",
    claim:
      "Perception cost per completed task is at least 5× lower than a per-step screenshot loop — because deltas replace re-perception.",
  },
  {
    id: "H3",
    name: "Verification",
    claim:
      "On tasks seeded with silently-failing controls, the echo layer's action windows raise success by at least 15 points over the same agent with change-sensing disabled.",
  },
  {
    id: "H4",
    name: "Robustness",
    claim:
      "On canvas-rendered pages with an empty accessibility tree, ESP keeps at least 70% of its structured-page success while a DOM-tree agent falls to near zero.",
  },
];

const specs = [
  { k: "Kind", v: "Thesis paper · pre-registered" },
  { k: "Perception", v: "No vision model in the loop" },
  { k: "Reasoner", v: "Small local text model, 4B–14B" },
  { k: "Action contract", v: "Schema-strict tool calls on node IDs" },
];

export default function EspPage() {
  return (
    <main className="esp-page">
      <style>{styles}</style>

      <nav className="esp-nav">
        <Link href="/" className="esp-brand">Bad Theory Labs</Link>
        <div className="esp-nav-links">
          <Link href="/#research">Research</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/context-integrity">Context Integrity</Link>
          <Link href="/esp" className="esp-active">ESP</Link>
        </div>
        <div className="esp-nav-cta">
          <a href={PDF_URL} target="_blank" rel="noreferrer">PDF</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="esp-solid">Schedule call</a>
        </div>
      </nav>

      <section className="esp-hero">
        <p className="esp-eyebrow">Thesis Paper · July 2026 · Pre-registered</p>
        <h1 className="esp-h1">
          ESP: Echo-Skeleton <em>Perception</em>
        </h1>
        <p className="esp-lede">
          A small, local, text-only model operates a graphical interface — and never sees an image.
        </p>
        <p className="esp-sub">
          Every serious computer-use agent works the same way: screenshot, feed a large vision model,
          act, sleep, screenshot again. It is expensive, stateless, and blind between captures. ESP
          proposes the opposite organ. The model holds a labeled <em>skeleton</em> of the screen as
          world state and perceives only <em>change</em> — sensing structure through echoes, the way a
          bat flies in the dark.
        </p>
        <div className="esp-hero-actions">
          <a href={PDF_URL} target="_blank" rel="noreferrer" className="esp-btn esp-btn-solid">Read the paper (PDF) →</a>
          <a href="#hypotheses" className="esp-btn esp-btn-outline">See the hypotheses</a>
        </div>
      </section>

      <section className="esp-thesis">
        <p className="esp-kicker">The thesis, in one sentence</p>
        <blockquote>
          A small text-only language model, given a persistent labeled skeleton of the screen and a
          millisecond-scale stream of change events, can complete realistic interactive tasks currently
          assumed to require vision–language models consuming full screenshots — at a fraction of the
          perception cost, with faster and more reliable action verification.
        </blockquote>
      </section>

      <section className="esp-passes">
        <p className="esp-kicker">How it perceives — three passes</p>
        <div className="esp-pass-grid">
          {passes.map((p) => (
            <article key={p.n} className="esp-pass">
              <span className="esp-pass-n">{p.n}</span>
              <h3>{p.name}</h3>
              <p className="esp-pass-tag">{p.tag}</p>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="esp-session">
        <p className="esp-kicker">One session, as the blind model experiences it</p>
        <p className="esp-session-note">
          Upload a file, confirm success. Perception output is plain; the model&apos;s emitted tool calls
          are marked <code>&gt;&gt;</code>. It reads a filename it never typed, watches a bar to 100%,
          and confirms from banner text — with no image anywhere.
        </p>
        <pre className="esp-code">
{`SKELETON (session start, abbreviated):
  node 7   button  "Choose file"        clickable
  node 9   text    "No file selected"   inert
  node 14  button  "Upload"             clickable, disabled

>> click(node 7)
  changed(node 9,  text: "No file selected" -> "report.pdf")
  changed(node 14, afford: disabled -> clickable)   # Upload went live

>> click(node 14)
  appeared(node 51, progressbar)
  changed(node 51, text: "0%" -> "47%")

>> wait_for(node 51, quiet, timeout=30s)
  changed(node 51, text: "47%" -> "100%")
  vanished(node 51)
  appeared(node 60, banner "Upload complete")

>> read(node 60)
  "Upload complete. Document ID 8842."
>> done(success, detail="Document ID 8842")`}
        </pre>
      </section>

      <section id="hypotheses" className="esp-hyp">
        <p className="esp-kicker">Four falsifiable hypotheses</p>
        <p className="esp-hyp-note">
          Fixed here before the prototype exists, so no result can quietly edit the question it answered.
        </p>
        <div className="esp-hyp-grid">
          {hypotheses.map((h) => (
            <article key={h.id} className="esp-hyp-card">
              <div className="esp-hyp-head">
                <span className="esp-hyp-id">{h.id}</span>
                <h3>{h.name}</h3>
              </div>
              <p>{h.claim}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="esp-specs">
        <div className="esp-spec-list">
          {specs.map((s) => (
            <div key={s.k} className="esp-spec">
              <span className="esp-spec-k">{s.k}</span>
              <span className="esp-spec-v">{s.v}</span>
            </div>
          ))}
        </div>
        <div className="esp-prereg">
          <h3>Why publish before proving?</h3>
          <p>
            This is a thesis paper in the strict sense. The architecture, the four numbers above, and a
            fixed decision rule are all committed to print before the first line of the prototype is
            written. Whatever the experiments say — full success, an echo layer that ships on its own, a
            canvas-page niche, or honest defeat — the goalposts cannot move to meet the result. A bat does
            not decide where the wall is after it hears the echo. Neither will we.
          </p>
          <p className="esp-prereg-fit">
            ESP is the perception half of the same bet as Prism&apos;s reasoning half: mechanical
            scaffolding around small local models, everywhere the field assumes you need a giant one.
          </p>
        </div>
      </section>

      <section className="esp-cta">
        <h2>Read the full paper</h2>
        <p>
          Architecture, related work and what is actually new, a worked session, the four hypotheses, the
          pre-registered experimental plan, and the failure modes we expect.
        </p>
        <div className="esp-cta-actions">
          <a href={PDF_URL} target="_blank" rel="noreferrer" className="esp-btn esp-btn-solid">Read the paper (PDF) →</a>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="esp-btn esp-btn-outline">Discuss on Discord</a>
        </div>
        <p className="esp-foot">Bad Theory Labs · Lagos · hello@badtheorylabs.com</p>
      </section>
    </main>
  );
}

const styles = `
.esp-page { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; min-height:100vh; background:var(--bg); color:var(--ink); }
.esp-nav { position:sticky; top:0; z-index:20; height:58px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.esp-brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.esp-nav-links, .esp-nav-cta { display:flex; gap:16px; align-items:center; }
.esp-nav-links a, .esp-nav-cta a { text-decoration:none; color:var(--body); font-family:var(--font-s); font-size:13px; }
.esp-nav-links .esp-active { color:var(--ink); }
.esp-nav-cta .esp-solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }

.esp-hero { max-width:1000px; margin:0 auto; padding:74px 28px 40px; border-bottom:1px solid var(--border); }
.esp-eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:14px; }
.esp-h1 { font-family:var(--font-d); font-size:clamp(44px,6.4vw,78px); letter-spacing:-.03em; line-height:1.0; margin-bottom:16px; }
.esp-h1 em { font-style:italic; }
.esp-lede { font-family:var(--font-d); font-size:clamp(19px,2.4vw,25px); color:var(--ink); letter-spacing:-.01em; margin-bottom:16px; }
.esp-sub { color:var(--body); line-height:1.8; max-width:760px; font-size:15px; }
.esp-sub em { font-style:italic; color:var(--ink); }
.esp-hero-actions { display:flex; gap:12px; margin-top:26px; flex-wrap:wrap; }
.esp-btn { display:inline-block; text-decoration:none; border-radius:9px; padding:12px 18px; font-size:14px; font-family:var(--font-s); }
.esp-btn-solid { background:var(--ink); color:var(--bg); }
.esp-btn-outline { border:1px solid var(--border); color:var(--ink); }
.esp-btn-outline:hover { border-color:var(--ink); }

.esp-thesis, .esp-passes, .esp-session, .esp-hyp, .esp-specs, .esp-cta { max-width:1000px; margin:0 auto; padding:44px 28px; border-bottom:1px solid var(--border); }
.esp-kicker { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:18px; }
.esp-thesis blockquote { margin:0; border-left:2px solid var(--ink); padding-left:20px; font-family:var(--font-d); font-size:clamp(20px,2.6vw,27px); line-height:1.5; letter-spacing:-.01em; color:var(--ink); }

.esp-pass-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
.esp-pass { border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:22px; }
.esp-pass-n { font-family:var(--font-m); font-size:12px; color:var(--faint); letter-spacing:.1em; }
.esp-pass h3 { font-family:var(--font-d); font-size:26px; margin:6px 0 2px; }
.esp-pass-tag { font-style:italic; color:var(--faint); font-size:13px; margin-bottom:12px; }
.esp-pass p { color:var(--body); line-height:1.7; font-size:14px; }

.esp-session-note { color:var(--body); line-height:1.7; font-size:14px; margin-bottom:16px; max-width:760px; }
.esp-session-note code, .esp-code { font-family:var(--font-mono, ui-monospace, "SF Mono", Menlo, monospace); }
.esp-code { background:#0e0d0c; color:#e8e6e1; border-radius:12px; padding:20px; font-size:12.5px; line-height:1.65; overflow-x:auto; }

.esp-hyp-note { color:var(--body); font-size:14px; margin:-8px 0 18px; }
.esp-hyp-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
.esp-hyp-card { border:1px solid var(--border); border-radius:14px; background:var(--bg); padding:20px; }
.esp-hyp-head { display:flex; align-items:baseline; gap:10px; margin-bottom:8px; }
.esp-hyp-id { font-family:var(--font-m); font-size:13px; color:var(--ink); background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:2px 8px; }
.esp-hyp-card h3 { font-family:var(--font-d); font-size:21px; }
.esp-hyp-card p { color:var(--body); line-height:1.7; font-size:14px; }

.esp-specs { display:grid; grid-template-columns:0.9fr 1.1fr; gap:28px; align-items:start; }
.esp-spec-list { display:flex; flex-direction:column; gap:0; }
.esp-spec { display:flex; justify-content:space-between; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
.esp-spec-k { color:var(--faint); font-size:13px; font-family:var(--font-m); text-transform:uppercase; letter-spacing:.06em; }
.esp-spec-v { color:var(--ink); font-size:14px; text-align:right; }
.esp-prereg h3 { font-family:var(--font-d); font-size:24px; margin-bottom:10px; }
.esp-prereg p { color:var(--body); line-height:1.8; font-size:14px; margin-bottom:10px; }
.esp-prereg-fit { color:var(--ink); }

.esp-cta { text-align:center; border-bottom:none; padding-bottom:80px; }
.esp-cta h2 { font-family:var(--font-d); font-size:clamp(30px,4vw,44px); letter-spacing:-.02em; margin-bottom:10px; }
.esp-cta > p { color:var(--body); line-height:1.7; max-width:620px; margin:0 auto 22px; font-size:15px; }
.esp-cta-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
.esp-foot { margin-top:32px; font-family:var(--font-m); font-size:11px; color:var(--faint); letter-spacing:.06em; }

@media (max-width: 900px) {
  .esp-nav-links { display:none; }
  .esp-nav { padding:0 16px; }
  .esp-hero, .esp-thesis, .esp-passes, .esp-session, .esp-hyp, .esp-specs, .esp-cta { padding-left:16px; padding-right:16px; }
  .esp-pass-grid, .esp-hyp-grid, .esp-specs { grid-template-columns:1fr; }
}
`;
