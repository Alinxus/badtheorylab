import Link from "next/link";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
const ACCESS_URL =
  "/contact?subject=BTL%20Runtime%20access%20request&message=We%20want%20to%20use%20BTL%20Runtime.%20Current%20stack,%20providers,%20traffic,%20and%20constraints:";

// the four moves the gateway makes to send fewer billable tokens upstream.
// pulled straight from the token-efficiency pipeline — order matters, caching first.
const pipeline = [
  {
    n: "01",
    title: "Provider-native prompt caching",
    body: "Aggressive prefix reuse on the upstreams that support it, so the stable head of a prompt stops getting re-billed on every call.",
  },
  {
    n: "02",
    title: "Conversation compression",
    body: "Stale history gets compressed before it leaves the gateway. The model keeps the thread; you stop paying to resend it verbatim.",
  },
  {
    n: "03",
    title: "Retrieval chunk dedupe",
    body: "Repeated context — the same docs pasted into every turn — is collapsed before the request reaches the provider.",
  },
  {
    n: "04",
    title: "Output budget shaping",
    body: "When a caller forgets a max-tokens cap, the runtime applies a sane one instead of letting a runaway completion bill you.",
  },
];

const teamsGet = [
  {
    n: "01",
    title: "Drop-in compatibility",
    body: "Keep the OpenAI-compatible surface your app already speaks. Switch the base URL — not the architecture.",
  },
  {
    n: "02",
    title: "Cheaper, faster execution",
    body: "Routing to equivalent upstreams plus cache and dedupe push spend down and speed up repeated traffic.",
  },
  {
    n: "03",
    title: "Proof it's working",
    body: "Request ledgering, usage analytics, and pricing visibility make the savings something you can actually see.",
  },
  {
    n: "04",
    title: "Self-serve keys & billing",
    body: "Workspace auth, scoped API keys for inference and read-only usage, credits, and top-ups — no operator backdoor required.",
  },
];

// public customer surface — these are the routes that actually matter to a product team.
const routes = [
  { method: "POST", path: "/v1/chat/completions", note: "primary inference" },
  { method: "POST", path: "/v1/responses", note: "responses API" },
  { method: "GET", path: "/v1/models", note: "public model slugs" },
  { method: "GET", path: "/v1/providers", note: "provider catalog" },
  { method: "GET", path: "/v1/account/pricing", note: "what you pay now" },
  { method: "POST", path: "/v1/api-keys", note: "scoped keys" },
  { method: "GET", path: "/v1/usage/summary", note: "spend & savings" },
];

