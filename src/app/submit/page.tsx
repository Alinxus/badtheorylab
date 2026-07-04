'use client';

import { useState } from "react";
import Link from "next/link";

// Hard deadline — mirrors the "Submissions due" row on /hackathon.
const DEADLINE = new Date("2026-07-05T15:00:00Z");
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

type Status = "idle" | "sending" | "ok" | "error";

const empty = {
  email: "",
  teamName: "",
  projectName: "",
  members: "",
  description: "",
  repoUrl: "",
  demoVideoUrl: "",
  liveUrl: "",
  xPostUrl: "",
  runtimeRoutes: "",
  runtimeProof: "",
  usesRuntime: false,
  acceptDeadline: false,
};

export default function SubmitPage() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [edited, setEdited] = useState(false);

  const [closed] = useState(() => Date.now() > DEADLINE.getTime());

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!form.usesRuntime) {
      setStatus("error");
      setMessage("Projects must call the BTL Runtime to be eligible. Please confirm the Runtime checkbox.");
      return;
    }
    if (!form.acceptDeadline) {
      setStatus("error");
      setMessage("Please acknowledge the submission deadline.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/hackathon/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("ok");
      setEdited(Boolean(data.updated));
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "ok") {
    return (
      <main className="sub-page">
        <style>{css}</style>
        <Nav />
        <section className="sub-done">
          <div className="sub-check">✓</div>
          <h1>{edited ? "Submission updated." : "Submission received."}</h1>
          <p>
            You&rsquo;re locked in for the BTL Runtime Hackathon. You can come back and edit this form
            with the same email any time before <strong>Jul 5, 15:00 UTC</strong>.
          </p>
          <p className="sub-muted">
            Demo day is Jul 5 at 17:00 UTC in Discord — that&rsquo;s where finalists present live.
          </p>
          <div className="sub-actions">
            <button className="btn-g" onClick={() => { setStatus("idle"); }}>Edit my submission</button>
            <a className="btn-p" href={DISCORD_URL} target="_blank" rel="noreferrer">Back to Discord →</a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="sub-page">
      <style>{css}</style>
      <Nav />

      <section className="sub-hero">
        <div className="sub-eyebrow"><span className="rule" /><span>BTL Runtime Hackathon · Submission</span></div>
        <h1>Submit your project.</h1>
        <p className="sub-sub">
          One submission per team, keyed to your registered email. Come back and edit any time before the
          deadline — the last version wins. A GitHub repo is required; a demo video and live link help but
          aren&rsquo;t mandatory. Sharing on X is optional and can earn up to 3 bonus points.
          {" "}<strong>Every eligible project must call the BTL Runtime.</strong>
        </p>
        <div className="sub-deadline">
          <span className="dot" /> Submissions close <strong>Jul 5, 2026 · 15:00 UTC</strong>
        </div>
      </section>

      {closed ? (
        <section className="sub-closed">
          <h2>Submissions are closed.</h2>
          <p>The deadline (Jul 5, 15:00 UTC) has passed. Join us for demo day at 17:00 UTC in Discord.</p>
          <a className="btn-p" href={DISCORD_URL} target="_blank" rel="noreferrer">Open Discord →</a>
        </section>
      ) : (
        <form className="sub-form" onSubmit={onSubmit}>
          <Field label="Registered email" required hint="Use the email you registered the hackathon with.">
            <input type="email" required value={form.email}
              onChange={e => update("email", e.target.value)} placeholder="you@domain.com" />
          </Field>

          <div className="sub-row">
            <Field label="Team name" required>
              <input required value={form.teamName}
                onChange={e => update("teamName", e.target.value)} placeholder="Team Fugu" />
            </Field>
            <Field label="Project name" required>
              <input required value={form.projectName}
                onChange={e => update("projectName", e.target.value)} placeholder="Marrow" />
            </Field>
          </div>

          <Field label="Team members" hint="Emails or Discord handles, comma-separated. Leave blank if solo.">
            <input value={form.members}
              onChange={e => update("members", e.target.value)} placeholder="ada#1234, grace@domain.com" />
          </Field>

          <Field label="Short description" required
            hint="Required. In 1–3 sentences, tell us what your project does and the problem it solves.">
            <textarea required rows={3} value={form.description}
              onChange={e => update("description", e.target.value)}
              placeholder="A memory layer for agents that…" />
          </Field>

          <Field label="GitHub repo link" required
            hint="Required. The link to your code on GitHub. If your repo is private, make sure the judges can access it.">
            <input type="url" required value={form.repoUrl}
              onChange={e => update("repoUrl", e.target.value)} placeholder="https://github.com/you/project" />
          </Field>

          <div className="sub-row">
            <Field label="Demo video link"
              hint="Optional. A short video (2 minutes or less) showing your project in action. Upload it to YouTube or Loom and paste the link.">
              <input type="url" value={form.demoVideoUrl}
                onChange={e => update("demoVideoUrl", e.target.value)} placeholder="https://youtu.be/…" />
            </Field>
            <Field label="Live app link"
              hint="Optional. If your app is online, paste the link so judges can open and try it. No live version? Just leave this blank — your repo is enough.">
              <input type="url" value={form.liveUrl}
                onChange={e => update("liveUrl", e.target.value)} placeholder="https://your-app.vercel.app" />
            </Field>
          </div>

          <Field label="X / Twitter post link"
            hint="Optional. Post your demo or build thread on X, tag @badtheorylabs, and paste the link for up to 3 publicity bonus points.">
            <input type="url" value={form.xPostUrl}
              onChange={e => update("xPostUrl", e.target.value)} placeholder="https://x.com/you/status/…" />
          </Field>

          <Field label="BTL Runtime routes / models used" required
            hint="e.g. /v1/chat/completions with deepseek, /v1/responses, vision, tools, memory.">
            <input required value={form.runtimeRoutes}
              onChange={e => update("runtimeRoutes", e.target.value)}
              placeholder="/v1/chat/completions · deepseek-chat, /v1/responses" />
          </Field>

          <Field label="Runtime proof" hint="Optional but helpful: a request ID, log line, or screenshot URL.">
            <input value={form.runtimeProof}
              onChange={e => update("runtimeProof", e.target.value)} placeholder="req_abc123 or https://…" />
          </Field>

          <label className="sub-check-row">
            <input type="checkbox" checked={form.usesRuntime}
              onChange={e => update("usesRuntime", e.target.checked)} />
            <span>This project calls the BTL Runtime. <em>Required for prize eligibility.</em></span>
          </label>

          <label className="sub-check-row">
            <input type="checkbox" checked={form.acceptDeadline}
              onChange={e => update("acceptDeadline", e.target.checked)} />
            <span>I understand submissions close Jul 5, 2026 at 15:00 UTC.</span>
          </label>

          {status === "error" && <p className="sub-err">{message}</p>}

          <button className="btn-p sub-submit" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Submitting…" : "Submit project"}
          </button>
          <p className="sub-fine">You keep full ownership of everything you build.</p>
        </form>
      )}
    </main>
  );
}

function Nav() {
  return (
    <nav className="sub-nav">
      <Link href="/" className="sub-brand">Bad Theory Labs</Link>
      <div className="sub-nav-links">
        <Link href="/hackathon">Hackathon</Link>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer">Discord</a>
      </div>
    </nav>
  );
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <label className="sub-field">
      <span className="sub-label">{label}{required && <em className="req"> *</em>}</span>
      {children}
      {hint && <span className="sub-hint">{hint}</span>}
    </label>
  );
}

