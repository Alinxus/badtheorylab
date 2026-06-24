'use client';

import { FormEvent, useEffect, useRef, useState } from "react";

type Props = { open: boolean; onClose: () => void; discordUrl: string };

type Fields = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  github: string;
  experience: string;
  teamName: string;
  teamSize: string;
  idea: string;
  runtimePlan: string;
};

const blank: Fields = {
  firstName: "", lastName: "", email: "", country: "", github: "",
  experience: "First hackathon", teamName: "", teamSize: "1",
  idea: "", runtimePlan: "",
};

const emailLooksOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function RegisterModal({ open, onClose, discordUrl }: Props) {
  const [f, setF] = useState<Fields>(blank);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // esc-to-close + lock the body scroll while the sheet is up
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCloseRef.current(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  const set = (k: keyof Fields) => (e: { target: { value: string } }) =>
    setF(prev => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr("");

    if (!f.firstName.trim() || !f.lastName.trim()) {
      setErr("We need your first and last name.");
      return;
    }
    if (!emailLooksOk(f.email.trim())) {
      setErr("That email doesn't look right.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/hackathon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't register you right now.");
      setDone(true);
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : "Couldn't register you right now.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => { setF(blank); setDone(false); setErr(""); };

  return (
    <div className="rm-scrim" onClick={onClose}>
      <style>{modalCss}</style>
      <div className="rm-sheet" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <button className="rm-x" onClick={onClose} aria-label="Close">×</button>

        {done ? (
          <div className="rm-done">
            <div className="rm-check">✓</div>
            <h2 className="rm-done-title">You&apos;re in.</h2>
            <p className="rm-done-sub">
              A confirmation is on its way to <strong>{f.email}</strong>. We&apos;ll send your free
              BTL runtime API credits and the kickoff details before the event. Next step: join the
              Discord so you don&apos;t miss anything.
            </p>
            <div className="rm-done-actions">
              <a href={discordUrl} target="_blank" rel="noreferrer" className="rm-btn-solid">Join the Discord →</a>
              <button className="rm-btn-ghost" onClick={() => { reset(); onClose(); }}>Done</button>
            </div>
            <p className="rm-note">Didn&apos;t get the email in a few minutes? Check spam, or write hello@badtheorylabs.com.</p>
          </div>
        ) : (
          <>
            <div className="rm-head">
              <div className="rm-kicker">BTL Runtime Hackathon · Online · Global</div>
              <h2 className="rm-title">Register</h2>
              <p className="rm-lede">Free to enter. Takes about a minute. No payment, no catch.</p>
            </div>

            <form className="rm-form" onSubmit={submit}>
              <div className="rm-grid">
                <label className="rm-field">
                  <span>First name *</span>
                  <input ref={firstFieldRef} value={f.firstName} onChange={set("firstName")} autoComplete="given-name" />
                </label>
                <label className="rm-field">
                  <span>Last name *</span>
                  <input value={f.lastName} onChange={set("lastName")} autoComplete="family-name" />
                </label>
              </div>

              <label className="rm-field">
                <span>Email *</span>
                <input type="email" value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@example.com" />
              </label>

              <div className="rm-grid">
                <label className="rm-field">
                  <span>Country</span>
                  <input value={f.country} onChange={set("country")} placeholder="Where you're hacking from" />
                </label>
                <label className="rm-field">
                  <span>GitHub / portfolio</span>
                  <input value={f.github} onChange={set("github")} placeholder="github.com/you" />
                </label>
              </div>

              <div className="rm-grid">
                <label className="rm-field">
                  <span>Experience</span>
                  <select value={f.experience} onChange={set("experience")}>
                    <option>First hackathon</option>
                    <option>A few under my belt</option>
                    <option>Seasoned</option>
                  </select>
                </label>
              </div>

              <div className="rm-grid">
                <label className="rm-field">
                  <span>Team name</span>
                  <input value={f.teamName} onChange={set("teamName")} placeholder="Solo is fine — leave blank" />
                </label>
                <label className="rm-field">
                  <span>Team size</span>
                  <select value={f.teamSize} onChange={set("teamSize")}>
                    <option value="1">Just me</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </label>
              </div>

              <label className="rm-field">
                <span>What might you build? <em>(optional)</em></span>
                <textarea value={f.idea} onChange={set("idea")} rows={2} placeholder="A rough idea is plenty — you can change it later." />
              </label>

              <label className="rm-field">
                <span>How will you use the BTL runtime? <em>(optional)</em></span>
                <textarea value={f.runtimePlan} onChange={set("runtimePlan")} rows={2} placeholder="Chat, agents, RAG, embeddings…" />
              </label>

              {err && <div className="rm-err">{err}</div>}

              <button type="submit" className="rm-submit" disabled={sending}>
                {sending ? "Registering…" : "Lock in my spot →"}
              </button>
              <p className="rm-fine">
                By registering you agree to receive event emails from Bad Theory Labs. You keep full
                ownership of whatever you build.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const modalCss = `
.rm-scrim {
  position: fixed; inset: 0; z-index: 1000; display: flex; align-items: flex-start;
  justify-content: center; padding: 40px 16px; overflow-y: auto;
  background: rgba(14,13,12,.5); backdrop-filter: blur(6px);
  animation: rm-fade .18s ease;
}
@keyframes rm-fade { from { opacity: 0 } to { opacity: 1 } }
.rm-sheet {
  position: relative; width: 100%; max-width: 560px; background: var(--bg, #FAFAF9);
  border: 1px solid var(--border, #E8E6E1); border-radius: 16px; padding: 36px 36px 32px;
  box-shadow: 0 24px 80px rgba(14,13,12,.28); animation: rm-rise .22s cubic-bezier(.2,.7,.3,1);
  font-family: 'DM Sans', sans-serif;
}
@keyframes rm-rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: translateY(0) } }
.rm-x {
  position: absolute; top: 16px; right: 16px; width: 30px; height: 30px;
  border: 1px solid var(--border, #E8E6E1); border-radius: 8px; background: transparent;
  color: var(--body, #5C5954); font-size: 18px; line-height: 1; cursor: pointer; transition: all .15s;
}
.rm-x:hover { border-color: var(--ink, #0E0D0C); color: var(--ink, #0E0D0C); }
.rm-head { margin-bottom: 22px; }
.rm-kicker {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: .1em;
  text-transform: uppercase; color: var(--faint, #9C9890); margin-bottom: 10px;
}
.rm-title {
  font-family: 'EB Garamond', serif; font-size: 36px; font-weight: 500;
  letter-spacing: -.03em; color: var(--ink, #0E0D0C); line-height: 1;
}
.rm-lede { font-size: 14px; font-weight: 300; color: var(--body, #5C5954); margin-top: 8px; }
.rm-form { display: flex; flex-direction: column; gap: 14px; }
.rm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.rm-field { display: flex; flex-direction: column; gap: 6px; }
.rm-field > span {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: .08em;
  text-transform: uppercase; color: var(--faint, #9C9890);
}
.rm-field > span em { font-style: normal; text-transform: none; letter-spacing: 0; }
.rm-field input, .rm-field select, .rm-field textarea {
  font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--ink, #0E0D0C);
  background: var(--surface, #F3F2EF); border: 1px solid var(--border, #E8E6E1);
  border-radius: 9px; padding: 11px 13px; outline: none; transition: border-color .15s, background .15s;
  width: 100%; resize: vertical;
}
.rm-field input:focus, .rm-field select:focus, .rm-field textarea:focus {
  border-color: var(--ink, #0E0D0C); background: var(--bg, #FAFAF9);
}
.rm-err {
  font-size: 13px; color: #8a2b1c; background: #fdf1ee; border: 1px solid #f3d6cf;
  border-radius: 9px; padding: 10px 13px;
}
.rm-submit {
  margin-top: 4px; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 500;
  color: var(--bg, #FAFAF9); background: var(--ink, #0E0D0C); border: none; border-radius: 9px;
  padding: 14px 22px; cursor: pointer; transition: opacity .15s;
}
.rm-submit:hover:not(:disabled) { opacity: .86; }
.rm-submit:disabled { opacity: .5; cursor: progress; }
.rm-fine { font-size: 11.5px; font-weight: 300; color: var(--faint, #9C9890); line-height: 1.55; }

.rm-done { text-align: center; padding: 12px 4px; }
.rm-check {
  width: 56px; height: 56px; margin: 0 auto 20px; border-radius: 50%;
  background: #0E0D0C; color: #FAFAF9; font-size: 26px; display: flex; align-items: center; justify-content: center;
}
.rm-done-title { font-family: 'EB Garamond', serif; font-size: 38px; font-weight: 500; letter-spacing: -.03em; color: var(--ink, #0E0D0C); }
.rm-done-sub { font-size: 14px; font-weight: 300; line-height: 1.7; color: var(--body, #5C5954); margin: 12px auto 24px; max-width: 400px; }
.rm-done-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.rm-btn-solid {
  font-size: 14px; font-weight: 500; color: var(--bg, #FAFAF9); background: var(--ink, #0E0D0C);
  text-decoration: none; padding: 12px 22px; border-radius: 9px; transition: opacity .15s;
}
.rm-btn-solid:hover { opacity: .86; }
.rm-btn-ghost {
  font-size: 14px; color: var(--body, #5C5954); background: transparent;
  border: 1px solid var(--border, #E8E6E1); padding: 11px 22px; border-radius: 9px; cursor: pointer;
}
.rm-btn-ghost:hover { border-color: var(--ink, #0E0D0C); color: var(--ink, #0E0D0C); }
.rm-note { font-size: 11.5px; font-weight: 300; color: var(--faint, #9C9890); margin-top: 18px; }

@media (max-width: 560px) {
  .rm-sheet { padding: 28px 20px 24px; }
  .rm-grid { grid-template-columns: 1fr; }
  .rm-title { font-size: 30px; }
}
`;
