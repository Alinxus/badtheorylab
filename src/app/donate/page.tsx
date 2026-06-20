'use client';

import { useState } from "react";
import Link from "next/link";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
const GOAL = 250000;

const TIERS = [
  { label: "$5", value: 5, whop: "https://whop.com/checkout/plan_isMGD9KnZw8xj", desc: "A coffee and good karma" },
  { label: "$10", value: 10, whop: "https://whop.com/checkout/plan_mnUQbH6zcIzka", desc: "Supports one small eval run" },
  { label: "$20", value: 20, whop: "https://whop.com/checkout/plan_EjKeyAYv64neK", desc: "Funds dataset hosting for a month" },
  { label: "$50", value: 50, whop: "https://whop.com/checkout/plan_DN2f7MNsOTEqP", desc: "Covers a full model eval round" },
  { label: "$100", value: 100, whop: "https://whop.com/checkout/plan_Yk05cgyoUIyjk", desc: "Pays for GPU compute hours" },
  { label: "$500", value: 500, whop: "https://whop.com/checkout/plan_xXfVuLsKDYuHQ", desc: "Funds a benchmark expansion" },
  { label: "$1,000", value: 1000, whop: "https://whop.com/checkout/plan_dCrVbbpgOf3LX", desc: "Major contribution toward GPU cluster" },
];

const DONATIONS = [
  { name: "Anonymous", amount: "$100", method: "whop card", date: "2d ago" },
  { name: "Anonymous", amount: "$50", method: "whop card", date: "5d ago" },
  { name: "Anonymous", amount: "$20", method: "SOL", date: "1w ago" },
];

const RAISED = 300;

