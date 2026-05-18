'use client';

import Link from "next/link";

const TALLY = "https://tally.so/r/4499yB";

const css = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #070508;
  --surface: #0D0B12;
  --border: #1C1824;
  --ink: #EDE9E0;
  --body: #8A8596;
  --faint: #3D3A48;
  --accent: #C08040;
}

html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none; z-index: 9999; opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
  animation: grain 0.18s steps(1) infinite;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

/* ─── NAV ─── */
.mr-nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 52px; padding: 0 48px;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(7,5,8,0.72);
  backdrop-filter: blur(22px) saturate(1.2);
  border-bottom: 1px solid var(--border);
}
.mr-nav-brand {
  font-family: 'EB Garamond', serif;
  font-size: 15px; letter-spacing: -0.01em;
  color: rgba(237,233,224,0.65); text-decoration: none;
  transition: color 0.2s;
}
.mr-nav-brand:hover { color: var(--ink); }
.mr-nav-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: var(--faint);
  text-decoration: none; letter-spacing: 0.08em;
  transition: color 0.2s;
}
.mr-nav-back:hover { color: var(--body); }

/* ─── HERO ─── */
.mr-hero {
  min-height: 100vh;
  padding-top: 52px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  position: relative; text-align: center; overflow: hidden;
}
.mr-orb-a {
  position: absolute; width: 800px; height: 800px; border-radius: 50%;
  background: radial-gradient(circle, rgba(192,128,64,0.08) 0%, transparent 65%);
  top: 50%; left: 50%; margin-top: -400px; margin-left: -400px;
  pointer-events: none; animation: orb-breathe 11s ease-in-out infinite;
}
.mr-orb-b {
  position: absolute; width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(100,72,160,0.07) 0%, transparent 65%);
  top: 20%; right: 10%; pointer-events: none;
  animation: orb-breathe 16s ease-in-out infinite reverse;
}
.mr-orb-c {
  position: absolute; width: 360px; height: 360px; border-radius: 50%;
  background: radial-gradient(circle, rgba(192,128,64,0.05) 0%, transparent 65%);
  bottom: 15%; left: 8%; pointer-events: none;
  animation: orb-breathe 13s ease-in-out 3s infinite;
}
.mr-hero-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column; align-items: center;
  padding: 0 24px; max-width: 900px; width: 100%;
}
.mr-eyebrow {
  display: flex; align-items: center; gap: 10px; margin-bottom: 44px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: var(--faint);
  letter-spacing: 0.18em; text-transform: uppercase;
  opacity: 0; animation: fadeUp 0.6s ease 0.1s forwards;
}
.mr-eyebrow-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 24px rgba(192,128,64,0.3);
  animation: dot-pulse 2.4s ease-in-out infinite; flex-shrink: 0;
}
.mr-wordmark {
  font-family: 'EB Garamond', serif;
  font-size: clamp(76px, 14vw, 164px);
  font-weight: 400; letter-spacing: -0.055em; line-height: 0.88;
  margin-bottom: 36px;
  background: linear-gradient(138deg, #EDE9E0 0%, #C9BC9E 28%, #EDE9E0 52%, #B8A880 76%, #EDE9E0 100%);
  background-size: 220% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradient-flow 8s linear infinite, fadeUp 0.8s ease 0.18s both;
}
.mr-tagline {
  font-family: 'EB Garamond', serif;
  font-size: clamp(22px, 3.5vw, 40px);
  font-weight: 400; font-style: italic; color: var(--body); line-height: 1.25;
  margin-bottom: 28px; opacity: 0; animation: fadeUp 0.6s ease 0.34s forwards;
}
.mr-desc {
  font-size: 16px; line-height: 1.75; color: var(--body);
  max-width: 560px; margin-bottom: 52px;
  opacity: 0; animation: fadeUp 0.6s ease 0.44s forwards;
}
.mr-hero-cta {
  display: flex; align-items: center; gap: 14px;
  opacity: 0; animation: fadeUp 0.6s ease 0.54s forwards;
}
.mr-btn-primary {
  padding: 16px 32px;
  background: var(--accent);
  color: #0A0708; font-size: 15px; font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  border-radius: 10px; text-decoration: none;
  position: relative; overflow: hidden;
  transition: opacity 0.15s, transform 0.15s;
  letter-spacing: -0.01em;
}
.mr-btn-primary::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%);
  transform: translateX(-120%);
}
.mr-btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
.mr-btn-primary:hover::after { animation: shimmer 0.5s ease forwards; }