// Same type kit + palette as /hackathon so /submit reads like the rest of the site.
const css = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.sub-page{--bg:#FAFAF9;--surface:#F3F2EF;--border:#E8E6E1;--border2:#D6D3CC;--ink:#0E0D0C;--body:#5C5954;--faint:#9C9890;--amber:rgba(168,94,26,1);
  min-height:100vh;background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif;-webkit-font-smoothing:antialiased;padding-bottom:96px;position:relative;overflow-x:hidden}
.sub-page::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:.025;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:160px;animation:sub-grain .18s steps(1) infinite}
@keyframes sub-grain{0%{background-position:0 0}25%{background-position:-14% 4%}50%{background-position:-4% 23%}75%{background-position:14% 0}100%{background-position:0 0}}

.sub-nav{position:sticky;top:0;z-index:200;height:58px;border-bottom:1px solid var(--border);background:rgba(250,250,249,.92);backdrop-filter:blur(20px) saturate(1.4);display:flex;align-items:center;justify-content:space-between;padding:0 28px}
.sub-brand{font-family:'EB Garamond',serif;font-size:20px;font-weight:500;letter-spacing:-.02em;color:var(--ink);text-decoration:none}
.sub-nav-links{display:flex;gap:18px;align-items:center}
.sub-nav-links a{color:var(--body);text-decoration:none;font-size:13px;transition:color .15s}
.sub-nav-links a:hover{color:var(--ink)}

