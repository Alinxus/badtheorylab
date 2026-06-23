'use client';

import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const CAL_URL = "https://cal.com/alameenpd/quick-chat";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
};

type SearchParamsLike = {
  get(name: string): string | null;
} | null;

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  subject: "General inquiry",
  message: "",
};

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageShell searchParams={null} />}>
      <ContactPageWithSearchParams />
    </Suspense>
  );
}

function ContactPageWithSearchParams() {
  const searchParams = useSearchParams();
  return <ContactPageShell searchParams={searchParams} />;
}

function ContactPageShell({ searchParams }: { searchParams: SearchParamsLike }) {
  const didPrefill = useRef(false);
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (didPrefill.current) {
      return;
    }

    const subject = searchParams?.get("subject")?.trim();
    const body = searchParams?.get("message")?.trim();
    const company = searchParams?.get("company")?.trim();

    if (!subject && !body && !company) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      company: company || prev.company,
      subject: subject || prev.subject,
      message: body || prev.message,
    }));
    didPrefill.current = true;
  }, [searchParams]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Unable to send message right now.");
      }

      setStatus("success");
      setMessage("Thanks — your message was sent. We will reply soon.");
      setForm(initialState);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send message right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      <style>{styles}</style>

      <nav className="top-nav">
        <Link href="/" className="brand">Bad Theory Labs</Link>
        <div className="nav-links">
          <Link href="/#research">Research</Link>
          <Link href="/#products">Products</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/brief">Brief</Link>
          <Link href="/whitepaper">Whitepaper</Link>
          <Link href="/stats">Stats</Link>
          <Link href="/contact" aria-current="page">Contact</Link>
        </div>
        <div className="nav-cta">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Join community</a>
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule call</a>
        </div>
      </nav>

      <section className="hero">
        <div>
          <p className="eyebrow">Contact</p>
          <h1>Talk to Bad Theory Labs.</h1>
          <p>
            Investors, partners, builders, researchers, and community members can reach out directly here.
            You can also schedule a call or join our Discord community.
          </p>
          <div className="quick-actions">
            <a href={CAL_URL} target="_blank" rel="noreferrer" className="solid">Schedule investor call</a>
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="ghost">Join Discord community</a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="form-card">
          <div className="row">
            <label>
              Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </label>
          </div>

          <div className="row">
            <label>
              Company / Handle
              <input
                value={form.company}
                onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
              />
            </label>
            <label>
              Subject
              <input
                value={form.subject}
                onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
              />
            </label>
          </div>

          <label>
            Message
            <textarea
              required
              rows={7}
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            />
          </label>

          <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send message"}</button>
          <p className={`status ${status}`}>{message}</p>
          <p className="meta">Direct email: <a href="mailto:hello@badtheorylabs.com">hello@badtheorylabs.com</a></p>
        </form>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890; }
.contact-page { min-height:100vh; background:var(--bg); color:var(--ink); }
.top-nav { position:sticky; top:0; z-index:20; height:58px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.brand { font-family:var(--font-d); font-size:22px; color:var(--ink); text-decoration:none; }
.nav-links, .nav-cta { display:flex; gap:16px; align-items:center; }
.nav-links a, .nav-cta a { text-decoration:none; color:var(--body); font-family:var(--font-s); font-size:13px; }
.nav-cta .solid { background:var(--ink); color:var(--bg); padding:8px 14px; border-radius:8px; }
.hero { max-width:1120px; margin:0 auto; padding:70px 28px; display:grid; gap:28px; grid-template-columns:1fr 1.2fr; }
.eyebrow { font-family:var(--font-m); text-transform:uppercase; letter-spacing:.12em; color:var(--faint); font-size:11px; margin-bottom:10px; }
h1 { font-family:var(--font-d); font-size:clamp(40px,6vw,66px); letter-spacing:-.03em; line-height:1.02; margin-bottom:10px; }
.hero p { color:var(--body); line-height:1.75; }
.quick-actions { margin-top:18px; display:flex; gap:10px; }
.quick-actions a { text-decoration:none; font-size:14px; padding:11px 14px; border-radius:8px; }
.quick-actions .solid { background:var(--ink); color:var(--bg); }
.quick-actions .ghost { border:1px solid var(--border); color:var(--body); }
.form-card { border:1px solid var(--border); background:var(--surface); border-radius:16px; padding:18px; display:flex; flex-direction:column; gap:12px; }
.row { display:grid; gap:10px; grid-template-columns:1fr 1fr; }
label { display:flex; flex-direction:column; gap:6px; font-family:var(--font-m); font-size:11px; text-transform:uppercase; letter-spacing:.08em; color:var(--faint); }
input, textarea { border:1px solid var(--border); background:var(--bg); border-radius:10px; padding:10px 12px; color:var(--ink); font-family:var(--font-s); font-size:14px; text-transform:none; letter-spacing:normal; }
textarea { resize:vertical; }
button { border:none; border-radius:10px; background:var(--ink); color:var(--bg); padding:11px 14px; font-size:14px; cursor:pointer; }
button:disabled { opacity:.7; cursor:wait; }
.status { min-height:20px; font-size:13px; }
.status.success { color:#146a41; }
.status.error { color:#8f2020; }
.meta { font-size:13px; color:var(--faint); }
.meta a { color:var(--body); }
@media (max-width: 980px) {
  .nav-links { display:none; }
  .top-nav { padding:0 16px; }
  .hero { grid-template-columns:1fr; padding:40px 16px 60px; }
  .row { grid-template-columns:1fr; }
}
`;