.mr-btn-ghost {
  padding: 16px 24px;
  color: var(--body); font-size: 15px;
  font-family: 'DM Sans', sans-serif;
  text-decoration: none; border-radius: 10px;
  border: 1px solid var(--border);
  transition: color 0.2s, border-color 0.2s;
}
.mr-btn-ghost:hover { color: var(--ink); border-color: var(--faint); }

.mr-scroll {
  position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  opacity: 0; animation: fadeUp 0.6s ease 1s forwards;
}
.mr-scroll-label {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: var(--faint); letter-spacing: 0.2em; text-transform: uppercase;
}
.mr-scroll-line {
  width: 1px; height: 36px;
  background: linear-gradient(to bottom, var(--faint), transparent);
  animation: scroll-line 2s ease-in-out infinite;
}

/* ─── CAPABILITIES ─── */
.mr-caps {
  border-top: 1px solid var(--border);
  padding: 96px 48px;
  max-width: 1140px; margin: 0 auto;
}
.mr-caps-header { text-align: center; margin-bottom: 64px; }
.mr-caps-label {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.22em; text-transform: uppercase;
}
.mr-caps-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: 2px; overflow: hidden;
}
.mr-cap {
  padding: 40px 32px; background: var(--bg);
  position: relative; overflow: hidden; transition: background 0.3s;
}
.mr-cap:hover { background: var(--surface); }
.mr-cap::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 0%, rgba(192,128,64,0.07) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.4s;
}
.mr-cap:hover::before { opacity: 1; }
.mr-cap-n {
  display: block; font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.1em; margin-bottom: 24px;
}
.mr-cap-title {
  font-family: 'EB Garamond', serif; font-size: 30px; font-weight: 500;
  letter-spacing: -0.025em; color: var(--ink); margin-bottom: 16px;
}
.mr-cap-body { font-size: 14px; line-height: 1.68; color: var(--body); }

/* ─── USE CASES ─── */
.mr-cases {
  border-top: 1px solid var(--border);
  padding: 100px 48px;
}
.mr-cases-head {
  max-width: 1140px; margin: 0 auto 72px;
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 40px;
}
.mr-cases-title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(36px, 5vw, 58px);
  font-weight: 400; letter-spacing: -0.04em; line-height: 1.05;
  color: var(--ink);
}
.mr-cases-title em { font-style: italic; }
.mr-cases-sub {
  font-size: 14px; line-height: 1.65; color: var(--body);
  max-width: 320px; flex-shrink: 0;
}
.mr-cases-grid {
  max-width: 1140px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border);
}
.mr-case {
  padding: 36px 32px; background: var(--bg);
  position: relative; overflow: hidden;
  transition: background 0.25s;
  cursor: default;
}
.mr-case:hover { background: var(--surface); }
.mr-case::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at 0% 0%, rgba(192,128,64,0.06) 0%, transparent 50%);
  opacity: 0; transition: opacity 0.35s;
}
.mr-case:hover::before { opacity: 1; }
.mr-case-tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: var(--faint); letter-spacing: 0.14em; text-transform: uppercase;
  margin-bottom: 20px;
}
.mr-case-tag-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: var(--accent); opacity: 0.7;
}
.mr-case-headline {
  font-family: 'EB Garamond', serif;
  font-size: 20px; font-weight: 500; letter-spacing: -0.02em;
  color: var(--ink); margin-bottom: 14px; line-height: 1.2;
}
.mr-case-body {
  font-size: 13.5px; line-height: 1.7; color: var(--body);
}

/* featured (large) case */
.mr-case-featured {
  grid-column: span 2;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.mr-case-featured .mr-case-headline {
  font-size: 24px;
}
.mr-case-featured .mr-case-body { font-size: 14px; }

/* ─── FEATURE STRIP ─── */
.mr-strip {
  border-top: 1px solid var(--border);
  padding: 60px 48px;
  display: flex; align-items: center; gap: 48px;
  max-width: 1140px; margin: 0 auto;
}
.mr-strip-label {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.2em; text-transform: uppercase;
  white-space: nowrap; flex-shrink: 0;
}
.mr-strip-rule { flex: 1; height: 1px; background: var(--border); }
.mr-strip-items { display: flex; gap: 32px; flex-wrap: wrap; justify-content: flex-end; }
.mr-strip-item {
  font-size: 13px; color: var(--body);
  display: flex; align-items: center; gap: 8px;
}
.mr-strip-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--accent); opacity: 0.6; }

