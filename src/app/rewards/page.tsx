'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  product: string;
  platform: string;
  reviewUrl: string;
  wallet: string;
  summary: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  product: "BTL Runtime",
  platform: "X",
  reviewUrl: "",
  wallet: "",
  summary: "",
};

export default function RewardsPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [claimId, setClaimId] = useState<number | string | null>(null);

  const set = (key: keyof FormState) => (
    event: { target: { value: string } },
  ) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setClaimId(null);

    try {
      const response = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimType: "review", ...form }),
      });
      const data = (await response.json()) as { error?: string; claimId?: number | string };
      if (!response.ok) {
        throw new Error(data.error || "Couldn't submit your claim.");
      }
      setClaimId(data.claimId || "pending");
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't submit your claim.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="rw-page">
      <style>{styles}</style>

      <nav className="rw-nav">
        <Link href="/" className="rw-brand">Bad Theory Labs</Link>
        <div className="rw-nav-links">
          <Link href="/runtime">Runtime</Link>
          <Link href="/hackathon">Hackathon</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      <section className="rw-shell">
        <div className="rw-left">
          <p className="rw-kicker">$BTL rewards</p>
          <h1>Claim rewards for useful BTL reviews.</h1>
          <p className="rw-copy">
            Drop a public review, teardown, demo, or case study for a BTL product. Submit it here,
            and we review the claim for $BTL payout. Honest feedback counts, even when it is critical.
          </p>

          <div className="rw-rules">
            {[
              ["Public URL", "The review must be visible and attributable."],
              ["Real usage", "Show what you tried, built, measured, or learned."],
              ["No paid praise", "Useful feedback is eligible whether positive or critical."],
              ["Manual review", "Approved claims move to pending payout."],
            ].map(([title, body]) => (
              <div className="rw-rule" key={title}>
                <span>{title}</span>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>

        <form className="rw-form" onSubmit={submit}>
          {claimId ? (
            <div className="rw-success">
              <div className="rw-check">✓</div>
              <h2>Claim received.</h2>
              <p>
                Your review reward claim is pending verification. Claim ID: <strong>{claimId}</strong>.
              </p>
              <button type="button" onClick={() => setClaimId(null)}>Submit another</button>
            </div>
          ) : (
            <>
              <div className="rw-form-head">
                <span>Review claim</span>
                <p>All fields except notes are required.</p>
              </div>

              <div className="rw-grid">
                <label>
                  Name
                  <input value={form.name} onChange={set("name")} required />
                </label>
                <label>
                  Email
                  <input type="email" value={form.email} onChange={set("email")} required />
                </label>
              </div>

              <div className="rw-grid">
                <label>
                  Product
                  <select value={form.product} onChange={set("product")} required>
                    <option>BTL Runtime</option>
                    <option>Marrow</option>
                    <option>RetainDB</option>
                    <option>BTL-2 Coder 7B</option>
                    <option>Bad Theory Labs</option>
                  </select>
                </label>
                <label>
                  Platform
                  <select value={form.platform} onChange={set("platform")} required>
                    <option>X</option>
                    <option>YouTube</option>
                    <option>Blog</option>
                    <option>GitHub</option>
                    <option>LinkedIn</option>
                    <option>Product Hunt</option>
                    <option>Other</option>
                  </select>
                </label>
              </div>

              <label>
                Public review URL
                <input
                  type="url"
                  value={form.reviewUrl}
                  onChange={set("reviewUrl")}
                  placeholder="https://..."
                  required
                />
              </label>

              <label>
                Wallet address
                <input
                  value={form.wallet}
                  onChange={set("wallet")}
                  placeholder="$BTL payout wallet"
                  required
                />
              </label>

              <label>
                Notes
                <textarea
                  value={form.summary}
                  onChange={set("summary")}
                  rows={4}
                  placeholder="What did you review? Anything we should know before verification?"
                />
              </label>

              {error ? <div className="rw-error">{error}</div> : null}
              <button type="submit" disabled={loading}>{loading ? "Submitting..." : "Submit claim"}</button>
              <p className="rw-fine">
                Rewards are discretionary, manually verified, and paid in $BTL after approval.
              </p>
            </>
          )}
        </form>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; }
.rw-page { min-height:100vh; background:var(--bg); color:var(--ink); font-family:var(--font-s); }
.rw-nav { height:58px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; padding:0 28px; background:rgba(250,250,249,.9); backdrop-filter:blur(18px); position:sticky; top:0; z-index:10; }
.rw-brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.rw-nav-links { display:flex; gap:16px; align-items:center; }
.rw-nav-links a { color:var(--body); text-decoration:none; font-size:13px; }
.rw-shell { display:grid; grid-template-columns:.9fr 1.1fr; min-height:calc(100vh - 58px); }
.rw-left { padding:72px clamp(24px,5vw,64px); border-right:1px solid var(--border); display:flex; flex-direction:column; justify-content:center; position:relative; overflow:hidden; }
.rw-left::before { content:''; position:absolute; width:560px; height:560px; border-radius:50%; background:radial-gradient(circle,rgba(168,94,26,.055),transparent 68%); top:45%; left:25%; transform:translate(-50%,-50%); pointer-events:none; }
.rw-kicker { font-family:var(--font-m); font-size:10.5px; color:var(--faint); text-transform:uppercase; letter-spacing:.12em; margin-bottom:18px; position:relative; }
h1 { font-family:var(--font-d); font-size:clamp(42px,5.4vw,74px); line-height:1; letter-spacing:-.04em; font-weight:400; max-width:560px; margin-bottom:22px; position:relative; }
.rw-copy { color:var(--body); font-size:16px; line-height:1.75; max-width:500px; margin-bottom:34px; position:relative; }
.rw-rules { display:grid; grid-template-columns:1fr 1fr; gap:10px; position:relative; }
.rw-rule { border:1px solid var(--border); background:rgba(250,250,249,.72); border-radius:10px; padding:16px; }
.rw-rule span { font-family:var(--font-m); font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--faint); }
.rw-rule p { color:var(--body); font-size:13px; line-height:1.55; margin-top:8px; }
.rw-form { padding:72px clamp(24px,5vw,68px); display:flex; flex-direction:column; justify-content:center; gap:14px; background:var(--surface); }
.rw-form-head { margin-bottom:4px; }
.rw-form-head span { font-family:var(--font-m); font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); }
.rw-form-head p { color:var(--body); font-size:13px; margin-top:6px; }
.rw-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
label { display:flex; flex-direction:column; gap:7px; font-family:var(--font-m); font-size:10.5px; letter-spacing:.1em; text-transform:uppercase; color:var(--faint); }
input, select, textarea { width:100%; border:1px solid var(--border); background:var(--bg); border-radius:10px; padding:12px 13px; color:var(--ink); font-family:var(--font-s); font-size:14px; text-transform:none; letter-spacing:0; outline:none; }
textarea { resize:vertical; }
input:focus, select:focus, textarea:focus { border-color:var(--ink); }
button { border:0; border-radius:10px; background:var(--ink); color:var(--bg); padding:13px 18px; cursor:pointer; font-size:14px; font-family:var(--font-s); }
button:disabled { opacity:.6; cursor:wait; }
.rw-error { color:#8a2b1c; background:#fdf1ee; border:1px solid #f3d6cf; border-radius:10px; padding:10px 12px; font-size:13px; }
.rw-fine { color:var(--faint); font-size:12px; line-height:1.6; }
.rw-success { border:1px solid var(--border); background:var(--bg); border-radius:14px; padding:34px; text-align:center; }
.rw-check { width:54px; height:54px; border-radius:50%; background:var(--ink); color:var(--bg); display:flex; align-items:center; justify-content:center; margin:0 auto 18px; font-size:25px; }
.rw-success h2 { font-family:var(--font-d); font-size:38px; font-weight:400; letter-spacing:-.03em; margin-bottom:10px; }
.rw-success p { color:var(--body); line-height:1.65; margin-bottom:22px; }
@media (max-width: 860px) {
  .rw-shell { grid-template-columns:1fr; }
  .rw-left { border-right:0; border-bottom:1px solid var(--border); padding:48px 20px; }
  .rw-form { padding:40px 20px 52px; }
  .rw-rules, .rw-grid { grid-template-columns:1fr; }
  .rw-nav { padding:0 16px; }
  .rw-nav-links { display:none; }
}
`;