export default function DonatePage() {
  const [customAmt, setCustomAmt] = useState("");
  const [showDonate, setShowDonate] = useState<number | "custom" | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const progressPct = Math.min((RAISED / GOAL) * 100, 100);

  return (
    <main className="fund-page">
      <style>{styles}</style>

      <nav className="top-nav">
        <Link href="/" className="brand">Bad Theory Labs</Link>
        <div className="nav-links">
          <Link href="/#research">Research</Link>
          <Link href="/#products">Products</Link>
          <Link href="/reasoning-gap">Reasoning Gap</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/donate" aria-current="page">Donate</Link>
          <Link href="/brief">Brief</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-cta">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Join community</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule call</a>
        </div>
        <button className={`nav-burger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-drawer">
          <a href="/#research" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Research</a>
          <a href="/#products" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Products</a>
          <Link href="/reasoning-gap" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Reasoning Gap</Link>
          <Link href="/papers" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Papers</Link>
          <Link href="/donate" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Donate</Link>
          <Link href="/brief" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Brief</Link>
          <Link href="/contact" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Contact</Link>
          <div className="nav-drawer-divider" />
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Join community</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="nav-drawer-cta" onClick={() => setMenuOpen(false)}>Schedule call</a>
        </div>
      )}

      <section className="hero">
        <p className="eyebrow">Bad Theory Labs · Research Fund</p>
        <h1>BTL Research Fund</h1>
        <p className="hero-subtitle">
          We need investment and donations to fund independent AI reasoning research.
          Every dollar goes to compute. Every result gets published.
        </p>
      </section>

      <section className="fund-core">
        <div className="fund-progress">
          <div className="fund-raised">
            <span className="raised-amount">${RAISED.toLocaleString()}</span>
            <span className="raised-goal">of ${GOAL.toLocaleString()}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="progress-note">Every contribution funds research infrastructure directly.</p>
        </div>

        <div className="fund-two-col">
          <div className="fund-desc">
            <h2>Fund the work that holds frontier AI to account.</h2>
            <p>
              Our first benchmark, The Reasoning Gap, shows that GPT-5.4, GPT-4o mini, and Gemini 2.0 Flash all
              score at random chance on basic causal inference. Human experts score 97.8%. That gap is not closing with scale.
            </p>
            <p>
              We run large-scale evals on frontier models. We build public benchmarks. We publish everything —
              results, code, datasets — for free. No paywalls. No spin.
            </p>
            <p>
              We need local GPU compute to scale this work. Each eval round costs hundreds of dollars on API endpoints.
              A GPU cluster cuts marginal cost to zero and guarantees reproducibility.
            </p>

            <h3>How the money goes</h3>
            <ul>
              <li><strong>$150,000</strong> — GPU cluster for in-house evals (4× RTX 5090 or equivalent)</li>
              <li><strong>$50,000</strong> — API compute for frontier model evaluations</li>
              <li><strong>$30,000</strong> — Dataset hosting, public infrastructure, compute for fine-tuning experiments</li>
              <li><strong>$20,000</strong> — DOI registration, archiving, domain fees, operational costs</li>
            </ul>
            <div className="invest-section">
              <h3>Interested in investing?</h3>
              <p>
                We welcome strategic investors who want to back independent AI reasoning research.
                Reach out directly:
              </p>
              <a href="mailto:alameencodes@gmail.com" className="invest-email">alameencodes@gmail.com</a>
            </div>
            <p className="fund-footnote">Every dollar is logged. Every result is public.</p>
          </div>

          <div className="fund-tiers">
            <h3>Contribute</h3>
            <div className="tier-grid">
              {TIERS.map((t) => (
                <button key={t.value} className="tier-card" onClick={() => setShowDonate(t.value)}>
                  <span className="tier-amount">{t.label}</span>
                  <span className="tier-desc">{t.desc}</span>
                </button>
              ))}
            </div>
            <div className="custom-amt-row">
              <input
                type="number"
                placeholder="Custom amount ($)"
                value={customAmt}
                onChange={(e) => setCustomAmt(e.target.value)}
                className="custom-input"
              />
              <button
                className="btn btn-solid donate-btn"
                onClick={() => {
                  const n = parseFloat(customAmt);
                  if (n >= 5) setShowDonate("custom");
                }}
              >
                Donate
              </button>
            </div>
            {customAmt && parseFloat(customAmt) < 5 && (
              <p className="error-msg">Minimum donation is $5</p>
            )}
          </div>
        </div>
      </section>

      {showDonate && (
        <div className="modal-overlay" onClick={() => setShowDonate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowDonate(null)}>×</button>
            <h3>Complete your donation</h3>
            <p className="modal-amount">
              {showDonate === "custom"
                ? `$${parseFloat(customAmt).toFixed(0)}`
                : `$${showDonate.toLocaleString()}`}
            </p>
            {showDonate !== "custom" ? (
              <>
                <p className="modal-label">Pay with card via Whop</p>
                <a
                  href={TIERS.find((t) => t.value === showDonate)?.whop || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-solid modal-btn"
                  onClick={() => setShowDonate(null)}
                >
                  Pay ${showDonate.toLocaleString()}
                </a>
                <p className="modal-meta">
                  Card via Whop. Receipt sent to your email.
                </p>
              </>
            ) : (
              <>
                <p className="modal-label">Custom amounts via crypto</p>
                <hr className="modal-hr" />
              </>
            )}
            <div className="crypto-addresses">
              <div className="crypto-row">
                <span className="crypto-tag">SOL</span>
                <code className="crypto-addr">463Q1phqfQqcWpG4pRdFvoQzEJi4PbgLbkiHGc5wF2YH</code>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="donations-feed">
        <h2>Recent Donations</h2>
        <div className="donations-list">
          {DONATIONS.map((d, i) => (
            <div key={i} className="donation-row">
              <span className="donation-name">{d.name}</span>
              <span className="donation-date">{d.date}</span>
              <span className="donation-method">{d.method}</span>
              <span className="donation-amount">{d.amount}</span>
            </div>
          ))}
        </div>
        <p className="feed-note">
          Donations appear here after confirmation. Crypto donations appear once confirmed on-chain.
        </p>
      </section>

      <section className="updates">
        <h2>Updates</h2>
        <div className="update-card">
          <p className="update-date">June 2026</p>
          <p className="update-title">Fund launched</p>
          <p className="update-body">
            BTL Research Fund is open. First $300 raised. GPU compute funded.
            The Reasoning Gap benchmark is published. Next: arithmetic control eval and model fine-tuning experiments.
          </p>
        </div>
      </section>

      <footer className="fund-footer">
        <p>Bad Theory Labs · Research Fund · 2026</p>
        <p className="footer-links">
          <Link href="/">Home</Link>
          <Link href="/reasoning-gap">Reasoning Gap</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/contact">Contact</Link>
        </p>
      </footer>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; }
.fund-page { min-height:100vh; background:var(--bg); color:var(--ink); font-family:'DM Sans',sans-serif; }

/* nav */
.top-nav { position:sticky; top:0; z-index:20; height:58px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.nav-links, .nav-cta { display:flex; gap:16px; align-items:center; }
.nav-links a, .nav-cta a { text-decoration:none; color:var(--body); font-family:var(--font-s); font-size:13px; }
.nav-links a[aria-current] { color:var(--ink); }
.nav-cta .solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }

/* hero */
.hero { max-width:1080px; margin:0 auto; padding:72px 28px 36px; border-bottom:1px solid var(--border); }
.eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:10px; }
.hero h1 { font-family:var(--font-d); font-size:clamp(42px,6vw,70px); letter-spacing:-.03em; line-height:1.02; margin-bottom:10px; }
.hero-subtitle { max-width:640px; color:var(--body); line-height:1.7; font-size:15px; }

/* fund core */
.fund-core { max-width:1080px; margin:0 auto; padding:40px 28px; }

/* progress */
.fund-progress { margin-bottom:48px; }
.fund-raised { margin-bottom:8px; }
.raised-amount { font-family:var(--font-d); font-size:48px; letter-spacing:-.02em; color:var(--ink); }
.raised-goal { font-size:24px; color:var(--faint); margin-left:6px; }
.progress-bar { height:8px; background:var(--border); border-radius:4px; overflow:hidden; margin:12px 0; }
.progress-fill { height:100%; background:var(--ink); border-radius:4px; transition:width 0.6s ease; }
.progress-note { color:var(--faint); font-size:12px; }

/* two col */
.fund-two-col { display:grid; grid-template-columns:1fr 1fr; gap:48px; }
.fund-desc h2 { font-family:var(--font-d); font-size:32px; letter-spacing:-.02em; margin-bottom:14px; }
.fund-desc h3 { font-family:var(--font-d); font-size:24px; letter-spacing:-.01em; margin:24px 0 10px; }
.fund-desc p { color:var(--body); line-height:1.8; margin-bottom:10px; font-size:14px; }
.fund-desc ul { list-style:none; padding:0; margin:12px 0; }
.fund-desc li { padding:8px 0; border-bottom:1px solid var(--border); font-size:14px; color:var(--body); }
.fund-desc li strong { color:var(--ink); }
.fund-footnote { font-family:var(--font-m); font-size:11px; color:var(--faint); letter-spacing:.06em; text-transform:uppercase; margin-top:16px; }
.invest-section { margin-top:32px; padding:16px; background:var(--surface); border:1px solid var(--border); border-radius:10px; }
.invest-section h3 { font-family:var(--font-d); font-size:20px; letter-spacing:-.01em; margin-bottom:6px; }
.invest-section p { color:var(--body); line-height:1.7; font-size:14px; margin-bottom:6px; }
.invest-email { font-family:var(--font-m); font-size:13px; color:var(--ink); text-decoration:underline; text-underline-offset:2px; }

/* tiers */
.fund-tiers h3 { font-family:var(--font-d); font-size:24px; letter-spacing:-.01em; margin-bottom:14px; }
.tier-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px; }
.tier-card { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:14px; cursor:pointer; text-align:left; transition:all 0.15s; }
.tier-card:hover { border-color:var(--ink); background:#fff; }
.tier-amount { display:block; font-family:var(--font-d); font-size:22px; color:var(--ink); margin-bottom:2px; }
.tier-desc { display:block; font-size:11px; color:var(--faint); }
.custom-amt-row { display:flex; gap:8px; margin-bottom:4px; }
.custom-input { flex:1; padding:10px 12px; border:1px solid var(--border2); border-radius:8px; font-size:14px; background:var(--bg); color:var(--ink); outline:none; }
.custom-input:focus { border-color:var(--ink); }
.donate-btn { padding:10px 20px; border-radius:8px; white-space:nowrap; }
.error-msg { color:#c00; font-size:12px; margin-top:4px; }

/* modal */
.modal-overlay { position:fixed; inset:0; z-index:2000; background:rgba(0,0,0,.4); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:20px; }
.modal { background:var(--bg); border-radius:16px; padding:32px; max-width:420px; width:100%; position:relative; }
.modal-close { position:absolute; top:12px; right:16px; background:none; border:none; font-size:28px; cursor:pointer; color:var(--faint); }
.modal h3 { font-family:var(--font-d); font-size:24px; margin-bottom:4px; }
.modal-amount { font-family:var(--font-d); font-size:40px; letter-spacing:-.02em; color:var(--ink); margin:8px 0; }
.modal-label { font-size:13px; color:var(--faint); margin-bottom:8px; }
.modal-btn { display:block; text-align:center; padding:14px; border-radius:10px; margin:12px 0; font-size:15px; text-decoration:none; }
.modal-meta { font-size:11px; color:var(--faint); margin-bottom:12px; }
.modal-hr { border:none; border-top:1px solid var(--border); margin:16px 0; }
.crypto-addresses { display:flex; flex-direction:column; gap:8px; }
.crypto-row { display:flex; align-items:center; gap:8px; }
.crypto-tag { font-family:var(--font-m); font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--faint); min-width:30px; }
.crypto-addr { font-family:var(--font-m); font-size:12px; color:var(--body); word-break:break-all; background:var(--surface); padding:6px 10px; border-radius:6px; }

/* donations feed */
.donations-feed { max-width:1080px; margin:0 auto; padding:40px 28px 60px; border-top:1px solid var(--border); }
.donations-feed h2 { font-family:var(--font-d); font-size:28px; letter-spacing:-.02em; margin-bottom:16px; }
.donations-list { max-width:600px; }
.donation-row { display:flex; align-items:center; gap:16px; padding:10px 0; border-bottom:1px solid var(--border); font-size:14px; }
.donation-name { flex:1; color:var(--ink); }
.donation-date { color:var(--faint); font-size:12px; width:44px; }
.donation-method { color:var(--body); font-size:12px; width:80px; }
.donation-amount { font-family:var(--font-m); width:70px; text-align:right; }
.feed-note { color:var(--faint); font-size:11px; margin-top:12px; }

/* updates */
.updates { max-width:1080px; margin:0 auto; padding:0 28px 60px; }
.updates h2 { font-family:var(--font-d); font-size:28px; letter-spacing:-.02em; margin-bottom:16px; }
.update-card { max-width:600px; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px; }
.update-date { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.08em; font-size:10px; color:var(--faint); margin-bottom:4px; }
.update-title { font-family:var(--font-d); font-size:20px; margin-bottom:6px; }
.update-body { color:var(--body); line-height:1.7; font-size:14px; }

/* footer */
.fund-footer { text-align:center; padding:32px 28px; border-top:1px solid var(--border); color:var(--faint); font-size:12px; }
.footer-links { margin-top:6px; display:flex; justify-content:center; gap:14px; }
.footer-links a { color:var(--body); text-decoration:none; font-size:12px; }
.footer-links a:hover { color:var(--ink); }

/* utils */
.btn { display:inline-block; font-family:var(--font-s); font-size:13px; cursor:pointer; border:none; text-decoration:none; }
.btn-solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }
.btn-outline { background:transparent; color:var(--ink); padding:8px 14px; border:1px solid var(--border); border-radius:8px; }
.btn:hover { opacity:.85; }

@media (max-width:900px) {
  .nav-links, .nav-cta { display:none; }
  .nav-burger { display:flex; }
  .top-nav { padding:0 16px; }
  .fund-two-col { grid-template-columns:1fr; gap:32px; }
  .tier-grid { grid-template-columns:1fr 1fr; }
  .hero h1 { font-size:36px; }
  .raised-amount { font-size:36px; }
  .hero, .fund-core, .donations-feed, .updates { padding-left:16px; padding-right:16px; }
}

@media (min-width:901px) {
  .nav-burger { display:none; }
}

/* hamburger */
.nav-burger { flex-direction:column; justify-content:center; align-items:center; width:36px; height:36px; background:none; border:none; cursor:pointer; gap:5px; padding:0; }
.nav-burger span { display:block; width:20px; height:1.5px; background:var(--ink); border-radius:1px; transition:all 0.2s; }
.nav-burger.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
.nav-burger.open span:nth-child(2) { opacity:0; }
.nav-burger.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

/* drawer */
.nav-drawer { position:fixed; top:58px; left:0; right:0; z-index:999; background:var(--bg); border-bottom:1px solid var(--border); padding:12px 16px 20px; display:flex; flex-direction:column; gap:2px; }
.nav-drawer-link { padding:10px 0; color:var(--body); text-decoration:none; font-family:var(--font-s); font-size:14px; border-bottom:1px solid var(--border); }
.nav-drawer-link:last-of-type { border-bottom:none; }
.nav-drawer-divider { height:1px; background:var(--border2); margin:8px 0; }
.nav-drawer-cta { display:block; text-align:center; background:var(--ink); color:var(--bg); padding:10px 14px; border-radius:8px; text-decoration:none; font-family:var(--font-s); font-size:14px; margin-top:4px; }
`;