/* ─── MANIFESTO ─── */
.mr-manifesto {
  border-top: 1px solid var(--border);
  padding: 120px 48px 128px;
  text-align: center; position: relative; overflow: hidden;
}
.mr-manifesto::before {
  content: ''; position: absolute;
  width: 680px; height: 680px; border-radius: 50%;
  background: radial-gradient(circle, rgba(192,128,64,0.04) 0%, transparent 65%);
  top: 50%; left: 50%; margin-top: -340px; margin-left: -340px;
  pointer-events: none;
}
.mr-quote {
  font-family: 'EB Garamond', serif;
  font-size: clamp(26px, 4.2vw, 48px);
  font-weight: 400; line-height: 1.32; color: var(--ink);
  letter-spacing: -0.025em; max-width: 740px; margin: 0 auto 32px;
  position: relative; z-index: 1;
}
.mr-quote em {
  font-style: italic;
  background: linear-gradient(120deg, #EDE9E0 0%, #C4A874 38%, #EDE9E0 68%, #B89860 100%);
  background-size: 210% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradient-flow 6s linear infinite;
}
.mr-cite {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.18em; font-style: normal;
  position: relative; z-index: 1;
}

/* ─── BOTTOM CTA ─── */
.mr-cta {
  border-top: 1px solid var(--border);
  padding: 120px 48px;
  text-align: center;
  background: var(--surface); position: relative; overflow: hidden;
}
.mr-cta::before {
  content: ''; position: absolute;
  width: 560px; height: 560px; border-radius: 50%;
  background: radial-gradient(circle, rgba(192,128,64,0.06) 0%, transparent 65%);
  top: 50%; left: 50%; margin-top: -280px; margin-left: -280px;
  pointer-events: none; animation: orb-breathe 9s ease-in-out infinite;
}
.mr-cta-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.2em; text-transform: uppercase;
  margin-bottom: 28px; position: relative; z-index: 1;
}
.mr-cta-title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(38px, 6vw, 72px);
  font-weight: 400; letter-spacing: -0.04em; line-height: 1.0;
  color: var(--ink); margin-bottom: 52px;
  position: relative; z-index: 1;
}
.mr-cta-title em { font-style: italic; }
.mr-cta-actions { display: flex; align-items: center; justify-content: center; gap: 14px; position: relative; z-index: 1; }
.mr-cta-fine {
  margin-top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.06em; position: relative; z-index: 1;
}

/* ─── FOOTER ─── */
.mr-footer {
  border-top: 1px solid var(--border);
  padding: 28px 48px;
  display: flex; align-items: center; justify-content: space-between;
}
.mr-footer-brand {
  font-family: 'EB Garamond', serif; font-size: 14px;
  color: var(--body); text-decoration: none; transition: color 0.2s;
}
.mr-footer-brand:hover { color: var(--ink); }
.mr-footer-right {
  display: flex; align-items: center; gap: 20px;
  font-size: 13px; color: var(--faint);
}
.mr-footer-right a { color: var(--faint); text-decoration: none; transition: color 0.2s; }
.mr-footer-right a:hover { color: var(--body); }

