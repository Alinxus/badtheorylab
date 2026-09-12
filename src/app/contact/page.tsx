'use client';

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import s from "./contact.module.css";
import { INTENTS, Intent, composeMessage, findIntent } from "./intents";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
const EMAIL = "hello@badtheorylabs.com";

type Answers = Record<string, string>;

export default function ContactPage() {
  return (
    <Suspense fallback={<Contact prefill={{}} />}>
      <WithParams />
    </Suspense>
  );
}

function WithParams() {
  const q = useSearchParams();
  const prefill = useMemo(
    () => ({
      intent: q.get("intent") ?? undefined,
      company: q.get("company")?.trim() || undefined,
      message: q.get("message")?.trim() || undefined,
    }),
    [q]
  );
  return <Contact prefill={prefill} />;
}

type Prefill = { intent?: string; company?: string; message?: string };

function Contact({ prefill }: { prefill: Prefill }) {
  const [intent, setIntent] = useState<Intent>(() => findIntent(prefill.intent));
  const [who, setWho] = useState(() => ({
    name: "",
    email: "",
    org: prefill.company ?? "",
  }));
  const [answers, setAnswers] = useState<Answers>(() =>
    prefill.message ? { [findIntent(prefill.intent).fields[0].key]: prefill.message } : {}
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const named = intent.bar ? intent.bar.filter((k) => (answers[k] ?? "").trim().length > 0) : [];

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: who.name,
          email: who.email,
          company: who.org,
          subject: intent.label,
          message: composeMessage(intent, answers),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "That did not send. Try again, or email us directly.");

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "That did not send. Try again, or email us directly.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setWho({ name: "", email: "", org: "" });
    setSent(false);
    setError("");
  };

  const pick = (next: Intent) => {
    setIntent(next);
    setAnswers({});
    setError("");
  };

  return (
    <main className={s.page}>
      <SiteNav />

      <header className={s.head}>
        <p className={s.eyebrow}>Contact</p>
        <h1 className={s.title}>Bring the problem.</h1>
        <p className={s.lede}>
          Pick the line that fits. The questions change with it, because a government
          contracting a research programme and a reporter checking a number do not
          need the same blank box.
        </p>
      </header>

      <div className={s.body}>
        <aside className={s.aside}>
          <p className={s.asideHead}>Reason for writing</p>
          <div className={s.switch} role="tablist" aria-label="Reason for writing">
            {INTENTS.map((it) => (
              <button
                key={it.id}
                type="button"
                role="tab"
                aria-selected={it.id === intent.id}
                data-on={it.id === intent.id ? "1" : "0"}
                className={s.switchRow}
                onClick={() => pick(it)}
              >
                <span className={s.switchLabel}>
                  <span className={s.switchMark} aria-hidden />
                  {it.label}
                </span>
                <span className={s.switchNote}>{it.note}</span>
              </button>
            ))}
          </div>

          <div className={s.direct}>
            <p className={s.directHead}>Or go direct</p>
            <a className={s.directRow} href={`mailto:${EMAIL}`}>
              <span>Email</span>
              <span>{EMAIL}</span>
            </a>
            <a className={s.directRow} href={CAL_URL} target="_blank" rel="noreferrer">
              <span>Book a call</span>
              <span>cal.com/alameenpd</span>
            </a>
            <a className={s.directRow} href={DISCORD_URL} target="_blank" rel="noreferrer">
              <span>Discord</span>
              <span>discord.gg</span>
            </a>
          </div>
        </aside>

        <div className={s.main}>
        {sent ? (
          <section className={s.done}>
            <div className={s.doneMark} aria-hidden />
            <h2 className={s.doneTitle}>Sent.</h2>
            <p className={s.doneBody}>
              It went to {EMAIL}, and the reply comes from the same address. If it is
              urgent, the call link on the left is faster than we are.
            </p>
            <button type="button" className={s.again} onClick={reset}>
              Write another
            </button>
          </section>
        ) : (
          <form className={s.form} onSubmit={submit}>
            {intent.lead ? <p className={s.formNote}>{intent.lead}</p> : null}

            <div className={s.fields}>
              <div className={s.pair}>
                <Line
                  label="Name"
                  required
                  value={who.name}
                  onChange={(v) => setWho((p) => ({ ...p, name: v }))}
                />
                <Line
                  label="Email"
                  type="email"
                  required
                  value={who.email}
                  onChange={(v) => setWho((p) => ({ ...p, email: v }))}
                />
              </div>

              <Line
                label="Organisation"
                value={who.org}
                onChange={(v) => setWho((p) => ({ ...p, org: v }))}
              />

              {intent.fields.map((f) => (
                <div className={s.field} key={f.key}>
                  <label className={s.flabel} htmlFor={`f-${f.key}`}>
                    {f.label}
                    {f.required ? null : <span className={s.opt}>Optional</span>}
                  </label>
                  {f.hint ? <p className={s.fhint}>{f.hint}</p> : null}
                  {f.lines && f.lines > 1 ? (
                    <textarea
                      id={`f-${f.key}`}
                      className={s.textarea}
                      rows={f.lines}
                      required={f.required}
                      value={answers[f.key] ?? ""}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                    />
                  ) : (
                    <input
                      id={`f-${f.key}`}
                      className={s.input}
                      required={f.required}
                      value={answers[f.key] ?? ""}
                      onChange={(e) =>
                        setAnswers((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                    />
                  )}
                </div>
              ))}
            </div>

            {intent.bar ? (
              <div className={s.ledger}>
                <div className={s.ticks} aria-hidden>
                  {intent.bar.map((k) => (
                    <span
                      key={k}
                      className={s.tick}
                      data-on={(answers[k] ?? "").trim() ? "1" : "0"}
                    />
                  ))}
                </div>
                <p className={s.ledgerText}>
                  {named.length} of {intent.bar.length} named
                  {named.length === intent.bar.length ? " · that is a brief" : ""}
                </p>
              </div>
            ) : null}

            <div className={s.foot}>
              <button className={s.submit} type="submit" disabled={sending}>
                {sending ? "Sending" : "Send"}
              </button>
              {error ? (
                <p className={s.status} data-kind="error">{error}</p>
              ) : (
                <p className={s.status}>Goes straight to the lab, not a queue.</p>
              )}
            </div>
          </form>
        )}
        </div>

        <aside className={s.rail}>
          <p className={s.railHead}>After you send</p>
          <ol className={s.steps}>
            {intent.after.map((a, i) => (
              <li key={a.step} className={s.step}>
                <span className={s.stepNo}>{String(i + 1).padStart(2, "0")}</span>
                <span className={s.stepLabel}>{a.step}</span>
                <span className={s.stepBody}>{a.body}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </main>
  );
}

function Line({
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
  const id = `w-${label.toLowerCase()}`;
  return (
    <div className={s.field}>
      <label className={s.flabel} htmlFor={id}>
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
