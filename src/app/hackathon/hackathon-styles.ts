// Page chrome for /hackathon. Lives in its own module so page.tsx stays small —
// the register modal ships its own styles separately.
export const pageCss = `
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
  border: none; cursor: pointer; font-size: 13px; font-family: 'DM Sans', sans-serif;
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
  max-width: 440px; margin-bottom: 36px;
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
  transition: opacity .12s; font-family: 'DM Sans', sans-serif;
}
.btn-p:hover { opacity: .85; }
.btn-p-lg { padding: 15px 32px; font-size: 15px; }
.btn-g {
  font-size: 14px; color: var(--body); text-decoration: none;
  padding: 12px 26px; border-radius: 8px; border: 1px solid var(--border);
  transition: border-color .15s, color .15s, background .15s;
  cursor: pointer; background: transparent; font-family: 'DM Sans', sans-serif;
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
.h-prize-detail { font-size: 13px; font-weight: 300; color: var(--body); }
.h-prize-note { font-size: 12px; font-weight: 300; color: var(--faint); line-height: 1.65; margin-top: 6px; }

/* SCHEDULE */
.h-schedule { border-bottom: 1px solid var(--border); }
.h-timeline { max-width: 760px; margin: 0 auto; padding: 52px 52px 72px; display: flex; flex-direction: column; }
.h-tl-row { display: flex; gap: 20px; }
.h-tl-time { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--faint); letter-spacing: .05em; min-width: 132px; padding-top: 3px; }
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

  .h-prizes { grid-template-columns: 1fr; }
  .h-prizes-left { border-right: none; border-bottom: 1px solid var(--border); padding: 48px 24px; }
  .h-prizes-right { padding: 48px 24px; }

  .h-ev-callout { padding: 24px 20px; }

  .h-section-head { flex-direction: column; gap: 16px; padding: 48px 24px 36px; }
  .h-section-desc { text-align: left; max-width: 100%; }

  .h-timeline { padding: 40px 24px 56px; }
  .h-tl-time { min-width: 104px; font-size: 9.5px; }

  .h-faq-grid { grid-template-columns: 1fr; padding: 0 24px 56px; }
  .h-faq-item { padding: 24px 0; border-left: none !important; }
  .h-faq-item:nth-last-child(-n+2) { border-bottom: 1px solid var(--border); }
  .h-faq-item:last-child { border-bottom: none; }

  .h-footer-cta { padding: 72px 24px; }
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