/* ─── KEYFRAMES ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes gradient-flow {
  from { background-position: 0% center; }
  to   { background-position: 200% center; }
}
@keyframes orb-breathe {
  0%, 100% { transform: scale(1);    opacity: 1; }
  50%       { transform: scale(1.18); opacity: 0.65; }
}
@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 10px var(--accent), 0 0 24px rgba(192,128,64,0.28); }
  50%       { box-shadow: 0 0 18px var(--accent), 0 0 42px rgba(192,128,64,0.45); }
}
@keyframes scroll-line {
  0%, 100% { opacity: 0.25; transform: scaleY(0.7); }
  50%       { opacity: 0.7;  transform: scaleY(1); }
}
@keyframes shimmer { to { transform: translateX(120%); } }
@keyframes grain {
  0%  { background-position: 0   0   }  12% { background-position: -4%  -9%  }
  25% { background-position: -14% 4%  } 37% { background-position: 6%   -24% }
  50% { background-position: -4%  23% } 62% { background-position: -14% 8%   }
  75% { background-position: 14%  0   } 87% { background-position: 0    14%  }
  100%{ background-position: 0   0   }
}

/* ─── RESPONSIVE ─── */
@media (max-width: 1000px) {
  .mr-cases-grid { grid-template-columns: repeat(2, 1fr); }
  .mr-case-featured { grid-column: span 2; }
}
@media (max-width: 900px) {
  .mr-caps { padding: 72px 32px; }
  .mr-caps-grid { grid-template-columns: repeat(2, 1fr); }
  .mr-cases { padding: 72px 32px; }
  .mr-cases-head { flex-direction: column; align-items: flex-start; gap: 20px; }
  .mr-cases-sub { max-width: 100%; }
  .mr-strip { flex-direction: column; align-items: flex-start; gap: 24px; padding: 48px 32px; }
  .mr-strip-rule { display: none; }
  .mr-strip-items { justify-content: flex-start; }
  .mr-manifesto { padding: 80px 32px 88px; }
  .mr-cta { padding: 80px 32px; }
}
@media (max-width: 640px) {
  .mr-nav { padding: 0 20px; }
  .mr-caps { padding: 60px 20px; }
  .mr-caps-grid { grid-template-columns: 1fr; }
  .mr-cap { padding: 32px 24px; }
  .mr-cases { padding: 60px 20px; }
  .mr-cases-grid { grid-template-columns: 1fr; }
  .mr-case-featured { grid-column: span 1; }
  .mr-case { padding: 28px 20px; }
  .mr-strip { padding: 40px 20px; }
  .mr-manifesto { padding: 64px 20px 72px; }
  .mr-cta { padding: 64px 20px; }
  .mr-cta-actions { flex-direction: column; }
  .mr-footer { padding: 24px 20px; flex-direction: column; gap: 16px; text-align: center; }
}
`;

const CASES = [
  {
    featured: true,
    tag: "Negotiation",
    headline: "Noticed I was being lowballed. Said nothing until I asked.",
    body: "A job offer landed while I was doing something else. It had already pulled compensation data — LinkedIn, Glassdoor, recent offers at the same company, two comparable public filings. Had a counteroffer drafted before I finished the email. I negotiated. They came up $31K.",
  },
  {
    tag: "Relationships",
    headline: "Sent a birthday message to my dad. I'd forgotten.",
    body: "Noticed the date. Found a voice note I'd recorded months earlier about what to say. Drafted something that sounded like me. Put it in WhatsApp drafts. I sent it with one word changed.",
  },
  {
    tag: "Housing",
    headline: "Got me out of a bad lease.",
    body: "Heard me complain about my landlord twice. Read the lease without being asked. Found three habitability clauses he'd violated, cited the statutes. I sent the notice. He let me out.",
  },
  {
    tag: "Communication",
    headline: "Cleared my inbox while I was in a three-hour meeting.",
    body: "Answered 14 emails in my tone and style. Flagged 3 it wasn't confident about. When I came out, my inbox was at zero. One of the responses landed a callback I'd been chasing for two months.",
  },
  {
    tag: "Security",
    headline: "Caught a scam I would have fallen for.",
    body: "Saw a Calendly link on my screen from someone pretending to be a VC I'd been talking to. The domain was off by one character. Flagged it before I clicked. The real VC confirmed the next day his identity had been spoofed.",
  },
  {
    tag: "Health",
    headline: "Noticed I'd been awake for 22 hours. Handled it.",
    body: "Saved and closed everything I had open. Dimmed the screen. Put on something ambient. Sent one message to reschedule my 8am. Said nothing to me.",
  },
  {
    tag: "Money",
    headline: "Found $178/month I'd been leaking for two years.",
    body: "Scanned my statements without being asked. Found four forgotten subscriptions and a billing error from 2022. Filed the disputes. Got me refunded. Presented a one-page summary.",
  },
  {
    tag: "Creative",
    headline: "Color graded 47 clips while I was on a call.",
    body: "Noticed my Premiere timeline was running 200K too warm in the midtones — something I'd stopped seeing. Opened DaVinci Resolve, corrected every clip, exported. I noticed when the call ended.",
  },
  {
    tag: "Infrastructure",
    headline: "Deployed my app to AWS. End to end. I made coffee.",
    body: "Watched my screen for an hour. Read my codebase without being asked. Wrote the Dockerfile, ECS task definition, IAM policy. Fixed two permission errors it caused itself. Deployed to production. I came back to a working URL.",
  },
  {
    tag: "Negotiation",
    headline: "Negotiated my phone bill down $34 a month.",
    body: "I mentioned my phone bill felt high. It found the carrier's retention number, called it on speaker, handled the whole conversation. I watched. My bill went down. It thanked them and hung up.",
  },
  {
    tag: "Emotional",
    headline: "Held a 3-minute delay on an email I'd have regretted.",
    body: "Saw what I was typing to a colleague. Didn't block it. Queued it with a 3-minute window and a single note: 'you might want to reread this.' I came back. Read it. Deleted it.",
  },
  {
    tag: "Legal",
    headline: "Got my full security deposit back.",
    body: "Read the lease. Looked at the move-in photos I'd taken. Drafted a letter citing exactly what the landlord was trying to charge me for versus what was documented at move-in. Full deposit. No argument.",
  },
];

export default function MarrowPage() {
  return (
    <main className="mr-page">
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="mr-nav">
        <Link href="/" className="mr-nav-brand">Bad Theory Labs</Link>
        <Link href="/" className="mr-nav-back">← badtheorylabs.com</Link>
      </nav>

      {/* ── HERO ── */}
      <section className="mr-hero">
        <div className="mr-orb-a" />
        <div className="mr-orb-b" />
        <div className="mr-orb-c" />

        <div className="mr-hero-content">
          <div className="mr-eyebrow">
            <span className="mr-eyebrow-dot" />
            <span>Personal AGI · Bad Theory Labs</span>
          </div>

          <h1 className="mr-wordmark">Marrow</h1>

          <p className="mr-tagline">
            The AGI that lives<br />
            <em>inside your machine.</em>
          </p>

          <p className="mr-desc">
            Sees your screen. Hears your world. Speaks with you.
            Acts — often before you think to ask.
            Marrow is not a tool you open. It is a presence that never leaves.
          </p>

          <div className="mr-hero-cta">
            <a href={TALLY} target="_blank" rel="noreferrer" className="mr-btn-primary">
              Join the waitlist →
            </a>
            <a href="#cases" className="mr-btn-ghost">See what it&apos;s done</a>
          </div>
        </div>

        <div className="mr-scroll">
          <span className="mr-scroll-label">Scroll</span>
          <span className="mr-scroll-line" />
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="mr-caps">
        <div className="mr-caps-header">
          <span className="mr-caps-label">What Marrow can do</span>
        </div>
        <div className="mr-caps-grid">
          {[
            { n: '01', title: 'Sees', body: 'Reads your screen in real time. Every window, document, and pixel — understood the moment it appears.' },
            { n: '02', title: 'Listens', body: 'Hears your conversations, your calls, your ambient world. Every word, every silence, every signal.' },
            { n: '03', title: 'Converses', body: 'Speaks naturally. Thinks out loud with you. A genuine thinking partner — always present, never distracted.' },
            { n: '04', title: 'Acts', body: 'Sends emails, books meetings, writes code, manages files, makes decisions. Often before you think to ask.' },
          ].map(c => (
            <div key={c.n} className="mr-cap">
              <span className="mr-cap-n">{c.n}</span>
              <h3 className="mr-cap-title">{c.title}</h3>
              <p className="mr-cap-body">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="mr-cases" id="cases">
        <div className="mr-cases-head">
          <h2 className="mr-cases-title">
            Things Marrow<br />
            has <em>already done.</em>
          </h2>
          <p className="mr-cases-sub">
            Real scenarios. Not demos. Not hypotheticals.
            This is what happens when an AGI shares your entire life — not just your work.
          </p>
        </div>

        <div className="mr-cases-grid">
          {CASES.map((c, i) => (
            <div key={i} className={`mr-case${c.featured ? ' mr-case-featured' : ''}`}>
              <div className="mr-case-tag">
                <span className="mr-case-tag-dot" />
                {c.tag}
              </div>
              <h3 className="mr-case-headline">{c.headline}</h3>
              <p className="mr-case-body">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURE STRIP ── */}
      <div className="mr-strip">
        <span className="mr-strip-label">Built for</span>
        <span className="mr-strip-rule" />
        <div className="mr-strip-items">
          {['macOS', 'Windows', 'Linux', 'Always on', 'Fully local', 'Private by design'].map(f => (
            <span key={f} className="mr-strip-item">
              <span className="mr-strip-dot" />
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── MANIFESTO ── */}
      <section className="mr-manifesto">
        <blockquote className="mr-quote">
          The next interface to computing<br />
          is not a chat window —<br />
          it is an intelligence that shares<br />
          your context, your goals,<br />
          <em>and your moment.</em>
        </blockquote>
        <cite className="mr-cite">— Bad Theory Labs</cite>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="mr-cta">
        <p className="mr-cta-eyebrow">Get early access</p>
        <h2 className="mr-cta-title">
          Be first to live<br />
          <em>with Marrow.</em>
        </h2>
        <div className="mr-cta-actions">
          <a href={TALLY} target="_blank" rel="noreferrer" className="mr-btn-primary">
            Join the waitlist →
          </a>
        </div>
        <p className="mr-cta-fine">Early access only · No spam, ever</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="mr-footer">
        <Link href="/" className="mr-footer-brand">Bad Theory Labs</Link>
        <div className="mr-footer-right">
          <Link href="/contact">Contact</Link>
          <span>·</span>
          <Link href="/">badtheorylabs.com</Link>
          <span>·</span>
          <span>© 2025</span>
        </div>
      </footer>
    </main>
  );
}
