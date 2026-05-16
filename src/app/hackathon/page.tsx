'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

const DISCORD_URL  = "https://discord.gg/eEKNE5M8W";
const FORM_URL     = "https://forms.gle/LHURH73mqa8nXTx49";
const HACKATHON_DATE = new Date("2025-07-18T08:00:00Z");

function calcRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000)  / 60000),
    secs:  Math.floor((diff % 60000)    / 1000),
  };
}

function useCountdown(target: Date) {
  const [t, setT] = useState(() => calcRemaining(target));
  useEffect(() => {
    const id = setInterval(() => setT(calcRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function HackathonPage() {
  const cd = useCountdown(HACKATHON_DATE);

  return (
    <main className="hack-page">
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav className="h-nav">
        <Link href="/" className="h-brand">Bad Theory Labs</Link>
        <div className="h-nav-links">
          <Link href="/#research">Research</Link>
          <Link href="/#products">Products</Link>
          <Link href="/papers">Papers</Link>
          <Link href="/brief">Brief</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <div className="h-nav-cta">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer">Join community</a>
          <a href={FORM_URL} target="_blank" rel="noreferrer" className="solid">Register now</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="h-hero">
        <div className="h-hero-left">
          <div className="h-orb" />
          <div>
            <div className="h-eyebrow">
              <span className="h-eyebrow-rule" />
              <span>BTL Hackathon 2025 · Lagos State University</span>
            </div>
            <h1 className="h-headline">
              Build what&apos;s<br /><em>never</em> been<br />built before.
            </h1>
            <p className="h-sub">
              48 hours. AI + General tracks. Physical event at Lagos State University.
              Open to every builder with something worth building. Courtesy of Bad Theory Labs.
            </p>
            <div className="h-actions">
              <a href={FORM_URL} target="_blank" rel="noreferrer" className="btn-p">Register for free</a>
              <a href="#tracks" className="btn-g">See tracks</a>
            </div>
          </div>

          <div className="h-meta-row">
            <div className="h-meta-item">
              <span className="h-meta-label">Date</span>
              <span className="h-meta-val">Jul 18–20, 2025</span>
            </div>
            <div className="h-meta-div" />
            <div className="h-meta-item">
              <span className="h-meta-label">Venue</span>
              <span className="h-meta-val">Lagos State University</span>
            </div>
            <div className="h-meta-div" />
            <div className="h-meta-item">
              <span className="h-meta-label">Spots</span>
              <span className="h-meta-val">200 builders</span>
            </div>
          </div>
        </div>

        <div className="h-hero-right">
          <div className="h-hero-overlay">
            <div className="h-live-chip">
              <span className="h-live-dot" />
              Registrations open
            </div>
            <p className="h-countdown-label">Hackathon starts in</p>
            <div className="h-countdown">
              <div className="h-cd-block">
                <span className="h-cd-n">{pad(cd.days)}</span>
                <span className="h-cd-l">days</span>
              </div>
              <span className="h-cd-sep">:</span>
              <div className="h-cd-block">
                <span className="h-cd-n">{pad(cd.hours)}</span>
                <span className="h-cd-l">hrs</span>
              </div>
              <span className="h-cd-sep">:</span>
              <div className="h-cd-block">
                <span className="h-cd-n">{pad(cd.mins)}</span>
                <span className="h-cd-l">min</span>
              </div>
              <span className="h-cd-sep">:</span>
              <div className="h-cd-block">
                <span className="h-cd-n">{pad(cd.secs)}</span>
                <span className="h-cd-l">sec</span>
              </div>
            </div>
            <div className="h-prize-teaser">
              <span className="h-prize-eyebrow">Prize pool</span>
              <span className="h-prize-val">₦1,000,000+</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="h-statsbar">
        {([
          ["200",  "Builders",  "max capacity"],
          ["₦1M+", "Prize pool","cash + perks"],
          ["48h",  "Hacking",   "non-stop"],
          ["2",    "Tracks",    "ai · general"],
          ["LASU", "Venue",     "Lagos State University"],
        ] as const).map(([n, l, s]) => (
          <div className="h-stat" key={l}>
            <span className="h-stat-n">{n}</span>
            <span className="h-stat-l">{l}</span>
            <span className="h-stat-s">{s}</span>
          </div>
        ))}
      </div>

      {/* ── MARQUEE ── */}
      <div className="h-marquee-wrap" aria-hidden="true">
        <div className="h-marquee-track">
          {[0, 1, 2].flatMap(i =>
            ["AI Infrastructure","Machine Learning","Developer Tools","Open Source","Systems Design",
             "Ambient Computing","Retrieval & Memory","Agent Frameworks","Edge AI","Data Pipelines"].map(tag => (
              <div className="h-marquee-item" key={`${i}-${tag}`}>
                <span className="h-marquee-dot" />{tag}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── TRACKS ── */}
      <section className="h-tracks" id="tracks">
        <div className="h-section-head">
          <div>
            <div className="h-eyebrow"><span className="h-eyebrow-rule" /><span>What you&apos;ll build</span></div>
            <h2 className="h-section-title">Two tracks,<br /><em>one mission.</em></h2>
          </div>
          <p className="h-section-desc">
            Whether you&apos;re building with AI or without it — there&apos;s a place for you.
            One winner. One podium.
          </p>
        </div>

        <div className="h-tracks-grid">
          <div className="h-track-card h-track-dark">
            <div className="h-track-orb" />
            <div className="h-track-num">01</div>
            <h3 className="h-track-name">AI Track</h3>
            <p className="h-track-desc">
              Anything that uses AI — large language models, agents, retrieval systems, embeddings,
              computer vision, voice, automation. If AI is meaningfully part of what you built,
              you&apos;re in this track. No gatekeeping on tools or approach.
            </p>
            <div className="h-track-tags">
              {["LLMs","Agents","RAG","Computer Vision","Voice AI","Automation","Multimodal"].map(t =>
                <span className="h-tag h-tag-dark" key={t}>{t}</span>)}
            </div>
          </div>

          <div className="h-track-card">
            <div className="h-track-num h-track-num-light">02</div>
            <h3 className="h-track-name">General Track</h3>
            <p className="h-track-desc">
              Build anything that doesn&apos;t lean on AI. Web apps, mobile, CLI tools, hardware,
              games, developer utilities — whatever solves a real problem with clean engineering
              and a clear problem statement.
            </p>
            <div className="h-track-tags">
              {["Web","Mobile","CLI Tools","APIs","DevTools","Hardware","Games"].map(t =>
                <span className="h-tag" key={t}>{t}</span>)}
            </div>
          </div>
        </div>
        <div className="h-tracks-note">
          <span className="h-tracks-note-rule" />
          <span>Judging is combined across both tracks. One 1st place, one 2nd, one 3rd — best project wins regardless of track.</span>
          <span className="h-tracks-note-rule" />
        </div>
      </section>

      {/* ── PRIZES ── */}
      <section className="h-prizes">
        <div className="h-prizes-left">
          <div className="h-eyebrow"><span className="h-eyebrow-rule" /><span>Prizes & Perks</span></div>
          <h2 className="h-section-title" style={{ fontSize: "clamp(32px,3.5vw,52px)" }}>
            What you win<br />when you <em>win.</em>
          </h2>
          <p className="h-prizes-body">
            Beyond cash prizes, every participant who ships gets something real. The top three
            teams get cash and direct access to BTL&apos;s team, tools, and network. Non-winning
            teams get spot cash prizes and perks too.
          </p>
          <div className="h-perks-list">
            {([
              ["Cash prizes",    "₦300k · ₦200k · ₦100k for top 3 — plus spot cash awards for non-winning teams"],
              ["API Credits",    "Free credits for OpenAI, Anthropic, and Cohere during the hack — all participants"],
              ["BTL Beta Access","Top 3 teams get early access to RetainDB + Marrow private beta"],
              ["Mentorship",     "Office hours with BTL founders and research partners — open to everyone"],
              ["Certificate",    "Official BTL hackathon certificate for every participant who ships"],
              ["Network",        "Direct introductions to the BTL team, researchers, and broader community"],
            ] as const).map(([title, desc]) => (
              <div className="h-perk" key={title}>
                <div className="h-perk-icon">→</div>
                <div>
                  <div className="h-perk-title">{title}</div>
                  <div className="h-perk-desc">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-prizes-right">
          <div className="h-prize-card">
            <div className="h-prize-rank">1st Place</div>
            <div className="h-prize-amount">₦300,000</div>
            <div className="h-prize-track">Cash · API credits · BTL beta access · Mentorship</div>
          </div>
          <div className="h-prize-card">
            <div className="h-prize-rank">2nd Place</div>
            <div className="h-prize-amount">₦200,000</div>
            <div className="h-prize-track">Cash · API credits · BTL beta access · Mentorship</div>
          </div>
          <div className="h-prize-card h-prize-card-amber">
            <div className="h-prize-rank">3rd Place</div>
            <div className="h-prize-amount">₦100,000</div>
            <div className="h-prize-track">Cash · API credits · Certificate · Mentorship</div>
          </div>
          <div className="h-prize-card h-prize-card-spot">
            <div className="h-prize-rank">Spot Prizes</div>
            <div className="h-prize-amount h-prize-amount-sm">Cash awards</div>
            <div className="h-prize-track">Best non-winning teams · Special category picks by judges</div>
          </div>
          <div className="h-prize-note">
            Every participant who ships gets a BTL certificate, community membership, and post-event
            research session access. Best project wins — track doesn&apos;t matter.
          </div>
        </div>
      </section>

      {/* ── SCHEDULE ── */}
      <section className="h-schedule">
        <div className="h-section-head">
          <div>
            <div className="h-eyebrow"><span className="h-eyebrow-rule" /><span>Timeline</span></div>
            <h2 className="h-section-title">48 hours,<br /><em>planned.</em></h2>
          </div>
        </div>
        <div className="h-timeline">
          {([
            ["Jul 18 · 09:00","Kickoff & Opening",  "Welcome address, track announcements, team formation begins"],
            ["Jul 18 · 11:00","Hacking Begins",      "48 hours start. Build, commit, ship."],
            ["Jul 19 · 14:00","Midpoint Check-in",   "Optional check-in with mentors. Office hours open."],
            ["Jul 19 · 20:00","BTL Research Talk",   "Internal research presentation — open to all participants"],
            ["Jul 20 · 09:00","Submissions Due",     "All projects submitted. No late entries."],
            ["Jul 20 · 11:00","Demo Day",            "Live presentations. Each team: 5 min demo + 3 min Q&A"],
            ["Jul 20 · 17:00","Winners Announced",   "Prizes awarded. Afterparty begins."],
          ] as const).map(([time, title, desc], i) => (
            <div className="h-tl-row" key={i}>
              <div className="h-tl-time">{time}</div>
              <div className="h-tl-line-wrap">
                <div className="h-tl-dot" />
                {i < 6 && <div className="h-tl-line" />}
              </div>
              <div className="h-tl-content">
                <div className="h-tl-title">{title}</div>
                <div className="h-tl-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="h-faq">
        <div className="h-section-head" style={{ borderBottom: "none", paddingBottom: 40 }}>
          <div>
            <div className="h-eyebrow"><span className="h-eyebrow-rule" /><span>FAQ</span></div>
            <h2 className="h-section-title">Questions,<br /><em>answered.</em></h2>
          </div>
        </div>
        <div className="h-faq-grid">
          {([
            ["Is it free?",               "Yes. Registration is free and open to all. No entry fees, no paid tiers."],
            ["Do I need a team?",         "No. Solo builders are welcome. You can also find a team in our Discord before the event."],
            ["How do I register?",        "Click any Register button on this page — it opens a Google Form. Takes under 2 minutes."],
            ["Who owns the IP?",          "You do. BTL makes no IP claims on hackathon projects."],
            ["Where is it?",             "Lagos State University — this is a physical, in-person event. You need to be there."],
            ["New to hackathons?",        "Perfect time to start. Beginners are explicitly welcome. We run workshops and office hours throughout."],
          ] as const).map(([q, a]) => (
            <div className="h-faq-item" key={q}>
              <div className="h-faq-q">{q}</div>
              <div className="h-faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BTL EVERYWHERE CALLOUT ── */}
      <div className="h-ev-callout">
        <div className="h-ev-callout-text">
          <span className="h-ev-callout-label">BTL Everywhere</span>
          Want to bring a BTL hackathon or community event to your campus or city?
          We partner with organisers worldwide — any country.
        </div>
        <a href="https://forms.gle/jsdiP7cyV4BqWBy69" target="_blank" rel="noreferrer" className="h-ev-callout-btn">
          Apply to host →
        </a>
      </div>

      {/* ── FOOTER CTA ── */}
      <section className="h-footer-cta">
        <div className="h-footer-orb" />
        <div className="h-eyebrow" style={{ justifyContent: "center" }}>
          <span className="h-eyebrow-rule" /><span>Don&apos;t wait</span><span className="h-eyebrow-rule" />
        </div>
        <h2 className="h-footer-title">48 hours to build<br />something <em>unforgettable.</em></h2>
        <div className="h-footer-actions">
          <a href={FORM_URL} target="_blank" rel="noreferrer" className="btn-p btn-p-lg">Register free →</a>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn-g btn-g-lg">Join the Discord</a>
        </div>
        <p className="h-footer-note">
          Courtesy of Bad Theory Labs ·{" "}
          <a href="mailto:hello@badtheorylabs.com">hello@badtheorylabs.com</a>
        </p>
      </section>
    </main>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #FAFAF9; --surface: #F3F2EF; --border: #E8E6E1;
  --border2: #D6D3CC; --ink: #0E0D0C; --body: #5C5954; --faint: #9C9890;
}

.hack-page {
  min-height: 100vh; background: var(--bg); color: var(--ink);
  font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
.hack-page::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px; animation: grain .18s steps(1) infinite;
}
@keyframes grain {
  0%{background-position:0 0}12%{background-position:-4% -9%}25%{background-position:-14% 4%}
  37%{background-position:6% -24%}50%{background-position:-4% 23%}62%{background-position:-14% 8%}
  75%{background-position:14% 0}87%{background-position:0 14%}100%{background-position:0 0}
}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* NAV */
.h-nav {
  position: sticky; top: 0; z-index: 200; height: 58px;
  border-bottom: 1px solid var(--border);
  background: rgba(250,250,249,.92); backdrop-filter: blur(20px) saturate(1.4);
  display: flex; align-items: center; justify-content: space-between; padding: 0 28px;
}
.h-brand {
  font-family: 'EB Garamond', serif; font-size: 20px; font-weight: 500;
  letter-spacing: -.02em; color: var(--ink); text-decoration: none; flex-shrink: 0;
}
.h-nav-links, .h-nav-cta { display: flex; gap: 16px; align-items: center; }
.h-nav-links a, .h-nav-cta a {
  text-decoration: none; color: var(--body);
  font-family: 'DM Sans', sans-serif; font-size: 13px; transition: color .15s;
}
.h-nav-links a:hover, .h-nav-cta a:hover { color: var(--ink); }
.h-nav-cta .solid {
  background: var(--ink); color: var(--bg) !important;
  padding: 7px 16px; border-radius: 8px; transition: opacity .15s;
}
.h-nav-cta .solid:hover { opacity: .82; }

/* HERO */
.h-hero {
  display: grid; grid-template-columns: 1fr 1fr;
  min-height: calc(100vh - 58px); border-bottom: 1px solid var(--border);
}
.h-hero-left {
  padding: 72px clamp(24px,4vw,60px) 60px;
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}
.h-orb {
  position: absolute; width: 520px; height: 520px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,.05) 0%, transparent 68%);
  top: 50%; left: 40%; transform: translate(-50%,-50%);
  pointer-events: none; animation: orb-drift 14s ease-in-out infinite;
}
@keyframes orb-drift {
  0%,100%{transform:translate(-50%,-50%)}
  33%{transform:translate(-44%,-56%)} 66%{transform:translate(-56%,-46%)}
}
.h-eyebrow {
  display: flex; align-items: center; gap: 10px; margin-bottom: 32px;
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  color: var(--faint); letter-spacing: .1em; text-transform: uppercase;
  opacity: 0; animation: fadeUp .55s ease .1s forwards;
}
.h-eyebrow-rule { width: 24px; height: 1px; background: var(--border); flex-shrink: 0; }
.h-headline {
  font-family: 'EB Garamond', serif;
  font-size: clamp(44px,5.2vw,76px); font-weight: 500;
  letter-spacing: -.04em; line-height: 1.01; color: var(--ink); margin-bottom: 24px;
  opacity: 0; animation: fadeUp .55s ease .17s forwards;
}
.h-headline em {
  font-style: italic; font-weight: 400;
  background: linear-gradient(118deg,var(--ink) 0%,#4a4540 30%,var(--ink) 55%,#6a6460 80%,var(--ink) 100%);
  background-size: 240% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: grad-flow 6s linear infinite;
}
@keyframes grad-flow { to { background-position: 240% center; } }
@keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes fadeIn { to { opacity: 1; } }

.h-sub {
  font-size: 16px; font-weight: 300; line-height: 1.76; color: var(--body);
  max-width: 420px; margin-bottom: 36px;
  opacity: 0; animation: fadeUp .55s ease .24s forwards;
}
.h-actions {
  display: flex; gap: 12px; margin-bottom: 52px; flex-wrap: wrap;
  opacity: 0; animation: fadeUp .55s ease .3s forwards;
}
.btn-p {
  font-size: 14px; font-weight: 500; color: var(--bg); background: var(--ink);
  border: none; cursor: pointer; padding: 13px 26px; border-radius: 8px;
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  transition: opacity .12s;
}
.btn-p:hover { opacity: .85; }
.btn-p-lg { padding: 15px 32px; font-size: 15px; }
.btn-g {
  font-size: 14px; color: var(--body); text-decoration: none;
  padding: 12px 26px; border-radius: 8px; border: 1px solid var(--border);
  transition: border-color .15s, color .15s, background .15s;
}
.btn-g:hover { border-color: var(--ink); color: var(--ink); background: rgba(14,13,12,.025); }
.btn-g-lg { padding: 14px 32px; font-size: 15px; }

.h-meta-row {
  display: flex; align-items: center; gap: 20px; padding-top: 32px;
  border-top: 1px solid var(--border); flex-wrap: wrap;
  opacity: 0; animation: fadeUp .55s ease .36s forwards;
}
.h-meta-item { display: flex; flex-direction: column; gap: 3px; }
.h-meta-label {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: var(--faint); letter-spacing: .1em; text-transform: uppercase;
}
.h-meta-val { font-size: 14px; font-weight: 500; color: var(--ink); }
.h-meta-div { width: 1px; height: 32px; background: var(--border); }

/* HERO RIGHT */
.h-hero-right {
  position: relative; background: var(--ink); overflow: hidden;
  display: flex; flex-direction: column; justify-content: flex-end;
  opacity: 0; animation: fadeIn 1.1s ease .45s forwards;
}
.h-hero-right::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background-image:
    radial-gradient(circle 1px at 20% 30%, rgba(250,250,249,.15) 0%, transparent 1px),
    radial-gradient(circle 1px at 60% 15%, rgba(250,250,249,.10) 0%, transparent 1px),
    radial-gradient(circle 1px at 80% 50%, rgba(250,250,249,.12) 0%, transparent 1px),
    radial-gradient(circle 1px at 35% 70%, rgba(250,250,249,.08) 0%, transparent 1px),
    radial-gradient(circle 200px at 50% 20%, rgba(168,94,26,.07) 0%, transparent 60%),
    radial-gradient(circle 300px at 80% 70%, rgba(168,94,26,.05) 0%, transparent 60%);
}
.h-hero-right::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .04;
  background-image:
    linear-gradient(rgba(250,250,249,1) 1px, transparent 1px),
    linear-gradient(90deg,rgba(250,250,249,1) 1px, transparent 1px);
  background-size: 48px 48px; animation: grid-drift 22s linear infinite;
}
@keyframes grid-drift { to { background-position: 48px 48px; } }

.h-hero-overlay {
  position: relative; z-index: 2; padding: 40px 44px;
  background: linear-gradient(to top, rgba(14,13,12,.97) 0%, rgba(14,13,12,.55) 55%, transparent 100%);
}
.h-live-chip {
  display: inline-flex; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: rgba(250,250,249,.38); letter-spacing: .12em; text-transform: uppercase;
  margin-bottom: 20px;
}
.h-live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: rgba(168,94,26,.9); flex-shrink: 0;
  animation: pulse-dot 2.2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%,100%{box-shadow:0 0 0 0 rgba(168,94,26,.55)}
  50%{box-shadow:0 0 0 5px rgba(168,94,26,0)}
}
.h-countdown-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: rgba(250,250,249,.3); letter-spacing: .1em; text-transform: uppercase; margin-bottom: 12px;
}
.h-countdown { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 32px; flex-wrap: wrap; }
.h-cd-block { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.h-cd-n {
  font-family: 'EB Garamond', serif; font-size: clamp(32px,4.5vw,56px);
  font-weight: 500; letter-spacing: -.04em; line-height: 1; color: rgba(250,250,249,.92);
}
.h-cd-l {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: rgba(250,250,249,.28); letter-spacing: .1em; text-transform: uppercase;
}
.h-cd-sep {
  font-family: 'EB Garamond', serif; font-size: 32px;
  color: rgba(250,250,249,.2); padding-bottom: 14px; line-height: 1;
}
.h-prize-teaser {
  display: flex; flex-direction: column; gap: 4px;
  padding-top: 20px; border-top: 1px solid rgba(250,250,249,.08);
}
.h-prize-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: rgba(250,250,249,.3); letter-spacing: .1em; text-transform: uppercase;
}
.h-prize-val {
  font-family: 'EB Garamond', serif; font-size: 28px;
  letter-spacing: -.03em; color: rgba(250,250,249,.88);
}

/* STATS BAR */
.h-statsbar {
  display: flex; border-bottom: 1px solid var(--border);
  background: var(--surface); overflow-x: auto;
}
.h-stat {
  flex: 1; min-width: 120px; display: flex; flex-direction: column; gap: 4px;
  padding: 24px 20px; border-right: 1px solid var(--border);
}
.h-stat:last-child { border-right: none; }
.h-stat-n {
  font-family: 'EB Garamond', serif; font-size: 26px; font-weight: 500;
  letter-spacing: -.04em; color: var(--ink); line-height: 1;
}
.h-stat-l { font-size: 13px; color: var(--body); }
.h-stat-s { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--faint); }

/* MARQUEE */
.h-marquee-wrap { overflow: hidden; border-bottom: 1px solid var(--border); background: var(--surface); }
.h-marquee-track { display: flex; width: max-content; animation: marquee 30s linear infinite; }
@keyframes marquee { to { transform: translateX(-33.333%); } }
.h-marquee-item {
  display: flex; align-items: center; gap: 14px; padding: 12px 36px; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: .06em; border-right: 1px solid var(--border); transition: color .2s;
}
.h-marquee-item:hover { color: var(--body); }
.h-marquee-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border2); flex-shrink: 0; }

/* SECTION HEADER */
.h-section-head {
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 80px 52px 52px; border-bottom: 1px solid var(--border);
}
.h-section-title {
  font-family: 'EB Garamond', serif; font-size: clamp(36px,4vw,58px); font-weight: 500;
  letter-spacing: -.03em; line-height: 1.05; color: var(--ink);
}
.h-section-title em { font-style: italic; font-weight: 400; }
.h-section-desc {
  font-size: 14px; font-weight: 300; color: var(--body); max-width: 280px; text-align: right; line-height: 1.72;
}

/* TRACKS */
.h-tracks { border-bottom: 1px solid var(--border); }
.h-tracks-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--border); }
.h-track-card {
  padding: 48px 40px; border-right: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 20px;
  position: relative; overflow: hidden; transition: background .2s;
}
.h-track-card:last-child { border-right: none; }
.h-track-card:hover { background: var(--surface); }
.h-track-dark { background: var(--ink); border-right-color: rgba(250,250,249,.06); }
.h-track-dark:hover { background: #1a1917; }
.h-track-orb {
  position: absolute; width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,.08) 0%, transparent 70%);
  top: -80px; right: -80px; pointer-events: none; animation: orb-drift 12s ease-in-out infinite;
}
.h-track-num { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(250,250,249,.2); letter-spacing: .1em; }
.h-track-num-light { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--faint); letter-spacing: .1em; }
.h-track-name { font-family: 'EB Garamond', serif; font-size: 28px; font-weight: 500; letter-spacing: -.02em; line-height: 1.1; }
.h-track-dark .h-track-name { color: rgba(250,250,249,.92); }
.h-track-desc { font-size: 14px; font-weight: 300; line-height: 1.72; color: var(--body); flex: 1; }
.h-track-dark .h-track-desc { color: rgba(250,250,249,.42); }
.h-track-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.h-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  padding: 4px 10px; border-radius: 4px; letter-spacing: .05em;
  border: 1px solid var(--border); color: var(--faint);
}
.h-tag-dark { border-color: rgba(250,250,249,.1); color: rgba(250,250,249,.35); background: rgba(250,250,249,.03); }
.h-tracks-note {
  display: flex; align-items: center; gap: 16px; padding: 16px 40px;
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  color: var(--faint); letter-spacing: .04em; text-align: center;
}
.h-tracks-note-rule { flex: 1; height: 1px; background: var(--border); }

/* PRIZES */
.h-prizes { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.h-prizes-left { padding: 72px 52px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 20px; }
.h-prizes-body { font-size: 15px; font-weight: 300; line-height: 1.76; color: var(--body); max-width: 420px; }
.h-perks-list { display: flex; flex-direction: column; gap: 16px; margin-top: 8px; }
.h-perk { display: flex; gap: 16px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.h-perk:last-child { border-bottom: none; }
.h-perk-icon { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--faint); margin-top: 1px; flex-shrink: 0; }
.h-perk-title { font-size: 14px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
.h-perk-desc { font-size: 13px; font-weight: 300; color: var(--body); line-height: 1.6; }
.h-prizes-right { padding: 72px 52px; display: flex; flex-direction: column; gap: 12px; background: var(--surface); }
.h-prize-card {
  padding: 22px 26px; border: 1px solid var(--border); border-radius: 12px; background: var(--bg);
  display: flex; flex-direction: column; gap: 5px;
}
.h-prize-card-amber { background: #fdf8f3; border-color: rgba(168,94,26,.14); }
.h-prize-card-spot  { background: var(--surface); border-style: dashed; }
.h-prize-rank { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--faint); }
.h-prize-card-amber .h-prize-rank { color: rgba(168,94,26,.55); }
.h-prize-amount { font-family: 'EB Garamond', serif; font-size: 30px; font-weight: 500; letter-spacing: -.03em; color: var(--ink); line-height: 1; }
.h-prize-amount-sm { font-size: 22px !important; }
.h-prize-track { font-size: 13px; font-weight: 300; color: var(--body); }
.h-prize-note { font-size: 12px; font-weight: 300; color: var(--faint); line-height: 1.65; margin-top: 6px; }

/* SCHEDULE */
.h-schedule { border-bottom: 1px solid var(--border); }
.h-timeline { max-width: 760px; margin: 0 auto; padding: 52px 52px 72px; display: flex; flex-direction: column; }
.h-tl-row { display: flex; gap: 20px; }
.h-tl-time { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--faint); letter-spacing: .05em; min-width: 120px; padding-top: 3px; }
.h-tl-line-wrap { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }
.h-tl-dot { width: 8px; height: 8px; border-radius: 50%; border: 1.5px solid var(--border2); background: var(--bg); margin-top: 4px; flex-shrink: 0; }
.h-tl-line { width: 1px; flex: 1; background: var(--border); margin: 6px 0; min-height: 28px; }
.h-tl-content { padding-bottom: 32px; flex: 1; }
.h-tl-title { font-size: 15px; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
.h-tl-desc  { font-size: 13px; font-weight: 300; color: var(--body); line-height: 1.65; }

/* FAQ */
.h-faq { border-bottom: 1px solid var(--border); }
.h-faq-grid { display: grid; grid-template-columns: 1fr 1fr; padding: 0 52px 72px; }
.h-faq-item { padding: 32px 40px 32px 0; border-bottom: 1px solid var(--border); }
.h-faq-item:nth-child(even) { padding-left: 40px; padding-right: 0; border-left: 1px solid var(--border); }
.h-faq-item:nth-last-child(-n+2) { border-bottom: none; }
.h-faq-q { font-size: 15px; font-weight: 500; color: var(--ink); margin-bottom: 10px; }
.h-faq-a { font-size: 14px; font-weight: 300; color: var(--body); line-height: 1.72; }

/* BTL EVERYWHERE CALLOUT */
.h-ev-callout {
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  padding: 28px 52px; border-bottom: 1px solid var(--border);
  background: var(--surface); flex-wrap: wrap;
}
.h-ev-callout-text {
  font-size: 14px; font-weight: 300; color: var(--body); line-height: 1.65;
  display: flex; flex-direction: column; gap: 4px;
}
.h-ev-callout-label {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--faint);
}
.h-ev-callout-btn {
  font-size: 13px; font-weight: 500; color: var(--bg); background: var(--ink);
  text-decoration: none; padding: 10px 20px; border-radius: 8px;
  white-space: nowrap; transition: opacity .15s; flex-shrink: 0;
}
.h-ev-callout-btn:hover { opacity: .82; }

/* FOOTER CTA */
.h-footer-cta {
  padding: 100px 52px; text-align: center; position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; gap: 24px;
}
.h-footer-orb {
  position: absolute; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,.04) 0%, transparent 65%);
  top: 50%; left: 50%; transform: translate(-50%,-50%);
  pointer-events: none; animation: orb-drift 16s ease-in-out infinite;
}
.h-footer-title {
  font-family: 'EB Garamond', serif; font-size: clamp(40px,5vw,68px); font-weight: 500;
  letter-spacing: -.04em; line-height: 1.05; color: var(--ink);
}
.h-footer-title em { font-style: italic; font-weight: 400; }
.h-footer-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.h-footer-note { font-size: 13px; font-weight: 300; color: var(--faint); }
.h-footer-note a { color: var(--body); text-decoration: none; }
.h-footer-note a:hover { color: var(--ink); }

/* RESPONSIVE */
@media (max-width: 900px) {
  .h-nav-links { display: none; }
  .h-nav { padding: 0 16px; }

  .h-hero { grid-template-columns: 1fr; min-height: unset; }
  .h-hero-left { border-right: none; border-bottom: 1px solid var(--border); padding: 48px 20px 40px; }
  .h-hero-right { min-height: 320px; }
  .h-hero-overlay { padding: 28px 24px; }

  .h-tracks-grid { grid-template-columns: 1fr; }
  .h-track-card { border-right: none; border-bottom: 1px solid var(--border); padding: 36px 24px; }
  .h-track-dark { border-bottom-color: rgba(250,250,249,.06); }

  .h-prizes { grid-template-columns: 1fr; }
  .h-prizes-left { border-right: none; border-bottom: 1px solid var(--border); padding: 48px 24px; }
  .h-prizes-right { padding: 48px 24px; }

  .h-ev-callout { padding: 24px 20px; }

  .h-section-head { flex-direction: column; gap: 16px; padding: 48px 24px 36px; }
  .h-section-desc { text-align: left; max-width: 100%; }

  .h-timeline { padding: 40px 24px 56px; }
  .h-tl-time { min-width: 90px; font-size: 9.5px; }

  .h-faq-grid { grid-template-columns: 1fr; padding: 0 24px 56px; }
  .h-faq-item { padding: 24px 0; border-left: none !important; }
  .h-faq-item:nth-last-child(-n+2) { border-bottom: 1px solid var(--border); }
  .h-faq-item:last-child { border-bottom: none; }

  .h-footer-cta { padding: 72px 24px; }
  .h-tracks-note { padding: 14px 24px; font-size: 10px; }
}

@media (max-width: 560px) {
  .h-headline { font-size: clamp(38px,10vw,56px); }
  .h-meta-div { display: none; }
  .h-meta-row { gap: 16px; }
  .h-cd-n { font-size: 28px; }
  .h-cd-sep { font-size: 22px; padding-bottom: 8px; }
  .h-countdown { gap: 6px; }
  .h-prize-val { font-size: 22px; }
  .h-statsbar { flex-wrap: wrap; }
  .h-stat { min-width: 50%; }
  .h-stat:nth-child(2n) { border-right: none; }
  .h-stat:nth-child(n+3) { border-top: 1px solid var(--border); }
}
`;
