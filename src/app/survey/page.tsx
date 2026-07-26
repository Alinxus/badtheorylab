'use client';

import { FormEvent, useState } from "react";
import Link from "next/link";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";

const STAGES: Array<{ value: string; label: string }> = [
  { value: "not_started", label: "Haven't tried Runtime yet" },
  { value: "signed_up", label: "Signed up, no key made" },
  { value: "has_key", label: "Made a key, never sent a request" },
  { value: "sent_requests", label: "Sent live requests" },
  { value: "paying", label: "Added credits or a provider key" },
];

type FormState = {
  email: string;
  stage: string;
  blocker: string;
  feedback: string;
};

const initialState: FormState = {
  email: "",
  stage: "",
  blocker: "",
  feedback: "",
};

export default function SurveyPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Couldn't save that, try again in a bit.");
      }

      setStatus("success");
      setMessage("Got it — thanks. This goes straight to the founder, not a queue.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Couldn't save that, try again in a bit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="survey-page">
      <style>{styles}</style>

      <nav className="top-nav">
        <Link href="/" className="brand">Bad Theory Labs</Link>
        <div className="nav-links">
          <Link href="/runtime">Runtime</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="nav-cta">
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule call</a>
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">Runtime feedback</p>
          <h1>Tell us why Runtime didn&apos;t stick.</h1>
          <p>
            You signed up at some point. Most people never send a request, and we&apos;d rather hear
            why from you directly than guess. Two minutes, goes straight to the founder.
          </p>
        </div>

        <form onSubmit={onSubmit} className="form-card">
          <label>
            Email (optional — only if you want a reply)
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </label>

          <fieldset>
            <legend>Where are you with Runtime right now?</legend>
            {STAGES.map((stage) => (
              <label key={stage.value} className="radio-row">
                <input
                  type="radio"
                  name="stage"
                  required
                  checked={form.stage === stage.value}
                  onChange={() => setForm((prev) => ({ ...prev, stage: stage.value }))}
                />
                {stage.label}
              </label>
            ))}
          </fieldset>

          <label>
            What stopped you from going further?
            <textarea
              required
              rows={3}
              placeholder="Confusing setup, no time, wrong fit, forgot it existed — whatever it was."
              value={form.blocker}
              onChange={(e) => setForm((prev) => ({ ...prev, blocker: e.target.value }))}
            />
          </label>

          <label>
            Anything else worth knowing? (optional)
            <textarea
              rows={3}
              value={form.feedback}
              onChange={(e) => setForm((prev) => ({ ...prev, feedback: e.target.value }))}
            />
          </label>

          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send feedback"}</button>
          <p className={`status ${status}`}>{message}</p>
        </form>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; }
.survey-page { min-height:100vh; background:var(--bg); color:var(--ink); }
.top-nav { position:sticky; top:0; z-index:20; height:58px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.nav-links, .nav-cta { display:flex; gap:16px; align-items:center; }
.nav-links a, .nav-cta a { text-decoration:none; color:var(--body); font-family:var(--font-s); font-size:13px; }
.nav-cta .solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }
.hero { max-width:1120px; margin:0 auto; padding:70px 28px; display:grid; gap:28px; grid-template-columns:1fr 1.2fr; }
.eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:10px; }
h1 { font-family:var(--font-d); font-size:clamp(36px,5.4vw,58px); letter-spacing:-.03em; line-height:1.04; margin-bottom:10px; }
.hero p { color:var(--body); line-height:1.75; }
.form-card { border:1px solid var(--border); background:var(--surface); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:14px; }
label { display:flex; flex-direction:column; gap:6px; font-family:var(--font-m); font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--faint); }
input, textarea { border:1px solid var(--border); background:var(--bg); border-radius:10px; padding:10px 12px; color:var(--ink); font-family:var(--font-s); font-size:14px; text-transform:none; letter-spacing:normal; }
textarea { resize:vertical; }
fieldset { border:1px solid var(--border); border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:8px; }
legend { font-family:var(--font-m); font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--faint); padding:0 6px; }
.radio-row { flex-direction:row; align-items:center; gap:8px; text-transform:none; letter-spacing:normal; font-family:var(--font-s); font-size:14px; color:var(--ink); }
.radio-row input { width:auto; flex:none; }
button { border:none; border-radius:10px; background:var(--ink); color:var(--bg); padding:11px 14px; font-size:14px; cursor:pointer; }
button:disabled { opacity:.7; cursor:wait; }
.status { min-height:20px; font-size:13px; }
.status.success { color:#146a41; }
.status.error { color:#8f2020; }
@media (max-width: 980px) {
  .nav-links { display:none; }
  .top-nav { padding:0 16px; }
  .hero { grid-template-columns:1fr; padding:40px 16px 60px; }
}
`;
