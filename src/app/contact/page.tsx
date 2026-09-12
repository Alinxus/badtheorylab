'use client';

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import s from "./contact.module.css";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
const EMAIL = "hello@badtheorylabs.com";

// the reason only picks the subject line and the prompt in the box. it used to
// swap the whole field set, which was more machinery than a contact form earns.
const REASONS = [
  {
    id: "contract",
    label: "Contract the lab",
    hint: "What are you trying to change? What cannot move, in data, hardware or latency? And how would you know it had worked?",
  },
  { id: "research", label: "Research", hint: "Which paper or result, and what do you want to know?" },
  { id: "press", label: "Press", hint: "Your outlet, what you need, and by when." },
  { id: "other", label: "Something else", hint: "Investors, hiring, the Discord, anything else." },
];

export default function ContactPage() {
  return (
    <Suspense fallback={<Contact org="" />}>
      <WithParams />
    </Suspense>
  );
}

function WithParams() {
  const q = useSearchParams();
  return <Contact org={q.get("company")?.trim() ?? ""} />;
}

function Contact({ org }: { org: string }) {
  const [reason, setReason] = useState(REASONS[0]);
  const [form, setForm] = useState({ name: "", email: "", org, message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.org,
          subject: reason.label,
          message: form.message,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "That did not send. Email us directly instead.");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not send. Email us directly instead.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className={s.page}>
      <SiteNav />

      <header className={s.head}>
        <p className={s.eyebrow}>Contact</p>
        <h1 className={s.title}>Bring the problem.</h1>
        <p className={s.lede}>
          Tell us what you are trying to change and how you would know it had worked. We will tell
          you whether it is a product problem, an engineering problem or a research problem.
        </p>
      </header>

      <div className={s.body}>
        {sent ? (
          <section className={s.done}>
            <div className={s.doneMark} aria-hidden="true" />
            <h2 className={s.doneTitle}>Sent.</h2>
            <p className={s.doneBody}>
              It reached {EMAIL}, and the reply comes from the same address. If it is urgent, book a
              call instead.
            </p>
            <a className={s.primary} href={CAL_URL} target="_blank" rel="noreferrer">
              Book a call
            </a>
          </section>
        ) : (
          <form className={s.form} onSubmit={submit}>
            <fieldset className={s.reasons}>
              <legend className={s.legend}>Reason for writing</legend>
              {REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  className={s.chip}
                  data-on={r.id === reason.id ? "1" : "0"}
                  onClick={() => setReason(r)}
                >
                  {r.label}
                </button>
              ))}
            </fieldset>

            <div className={s.pair}>
              <Field label="Name" required value={form.name} onChange={set("name")} />
              <Field label="Email" type="email" required value={form.email} onChange={set("email")} />
            </div>

            <Field label="Organisation" value={form.org} onChange={set("org")} />

            <div className={s.field}>
              <label className={s.label} htmlFor="message">Message</label>
              <textarea
                id="message"
                className={s.textarea}
                rows={7}
                required
                placeholder={reason.hint}
                value={form.message}
                onChange={(e) => set("message")(e.target.value)}
              />
            </div>

            <div className={s.foot}>
              <button className={s.primary} type="submit" disabled={sending}>
                {sending ? "Sending" : "Send"}
              </button>
              <p className={s.status} data-kind={error ? "error" : "idle"}>
                {error || "Goes straight to the lab, not a queue."}
              </p>
            </div>
          </form>
        )}

        <aside className={s.aside}>
          <h2 className={s.asideTitle}>Rather talk it through?</h2>
          <p className={s.asideBody}>
            Thirty minutes with someone who would actually run the work. Often faster than writing
            the whole thing down.
          </p>
          <a className={s.callBtn} href={CAL_URL} target="_blank" rel="noreferrer">
            Book a call
          </a>

          <div className={s.links}>
            <a href={`mailto:${EMAIL}`}>
              <span>Email</span>
              <span>{EMAIL}</span>
            </a>
            <a href={DISCORD_URL} target="_blank" rel="noreferrer">
              <span>Discord</span>
              <span>discord.gg</span>
            </a>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  const id = `f-${label.toLowerCase()}`;
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={id}>
        {label}
        {required ? null : <span className={s.opt}>Optional</span>}
      </label>
      <input
        id={id}
        className={s.input}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
