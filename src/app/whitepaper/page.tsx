import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "Whitepaper — Bad Theory Labs",
  description: "The Bad Theory Labs whitepaper: the thesis, the products, the $BTL token, and the roadmap.",
};

const CA = "E54u2LpWSNZ5LqLitetfw7Ajc7t4phCPHCJuJVRPpump";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

export default function WhitepaperPage() {
  return (
    <main className="wp-page">
      <style>{styles}</style>
      <SiteNav />

      <section className="wp-hero">
        <p className="wp-eyebrow">Whitepaper · v1.0 · June 2026</p>
        <h1>Bad Theory Labs</h1>
        <p className="wp-lede">
          Infrastructure for intelligence that actually follows through — and a community-owned token,
          $BTL, that aligns the people building it with the people using it.
        </p>
        <div className="wp-hero-meta">
          <span>Solana · SPL</span>
          <span className="wp-dot">·</span>
          <span>Lab: Lagos</span>
          <span className="wp-dot">·</span>
          <a href="/stats">Live stats →</a>
        </div>
      </section>

      <article className="wp">
        <nav className="wp-toc" aria-label="Contents">
          <span className="wp-toc-title">Contents</span>
          <a href="#abstract">01 — Abstract</a>
          <a href="#problem">02 — The problem</a>
          <a href="#thesis">03 — Thesis</a>
          <a href="#stack">04 — The stack</a>
          <a href="#token">05 — The $BTL token</a>
          <a href="#dist">06 — Distribution</a>
          <a href="#roadmap">07 — Roadmap</a>
          <a href="#risks">08 — Risks &amp; disclaimers</a>
        </nav>

        <section id="abstract" className="wp-sec">
          <h2>01 — Abstract</h2>
          <p>
            Bad Theory Labs is a research lab and product studio building the layer that makes AI useful inside
            real work: memory, retrieval, context, and presence. Today&apos;s models can talk; they cannot reliably
            remember, follow through, or stay grounded. We treat that as an infrastructure problem, not a prompting one.
          </p>
          <p>
            This document describes the thesis behind the lab, the products shipping against it, and <strong>$BTL</strong>:
            a Solana token that earns holders discounted credits for BTL Runtime, gates early access to what we build,
            and lets the community coordinate around it. $BTL is a utility and access asset — not a promise of profit.
          </p>
        </section>

        <section id="problem" className="wp-sec">
          <h2>02 — The problem</h2>
          <p>
            Frontier models are extraordinary pattern completers and unreliable colleagues. They hallucinate facts,
            forget what you told them five minutes ago, and re-derive the same context every session. The industry&apos;s
            answer has mostly been &ldquo;bigger model, longer prompt.&rdquo; That scales cost, not trust.
          </p>
          <ul>
            <li><strong>No durable memory.</strong> Context windows are not memory; they evaporate.</li>
            <li><strong>Hallucination under retrieval.</strong> Most RAG stacks confidently invent when the answer isn&apos;t present.</li>
            <li><strong>No presence.</strong> Models react to a turn; they don&apos;t persist, watch, or follow through on work.</li>
          </ul>
        </section>

        <section id="thesis" className="wp-sec">
          <h2>03 — Thesis</h2>
          <p><strong>Intelligence is compression.</strong> To perceive is to compress input into representations that
            keep what is useful. To reason is to compress those further into structure that supports prediction and
            transfer. We believe the durable advantages in AI will come from systems engineered around that principle —
            grounded memory and causally-structured retrieval — rather than from raw scale alone.</p>
          <blockquote>
            The field has been teaching systems to predict the world. We are building systems that hold onto it.
          </blockquote>
          <p>The research backing this lives in our <a href="/papers">Compression Program</a>; the products below are its
            commercial edge.</p>
        </section>

        <section id="stack" className="wp-sec">
          <h2>04 — The stack</h2>
          <div className="wp-cards">
            <div className="wp-card">
              <div className="wp-card-tag">Shipping</div>
              <h3>RetainDB</h3>
              <p>Grounded memory + retrieval that refuses to invent. <strong>0% hallucination</strong> on a frozen
                dataset and <strong>79%</strong> on LongMemEval versus 56.7% for the next best system.</p>
            </div>
            <div className="wp-card">
              <div className="wp-card-tag">Shipping</div>
              <h3>Marrow</h3>
              <p>The presence layer — gives an agent a persistent working context so it can watch, remember, and
                follow through across sessions instead of starting cold every time.</p>
            </div>
            <div className="wp-card">
              <div className="wp-card-tag">Pilot</div>
              <h3>BTL Runtime</h3>
              <p>A model gateway that routes, meters, and hardens traffic across providers — the plumbing that lets
                teams run agents in production without rebuilding it themselves.</p>
            </div>
            <div className="wp-card">
              <div className="wp-card-tag">Research</div>
              <h3>BTL-2 Coder</h3>
              <p>A compact 7B coding model fine-tuned in-house — our testbed for compression-first training and the
                first model carrying lab methodology end to end.</p>
            </div>
          </div>
        </section>

        <section id="token" className="wp-sec">
          <h2>05 — The $BTL token</h2>
          <p>$BTL is an SPL token on Solana. It exists to align incentives between the people building the lab and the
            community supporting it. Its design goals are deliberately narrow:</p>
          <ul>
            <li><strong>Cheaper credits.</strong> Holding $BTL earns discounted credits for BTL Runtime access — the more you hold, the less you pay per call.</li>
            <li><strong>Early access.</strong> Token-gated entry to product betas (RetainDB, Marrow) and priority hackathon tracks.</li>
            <li><strong>Coordination.</strong> Signal weight in community proposals — what we prioritize, what we open-source.</li>
            <li><strong>Membership.</strong> A durable badge of being early to the thesis, redeemable for community standing.</li>
          </ul>
          <p>What $BTL is <em>not</em>: it is not equity, not a share of revenue, not a debt instrument, and not a promise
            that anyone will profit. Utility ships incrementally and is documented publicly as it lands.</p>
          <div className="wp-ca">
            <div className="wp-ca-label">Contract address (Solana)</div>
            <code>{CA}</code>
          </div>
        </section>

        <section id="dist" className="wp-sec">
          <h2>06 — Distribution</h2>
          <p>$BTL launched into a fair, open market — no insider pre-sale round. The intent of the distribution is broad
            community ownership and a treasury that funds research and hackathons.</p>
          <div className="wp-alloc">
            {[
              { l: "Open market / community", v: 80, n: "freely traded, fair launch" },
              { l: "Lab treasury", v: 12, n: "research, grants, hackathon prizes" },
              { l: "Liquidity", v: 5, n: "locked market depth" },
              { l: "Contributors", v: 3, n: "vested over time" },
            ].map((a) => (
              <div className="wp-alloc-row" key={a.l}>
                <span className="wp-alloc-l">{a.l}</span>
                <span className="wp-alloc-bar"><span style={{ width: `${a.v}%` }} /></span>
                <span className="wp-alloc-v">{a.v}%</span>
                <span className="wp-alloc-n">{a.n}</span>
              </div>
            ))}
          </div>
          <p className="wp-fine">Indicative allocation. Final on-chain figures are verifiable on Solana explorers via the
            contract address above; this section is descriptive, not a binding commitment.</p>
        </section>

        <section id="roadmap" className="wp-sec">
          <h2>07 — Roadmap</h2>
          <div className="wp-road">
            {[
              { p: "Now", t: "Live presence + public stats", d: "Real community metrics, no vanity numbers — the page you can watch in real time." },
              { p: "Next", t: "Token-gated RetainDB beta", d: "Holders get first access to grounded-memory API keys." },
              { p: "Then", t: "Community proposals", d: "On-chain signalling for what the treasury funds next." },
              { p: "Later", t: "Open research drops", d: "Compression Program results and model weights released to the community." },
            ].map((r) => (
              <div className="wp-road-row" key={r.t}>
                <div className="wp-road-p">{r.p}</div>
                <div>
                  <div className="wp-road-t">{r.t}</div>
                  <div className="wp-road-d">{r.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="risks" className="wp-sec">
          <h2>08 — Risks &amp; disclaimers</h2>
          <p className="wp-fine">
            $BTL is a high-risk digital asset. Crypto tokens can lose all value; only participate with funds you can
            afford to lose entirely. Nothing in this document is financial, investment, legal, or tax advice, and nothing
            here is an offer or solicitation to buy or sell any asset. $BTL confers no ownership, equity, dividend, or
            revenue right in Bad Theory Labs or its products. Roadmap items are aspirations, not guarantees, and may
            change or be dropped. Always verify the contract address yourself before transacting. Regulations vary by
            jurisdiction — it is your responsibility to comply with yours.
          </p>
        </section>

        <div className="wp-foot">
          <a className="wp-foot-cta" href={DISCORD_URL} target="_blank" rel="noreferrer">Join the community →</a>
          <a className="wp-foot-link" href="/stats">Watch the live stats</a>
        </div>
      </article>
    </main>
  );
}

const styles = `
:root { --bg:#FAFAF9; --surface:#F3F2EF; --border:#E8E6E1; --border2:#D6D3CC; --ink:#0E0D0C; --body:#5C5954; --faint:#9C9890; }
.wp-page { min-height:100vh; background:var(--bg); color:var(--ink); font-family:'DM Sans',system-ui,sans-serif; }
.wp-page em { font-style:italic; }

.wp-hero { max-width:980px; margin:0 auto; padding:72px 28px 44px; border-bottom:1px solid var(--border); }
.wp-eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:14px; }
.wp-hero h1 { font-family:'EB Garamond',Georgia,serif; font-size:clamp(46px,7vw,86px); font-weight:500; letter-spacing:-.04em; line-height:1; margin-bottom:18px; }
.wp-lede { font-size:18px; font-weight:300; line-height:1.7; color:var(--body); max-width:600px; margin-bottom:22px; }
.wp-hero-meta { display:flex; align-items:center; gap:10px; flex-wrap:wrap; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); }
.wp-hero-meta a { color:var(--ink); text-decoration:none; }
.wp-hero-meta a:hover { opacity:.7; }
.wp-dot { color:var(--border2); }

.wp { max-width:980px; margin:0 auto; padding:8px 28px 90px; display:grid; grid-template-columns:200px 1fr; gap:48px; align-items:start; }
.wp-toc { position:sticky; top:80px; display:flex; flex-direction:column; gap:9px; padding-top:40px; }
.wp-toc-title { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:6px; }
.wp-toc a { font-size:13px; color:var(--body); text-decoration:none; transition:color .12s,padding-left .2s; }
.wp-toc a:hover { color:var(--ink); padding-left:4px; }

.wp-sec { padding:40px 0; border-bottom:1px solid var(--border); }
.wp-sec:first-of-type { padding-top:40px; }
.wp-sec h2 { font-family:'EB Garamond',Georgia,serif; font-size:30px; font-weight:500; letter-spacing:-.025em; margin-bottom:18px; scroll-margin-top:78px; }
.wp-sec h3 { font-family:'EB Garamond',Georgia,serif; font-size:22px; font-weight:500; letter-spacing:-.02em; margin-bottom:8px; }
.wp-sec p { font-size:15.5px; font-weight:300; line-height:1.8; color:var(--body); margin-bottom:14px; }
.wp-sec strong { font-weight:600; color:var(--ink); }
.wp-sec ul { margin:0 0 14px 0; padding:0; list-style:none; }
.wp-sec li { font-size:15px; font-weight:300; line-height:1.7; color:var(--body); padding:10px 0 10px 22px; border-bottom:1px solid var(--border); position:relative; }
.wp-sec li::before { content:''; position:absolute; left:2px; top:18px; width:6px; height:6px; border-radius:50%; background:var(--border2); }
.wp-sec li:last-child { border-bottom:none; }
.wp-sec a { color:var(--ink); text-decoration:underline; text-underline-offset:3px; text-decoration-color:var(--border2); }
blockquote { margin:18px 0; border-left:2px solid var(--ink); padding-left:18px; font-family:'EB Garamond',Georgia,serif; font-size:21px; font-style:italic; line-height:1.45; color:var(--ink); }

.wp-cards { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.wp-card { border:1px solid var(--border); border-radius:13px; padding:22px; background:var(--surface); }
.wp-card-tag { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:12px; }
.wp-card p { font-size:13.5px; margin-bottom:0; }

.wp-ca { margin-top:20px; border:1px solid var(--border); border-radius:11px; padding:18px; background:var(--surface); }
.wp-ca-label { font-family:'JetBrains Mono',monospace; font-size:9.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:8px; }
.wp-ca code { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink); word-break:break-all; }

.wp-alloc { display:flex; flex-direction:column; gap:0; margin:6px 0 12px; }
.wp-alloc-row { display:grid; grid-template-columns:190px 1fr 44px; grid-template-rows:auto auto; align-items:center; gap:4px 14px; padding:14px 0; border-bottom:1px solid var(--border); }
.wp-alloc-row:last-child { border-bottom:none; }
.wp-alloc-l { font-size:14px; color:var(--ink); font-weight:500; }
.wp-alloc-bar { height:6px; background:var(--surface); border-radius:3px; overflow:hidden; }
.wp-alloc-bar span { display:block; height:100%; background:var(--ink); border-radius:3px; }
.wp-alloc-v { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink); text-align:right; }
.wp-alloc-n { grid-column:1 / -1; font-size:12px; font-weight:300; color:var(--faint); }
.wp-fine { font-size:13px !important; color:var(--faint) !important; line-height:1.7 !important; }

.wp-road { display:flex; flex-direction:column; gap:0; }
.wp-road-row { display:grid; grid-template-columns:80px 1fr; gap:18px; padding:18px 0; border-bottom:1px solid var(--border); }
.wp-road-row:last-child { border-bottom:none; }
.wp-road-p { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--faint); padding-top:3px; }
.wp-road-t { font-size:16px; font-weight:500; color:var(--ink); margin-bottom:4px; }
.wp-road-d { font-size:13.5px; font-weight:300; color:var(--body); line-height:1.65; }

.wp-foot { display:flex; align-items:center; gap:18px; flex-wrap:wrap; padding-top:34px; }
.wp-foot-cta { font-size:14px; font-weight:500; color:var(--bg); background:var(--ink); padding:12px 22px; border-radius:9px; text-decoration:none; }
.wp-foot-cta:hover { opacity:.85; }
.wp-foot-link { font-size:14px; color:var(--body); text-decoration:none; }
.wp-foot-link:hover { color:var(--ink); }

@media (max-width: 820px) {
  .wp { grid-template-columns:1fr; gap:0; }
  .wp-toc { position:static; flex-flow:row wrap; gap:10px 16px; padding:24px 0 10px; border-bottom:1px solid var(--border); }
  .wp-toc-title { width:100%; margin-bottom:0; }
  .wp-cards { grid-template-columns:1fr; }
  .wp-alloc-row { grid-template-columns:1fr 60px 40px; }
  .wp-alloc-l { grid-column:1 / -1; }
}
`;