.sub-hero{max-width:760px;margin:0 auto;padding:64px 28px 8px}
.sub-eyebrow{display:flex;align-items:center;gap:10px;color:var(--faint);font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.1em;text-transform:uppercase}
.sub-eyebrow .rule{width:24px;height:1px;background:var(--border);flex-shrink:0}
.sub-hero h1{font-family:'EB Garamond',serif;font-size:clamp(40px,5vw,60px);font-weight:500;letter-spacing:-.04em;line-height:1.02;margin:24px 0 16px}
.sub-sub{font-size:16px;font-weight:300;line-height:1.76;color:var(--body);max-width:600px}
.sub-sub strong{font-weight:500;color:var(--ink)}
.sub-deadline{margin-top:24px;display:inline-flex;align-items:center;gap:9px;background:#fdf8f3;border:1px solid rgba(168,94,26,.14);border-radius:8px;padding:9px 15px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.04em;text-transform:uppercase;color:#8a5a2e}
.sub-deadline strong{font-weight:500}
.sub-deadline .dot{width:6px;height:6px;border-radius:50%;background:var(--amber);flex-shrink:0;animation:sub-pulse 2.2s ease-in-out infinite}
@keyframes sub-pulse{0%,100%{box-shadow:0 0 0 0 rgba(168,94,26,.5)}50%{box-shadow:0 0 0 5px rgba(168,94,26,0)}}

.sub-form{max-width:760px;margin:40px auto 0;padding:0 28px;display:flex;flex-direction:column;gap:26px}
.sub-row{display:grid;grid-template-columns:1fr 1fr;gap:26px}
@media(max-width:640px){.sub-row{grid-template-columns:1fr;gap:26px}}
.sub-field{display:flex;flex-direction:column;gap:7px}
.sub-label{font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink);font-weight:500}
.sub-label .req{color:var(--amber);font-style:normal}
.sub-hint{font-size:12.5px;font-weight:300;line-height:1.55;color:var(--faint)}
.sub-field input,.sub-field textarea{border:1px solid var(--border2);border-radius:8px;padding:12px 14px;font-size:15px;background:#fff;color:var(--ink);font-family:'DM Sans',sans-serif;outline:none;transition:border-color .15s,box-shadow .15s}
.sub-field input::placeholder,.sub-field textarea::placeholder{color:var(--faint)}
.sub-field input:focus,.sub-field textarea:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(14,13,12,.05)}
.sub-check-row{display:flex;gap:12px;align-items:flex-start;font-size:14px;font-weight:300;color:var(--body);line-height:1.55;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 16px}
.sub-check-row input{margin-top:2px;width:16px;height:16px;flex:none;accent-color:var(--ink)}
.sub-check-row em{color:var(--amber);font-style:normal;font-weight:500}
.sub-err{color:#a8402a;font-size:14px;margin:0}

.btn-p{font-family:'DM Sans',sans-serif;background:var(--ink);color:var(--bg);border:none;border-radius:8px;padding:14px 28px;font-size:15px;font-weight:500;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:opacity .12s}
.btn-p:hover{opacity:.85}
.btn-p:disabled{opacity:.5;cursor:default}
.btn-g{font-family:'DM Sans',sans-serif;background:transparent;color:var(--body);border:1px solid var(--border2);border-radius:8px;padding:13px 26px;font-size:15px;font-weight:500;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;transition:border-color .15s,color .15s,background .15s}
.btn-g:hover{border-color:var(--ink);color:var(--ink);background:rgba(14,13,12,.025)}
.sub-submit{margin-top:6px;align-self:flex-start;padding:15px 34px}
.sub-fine{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:var(--faint);margin:0}

.sub-closed,.sub-done{max-width:620px;margin:80px auto;padding:0 28px;text-align:center}
.sub-closed h2,.sub-done h1{font-family:'EB Garamond',serif;font-weight:500;letter-spacing:-.03em}
.sub-done h1{font-size:38px;margin:0 0 14px}
.sub-closed h2{font-size:32px;margin:0 0 12px}
.sub-done .sub-check{width:56px;height:56px;border-radius:50%;background:var(--ink);color:var(--bg);font-size:26px;display:flex;align-items:center;justify-content:center;margin:0 auto 22px}
.sub-done p,.sub-closed p{color:var(--body);font-weight:300;line-height:1.72;font-size:15px}
.sub-done p strong{color:var(--ink);font-weight:500}
.sub-muted{color:var(--faint);font-size:13.5px}
.sub-actions{display:flex;gap:12px;justify-content:center;margin-top:28px;flex-wrap:wrap}
`;
