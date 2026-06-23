'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import RegisterModal from "./RegisterModal";
import { pageCss } from "./hackathon-styles";

const DISCORD_URL   = "https://discord.gg/QJBCcB7bF";
const RUNTIME_URL   = "https://badtheorylabs.com";
// 48h, online, starts 15:00 UTC so it's a sane hour across most of the world
const HACKATHON_DATE = new Date("2026-07-03T15:00:00Z");

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
  const [regOpen, setRegOpen] = useState(false);
  const openReg = () => setRegOpen(true);

  return (
    <main className="hack-page">
      <style>{pageCss}</style>
      <RegisterModal open={regOpen} onClose={() => setRegOpen(false)} discordUrl={DISCORD_URL} />

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
          <button type="button" onClick={openReg} className="solid">Register now</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="h-hero">
        <div className="h-hero-left">
          <div className="h-orb" />
          <div>
            <div className="h-eyebrow">
              <span className="h-eyebrow-rule" />
              <span>BTL Runtime Hackathon · Online · Global</span>
            </div>
            <h1 className="h-headline">
              Build it on<br />the <em>BTL</em><br />runtime.
            </h1>
            <p className="h-sub">
              48 hours, fully online, open to builders anywhere on Earth. Ship anything powered by the
              BTL runtime — our OpenAI-compatible LLM gateway. Free API credits for everyone who enters.
              $1,000+ in prizes. Courtesy of Bad Theory Labs.
            </p>
            <div className="h-actions">
              <button type="button" onClick={openReg} className="btn-p">Register for free</button>
              <a href="#tracks" className="btn-g">See tracks</a>
            </div>
          </div>

          <div className="h-meta-row">
            <div className="h-meta-item">
              <span className="h-meta-label">Date</span>
              <span className="h-meta-val">Jul 3–5, 2026</span>
            </div>
            <div className="h-meta-div" />
            <div className="h-meta-item">
              <span className="h-meta-label">Where</span>
              <span className="h-meta-val">Online · Worldwide</span>
            </div>
            <div className="h-meta-div" />
            <div className="h-meta-item">
              <span className="h-meta-label">Entry</span>
              <span className="h-meta-val">Free · open to all</span>
            </div>
          </div>
        </div>

        <div className="h-hero-right">
          <div className="h-hero-overlay">
            <div className="h-live-chip">
              <span className="h-live-dot" />
              Registrations open
            </div>
            <p className="h-countdown-label">Hacking starts in</p>
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
              <span className="h-prize-val">$1,100 USD</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="h-statsbar">
        {([
          ["Global", "Reach",      "any country, any timezone"],
          ["$1,100", "Prize pool", "paid in USD"],
          ["48h",    "Hacking",    "non-stop"],
          ["2",      "Tracks",     "ai apps · agents & tools"],
          ["Online", "Venue",      "discord + video"],
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
            ["LLM Gateway","Chat Completions","Agents","Retrieval & Memory","Embeddings","Tool Use",
             "Streaming","OpenAI-compatible","Multi-provider","Usage & Billing"].map(tag => (
              <div className="h-marquee-item" key={`${i}-${tag}`}>
                <span className="h-marquee-dot" />{tag}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── THE RUNTIME ── */}
      <section className="h-ev-callout" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="h-ev-callout-text">
          <span className="h-ev-callout-label">The one rule</span>
          Every project must call the <strong>BTL runtime</strong> — our OpenAI-compatible gateway
          (<code>/v1/chat/completions</code>, <code>/v1/responses</code>). Register and we send you a
          scoped API key plus free credits to build with. Bring any provider behind it.
        </div>
        <a href={RUNTIME_URL} target="_blank" rel="noreferrer" className="h-ev-callout-btn">
          Read the runtime docs →
        </a>
      </section>

      {/* ── TRACKS ── */}
      <section className="h-tracks" id="tracks">
        <div className="h-section-head">
          <div>
            <div className="h-eyebrow"><span className="h-eyebrow-rule" /><span>What you&apos;ll build</span></div>
            <h2 className="h-section-title">Two tracks,<br /><em>one runtime.</em></h2>
          </div>
          <p className="h-section-desc">
            Both tracks run on the BTL runtime. Judging is combined — best project wins, track aside.
          </p>
        </div>

        <div className="h-tracks-grid">
          <div className="h-track-card h-track-dark">
            <div className="h-track-orb" />
            <div className="h-track-num">01</div>
            <h3 className="h-track-name">AI Apps</h3>
            <p className="h-track-desc">
              End-user products with the runtime doing the heavy lifting — chat, copilots, search,
              writing, voice, multimodal. If a real person would open it and get value, it belongs here.
            </p>
            <div className="h-track-tags">
              {["Chat","Copilots","RAG","Search","Voice","Multimodal","Writing"].map(t =>
                <span className="h-tag h-tag-dark" key={t}>{t}</span>)}
            </div>
          </div>

          <div className="h-track-card">
            <div className="h-track-num h-track-num-light">02</div>
            <h3 className="h-track-name">Agents &amp; Tools</h3>
            <p className="h-track-desc">
              The infrastructure layer — autonomous agents, dev tools, automations, evals, and SDKs that
              orchestrate the runtime. Tool use, streaming, and multi-step loops live here.
            </p>
            <div className="h-track-tags">
              {["Agents","Tool Use","CLIs","Automations","Evals","SDKs","Pipelines"].map(t =>
                <span className="h-tag" key={t}>{t}</span>)}
            </div>
          </div>
        </div>
        <div className="h-tracks-note">
          <span className="h-tracks-note-rule" />
          <span>One 1st, one 2nd, one 3rd across both tracks — plus a $100 spot prize for best use of the runtime.</span>
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
            $1,100 in cash split across the podium and a spot prize, paid in USD by bank transfer,
            PayPal, or stablecoin — wherever you are. Every shipper gets more than money, too.
          </p>
          <div className="h-perks-list">
            {([
              ["Cash prizes",     "$500 · $300 · $200 for the top 3, plus a $100 'best use of runtime' spot prize"],
              ["Runtime credits", "Free BTL runtime API credits for every registrant — across providers"],
              ["BTL beta access", "Top teams get early access to RetainDB + Marrow private beta"],
              ["Mentorship",      "Live office hours with BTL founders and research partners — open to all"],
              ["Certificate",     "Official BTL hackathon certificate for everyone who ships"],
              ["Network",         "Direct intros to the BTL team, researchers, and the wider community"],
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
            <div className="h-prize-amount">$500</div>
            <div className="h-prize-track">Cash · Runtime credits · BTL beta access · Mentorship</div>
          </div>
          <div className="h-prize-card">
            <div className="h-prize-rank">2nd Place</div>
            <div className="h-prize-amount">$300</div>
            <div className="h-prize-track">Cash · Runtime credits · BTL beta access · Mentorship</div>
          </div>
          <div className="h-prize-card h-prize-card-amber">
            <div className="h-prize-rank">3rd Place</div>
            <div className="h-prize-amount">$200</div>
            <div className="h-prize-track">Cash · Runtime credits · Certificate · Mentorship</div>
          </div>
          <div className="h-prize-card h-prize-card-spot">
            <div className="h-prize-rank">Spot Prize</div>
            <div className="h-prize-amount h-prize-amount-sm">$100</div>
            <div className="h-prize-track">Best use of the BTL runtime · judges&apos; pick</div>
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
            <div className="h-eyebrow"><span className="h-eyebrow-rule" /><span>Timeline · all times UTC</span></div>
            <h2 className="h-section-title">48 hours,<br /><em>online.</em></h2>
          </div>
        </div>
        <div className="h-timeline">
          {([
            ["Jul 3 · 15:00 UTC","Kickoff stream",     "Welcome, rules, runtime walkthrough. API keys go out. Hacking begins."],
            ["Jul 3 · 16:00 UTC","Team formation",      "Find a team in Discord, or fly solo. Mentor channels open."],
            ["Jul 4 · 15:00 UTC","Midpoint office hours","Drop-in help with the runtime, debugging, and scope."],
            ["Jul 4 · 19:00 UTC","BTL research talk",    "Live research session — open to every participant."],
            ["Jul 5 · 15:00 UTC","Submissions due",      "Repo + 2-min demo video submitted. Hard deadline, no late entries."],
            ["Jul 5 · 17:00 UTC","Demo day",             "Finalists present live on the call. 5-min demo + 3-min Q&A."],
            ["Jul 5 · 20:00 UTC","Winners announced",    "Prizes awarded on stream. Payouts begin."],
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
            ["Is it free?",                "Yes. Free to enter, open to anyone anywhere. No fees, no tiers."],
            ["Do I have to use the runtime?","Yes — that's the whole event. Every project calls the BTL runtime. You get a key and free credits at registration."],
            ["Do I need a team?",          "No. Solo is welcome, and you can find teammates in Discord before kickoff. Teams up to 4."],
            ["How do I register?",         "Hit any Register button on this page — the form is right here, no Google Forms. Under a minute."],
            ["Who owns the IP?",           "You do. BTL makes no claim on anything you build here."],
            ["How are prizes paid?",       "USD by bank transfer, PayPal, or stablecoin — whatever works for your country."],
          ] as const).map(([q, a]) => (
            <div className="h-faq-item" key={q}>
              <div className="h-faq-q">{q}</div>
              <div className="h-faq-a">{a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPONSOR / MENTOR CALLOUT ── */}
      <div className="h-ev-callout">
        <div className="h-ev-callout-text">
          <span className="h-ev-callout-label">Get involved</span>
          Want to mentor teams, judge demo day, or sponsor a prize? We partner with people and
          companies worldwide — reach out and we&apos;ll find a fit.
        </div>
        <a href="mailto:hello@badtheorylabs.com?subject=BTL%20Runtime%20Hackathon%20%E2%80%94%20partner"
           className="h-ev-callout-btn">
          Mentor or sponsor →
        </a>
      </div>

      {/* ── FOOTER CTA ── */}
      <section className="h-footer-cta">
        <div className="h-footer-orb" />
        <div className="h-eyebrow" style={{ justifyContent: "center" }}>
          <span className="h-eyebrow-rule" /><span>Don&apos;t wait</span><span className="h-eyebrow-rule" />
        </div>
        <h2 className="h-footer-title">48 hours to build<br />on the <em>runtime.</em></h2>
        <div className="h-footer-actions">
          <button type="button" onClick={openReg} className="btn-p btn-p-lg">Register free →</button>
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
