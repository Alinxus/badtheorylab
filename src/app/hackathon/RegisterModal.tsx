"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  discordUrl: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  github: string;
  experience: string;
  teamName: string;
  teamSize: string;
  projectIdea: string;
};

type ApiResult = {
  ok?: boolean;
  already?: boolean;
  error?: string;
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  country: "",
  github: "",
  experience: "First hackathon",
  teamName: "",
  teamSize: "1",
  projectIdea: "",
};

const experienceOptions = ["First hackathon", "A few under my belt", "Seasoned"] as const;
const teamSizeOptions = [
  ["1", "Just me"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
] as const;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RegisterModal({ open, onClose, discordUrl }: Props) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [message, setMessage] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const onCloseRef = useRef(onClose);
  const statusRef = useRef(status);

  const fullName = useMemo(
    () => [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(" "),
    [form.firstName, form.lastName],
  );

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && statusRef.current !== "submitting") {
        setStatus("idle");
        setMessage("");
        onCloseRef.current();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => firstInputRef.current?.focus(), 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!open) return null;

  const updateField =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(current => ({ ...current, [field]: event.target.value }));
      if (message) setMessage("");
    };

  const close = () => {
    if (status === "submitting") return;
    setStatus("idle");
    setMessage("");
    onClose();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
      country: form.country.trim(),
      github: form.github.trim(),
      teamName: form.teamName.trim(),
      projectIdea: form.projectIdea.trim(),
    };

    if (!payload.firstName || !payload.lastName) {
      setMessage("Please add your first and last name.");
      firstInputRef.current?.focus();
      return;
    }

    if (!isEmail(payload.email)) {
      setMessage("Please use a valid email address.");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/hackathon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as ApiResult;

      if (!response.ok || result.error) {
        throw new Error(result.error || "Registration failed. Please try again.");
      }

      setForm(payload);
      setMessage(result.already ? "You were already registered with this email." : "");
      setStatus("success");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed. Please try again.");
      setStatus("idle");
    }
  };

  const registerAnother = () => {
    setForm(emptyForm);
    setMessage("");
    setStatus("idle");
    window.setTimeout(() => firstInputRef.current?.focus(), 0);
  };

  return (
    <div className="rm-scrim" onMouseDown={close}>
      <style>{modalCss}</style>
      <section
        className="rm-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="register-title"
        onMouseDown={event => event.stopPropagation()}
      >
        <button
          className="rm-x"
          type="button"
          onClick={close}
          aria-label="Close registration form"
        >
          ×
        </button>

        {status === "success" ? (
          <div className="rm-done">
            <div className="rm-check" aria-hidden="true">
              ✓
            </div>
            <p className="rm-kicker">Registration received</p>
            <h2 className="rm-done-title">You&apos;re in{fullName ? `, ${form.firstName.trim()}` : ""}.</h2>
            <p className="rm-done-sub">
              {message ? `${message} ` : ""}
              We&apos;ll send kickoff details and free BTL runtime credits to{" "}
              <strong>{form.email}</strong>. Join Discord next so you catch the stream, team
              formation, and support channels.
            </p>
            <div className="rm-done-actions">
              <a href={discordUrl} target="_blank" rel="noreferrer" className="rm-btn-solid">
                Join the Discord →
              </a>
              <button className="rm-btn-ghost" type="button" onClick={close}>
                Done
              </button>
            </div>
            <button className="rm-text-btn" type="button" onClick={registerAnother}>
              Register another teammate
            </button>
          </div>
        ) : (
          <>
            <div className="rm-head">
              <p className="rm-kicker">BTL Runtime Hackathon · Online · Global</p>
              <h2 className="rm-title" id="register-title">
                Register
              </h2>
              <p className="rm-lede">Free to enter. No payment, no catch. Tell us who is building.</p>
            </div>

            <form className="rm-form" onSubmit={submit} noValidate>
              <div className="rm-grid">
                <label className="rm-field">
                  <span>First name *</span>
                  <input
                    ref={firstInputRef}
                    value={form.firstName}
                    onChange={updateField("firstName")}
                    autoComplete="given-name"
                    required
                  />
                </label>
                <label className="rm-field">
                  <span>Last name *</span>
                  <input
                    value={form.lastName}
                    onChange={updateField("lastName")}
                    autoComplete="family-name"
                    required
                  />
                </label>
              </div>

              <label className="rm-field">
                <span>Email *</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <div className="rm-grid">
                <label className="rm-field">
                  <span>Country</span>
                  <input
                    value={form.country}
                    onChange={updateField("country")}
                    autoComplete="country-name"
                    placeholder="Where you are hacking from"
                  />
                </label>
                <label className="rm-field">
                  <span>GitHub / portfolio</span>
                  <input
                    value={form.github}
                    onChange={updateField("github")}
                    inputMode="url"
                    placeholder="github.com/you"
                  />
                </label>
              </div>

              <div className="rm-grid">
                <label className="rm-field">
                  <span>Experience</span>
                  <select value={form.experience} onChange={updateField("experience")}>
                    {experienceOptions.map(option => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label className="rm-field">
                  <span>Team size</span>
                  <select value={form.teamSize} onChange={updateField("teamSize")}>
                    {teamSizeOptions.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="rm-field">
                <span>Team name</span>
                <input
                  value={form.teamName}
                  onChange={updateField("teamName")}
                  placeholder="Optional; solo is fine"
                />
              </label>

              <label className="rm-field">
                <span>
                  What might you build? <em>Optional</em>
                </span>
                <textarea
                  value={form.projectIdea}
                  onChange={updateField("projectIdea")}
                  rows={3}
                  placeholder="A rough idea is enough. You can change it later."
                />
              </label>

              {message && (
                <div className="rm-err" role="alert">
                  {message}
                </div>
              )}

              <button type="submit" className="rm-submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Registering..." : "Lock in my spot →"}
              </button>
              <p className="rm-fine">
                By registering you agree to receive event emails from Bad Theory Labs. You keep full
                ownership of whatever you build.
              </p>
            </form>
          </>
        )}
      </section>
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
  font-family: 'DM Sans', sans-serif;
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
.rm-field textarea { line-height: 1.55; min-height: 84px; }
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
.rm-done-title {
  font-family: 'EB Garamond', serif; font-size: 38px; font-weight: 500;
  letter-spacing: -.03em; color: var(--ink, #0E0D0C); line-height: 1.05;
}
.rm-done-sub {
  font-size: 14px; font-weight: 300; line-height: 1.7; color: var(--body, #5C5954);
  margin: 12px auto 24px; max-width: 420px;
}
.rm-done-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.rm-btn-solid {
  font-size: 14px; font-weight: 500; color: var(--bg, #FAFAF9); background: var(--ink, #0E0D0C);
  text-decoration: none; padding: 12px 22px; border-radius: 9px; transition: opacity .15s;
}
.rm-btn-solid:hover { opacity: .86; }
.rm-btn-ghost {
  font-size: 14px; color: var(--body, #5C5954); background: transparent;
  border: 1px solid var(--border, #E8E6E1); padding: 11px 22px; border-radius: 9px; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}
.rm-btn-ghost:hover { border-color: var(--ink, #0E0D0C); color: var(--ink, #0E0D0C); }
.rm-text-btn {
  margin-top: 18px; border: none; background: transparent; color: var(--faint, #9C9890);
  cursor: pointer; font-size: 12px; font-family: 'DM Sans', sans-serif; text-decoration: underline;
  text-underline-offset: 3px;
}
.rm-text-btn:hover { color: var(--ink, #0E0D0C); }
@media (max-width: 560px) {
  .rm-scrim { padding: 24px 12px; }
  .rm-sheet { padding: 28px 20px 24px; border-radius: 12px; }
  .rm-grid { grid-template-columns: 1fr; }
  .rm-title { font-size: 30px; }
}
`;