export default function RuntimePage() {
  return (
    <main className="rt-page">
      <style>{styles}</style>

      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links">
          <Link href="/#products">Products</Link>
          <Link href="/runtime" className="rt-active">Runtime</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="rt-nav-cta">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Community</a>
          <a href={ACCESS_URL} className="rt-solid">Request access</a>
        </div>
      </nav>

      <section className="rt-hero">
        <div className="rt-hero-copy">
          <p className="rt-eyebrow">Product · Inference gateway</p>
          <h1 className="rt-h1">BTL <em>Runtime</em></h1>
          <p className="rt-lede">
            One API in front of every model provider. Lower effective AI spend and
            lower latency — <em>without rewriting your app.</em>
          </p>
          <p className="rt-sub">
            For teams shipping across OpenAI, Anthropic, Bedrock, Vertex, OpenRouter,
            and the long tail. BTL Runtime is the drop-in gateway that keeps working
            when provider economics change underneath you.
          </p>
          <div className="rt-hero-actions">
            <a href={ACCESS_URL} className="rt-btn rt-btn-solid">Request access →</a>
            <a href={CAL_URL} target="_blank" rel="noreferrer" className="rt-btn rt-btn-outline">Schedule a call</a>
          </div>
        </div>

        <div className="rt-hero-code">
          <div className="rt-code-head">
            <span className="rt-dot" /><span className="rt-dot" /><span className="rt-dot" />
            <span className="rt-code-label">change one line</span>
          </div>
          <pre className="rt-code">
{`from openai import OpenAI

client = OpenAI(
    base_url="https://api.badtheorylabs.com/v1",
    api_key=BTL_KEY,
)

# same call. same shape. less spend.
client.chat.completions.create(
    model="btl-frontier",
    messages=[{"role": "user",
               "content": "ship it"}],
)`}
          </pre>
        </div>
      </section>

      <section className="rt-strip">
        {[
          { k: "Drop-in", v: "OpenAI-compatible" },
          { k: "Providers", v: "Multi-vendor routing" },
          { k: "Billing", v: "1 credit = $1 spend" },
          { k: "Proof", v: "Ledgered + metered" },
        ].map((s) => (
          <div key={s.k} className="rt-strip-cell">
            <div className="rt-strip-k">{s.k}</div>
            <div className="rt-strip-v">{s.v}</div>
          </div>
        ))}
      </section>

      <section className="rt-block">
        <div className="rt-block-head">
          <p className="rt-label">How it cuts spend</p>
          <h2 className="rt-h2">A token-efficiency layer,<br/><em>not just a router.</em></h2>
          <p className="rt-block-body">
            Routing to a cheaper equivalent upstream is only half of it. The runtime
            also sends fewer billable tokens, reuses the ones it must send, and avoids
            doing the same work twice. You keep the model boundary you chose; we cut
            the waste before the request reaches it.
          </p>
        </div>
        <div className="rt-grid">
          {pipeline.map((p) => (
            <div key={p.n} className="rt-card">
              <div className="rt-card-n">{p.n}</div>
              <div className="rt-card-title">{p.title}</div>
              <div className="rt-card-body">{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rt-block rt-block-alt">
        <div className="rt-two">
          <div className="rt-two-left">
            <p className="rt-label">What teams get</p>
            <h2 className="rt-h2">Switch the base URL,<br/><em>keep the product.</em></h2>
            <p className="rt-block-body">
              Best fit for teams already shipping AI products and feeling real spend
              or latency pressure. No exact-vendor lock-in — ask for a specific
              provider when you need it, let the gateway choose when you don&apos;t.
            </p>
            <a href={ACCESS_URL} className="rt-btn rt-btn-solid">Request access →</a>
          </div>
          <div className="rt-two-right">
            {teamsGet.map((t) => (
              <div key={t.n} className="rt-row">
                <div className="rt-row-n">{t.n}</div>
                <div>
                  <div className="rt-row-title">{t.title}</div>
                  <div className="rt-row-body">{t.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rt-block">
        <div className="rt-block-head">
          <p className="rt-label">Customer API surface</p>
          <h2 className="rt-h2">The routes that<br/><em>actually matter.</em></h2>
          <p className="rt-block-body">
            Most traffic only ever touches two of these. The rest are for keys, usage,
            and the catalog. No <code>/v1/admin/*</code> or ops-only auth in the
            customer path.
          </p>
        </div>
        <div className="rt-routes">
          {routes.map((r) => (
            <div key={r.path} className="rt-route">
              <span className={`rt-method rt-${r.method.toLowerCase()}`}>{r.method}</span>
              <span className="rt-path">{r.path}</span>
              <span className="rt-route-note">{r.note}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rt-cta">
        <h2 className="rt-cta-title">Stop paying for token waste.</h2>
        <p className="rt-cta-sub">
          Tell us your stack, providers, traffic, and constraints. We&apos;ll get you a key.
        </p>
        <div className="rt-hero-actions">
          <a href={ACCESS_URL} className="rt-btn rt-btn-light">Request access →</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="rt-btn rt-btn-ghost">Schedule a call</a>
        </div>
      </section>

      <footer className="rt-footer">
        <span>© 2025 Bad Theory Labs · Lagos, Nigeria</span>
        <div className="rt-footer-links">
          <Link href="/">Home</Link>
          <Link href="/#products">Products</Link>
          <a href="mailto:hello@badtheorylabs.com">hello@badtheorylabs.com</a>
        </div>
      </footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.rt-page {
  --bg:#FAFAF9; --surface:#F3F2EF; --border:#E8E6E1; --border2:#D6D3CC;
  --ink:#0E0D0C; --body:#5C5954; --faint:#9C9890;
  background:var(--bg); color:var(--ink);
  font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; min-height:100vh;
}
.rt-page *,.rt-page *::before,.rt-page *::after { box-sizing:border-box; }
.rt-page em { font-style:italic; font-weight:400; }
.rt-page code { font-family:'JetBrains Mono',monospace; font-size:0.85em; background:var(--surface); padding:1px 5px; border-radius:4px; }

/* nav */
.rt-nav {
  position:sticky; top:0; z-index:50; height:56px; padding:0 clamp(20px,4vw,52px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(250,250,249,0.85); backdrop-filter:blur(24px) saturate(1.4);
  border-bottom:1px solid var(--border);
}
.rt-brand { font-family:'EB Garamond',serif; font-size:16px; font-weight:500; letter-spacing:-0.02em; color:var(--ink); text-decoration:none; }
.rt-nav-links { display:flex; gap:28px; }
.rt-nav-links a { font-size:13px; color:var(--body); text-decoration:none; transition:color .15s; }
.rt-nav-links a:hover,.rt-nav-links a.rt-active { color:var(--ink); }
.rt-nav-cta { display:flex; align-items:center; gap:10px; }
.rt-nav-cta a { font-size:13px; color:var(--body); text-decoration:none; }
.rt-solid { background:var(--ink); color:var(--bg)!important; padding:7px 16px; border-radius:7px; font-weight:500; transition:opacity .12s; }
.rt-solid:hover { opacity:.85; }
@media (max-width:760px){ .rt-nav-links{ display:none; } }

/* hero */
.rt-hero {
  display:grid; grid-template-columns:1.05fr 0.95fr; gap:0;
  border-bottom:1px solid var(--border);
}
.rt-hero-copy { padding:clamp(48px,7vw,96px) clamp(24px,4vw,56px); border-right:1px solid var(--border); }
.rt-eyebrow { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:28px; }
.rt-h1 { font-family:'EB Garamond',serif; font-size:clamp(52px,7vw,92px); font-weight:500; letter-spacing:-0.04em; line-height:0.96; margin-bottom:24px; }
.rt-lede { font-family:'EB Garamond',serif; font-size:clamp(20px,2.4vw,28px); font-weight:500; letter-spacing:-0.02em; line-height:1.3; color:var(--ink); max-width:460px; margin-bottom:20px; }
.rt-sub { font-size:15px; font-weight:300; line-height:1.78; color:var(--body); max-width:440px; margin-bottom:36px; }
.rt-hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.rt-btn { font-size:14px; font-weight:500; text-decoration:none; padding:13px 26px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; transition:opacity .12s,border-color .15s,color .15s,background .15s; }
.rt-btn-solid { background:var(--ink); color:var(--bg); }
.rt-btn-solid:hover { opacity:.85; }
.rt-btn-outline { border:1px solid var(--border); color:var(--body); }
.rt-btn-outline:hover { border-color:var(--ink); color:var(--ink); background:rgba(14,13,12,0.025); }

/* hero code panel */
.rt-hero-code { background:var(--ink); padding:clamp(32px,4vw,52px); display:flex; flex-direction:column; justify-content:center; }
.rt-code-head { display:flex; align-items:center; gap:7px; margin-bottom:22px; }
.rt-dot { width:9px; height:9px; border-radius:50%; background:rgba(250,250,249,0.18); }
.rt-code-label { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(250,250,249,0.35); letter-spacing:0.1em; text-transform:uppercase; margin-left:8px; }
.rt-code { font-family:'JetBrains Mono',monospace; font-size:13px; line-height:1.7; color:rgba(250,250,249,0.82); white-space:pre; overflow-x:auto; margin:0; }

/* stat strip */
.rt-strip { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--border); background:var(--surface); }
.rt-strip-cell { padding:28px clamp(20px,3vw,40px); border-right:1px solid var(--border); }
.rt-strip-cell:last-child { border-right:none; }
.rt-strip-k { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--faint); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
.rt-strip-v { font-family:'EB Garamond',serif; font-size:clamp(18px,2vw,24px); font-weight:500; letter-spacing:-0.02em; color:var(--ink); }

/* blocks */
.rt-block { padding:clamp(56px,7vw,96px) clamp(24px,4vw,56px); border-bottom:1px solid var(--border); max-width:1320px; margin:0 auto; }
.rt-block-alt { background:var(--surface); max-width:none; }
.rt-block-head { max-width:620px; margin-bottom:56px; }
.rt-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:10px; }
.rt-label::before { content:''; width:24px; height:1px; background:var(--border); }
.rt-h2 { font-family:'EB Garamond',serif; font-size:clamp(32px,4vw,52px); font-weight:500; letter-spacing:-0.035em; line-height:1.05; margin-bottom:24px; }
.rt-block-body { font-size:15.5px; font-weight:300; line-height:1.78; color:var(--body); }

/* pipeline grid */
.rt-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.rt-card { background:var(--bg); padding:36px clamp(24px,3vw,40px); transition:background .2s; }
.rt-block-alt .rt-card { background:var(--surface); }
.rt-card:hover { background:var(--surface); }
.rt-card-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--faint); letter-spacing:0.1em; margin-bottom:16px; }
.rt-card-title { font-family:'EB Garamond',serif; font-size:22px; font-weight:500; letter-spacing:-0.02em; margin-bottom:10px; }
.rt-card-body { font-size:14px; font-weight:300; line-height:1.72; color:var(--body); }

/* two-col */
.rt-two { display:grid; grid-template-columns:1fr 1fr; gap:clamp(40px,6vw,80px); max-width:1320px; margin:0 auto; }
.rt-two-left .rt-btn { margin-top:32px; }
.rt-two-right { display:flex; flex-direction:column; }
.rt-row { display:flex; gap:18px; padding:22px 0; border-bottom:1px solid var(--border); }
.rt-row:first-child { border-top:1px solid var(--border); }
.rt-row-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--faint); padding-top:3px; width:22px; flex-shrink:0; }
.rt-row-title { font-size:15px; font-weight:500; color:var(--ink); margin-bottom:5px; }
.rt-row-body { font-size:13.5px; font-weight:300; line-height:1.68; color:var(--body); }

/* routes */
.rt-routes { border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.rt-route { display:flex; align-items:center; gap:16px; padding:15px clamp(18px,2.5vw,28px); border-bottom:1px solid var(--border); transition:background .15s; }
.rt-route:last-child { border-bottom:none; }
.rt-route:hover { background:var(--surface); }
.rt-method { font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:0.06em; padding:3px 8px; border-radius:5px; width:52px; text-align:center; flex-shrink:0; }
.rt-post { background:rgba(168,94,26,0.12); color:#A85E1A; }
.rt-get { background:rgba(14,13,12,0.06); color:var(--body); }
.rt-path { font-family:'JetBrains Mono',monospace; font-size:14px; color:var(--ink); }
.rt-route-note { font-size:12.5px; font-weight:300; color:var(--faint); margin-left:auto; }

/* cta */
.rt-cta { background:var(--ink); padding:clamp(64px,8vw,112px) clamp(24px,4vw,56px); text-align:center; }
.rt-cta-title { font-family:'EB Garamond',serif; font-size:clamp(32px,4.5vw,60px); font-weight:500; letter-spacing:-0.04em; color:rgba(250,250,249,0.94); margin-bottom:16px; }
.rt-cta-sub { font-size:15px; font-weight:300; color:rgba(250,250,249,0.45); margin-bottom:36px; }
.rt-cta .rt-hero-actions { justify-content:center; }
.rt-btn-light { background:var(--bg); color:var(--ink); }
.rt-btn-light:hover { opacity:.88; }
.rt-btn-ghost { border:1px solid rgba(255,255,255,0.18); color:rgba(250,250,249,0.7); }
.rt-btn-ghost:hover { border-color:rgba(255,255,255,0.5); color:var(--bg); }

/* footer */
.rt-footer { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:16px; padding:28px clamp(24px,4vw,56px); font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); }
.rt-footer-links { display:flex; gap:24px; }
.rt-footer-links a { color:var(--faint); text-decoration:none; transition:color .12s; }
.rt-footer-links a:hover { color:var(--ink); }

@media (max-width:820px){
  .rt-hero { grid-template-columns:1fr; }
  .rt-hero-copy { border-right:none; border-bottom:1px solid var(--border); }
  .rt-strip { grid-template-columns:1fr 1fr; }
  .rt-strip-cell:nth-child(2) { border-right:none; }
  .rt-strip-cell:nth-child(1),.rt-strip-cell:nth-child(2) { border-bottom:1px solid var(--border); }
  .rt-grid { grid-template-columns:1fr; }
  .rt-two { grid-template-columns:1fr; }
  .rt-route-note { display:none; }
}
`;
