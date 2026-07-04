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
          aren&rsquo;t mandatory. <strong>Every eligible project must call the BTL Runtime.</strong>
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

const css = `
.sub-page{min-height:100vh;background:#FAFAF9;color:#0E0D0C;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Arial,sans-serif;padding-bottom:80px}
.sub-nav{display:flex;align-items:center;justify-content:space-between;padding:20px 28px;max-width:820px;margin:0 auto}
.sub-brand{font-weight:700;text-decoration:none;color:#0E0D0C}
.sub-nav-links{display:flex;gap:20px}
.sub-nav-links a{color:#5C5954;text-decoration:none;font-size:14px}
.sub-nav-links a:hover{color:#0E0D0C}
.sub-hero{max-width:820px;margin:24px auto 8px;padding:0 28px}
.sub-eyebrow{display:flex;align-items:center;gap:10px;color:#9C9890;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.sub-eyebrow .rule{width:28px;height:1px;background:#D6D3CC}
.sub-hero h1{font-size:40px;margin:14px 0 10px;letter-spacing:-.02em}
.sub-sub{color:#5C5954;font-size:16px;line-height:1.6;max-width:640px}
.sub-deadline{margin-top:16px;display:inline-flex;align-items:center;gap:8px;background:#F3F2EF;border:1px solid #E8E6E1;border-radius:999px;padding:7px 14px;font-size:13px;color:#4a4540}
.sub-deadline .dot{width:7px;height:7px;border-radius:50%;background:#0E0D0C}
.sub-form{max-width:820px;margin:28px auto 0;padding:0 28px;display:flex;flex-direction:column;gap:20px}
.sub-row{display:grid;grid-template-columns:1fr 1fr;gap:20px}
@media(max-width:640px){.sub-row{grid-template-columns:1fr}.sub-hero h1{font-size:32px}}
.sub-field{display:flex;flex-direction:column;gap:6px}
.sub-label{font-size:14px;font-weight:600}
.sub-label .req{color:#b3402e;font-style:normal}
.sub-hint{font-size:12px;color:#9C9890}
.sub-field input,.sub-field textarea{border:1px solid #D6D3CC;border-radius:10px;padding:11px 13px;font-size:15px;background:#fff;color:#0E0D0C;font-family:inherit;outline:none}
.sub-field input:focus,.sub-field textarea:focus{border-color:#0E0D0C;box-shadow:0 0 0 3px rgba(14,13,12,.06)}
.sub-check-row{display:flex;gap:11px;align-items:flex-start;font-size:14px;color:#4a4540;line-height:1.5;background:#F3F2EF;border:1px solid #E8E6E1;border-radius:10px;padding:13px 15px}
.sub-check-row input{margin-top:2px;width:16px;height:16px;flex:none}
.sub-check-row em{color:#b3402e;font-style:normal;font-weight:600}
.sub-err{color:#b3402e;font-size:14px;margin:0}
.btn-p{background:#0E0D0C;color:#fff;border:none;border-radius:10px;padding:13px 22px;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;text-align:center}
.btn-p:disabled{opacity:.55;cursor:default}
.btn-g{background:transparent;color:#0E0D0C;border:1px solid #D6D3CC;border-radius:10px;padding:13px 22px;font-size:15px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block}
.sub-submit{margin-top:4px}
.sub-fine{font-size:12px;color:#9C9890;text-align:center;margin:2px 0 0}
.sub-closed,.sub-done{max-width:640px;margin:60px auto;padding:0 28px;text-align:center}
.sub-done .sub-check{width:52px;height:52px;border-radius:50%;background:#0E0D0C;color:#fff;font-size:26px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.sub-done h1{font-size:30px;margin:0 0 12px}
.sub-done p{color:#5C5954;line-height:1.6}
.sub-muted{color:#9C9890;font-size:14px}
.sub-actions{display:flex;gap:12px;justify-content:center;margin-top:22px}
`;
