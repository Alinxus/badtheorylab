'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #FAFAF9; --surface: #F3F2EF; --border: #E8E6E1;
  --border2: #D6D3CC; --ink: #0E0D0C; --body: #5C5954; --faint: #9C9890;
}

html { scroll-behavior: smooth; }
body {
  background: var(--bg); color: var(--ink);
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}

/* animated film grain */
body::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 9998; opacity: 0.028;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px;
  animation: grain-shift 0.18s steps(1) infinite;
}
@keyframes grain-shift {
  0%  { background-position: 0 0 }     12% { background-position: -4% -9% }
  25% { background-position: -14% 4% } 37% { background-position: 6% -24% }
  50% { background-position: -4% 23% } 62% { background-position: -14% 8% }
  75% { background-position: 14% 0 }   87% { background-position: 0 14% }
  100%{ background-position: 0 0 }
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

/* ─── CURSOR GLOW ─── */
.cursor-glow {
  position: fixed; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,0.055) 0%, transparent 60%);
  pointer-events: none; z-index: 9997; top: 0; left: 0;
  will-change: transform; transition: transform 0.06s linear;
}

/* ─── NAV ─── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: 56px; padding: 0 52px;
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(250,250,249,0.84); backdrop-filter: blur(24px) saturate(1.4);
  border-bottom: 1px solid var(--border);
}
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.nav-logo-mark { animation: float-gentle 7s ease-in-out infinite; display: flex; align-items: center; }
.nav-logo-text { font-family: 'EB Garamond', serif; font-size: 16px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink); }
.nav-logo-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--faint); letter-spacing: 0.18em; margin-left: 2px; }
.nav-links { display: flex; align-items: center; gap: 36px; }
.nav-link {
  font-size: 13px; color: var(--body); text-decoration: none;
  transition: color 0.15s; position: relative; padding-bottom: 2px;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
  height: 1px; background: var(--ink);
  transform: scaleX(0); transform-origin: left;
  transition: transform 0.26s cubic-bezier(.16,1,.3,1);
}
.nav-link:hover { color: var(--ink); }
.nav-link:hover::after { transform: scaleX(1); }
.nav-right { display: flex; align-items: center; gap: 10px; }
.btn-ghost {
  font-size: 13px; color: var(--body); text-decoration: none;
  padding: 6px 14px; transition: color 0.15s;
}
.btn-ghost:hover { color: var(--ink); }
.btn-solid {
  font-size: 13px; font-weight: 500; color: var(--bg); background: var(--ink);
  border: none; cursor: pointer; padding: 8px 20px; border-radius: 7px;
  text-decoration: none; position: relative; overflow: hidden;
  transition: opacity 0.12s;
}
.btn-solid::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
  transform: translateX(-120%);
}
.btn-solid:hover { opacity: 0.85; }
.btn-solid:hover::after { animation: shimmer-sweep 0.55s ease forwards; }

/* ─── HERO — full viewport width, no max-width cap ─── */
.hero {
  padding-top: 56px;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
}

/* LEFT */
.hero-left {
  padding: 80px clamp(36px, 4vw, 68px) 80px clamp(24px, 4vw, 52px);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}
/* ambient warm orb behind hero text */
.hero-left::before {
  content: ''; position: absolute;
  width: 560px; height: 560px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,0.045) 0%, transparent 68%);
  top: 40%; left: 30%; transform: translate(-50%,-50%);
  pointer-events: none; animation: orb-drift-a 14s ease-in-out infinite;
}

.hero-eyebrow {
  display: flex; align-items: center; gap: 10px; margin-bottom: 36px;
  opacity: 0; animation: fadeUp 0.6s ease 0.1s forwards;
}
.hero-eyebrow-rule { width: 24px; height: 1px; background: var(--border); }
.hero-eyebrow-text {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase;
}

.hero-headline {
  font-family: 'EB Garamond', serif;
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 500; letter-spacing: -0.04em; line-height: 1.0;
  color: var(--ink); margin-bottom: 28px;
  opacity: 0; animation: fadeUp 0.6s ease 0.18s forwards;
}
/* animated gradient on italic words */
.hero-headline em {
  font-style: italic; font-weight: 400;
  background: linear-gradient(118deg, var(--ink) 0%, #4a4540 30%, var(--ink) 55%, #6a6460 80%, var(--ink) 100%);
  background-size: 240% auto;
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  animation: gradient-flow 6s linear infinite;
}

.hero-body {
  font-size: 16px; font-weight: 300; line-height: 1.78;
  color: var(--body); max-width: 420px; margin-bottom: 40px;
  opacity: 0; animation: fadeUp 0.6s ease 0.26s forwards;
}

.hero-actions {
  display: flex; align-items: center; gap: 12px; margin-bottom: 56px;
  opacity: 0; animation: fadeUp 0.6s ease 0.32s forwards;
}
.btn-hero-p {
  font-size: 14px; font-weight: 500; color: var(--bg); background: var(--ink);
  border: none; cursor: pointer; padding: 13px 28px; border-radius: 8px;
  text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
  position: relative; overflow: hidden; transition: opacity 0.12s;
}
.btn-hero-p::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.18) 50%, transparent 65%);
  transform: translateX(-120%);
}
.btn-hero-p:hover { opacity: 0.86; }
.btn-hero-p:hover::after { animation: shimmer-sweep 0.55s ease forwards; }
.btn-hero-g {
  font-size: 14px; color: var(--body); text-decoration: none;
  padding: 12px 28px; border-radius: 8px; border: 1px solid var(--border);
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.btn-hero-g:hover { border-color: var(--ink); color: var(--ink); background: rgba(14,13,12,0.025); }

.hero-stats {
  display: flex; border-top: 1px solid var(--border); padding-top: 36px;
  opacity: 0; animation: fadeUp 0.6s ease 0.4s forwards;
}
.stat { flex: 1; }
.stat + .stat { padding-left: 24px; border-left: 1px solid var(--border); }
.stat-n {
  font-family: 'EB Garamond', serif; font-size: 30px; font-weight: 500;
  letter-spacing: -0.04em; color: var(--ink); line-height: 1; margin-bottom: 5px;
}
.stat-l { font-size: 12px; color: var(--body); margin-bottom: 2px; }
.stat-s { font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--faint); }

/* RIGHT — dark, full-bleed to viewport edge */
.hero-right {
  position: relative; overflow: hidden;
  background: var(--ink);
  display: flex; flex-direction: column; justify-content: flex-end;
  opacity: 0; animation: fadeIn 1.1s ease 0.45s forwards;
}
.hero-canvas { position: absolute; inset: 0; }

.hero-right-content {
  position: relative; z-index: 2; padding: 32px 40px;
  background: linear-gradient(to top, rgba(14,13,12,0.97) 0%, rgba(14,13,12,0.55) 60%, transparent 100%);
}
.hero-right-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: rgba(250,250,249,0.35); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 12px; display: flex; align-items: center; gap: 8px;
}
.hero-right-label::before {
  content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%;
  background: rgba(168,94,26,0.9); animation: pulse-dot 2.2s ease-in-out infinite;
}
.hero-right-title {
  font-family: 'EB Garamond', serif; font-size: 28px; font-weight: 500;
  letter-spacing: -0.03em; color: rgba(250,250,249,0.92); margin-bottom: 8px;
}
.hero-right-title em { font-style: italic; font-weight: 400; }
.hero-right-body {
  font-size: 13px; font-weight: 300; color: rgba(250,250,249,0.42);
  line-height: 1.65; max-width: 340px;
}

/* ─── HACKATHON BANNER ─── */
.hack-banner {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 13px 52px; border-bottom: 1px solid var(--border);
  background: var(--ink); text-decoration: none;
  transition: opacity 0.15s;
}
.hack-banner:hover { opacity: 0.88; }
.hack-banner-dot {
  width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
  background: rgba(168,94,26,0.9);
  animation: pulse-dot 2.2s ease-in-out infinite;
}
.hack-banner-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  color: rgba(250,250,249,0.9);
}
.hack-banner-sep { color: rgba(250,250,249,0.2); font-size: 12px; }
.hack-banner-copy {
  font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300;
  color: rgba(250,250,249,0.45); flex: 1;
}
.hack-banner-cta {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  letter-spacing: 0.06em; color: rgba(168,94,26,0.9);
  margin-left: auto; white-space: nowrap;
}

/* ─── MARQUEE ─── */
.marquee-wrap {
  overflow: hidden;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  background: var(--surface);
}
.marquee-track { display: flex; width: max-content; animation: marquee 28s linear infinite; }
.marquee-item {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 40px; white-space: nowrap;
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: var(--faint); letter-spacing: 0.06em;
  border-right: 1px solid var(--border);
  transition: color 0.2s;
}
.marquee-item:hover { color: var(--body); }
.marquee-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border2); flex-shrink: 0; }

/* ─── PRODUCTS ─── */
.products-section { max-width: 1320px; margin: 0 auto; }
.section-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  padding: 80px 52px 52px; border-bottom: 1px solid var(--border);
}
.section-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.section-eyebrow-rule { width: 24px; height: 1px; background: var(--border); }
.section-eyebrow-text {
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase;
}
.section-title {
  font-family: 'EB Garamond', serif; font-size: clamp(36px, 4vw, 56px);
  font-weight: 500; letter-spacing: -0.03em; line-height: 1.05; color: var(--ink);
}
.section-title em { font-style: italic; font-weight: 400; }
.section-desc {
  font-size: 14px; font-weight: 300; color: var(--body);
  max-width: 280px; text-align: right; line-height: 1.72;
}

/* ─── MARROW ─── */
.marrow-section { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.marrow-left {
  padding: 60px 56px 60px 52px; border-right: 1px solid var(--border);
  display: flex; flex-direction: column; justify-content: space-between;
}
.marrow-right {
  position: relative; overflow: hidden;
  background: #090909; min-height: 500px;
}
/* subtle gold corner glow */
.marrow-right::after {
  content: ''; position: absolute; top: 0; right: 0;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,0.07) 0%, transparent 70%);
  pointer-events: none; z-index: 1;
  animation: orb-drift-b 9s ease-in-out infinite;
}

.product-label {
  font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint);
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px;
  display: flex; align-items: center; gap: 10px;
}
.product-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--border); }
.product-label::after {
  content: ''; display: inline-block; width: 5px; height: 5px;
  border-radius: 50%; background: currentColor; opacity: 0.5; margin-left: 2px;
  animation: pulse-dot 2.8s ease-in-out infinite;
}

.marrow-title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(32px, 3.5vw, 52px); font-weight: 500;
  letter-spacing: -0.035em; line-height: 1.05; color: var(--ink); margin-bottom: 20px;
}
.marrow-title em { font-style: italic; font-weight: 400; }
.marrow-body {
  font-size: 16px; font-weight: 300; line-height: 1.78;
  color: var(--body); margin-bottom: 36px;
}

.capability-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 40px; }
.capability-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 6px; border-bottom: 1px solid var(--border);
  transition: padding-left 0.26s cubic-bezier(.16,1,.3,1), background 0.2s;
  border-radius: 4px; cursor: default;
}
.capability-row:first-child { border-top: 1px solid var(--border); }
.capability-row:hover { padding-left: 12px; background: rgba(14,13,12,0.025); }
.capability-row:hover .cap-num { color: var(--body); }
.cap-num {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: var(--faint); width: 20px; flex-shrink: 0; transition: color 0.2s;
}
.cap-text { font-size: 14px; color: var(--ink); font-weight: 400; }
.cap-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9px;
  color: var(--faint); margin-left: auto; white-space: nowrap;
}

.marrow-cta {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 500; color: var(--bg); background: var(--ink);
  border: none; cursor: pointer; padding: 13px 28px; border-radius: 8px;
  text-decoration: none; position: relative; overflow: hidden; transition: opacity 0.12s;
}
.marrow-cta::after {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%);
  transform: translateX(-120%);
}
.marrow-cta:hover { opacity: 0.86; }
.marrow-cta:hover::after { animation: shimmer-sweep 0.55s ease forwards; }

.marrow-canvas-wrap { position: absolute; inset: 0; }
.marrow-overlay {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 28px 32px; z-index: 2;
  background: linear-gradient(to top, rgba(9,9,9,0.96) 0%, transparent 100%);
}
.marrow-overlay-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: rgba(250,250,249,0.28); letter-spacing: 0.1em; text-transform: uppercase;
  margin-bottom: 8px;
}
.marrow-overlay-text {
  font-family: 'EB Garamond', serif; font-size: 20px; font-style: italic;
  color: rgba(250,250,249,0.7); letter-spacing: -0.02em;
}

/* ─── RETAINDB ─── */
.retaindb-section { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.rdb-left { padding: 60px 56px 60px 52px; border-right: 1px solid var(--border); }
.rdb-right { padding: 60px 52px 60px 56px; display: flex; flex-direction: column; justify-content: center; }

/* rounded card for benchmark table */
.bench-card {
  border: 1px solid var(--border); border-radius: 12px;
  overflow: hidden; margin-top: 28px;
  box-shadow: 0 2px 16px rgba(14,13,12,0.04);
}
.bench-table { width: 100%; border-collapse: collapse; }
.bench-table th {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; color: var(--faint);
  font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
  padding: 10px 16px; text-align: left;
  border-bottom: 1px solid var(--border); background: var(--surface);
}
.bench-table td {
  padding: 13px 16px; font-size: 13px; color: var(--body);
  border-bottom: 1px solid var(--border);
}
.bench-table tr:last-child td { border-bottom: none; }
.bench-table .winner { font-weight: 500; color: var(--ink); }
/* winner row highlight + animated left stripe */
.bench-table tbody tr:first-child td { background: rgba(14,13,12,0.018); }
.bench-table tbody tr:first-child td:first-child {
  border-left: 2px solid var(--ink);
  animation: winner-stripe 3s ease-in-out infinite;
}
.bench-bar-wrap { display: flex; align-items: center; gap: 10px; }
.bench-bar-bg { flex: 1; height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
.bench-bar-fill { height: 100%; background: var(--ink); border-radius: 2px; transition: width 1.2s cubic-bezier(.16,1,.3,1); }
.bench-bar-fill.dim { background: var(--border2); }

/* ─── RESEARCH ─── */
.research-section {
  background: var(--ink); position: relative; overflow: hidden;
}
/* dual animated gradient orbs in background */
.research-section::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 65% 55% at 12% 65%, rgba(168,94,26,0.10) 0%, transparent 55%),
    radial-gradient(ellipse 45% 70% at 88% 18%, rgba(80,110,200,0.07) 0%, transparent 55%);
  animation: research-orbs 12s ease-in-out infinite alternate;
}
.research-inner {
  max-width: 1320px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr;
  position: relative; z-index: 1;
}
.research-left { padding: 72px 56px 72px 52px; border-right: 1px solid rgba(255,255,255,0.07); }
.research-right { padding: 72px 52px 72px 56px; }
.research-eyebrow {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: rgba(250,250,249,0.28); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
}
.research-eyebrow::before { content: ''; display: inline-block; width: 16px; height: 1px; background: rgba(255,255,255,0.1); }
.research-title {
  font-family: 'EB Garamond', serif; font-size: clamp(32px, 3.5vw, 52px);
  font-weight: 500; letter-spacing: -0.035em; line-height: 1.05;
  color: var(--bg); margin-bottom: 20px;
}
.research-title em { font-style: italic; font-weight: 400; }
.research-body {
  font-size: 15px; font-weight: 300; line-height: 1.78;
  color: rgba(250,250,249,0.42); margin-bottom: 36px;
}
.research-quote {
  font-family: 'EB Garamond', serif; font-size: 19px; font-style: italic;
  color: rgba(250,250,249,0.58); line-height: 1.5;
  border-left: 1px solid rgba(255,255,255,0.1); padding-left: 24px; margin-bottom: 32px;
}
.research-link {
  font-family: 'JetBrains Mono', monospace; font-size: 11px;
  color: rgba(250,250,249,0.42); text-decoration: none;
  display: inline-flex; align-items: center; gap: 6px;
  transition: color 0.15s, gap 0.22s;
}
.research-link:hover { color: var(--bg); gap: 11px; }

.workstream {
  padding: 22px 0; border-bottom: 1px solid rgba(255,255,255,0.055);
  transition: padding-left 0.26s cubic-bezier(.16,1,.3,1); cursor: default;
}
.workstream:last-child { border-bottom: none; }
.workstream:hover { padding-left: 10px; }
.ws-num {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  color: rgba(250,250,249,0.22); margin-bottom: 8px; letter-spacing: 0.06em;
}
.ws-title {
  font-family: 'EB Garamond', serif; font-size: 20px; font-weight: 500;
  color: rgba(250,250,249,0.84); margin-bottom: 6px; letter-spacing: -0.02em;
}
.ws-body {
  font-size: 13px; font-weight: 300;
  color: rgba(250,250,249,0.35); line-height: 1.65;
}

/* ─── BTL EVERYWHERE ─── */
.btl-everywhere {
  display: grid; grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  max-width: 100%;
}
.btl-ev-left {
  padding: 80px clamp(28px,4vw,56px) 80px 52px;
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 24px;
  position: relative; overflow: hidden;
}
.btl-ev-orb {
  position: absolute; width: 480px; height: 480px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,0.045) 0%, transparent 68%);
  top: 50%; left: 30%; transform: translate(-50%,-50%);
  pointer-events: none; animation: orb-drift-a 14s ease-in-out infinite;
}
.btl-ev-eyebrow {
  display: flex; align-items: center; gap: 10px;
  font-family: 'JetBrains Mono', monospace; font-size: 10.5px;
  color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase;
}
.btl-ev-rule { width: 24px; height: 1px; background: var(--border); flex-shrink: 0; }
.btl-ev-title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(36px,3.8vw,58px); font-weight: 500;
  letter-spacing: -0.035em; line-height: 1.05; color: var(--ink);
}
.btl-ev-title em { font-style: italic; font-weight: 400; }
.btl-ev-body {
  font-size: 16px; font-weight: 300; line-height: 1.78;
  color: var(--body); max-width: 400px;
}
.btl-ev-actions { display: flex; gap: 12px; margin-top: 4px; }

.btl-ev-right {
  padding: 80px clamp(28px,4vw,56px) 80px 52px;
  display: flex; flex-direction: column; justify-content: space-between; gap: 48px;
}
.btl-ev-cards { display: flex; flex-direction: column; gap: 0; }
.btl-ev-card {
  padding: 28px 0; border-bottom: 1px solid var(--border);
  display: flex; flex-direction: column; gap: 8px;
  transition: padding-left 0.22s cubic-bezier(.16,1,.3,1);
}
.btl-ev-card:first-child { padding-top: 0; }
.btl-ev-card:last-child { border-bottom: none; padding-bottom: 0; }
.btl-ev-card:hover { padding-left: 8px; }
.btl-ev-card-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--faint);
}
.btl-ev-card-title {
  font-size: 15px; font-weight: 500; color: var(--ink); line-height: 1.3;
}
.btl-ev-card-body {
  font-size: 13px; font-weight: 300; line-height: 1.72; color: var(--body);
}
.btl-ev-note {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--faint); letter-spacing: 0.04em; line-height: 1.6;
}

/* ─── FOOTER ─── */
.footer { border-top: 1px solid var(--border); }
.footer-cta {
  max-width: 1320px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--border);
}
.footer-cta-left { padding: 64px 56px 64px 52px; border-right: 1px solid var(--border); }
.footer-cta-right {
  padding: 64px 52px 64px 56px; background: var(--ink);
  display: flex; flex-direction: column; justify-content: space-between;
  position: relative; overflow: hidden;
}
/* animated orb in dark footer panel */
.footer-cta-right::before {
  content: ''; position: absolute;
  width: 440px; height: 440px; border-radius: 50%;
  background: radial-gradient(circle, rgba(168,94,26,0.13) 0%, transparent 65%);
  bottom: -160px; right: -90px; pointer-events: none;
  animation: orb-drift-c 13s ease-in-out infinite;
}
.footer-cta-right::after {
  content: ''; position: absolute;
  width: 260px; height: 260px; border-radius: 50%;
  background: radial-gradient(circle, rgba(100,130,220,0.06) 0%, transparent 65%);
  top: -80px; left: -40px; pointer-events: none;
  animation: orb-drift-a 10s ease-in-out infinite reverse;
}
.footer-cta-title {
  font-family: 'EB Garamond', serif;
  font-size: clamp(28px, 3vw, 44px); font-weight: 500;
  letter-spacing: -0.03em; color: var(--ink); margin-bottom: 12px;
}
.footer-cta-title em { font-style: italic; font-weight: 400; }
.footer-cta-sub { font-size: 14px; font-weight: 300; color: var(--body); margin-bottom: 32px; }
.footer-cta-actions { display: flex; gap: 12px; }

.footer-main {
  max-width: 1320px; margin: 0 auto;
  display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 52px 52px 48px; gap: 0;
  border-bottom: 1px solid var(--border);
}
.footer-brand { padding-right: 64px; }
.footer-tagline {
  font-size: 13px; font-weight: 300; color: var(--body);
  line-height: 1.7; max-width: 240px; margin: 14px 0 24px;
}
.footer-col-title {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 500;
  color: var(--faint); letter-spacing: 0.12em; text-transform: uppercase;
  margin-bottom: 18px;
}
.footer-links { display: flex; flex-direction: column; gap: 11px; }
.footer-link {
  font-size: 13.5px; font-weight: 300; color: var(--body);
  text-decoration: none; display: block;
  transition: color 0.15s, padding-left 0.22s cubic-bezier(.16,1,.3,1);
}
.footer-link:hover { color: var(--ink); padding-left: 5px; }
.footer-bottom {
  max-width: 1320px; margin: 0 auto; padding: 20px 52px;
  display: flex; justify-content: space-between; align-items: center;
}
.footer-copy { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); }
.footer-bottom-links { display: flex; gap: 24px; }
.footer-bottom-link {
  font-family: 'JetBrains Mono', monospace; font-size: 10px;
  color: var(--faint); text-decoration: none; transition: color 0.12s;
}
.footer-bottom-link:hover { color: var(--body); }

/* ─────────────────────────────────────────────
   ALL KEYFRAMES
───────────────────────────────────────────── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
/* button light sweep */
@keyframes shimmer-sweep {
  to { transform: translateX(150%); }
}
/* logo mark float */
@keyframes float-gentle {
  0%,100% { transform: translateY(0px) rotate(0deg); }
  33%     { transform: translateY(-5px) rotate(1.2deg); }
  66%     { transform: translateY(-2px) rotate(-0.6deg); }
}
/* small pulsing dot */
@keyframes pulse-dot {
  0%,100% { opacity: 0.3; transform: scale(1); }
  50%     { opacity: 1;   transform: scale(1.55); }
}
/* headline gradient travel */
@keyframes gradient-flow {
  0%   { background-position: 0% 50%; }
  100% { background-position: 240% 50%; }
}
/* ambient orb drifts */
@keyframes orb-drift-a {
  0%,100% { transform: translate(0%,0%) scale(1); }
  25%     { transform: translate(4%,-9%) scale(1.07); }
  50%     { transform: translate(-5%,6%) scale(0.93); }
  75%     { transform: translate(6%,3%) scale(1.04); }
}
@keyframes orb-drift-b {
  0%,100% { transform: translate(0%,0%) scale(1); }
  30%     { transform: translate(-8%,12%) scale(0.88); }
  60%     { transform: translate(10%,-6%) scale(1.12); }
}
@keyframes orb-drift-c {
  0%,100% { transform: translate(0%,0%) scale(1); }
  40%     { transform: translate(-5%,-8%) scale(1.1); }
  70%     { transform: translate(8%,5%) scale(0.92); }
}
/* research section background pulse */
@keyframes research-orbs {
  from { opacity: 0.55; transform: scale(1)   translateX(0%); }
  to   { opacity: 1;    transform: scale(1.1) translateX(2.5%); }
}
/* winner row stripe glow */
@keyframes winner-stripe {
  0%,100% { border-left-color: rgba(14,13,12,0.35); }
  50%     { border-left-color: rgba(14,13,12,1); box-shadow: -2px 0 8px rgba(14,13,12,0.25); }
}

/* ─── RESPONSIVE ─── */
/* hamburger */
.nav-burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  width: 36px; height: 36px; background: none; border: none; cursor: pointer;
  padding: 6px; border-radius: 6px; transition: background .15s;
}
.nav-burger:hover { background: var(--surface); }
.nav-burger span {
  display: block; height: 1.5px; background: var(--ink); border-radius: 2px;
  transition: transform .22s ease, opacity .22s ease, width .22s ease;
  transform-origin: center;
}
.nav-burger span:nth-child(1) { width: 20px; }
.nav-burger span:nth-child(2) { width: 14px; }
.nav-burger span:nth-child(3) { width: 20px; }
.nav-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); width: 20px; }
.nav-burger.open span:nth-child(2) { opacity: 0; }
.nav-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 20px; }

/* mobile drawer */
.nav-drawer {
  position: fixed; top: 56px; left: 0; right: 0; z-index: 999;
  background: rgba(250,250,249,.97); backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--border);
  display: flex; flex-direction: column;
  padding: 8px 0 20px;
  animation: drawer-in .2s ease;
}
@keyframes drawer-in {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.nav-drawer-link {
  padding: 14px 20px; font-size: 15px; color: var(--body);
  text-decoration: none; transition: color .12s, background .12s;
  font-family: 'DM Sans', sans-serif;
}
.nav-drawer-link:hover { color: var(--ink); background: var(--surface); }
.nav-drawer-divider { height: 1px; background: var(--border); margin: 8px 0; }
.nav-drawer-cta {
  margin: 8px 20px 0; padding: 12px 20px; border-radius: 8px;
  background: var(--ink); color: var(--bg) !important;
  text-align: center; font-size: 14px; font-weight: 500;
  text-decoration: none; font-family: 'DM Sans', sans-serif;
  transition: opacity .12s;
}
.nav-drawer-cta:hover { opacity: .84; }

/* hack banner mobile */
@media (max-width: 640px) {
  .hack-banner { padding: 12px 16px; gap: 8px; }
  .hack-banner-copy { display: none; }
  .hack-banner-sep  { display: none; }
}

@media (max-width: 900px) {
  .nav { padding: 0 16px; }
  .nav-links { display: none; }
  .nav-burger { display: flex; }

  /* hero */
  .hero { grid-template-columns: 1fr; min-height: auto; }
  .hero-left { padding: 48px 20px 44px; border-right: none; border-bottom: 1px solid var(--border); }
  .hero-right { min-height: 340px; }
  .hero-actions { flex-direction: column; align-items: stretch; }
  .btn-hero-p,.btn-hero-g { text-align: center; justify-content: center; }
  .hero-stats { flex-direction: column; gap: 20px; padding-top: 24px; }
  .stat + .stat { padding-left: 0; border-left: none; border-top: 1px solid var(--border); padding-top: 20px; }

  /* products / sections */
  .section-header { flex-direction: column; align-items: flex-start; gap: 20px; padding: 48px 20px 36px; }
  .section-desc { text-align: left; max-width: 100%; }
  .products-section { max-width: 100%; }
  .marrow-section,.retaindb-section,.research-inner,.footer-cta,.footer-main,.btl-everywhere { grid-template-columns: 1fr; }
  .marrow-left,.rdb-left,.research-left,.footer-cta-left,.btl-ev-left { border-right: none; border-bottom: 1px solid var(--border); padding: 44px 20px 40px; }
  .btl-ev-right { padding: 44px 20px 48px; }
  .marrow-right,.rdb-right,.research-right { padding: 40px 20px 44px; }
  .marrow-right { min-height: 280px; }
  .footer-cta-right { padding: 44px 20px; }
  .footer-main { padding: 44px 20px 40px; gap: 36px; }
  .footer-brand { padding-right: 0; }
  .footer-bottom { flex-direction: column; align-items: flex-start; gap: 12px; padding: 20px; }

  /* marquee */
  .marquee-wrap { border-top: none; }
}

/* ── THESIS SECTION ── */
.thesis-wrap { max-width: 1320px; margin: 0 auto; }
.thesis-statement { padding: 96px 52px 80px; border-bottom: 1px solid var(--border); }
.thesis-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 36px; }
.thesis-eyebrow-rule { width: 24px; height: 1px; background: var(--border); }
.thesis-eyebrow-text { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; }
.thesis-headline { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(40px, 5.5vw, 82px); font-weight: 500; letter-spacing: -0.04em; line-height: 1.0; color: var(--ink); max-width: 1100px; }
.thesis-headline em { font-style: italic; font-weight: 400; }
.what-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.what-left { padding: 64px 56px 64px 52px; border-right: 1px solid var(--border); display: flex; flex-direction: column; justify-content: space-between; }
.what-right { padding: 64px 52px 64px 56px; display: flex; flex-direction: column; gap: 0; }
.what-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
.what-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--border); }
.what-title { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(28px, 3vw, 44px); font-weight: 500; letter-spacing: -0.03em; line-height: 1.08; color: var(--ink); margin-bottom: 24px; }
.what-title em { font-style: italic; font-weight: 400; }
.what-body { font-size: 15.5px; font-weight: 300; line-height: 1.78; color: var(--body); margin-bottom: 36px; max-width: 420px; }
.identity-chips { display: flex; flex-direction: column; gap: 0; }
.identity-chip { display: flex; align-items: center; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); }
.identity-chip:first-child { border-top: 1px solid var(--border); }
.ic-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); width: 24px; flex-shrink: 0; }
.ic-body { flex: 1; }
.ic-title { font-family: 'EB Garamond', Georgia, serif; font-size: 19px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 4px; }
.ic-desc { font-size: 13px; font-weight: 300; color: var(--body); line-height: 1.55; }
.capabilities-label { padding: 32px 52px 28px; border-bottom: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; display: flex; align-items: center; gap: 10px; }
.capabilities-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--border); }
.capabilities-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.cap-cell { padding: 48px 52px; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); position: relative; overflow: hidden; transition: background 0.2s; }
.cap-cell:hover { background: var(--surface); }
.cap-cell:nth-child(even) { border-right: none; }
.cap-cell:nth-child(3), .cap-cell:nth-child(4) { border-bottom: none; }
.cap-bg-num { position: absolute; top: -20px; right: 16px; font-family: 'EB Garamond', Georgia, serif; font-size: 140px; font-weight: 700; letter-spacing: -0.06em; color: var(--surface); line-height: 1; user-select: none; transition: color 0.2s; }
.cap-cell:hover .cap-bg-num { color: var(--border); }
.cap-num-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; position: relative; z-index: 1; }
.cap-heading { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(22px, 2.4vw, 34px); font-weight: 500; letter-spacing: -0.03em; color: var(--ink); line-height: 1.1; margin-bottom: 16px; position: relative; z-index: 1; }
.cap-heading em { font-style: italic; font-weight: 400; }
.cap-body { font-size: 14px; font-weight: 300; line-height: 1.75; color: var(--body); max-width: 380px; position: relative; z-index: 1; }
.not-section { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.not-left { padding: 60px 56px 60px 52px; border-right: 1px solid var(--border); }
.not-right { padding: 60px 52px 60px 56px; }
.not-title { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(26px, 2.8vw, 40px); font-weight: 500; letter-spacing: -0.03em; color: var(--ink); margin-bottom: 8px; }
.not-title em { font-style: italic; font-weight: 400; }
.not-sub { font-size: 14px; font-weight: 300; color: var(--body); line-height: 1.7; max-width: 340px; margin-bottom: 36px; }
.not-list { display: flex; flex-direction: column; gap: 0; }
.not-row { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--border); }
.not-row:first-child { border-top: 1px solid var(--border); }
.not-x { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--border2); flex-shrink: 0; width: 16px; }
.not-text { font-size: 14px; color: var(--body); }
.yes-list { display: flex; flex-direction: column; gap: 0; }
.yes-row { display: flex; align-items: flex-start; gap: 14px; padding: 18px 0; border-bottom: 1px solid var(--border); }
.yes-row:first-child { border-top: 1px solid var(--border); }
.yes-check { width: 18px; height: 18px; border-radius: 50%; background: var(--ink); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.yes-title { font-size: 14px; font-weight: 500; color: var(--ink); margin-bottom: 3px; }
.yes-desc { font-size: 12.5px; font-weight: 300; color: var(--body); line-height: 1.55; }
.closing { padding: 80px 52px; background: var(--ink); text-align: center; }
.closing-text { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(28px, 3.5vw, 52px); font-weight: 500; letter-spacing: -0.04em; line-height: 1.1; color: rgba(250,250,249,0.9); max-width: 820px; margin: 0 auto 32px; }
.closing-text em { font-style: italic; font-weight: 400; color: rgba(250,250,249,0.6); }
.closing-sub { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(250,250,249,0.3); letter-spacing: 0.06em; }

/* ── RAISE SECTION ── */
.raise-wrap { max-width: 1320px; margin: 0 auto; }
.raise-header { padding: 88px 52px 60px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-end; justify-content: space-between; gap: 48px; }
.raise-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
.raise-eyebrow-rule { width: 24px; height: 1px; background: var(--border); }
.raise-eyebrow-text { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; }
.raise-title { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(38px, 4.5vw, 68px); font-weight: 500; letter-spacing: -0.04em; line-height: 1.0; color: var(--ink); }
.raise-title em { font-style: italic; font-weight: 400; }
.raise-header-right { max-width: 300px; text-align: right; flex-shrink: 0; }
.raise-header-desc { font-size: 14px; font-weight: 300; color: var(--body); line-height: 1.75; margin-bottom: 12px; }
.raise-header-note { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); }
.raise-grid { display: grid; grid-template-columns: 1fr 1fr; border-bottom: 1px solid var(--border); }
.raise-left { padding: 60px 56px 64px 52px; border-right: 1px solid var(--border); }
.beliefs-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
.beliefs-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--border); }
.beliefs-intro { font-size: 15px; font-weight: 300; color: var(--body); line-height: 1.75; margin-bottom: 36px; max-width: 400px; }
.belief-list { display: flex; flex-direction: column; gap: 0; }
.belief-row { display: flex; align-items: flex-start; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--border); }
.belief-row:first-child { border-top: 1px solid var(--border); }
.belief-check { width: 18px; height: 18px; border-radius: 50%; border: 1.5px solid var(--border2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
.belief-text { font-size: 14px; color: var(--ink); line-height: 1.6; }
.belief-text strong { font-weight: 500; }
.raise-right { padding: 60px 52px 64px 56px; display: flex; flex-direction: column; justify-content: space-between; }
.contact-head { margin-bottom: 40px; }
.contact-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
.contact-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--border); }
.contact-title { font-family: 'EB Garamond', Georgia, serif; font-size: 28px; font-weight: 500; letter-spacing: -0.03em; color: var(--ink); margin-bottom: 12px; }
.contact-title em { font-style: italic; font-weight: 400; }
.contact-body { font-size: 14px; font-weight: 300; color: var(--body); line-height: 1.75; max-width: 360px; }
.contact-form { display: flex; flex-direction: column; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 7px; }
.field-label { font-size: 12.5px; font-weight: 500; color: var(--body); }
.field-input { height: 42px; padding: 0 14px; border: 1px solid var(--border); border-radius: 7px; background: var(--bg); color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.12s; width: 100%; }
.field-input:focus { border-color: var(--ink); }
.field-input::placeholder { color: var(--faint); }
.field-textarea { padding: 12px 14px; height: 108px; resize: none; border: 1px solid var(--border); border-radius: 7px; background: var(--bg); color: var(--ink); font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.12s; width: 100%; line-height: 1.6; }
.field-textarea:focus { border-color: var(--ink); }
.field-textarea::placeholder { color: var(--faint); }
.field-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.submit-btn { width: 100%; height: 44px; border-radius: 7px; background: var(--ink); color: var(--bg); font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; border: none; cursor: pointer; transition: opacity 0.12s; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 4px; }
.submit-btn:hover { opacity: 0.84; }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.form-note { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: var(--faint); text-align: center; margin-top: 8px; line-height: 1.6; }
.form-note a { color: var(--body); text-decoration: none; }
.form-note a:hover { color: var(--ink); }
.success-state { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; flex: 1; padding: 40px 0; }
.success-icon { width: 52px; height: 52px; border-radius: 50%; background: var(--ink); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
.success-title { font-family: 'EB Garamond', Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink); margin-bottom: 10px; }
.success-body { font-size: 14px; font-weight: 300; color: var(--body); line-height: 1.7; max-width: 320px; }
.need-section { background: var(--ink); padding: 72px 52px; }
.need-inner { max-width: 1320px; margin: 0 auto; }
.need-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(250,250,249,0.3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
.need-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: rgba(255,255,255,0.1); }
.need-title { font-family: 'EB Garamond', Georgia, serif; font-size: clamp(28px, 3vw, 44px); font-weight: 500; letter-spacing: -0.035em; color: rgba(250,250,249,0.9); margin-bottom: 48px; line-height: 1.1; }
.need-title em { font-style: italic; font-weight: 400; }
.need-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; border-top: 1px solid rgba(255,255,255,0.08); }
.need-cell { padding: 32px 0; border-right: 1px solid rgba(255,255,255,0.08); padding-right: 40px; }
.need-cell + .need-cell { padding-left: 40px; }
.need-cell:last-child { border-right: none; }
.need-cell-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(250,250,249,0.2); margin-bottom: 12px; letter-spacing: 0.06em; }
.need-cell-title { font-family: 'EB Garamond', Georgia, serif; font-size: 20px; font-weight: 500; color: rgba(250,250,249,0.82); margin-bottom: 8px; letter-spacing: -0.02em; }
.need-cell-body { font-size: 13px; font-weight: 300; color: rgba(250,250,249,0.38); line-height: 1.65; }
.email-strip { border-top: 1px solid var(--border); padding: 32px 52px; display: flex; align-items: center; justify-content: space-between; background: var(--surface); }
.email-left { font-size: 13.5px; color: var(--body); }
.email-link { font-family: 'EB Garamond', Georgia, serif; font-size: 20px; font-weight: 500; letter-spacing: -0.02em; color: var(--ink); text-decoration: none; display: flex; align-items: center; gap: 10px; transition: opacity 0.12s; }
.email-link:hover { opacity: 0.7; }

@media (max-width: 860px) {
  .thesis-statement { padding: 56px 20px 48px; }
  .what-grid,.not-section { grid-template-columns: 1fr; }
  .what-left { padding: 44px 20px 40px; border-right: none; border-bottom: 1px solid var(--border); }
  .what-right { padding: 40px 20px 44px; }
  .capabilities-label { padding: 24px 20px 20px; }
  .capabilities-grid { grid-template-columns: 1fr; }
  .cap-cell { padding: 36px 20px; border-right: none !important; }
  .cap-cell:nth-child(3),.cap-cell:nth-child(4) { border-bottom: 1px solid var(--border); }
  .cap-cell:last-child { border-bottom: none; }
  .not-left { padding: 44px 20px 40px; border-right: none; border-bottom: 1px solid var(--border); }
  .not-right { padding: 40px 20px 44px; }
  .closing { padding: 48px 20px; }
  .raise-header { flex-direction: column; align-items: flex-start; gap: 20px; padding: 52px 20px 40px; }
  .raise-header-right { text-align: left; max-width: 100%; }
  .raise-grid { grid-template-columns: 1fr; }
  .raise-left { padding: 44px 20px 40px; border-right: none; border-bottom: 1px solid var(--border); }
  .raise-right { padding: 40px 20px 44px; }
  .need-section { padding: 48px 20px; }
  .need-grid { grid-template-columns: 1fr; }
  .need-cell { padding: 24px 0; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .need-cell + .need-cell { padding-left: 0; }
  .need-cell:last-child { border-bottom: none; }
  .email-strip { flex-direction: column; align-items: flex-start; gap: 12px; padding: 28px 20px; }
  .field-row-2 { grid-template-columns: 1fr; }
  .btl-ev-left { padding: 48px 20px 40px; }
  .btl-ev-right { padding: 40px 20px 52px; }
}
`;

/* ─────────────────────────────────────────────
   CURSOR GLOW
───────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      el.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL — fades + slides in on viewport entry
───────────────────────────────────────────── */
type RevealDir = 'up' | 'left' | 'right' | 'scale';
function Reveal({
  children, delay = 0, direction = 'up', style: extraStyle = {},
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: RevealDir;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const hidden: Record<RevealDir, string> = {
    up:    'translateY(28px)',
    left:  'translateX(-28px)',
    right: 'translateX(28px)',
    scale: 'scale(0.93) translateY(14px)',
  };
  return (
    <div
      ref={ref}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'none' : hidden[direction],
        transition: `opacity 0.85s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.85s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COUNT-UP — animates a number into view
───────────────────────────────────────────── */
function CountUp({ end, suffix = '', prefix = '' }: { end: number; suffix?: string; prefix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const start = performance.now();
        const dur = 1800;
        const tick = (now: number) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          setN(Math.round(eased * end));
          if (p < 1) requestAnimationFrame(tick);
          else setN(end);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{prefix}{n}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON — drifts toward cursor on hover
───────────────────────────────────────────── */
function MagneticBtn({
  children, href = '#', className = '', style: extraStyle = {},
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.3;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.3;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
    el.style.transition = 'transform 0.08s ease';
  }, []);
  const leave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.transition = 'transform 0.5s cubic-bezier(.16,1,.3,1)';
  }, []);
  return (
    <a ref={ref} href={href} className={className} style={extraStyle}
       onMouseMove={move} onMouseLeave={leave}>
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────
   ORBITAL CANVAS — 3-D ring system with comets
───────────────────────────────────────────── */
function OrbitalCanvas({ dark = true }: { dark?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0, t = 0;

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    resize();
    window.addEventListener('resize', resize);

    const ink = dark ? 'rgba(250,250,249,' : 'rgba(14,13,12,';

    const orbits = [
      { rx: 0.38, ry: 0.145, tilt: 0,   speed: 0.0008, n: 120, lw: 0.5 },
      { rx: 0.30, ry: 0.110, tilt: 65,  speed: 0.0011, n: 90,  lw: 0.5 },
      { rx: 0.22, ry: 0.090, tilt: 130, speed: 0.0015, n: 60,  lw: 0.4 },
      { rx: 0.14, ry: 0.060, tilt: 40,  speed: 0.0020, n: 40,  lw: 0.35 },
    ];

    // comets: fast-moving bright streaks along an orbit
    type Comet = { orb: number; angle: number; tail: { x: number; y: number; a: number }[] };
    const comets: Comet[] = [];
    const COMET_SPEED = 0.045;

    const spawnComet = () => {
      if (comets.length < 4) {
        comets.push({ orb: Math.floor(Math.random() * orbits.length), angle: Math.random() * Math.PI * 2, tail: [] });
      }
    };

    // data readouts in corners
    const readouts = [
      { x: 0.10, y: 0.18, vals: ['0%', '0.0%', '—'],  cur: 0, label: 'halluc' },
      { x: 0.84, y: 0.16, vals: ['79%', '79.1%', '79%'], cur: 0, label: 'recall' },
      { x: 0.09, y: 0.78, vals: ['88%', '87.9%', '88%'], cur: 0, label: 'single' },
      { x: 0.80, y: 0.80, vals: ['<40ms', '38ms', '<40ms'], cur: 0, label: 'p95' },
    ];

    let lastReadoutFlip = 0;

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.5, cy = H * 0.5;

      // spawn a comet every ~150 frames
      if (t % 150 === 0) spawnComet();

      orbits.forEach((orb, oi) => {
        const rx = W * orb.rx, ry = H * orb.ry;
        const tr = orb.tilt * Math.PI / 180;
        const ct = Math.cos(tr), st = Math.sin(tr);
        const base = 0.12 + oi * 0.04;

        // orbit ring
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.02; a += 0.02) {
          const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
          const x = cx + ex * ct - ey * st;
          const y = cy + ex * st + ey * ct;
          a < 0.021 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = ink + base * 0.45 + ')';
        ctx.lineWidth = orb.lw;
        ctx.stroke();

        // particles
        for (let p = 0; p < orb.n; p++) {
          const a = (p / orb.n) * Math.PI * 2 + t * orb.speed;
          const ex = rx * Math.cos(a), ey = ry * Math.sin(a);
          const x = cx + ex * ct - ey * st;
          const y = cy + ex * st + ey * ct;
          const bright = (Math.sin(a * 2 + oi) + 1) / 2;
          const r = (0.35 + bright * 1.1) * (1 - oi * 0.14);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = ink + (0.07 + bright * 0.32) + ')';
          ctx.fill();
        }
      });

      // comets
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        const orb = orbits[c.orb];
        const rx = W * orb.rx, ry = H * orb.ry;
        const tr = orb.tilt * Math.PI / 180;
        const ct = Math.cos(tr), st = Math.sin(tr);
        const ex = rx * Math.cos(c.angle), ey = ry * Math.sin(c.angle);
        const hx = cx + ex * ct - ey * st;
        const hy = cy + ex * st + ey * ct;

        // add to tail
        c.tail.push({ x: hx, y: hy, a: 1 });
        if (c.tail.length > 22) c.tail.shift();

        // draw tail
        c.tail.forEach((pt, ti) => {
          const frac = (ti + 1) / c.tail.length;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, frac * 1.6, 0, Math.PI * 2);
          ctx.fillStyle = ink + frac * 0.75 + ')';
          ctx.fill();
        });

        c.angle += COMET_SPEED;
        if (c.tail.length >= 22 && c.tail.length % 22 === 0) {
          comets.splice(i, 1);
        }
      }

      // nucleus
      const nr = Math.min(W, H) * 0.024;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, nr * 2.2);
      g.addColorStop(0,   ink + '0.9)');
      g.addColorStop(0.4, ink + '0.45)');
      g.addColorStop(1,   ink + '0)');
      ctx.beginPath(); ctx.arc(cx, cy, nr * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, nr * 0.48, 0, Math.PI * 2);
      ctx.fillStyle = ink + '1)'; ctx.fill();

      // data readouts — flip value every 90 frames
      if (t - lastReadoutFlip > 90) {
        lastReadoutFlip = t;
        readouts.forEach(r => { r.cur = (r.cur + 1) % r.vals.length; });
      }
      readouts.forEach(dp => {
        const px = dp.x * W, py = dp.y * H;
        const pulse = Math.sin(t * 0.022 + dp.x * 10) * 0.28 + 0.72;
        ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2);
        ctx.fillStyle = ink + 0.55 * pulse + ')'; ctx.fill();
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = ink + 0.28 * pulse + ')';
        ctx.fillText(dp.vals[dp.cur], px + 9, py + 4);
        ctx.font = '8px JetBrains Mono, monospace';
        ctx.fillStyle = ink + 0.14 * pulse + ')';
        ctx.fillText(dp.label, px + 9, py + 14);
      });

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [dark]);

  return (
    <canvas ref={canvasRef} className="hero-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }} />
  );
}

/* ─────────────────────────────────────────────
   MARROW CANVAS — node graph with data pulses
───────────────────────────────────────────── */
function MarrowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0, t = 0;

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    resize();
    window.addEventListener('resize', resize);

    const nodes = Array.from({ length: 26 }, () => ({
      x:  Math.random() * 0.82 + 0.09,
      y:  Math.random() * 0.82 + 0.09,
      vx: (Math.random() - 0.5) * 0.00028,
      vy: (Math.random() - 0.5) * 0.00028,
      r:  Math.random() * 2.4 + 0.9,
      phase: Math.random() * Math.PI * 2,
      active: Math.random() > 0.55,
    }));

    // data pulses travelling along edges
    type Pulse = { a: number; b: number; t: number; speed: number };
    const pulses: Pulse[] = [];

    const spawnPulse = () => {
      const actives = nodes.map((n, i) => n.active ? i : -1).filter(i => i >= 0);
      if (actives.length >= 2) {
        const a = actives[Math.floor(Math.random() * actives.length)];
        let b = a;
        while (b === a) b = actives[Math.floor(Math.random() * actives.length)];
        pulses.push({ a, b, t: 0, speed: 0.018 + Math.random() * 0.014 });
      }
    };

    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, W, H);

      if (t % 55 === 0) spawnPulse();

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0.06 || n.x > 0.94) n.vx *= -1;
        if (n.y < 0.06 || n.y > 0.94) n.vy *= -1;
      });

      const maxD = Math.min(W, H) * 0.30;

      // edges
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return;
          const ax = a.x * W, ay = a.y * H;
          const bx = b.x * W, by = b.y * H;
          const d = Math.hypot(ax - bx, ay - by);
          if (d < maxD) {
            ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(250,250,249,${(1 - d / maxD) * 0.13})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });

      // data pulses — bright dot travelling from node a → node b
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const na = nodes[p.a], nb = nodes[p.b];
        const px = (na.x + (nb.x - na.x) * p.t) * W;
        const py = (na.y + (nb.y - na.y) * p.t) * H;
        // glow
        const grd = ctx.createRadialGradient(px, py, 0, px, py, 8);
        grd.addColorStop(0, 'rgba(250,250,249,0.9)');
        grd.addColorStop(1, 'rgba(250,250,249,0)');
        ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
        ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(250,250,249,1)'; ctx.fill();
      }

      // nodes
      nodes.forEach(n => {
        const x = n.x * W, y = n.y * H;
        const pulse = (Math.sin(t * 0.032 + n.phase) + 1) / 2;
        const alpha = n.active ? 0.38 + pulse * 0.52 : 0.07 + pulse * 0.09;
        const r = n.active ? n.r * (1 + pulse * 0.45) : n.r;
        if (n.active) {
          const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
          grd.addColorStop(0, `rgba(250,250,249,${alpha * 0.35})`);
          grd.addColorStop(1, 'rgba(250,250,249,0)');
          ctx.beginPath(); ctx.arc(x, y, r * 5, 0, Math.PI * 2);
          ctx.fillStyle = grd; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250,250,249,${alpha})`; ctx.fill();
      });

      // scanning sweep line
      const sy = (t * 0.55) % H;
      const sg = ctx.createLinearGradient(0, sy - 24, 0, sy + 24);
      sg.addColorStop(0, 'rgba(250,250,249,0)');
      sg.addColorStop(0.5, 'rgba(250,250,249,0.045)');
      sg.addColorStop(1, 'rgba(250,250,249,0)');
      ctx.fillStyle = sg;
      ctx.fillRect(0, sy - 24, W, 48);

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} className="hero-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }} />
  );
}

/* ─────────────────────────────────────────────
   ORBITAL MARK (logo)
───────────────────────────────────────────── */
function OrbitalMark({ size = 28, color = "#0E0D0C" }: { size?: number; color?: string }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <ellipse cx={r} cy={r} rx={size*0.42} ry={size*0.23} stroke={color} strokeWidth="1.2" fill="none"/>
      <ellipse cx={r} cy={r} rx={size*0.42} ry={size*0.23} stroke={color} strokeWidth="1.2" fill="none"
        transform={`rotate(65 ${r} ${r})`}/>
      <circle cx={r} cy={r} r={size*0.063} fill={color}/>
      <circle cx={r + size*0.42*0.95} cy={r} r={size*0.042} fill={color}/>
    </svg>
  );
}

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const marrow_items = [
  { n: '01', t: 'Reads your entire screen in real time',              tag: 'perception'   },
  { n: '02', t: 'Builds context silently from everything you do',     tag: 'memory'       },
  { n: '03', t: 'Decides when stepping in is actually worth it',      tag: 'judgment'     },
  { n: '04', t: 'Browses the web, writes code, moves files, uses your apps', tag: 'action' },
  { n: '05', t: 'Learns your patterns and turns them into tools',     tag: 'compounding'  },
];

const marquee_items = [
  'Persistent context', 'Selective attention', 'Native action',
  'Continuous improvement', 'Intelligence as compression',
  'Memory infrastructure', 'Causal reasoning', 'Ambient presence',
];

/* ─── THESIS DATA ─── */
type CapItem = { n: string; heading: React.ReactNode; body: string };
const thesis_capabilities: CapItem[] = [
  { n: '01', heading: <>Persistent<br/><em>context.</em></>, body: "AI systems need structured, reliable memory across sessions, tools, and workflows. Not a bigger prompt window. A real memory layer — one that stores what matters and retrieves it accurately when it matters." },
  { n: '02', heading: <>Selective<br/><em>attention.</em></>, body: "Systems should not surface everything they detect. They need taste, prioritization, and restraint. The goal is not to be helpful all the time — it is to show up only when the signal is high enough." },
  { n: '03', heading: <>Native<br/><em>action.</em></>, body: "AI should not stop at suggestion. It should execute meaningful work. Browse the web, write code, manage files, run tasks end to end. The machine should be able to follow through." },
  { n: '04', heading: <>Continuous<br/><em>improvement.</em></>, body: "The system should become more useful over time by learning the user's patterns, tools, and repeated tasks — without being explicitly programmed to. Intelligence that compounds." },
];
const thesis_not_us = ["A model company", "An AI wrapper", "A chatbot", "A features team", "Another LLM startup"];
const thesis_yes_us = [
  { title: "A research lab", desc: "We investigate how intelligence perceives, reasons, and acts. We publish what we find. We build on what we learn." },
  { title: "A product studio", desc: "We ship. Research without product is just paper. Product without research is just imitation." },
  { title: "An infrastructure company", desc: "We build the substrate layer — the memory, retrieval, context, and ambient presence that makes AI genuinely useful." },
];

function ThesisSection() {
  return (
    <section style={{ borderTop: '1px solid var(--border)' }}>
      <div className="thesis-wrap">
        <Reveal>
          <div className="thesis-statement">
            <div className="thesis-eyebrow">
              <div className="thesis-eyebrow-rule"/>
              <span className="thesis-eyebrow-text">Our thesis</span>
            </div>
            <h2 className="thesis-headline">
              We research how intelligence<br/>
              <em>perceives, reasons, and acts</em> —<br/>
              and build the infrastructure<br/>
              that makes it possible.
            </h2>
          </div>
        </Reveal>

        <div className="what-grid">
          <div className="what-left">
            <Reveal>
              <div>
                <div className="what-label">What we are</div>
                <h3 className="what-title">A product and<br/>research lab.</h3>
                <p className="what-body">
                  We are not a model company. We are not an AI wrapper. We are building the substrate layer
                  that makes AI genuinely useful inside real workflows — the memory, the retrieval, the context,
                  and the ambient presence that connects intelligence to how people actually work.
                </p>
                <p className="what-body" style={{ marginBottom: 0 }}>
                  Research without product is just paper. Product without research is just imitation.
                  We do both — because neither alone is enough.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="what-right">
            <Reveal delay={80} direction="right">
              <div className="what-label">How we are structured</div>
              <div className="identity-chips">
                {thesis_yes_us.map((item, i) => (
                  <div className="identity-chip" key={i}>
                    <span className="ic-num">0{i + 1}</span>
                    <div className="ic-body">
                      <div className="ic-title">{item.title}</div>
                      <div className="ic-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
                {thesis_not_us.map((item, i) => (
                  <div className="identity-chip" key={'n' + i}>
                    <span className="ic-num" style={{ color: 'var(--border2)' }}>✕</span>
                    <div className="ic-body">
                      <div className="ic-title" style={{ color: 'var(--faint)', fontStyle: 'normal', fontWeight: 400, fontSize: 16 }}>{item}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="capabilities-label">The four capabilities we are building toward</div>
        </Reveal>
        <div className="capabilities-grid">
          {thesis_capabilities.map((cap, i) => (
            <Reveal key={cap.n} delay={i * 60} direction={i % 2 === 0 ? 'left' : 'right'}>
              <div className="cap-cell">
                <div className="cap-bg-num">0{i + 1}</div>
                <div className="cap-num-label">{cap.n}</div>
                <h4 className="cap-heading">{cap.heading}</h4>
                <p className="cap-body">{cap.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="not-section">
          <div className="not-left">
            <Reveal direction="left">
              <div className="what-label">What we are not</div>
              <h3 className="not-title">Not a model.<br/>Not a wrapper.<br/><em>Not a chatbot.</em></h3>
              <p className="not-sub">
                The common pattern: bolt AI onto existing software. Optimize for engagement. Ship a demo. Call it an agent. We have no interest in that.
              </p>
              <div className="not-list">
                {thesis_not_us.map((item, i) => (
                  <div className="not-row" key={i}>
                    <span className="not-x">✕</span>
                    <span className="not-text">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
          <div className="not-right">
            <Reveal direction="right">
              <div className="what-label">What we are building</div>
              <h3 className="not-title">The substrate layer<br/>for <em>AI-native computing.</em></h3>
              <p className="not-sub">
                The current generation of AI products is limited in predictable ways. They forget too much. They retrieve the wrong context. They interrupt without judgment. They can generate, but rarely follow through.
              </p>
              <div className="yes-list">
                {thesis_yes_us.map((item, i) => (
                  <div className="yes-row" key={i}>
                    <div className="yes-check">
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5l2.5 2.5L8 1" stroke="#FAFAF9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <div className="yes-title">{item.title}</div>
                      <div className="yes-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal>
          <div className="closing">
            <p className="closing-text">
              &ldquo;The goal of Bad Theory Labs is not to ship isolated AI features.<br/>
              The goal is to help define <em>a new interface to computing.</em>&rdquo;
            </p>
            <div className="closing-sub">Bad Theory Labs · Investor Brief · 2025</div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── RAISE DATA ─── */
type BeliefItem = { text: React.ReactNode };
const raise_beliefs: BeliefItem[] = [
  { text: <>Memory and context are <strong>foundational layers</strong> in the agent stack — not features to be bolted on.</> },
  { text: <>Proactive, ambient software will become a <strong>major product category</strong> in the next five years.</> },
  { text: <>Desktop and workflow-native agents will matter as much as browser agents — maybe more.</> },
  { text: <><strong>Judgment and restraint</strong> are underrated differentiators in AI products. Taste is a moat.</> },
  { text: <>A research-driven lab can produce both <strong>critical infrastructure</strong> and defining end-user experiences.</> },
];
const raise_needs = [
  { n: '01', title: 'Capital', body: "To accelerate Marrow and RetainDB development, ship a private beta, build the task-aware retrieval API, grow RetainDB's managed cloud tier, and make the first engineering hire." },
  { n: '02', title: 'Strategic alignment', body: 'Investors who believe in the vision and can provide product conviction, network support, and patience for a large thesis that starts with early signals.' },
  { n: '03', title: 'Not just capital', body: 'The right partner thinks in years, not quarters. We are building infrastructure — the kind that becomes foundational before it becomes obvious.' },
];

function RaiseSection() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', fund: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.fund,
          subject: 'Investor inquiry from landing page',
          message: form.message || 'No message provided.',
        }),
      });

      const data = await response.json() as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || 'Unable to send message right now.');
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send message right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={{ borderTop: '1px solid var(--border)' }}>
      <div className="raise-wrap">
        <Reveal>
          <div className="raise-header">
            <div>
              <div className="raise-eyebrow">
                <div className="raise-eyebrow-rule"/>
                <span className="raise-eyebrow-text">Pre-seed raise</span>
              </div>
              <h2 className="raise-title">We are raising.<br/><em>We are selective.</em></h2>
            </div>
            <div className="raise-header-right">
              <p className="raise-header-desc">Looking for investors who share conviction about where intelligence is going — not just capital.</p>
              <p className="raise-header-note">Pre-seed · early 2025 · hello@badtheorylabs.com</p>
            </div>
          </div>
        </Reveal>

        <div className="raise-grid">
          <div className="raise-left">
            <Reveal direction="left">
              <div className="beliefs-label">We are looking for investors who believe</div>
              <p className="beliefs-intro">Not a checklist. A real filter. If at least one of these resonates — we should talk.</p>
              <div className="belief-list">
                {raise_beliefs.map((b, i) => (
                  <div className="belief-row" key={i}>
                    <div className="belief-check">
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2L7 1" stroke="var(--border2)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="belief-text">{b.text}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="raise-right">
            <Reveal direction="right">
              {!sent ? (
                <>
                  <div className="contact-head">
                    <div className="contact-label">Get in touch</div>
                    <h3 className="contact-title">If this resonates,<br/><em>let&apos;s talk.</em></h3>
                    <p className="contact-body">We reply to every message. No deck required to start — a paragraph about why you&apos;re interested is enough.</p>
                  </div>
                  <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="field-row-2">
                      <div className="field">
                        <label className="field-label">Your name</label>
                        <input className="field-input" type="text" placeholder="Your name" value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })} required/>
                      </div>
                      <div className="field">
                        <label className="field-label">Fund / firm</label>
                        <input className="field-input" type="text" placeholder="Fund or firm name" value={form.fund}
                          onChange={e => setForm({ ...form, fund: e.target.value })}/>
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">Email</label>
                      <input className="field-input" type="email" placeholder="you@fund.com" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })} required/>
                    </div>
                    <div className="field">
                      <label className="field-label">Why you&apos;re interested</label>
                      <textarea className="field-textarea"
                        placeholder="Which belief above resonates? What are you seeing in the market? A paragraph is fine."
                        value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}/>
                    </div>
                    <button className="submit-btn" type="submit" disabled={loading}>
                      {loading ? 'Sending…' : (
                        <>
                          Send to hello@badtheorylabs.com
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M2 6.5h9M7 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </>
                      )}
                    </button>
                    <p className="form-note">
                      Or email directly: <a href="mailto:hello@badtheorylabs.com">hello@badtheorylabs.com</a>
                    </p>
                    {error ? <p className="form-note" style={{ color: '#8f2020' }}>{error}</p> : null}
                  </form>
                </>
              ) : (
                <div className="success-state">
                  <div className="success-icon">
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                      <path d="M1 8l6 6L19 1" stroke="var(--bg)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="success-title">Message sent.</div>
                  <p className="success-body">We reply to every message personally. You&apos;ll hear from us at hello@badtheorylabs.com — usually within 24 hours.</p>
                </div>
              )}
            </Reveal>
          </div>
        </div>
      </div>

      <div className="need-section">
        <div className="need-inner">
          <Reveal>
            <div className="need-label">What we need most</div>
            <h3 className="need-title">Not just capital.<br/><em>Conviction and alignment.</em></h3>
            <div className="need-grid">
              {raise_needs.map((n) => (
                <div className="need-cell" key={n.n}>
                  <div className="need-cell-num">{n.n}</div>
                  <div className="need-cell-title">{n.title}</div>
                  <div className="need-cell-body">{n.body}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="email-strip">
        <span className="email-left">Prefer to reach out directly?</span>
        <a className="email-link" href="mailto:hello@badtheorylabs.com">
          hello@badtheorylabs.com
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────── */
export default function BTLLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <style>{css}</style>
      <CursorGlow />

      {/* NAV */}
      <nav className="nav">
        <Link className="nav-logo" href="/" onClick={() => setMenuOpen(false)}>
          <span className="nav-logo-mark"><OrbitalMark size={26} color="#0E0D0C"/></span>
          <span className="nav-logo-text">
            Bad Theory <span className="nav-logo-tag">LABS</span>
          </span>
        </Link>

        {/* desktop centre links */}
        <div className="nav-links">
          <a className="nav-link" href="#research">Research</a>
          <a className="nav-link" href="#products">Products</a>
          <a className="nav-link" href="/papers">Papers</a>
          <a className="nav-link" href="/reasoning-gap">Reasoning Gap</a>
          <a className="nav-link" href="/reasoning-test">Reasoning Test</a>
          <a className="nav-link" href="/donate">Donate</a>
          <a className="nav-link" href="/brief">Brief</a>
          <a className="nav-link" href="/hackathon">Hackathon</a>
          <a className="nav-link" href="/contact">Contact</a>
        </div>

        {/* desktop right */}
        <div className="nav-right">
          <a className="btn-ghost" href="https://discord.gg/QJBCcB7bF" target="_blank" rel="noreferrer">Join community</a>
          <a className="btn-solid" href="https://cal.com/alameenpd/quick-chat" target="_blank" rel="noreferrer">Schedule call</a>
        </div>

        {/* mobile hamburger */}
        <button
          className={`nav-burger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="nav-drawer">
          <a href="#research" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Research</a>
          <a href="#products" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Products</a>
          <a href="/papers"   className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Papers</a>
          <a href="/reasoning-gap" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Reasoning Gap</a>
          <a href="/reasoning-test" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Reasoning Test</a>
          <a href="/donate"     className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Donate</a>
          <a href="/brief"    className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Brief</a>
          <a href="/hackathon" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Hackathon</a>
          <a href="/contact"  className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Contact</a>
          <div className="nav-drawer-divider" />
          <a href="https://discord.gg/QJBCcB7bF" target="_blank" rel="noreferrer" className="nav-drawer-link" onClick={() => setMenuOpen(false)}>Join community</a>
          <a href="https://cal.com/alameenpd/quick-chat" target="_blank" rel="noreferrer" className="nav-drawer-cta" onClick={() => setMenuOpen(false)}>Schedule call</a>
        </div>
      )}

      {/* ── HERO ── */}
      <div className="hero">
        {/* LEFT */}
        <div className="hero-left">
          <div>
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-rule"/>
              <span className="hero-eyebrow-text">Research · Infrastructure · Products</span>
            </div>
            <h1 className="hero-headline">
              We research how<br/>
              intelligence <em>perceives,<br/>
              reasons, and acts.</em>
            </h1>
            <p className="hero-body">
              Bad Theory Labs is a research lab and product studio. We build the infrastructure
              that makes AI genuinely useful inside real work — the memory, the retrieval,
              the context, and the presence that turns intelligence into something that actually
              follows through.
            </p>
            <div className="hero-actions">
              <MagneticBtn href="#research" className="btn-hero-p">
                Read our thesis <Arrow/>
              </MagneticBtn>
              <MagneticBtn href="#products" className="btn-hero-g">
                View products
              </MagneticBtn>
            </div>
          </div>

          <div className="hero-stats">
            {[
              { end: 0,  suffix: '%', l: 'Hallucination rate',  s: 'RetainDB · frozen dataset' },
              { end: 79, suffix: '%', l: 'LongMemEval score',   s: 'vs 56.7% next best'       },
              { end: 2,  suffix: '',  l: 'Products shipping',   s: 'RetainDB · Marrow'        },
            ].map((s, i) => (
              <div className="stat" key={i}
                style={{ paddingLeft: i > 0 ? 24 : 0, borderLeft: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <div className="stat-n"><CountUp end={s.end} suffix={s.suffix}/></div>
                <div className="stat-l">{s.l}</div>
                <div className="stat-s">{s.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — dark orbital, full bleed to viewport edge */}
        <div className="hero-right">
          <div className="hero-canvas"><OrbitalCanvas dark={true}/></div>
          <div className="hero-right-content">
            <div className="hero-right-label">Active research · April 2026</div>
            <div className="hero-right-title">The <em>Compression Program</em></div>
            <div className="hero-right-body">
              Intelligence is compression. We are investigating whether treating compression
              as a primary training objective — not a byproduct — produces systems that reason
              rather than pattern-match.
            </div>
          </div>
        </div>
      </div>

      {/* ── HACKATHON BANNER ── */}
      <Link href="/hackathon" className="hack-banner">
        <span className="hack-banner-dot" />
        <span className="hack-banner-label">BTL Hackathon 2025</span>
        <span className="hack-banner-sep">·</span>
        <span className="hack-banner-copy">48 hours · Lagos State University · ₦1,000,000+ in prizes</span>
        <span className="hack-banner-cta">Register free →</span>
      </Link>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...marquee_items, ...marquee_items].map((item, i) => (
            <div className="marquee-item" key={i}>
              <div className="marquee-dot"/>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* ── THESIS ── */}
      <ThesisSection/>

      {/* ── PRODUCTS ── */}
      <div className="products-section" id="products">

        <Reveal>
          <div className="section-header">
            <div>
              <div className="section-eyebrow">
                <div className="section-eyebrow-rule"/>
                <span className="section-eyebrow-text">Products</span>
              </div>
              <h2 className="section-title">
                Infrastructure at the base.<br/><em>Intelligence at the surface.</em>
              </h2>
            </div>
            <p className="section-desc">
              Two products. One thesis. Memory and agency — the two things that make AI
              useful inside real work.
            </p>
          </div>
        </Reveal>

        {/* MARROW */}
        <div className="marrow-section">
          <div className="marrow-left">
            <div>
              <Reveal delay={0}>
                <div className="product-label">Marrow · Desktop agent</div>
              </Reveal>
              <Reveal delay={60}>
                <h3 className="marrow-title">
                  The closest thing<br/>to Jarvis that fits<br/><em>inside a computer.</em>
                </h3>
              </Reveal>
              <Reveal delay={120}>
                <p className="marrow-body">
                  Marrow lives on your laptop. It watches what you do, builds up a picture
                  of your work, and stays completely silent — until the moment doing something
                  is actually worth more than the interruption. Then it doesn&apos;t suggest. It acts.
                </p>
              </Reveal>
              <div className="capability-list">
                {marrow_items.map((item, i) => (
                  <Reveal key={item.n} delay={i * 55}>
                    <div className="capability-row">
                      <span className="cap-num">{item.n}</span>
                      <span className="cap-text">{item.t}</span>
                      <span className="cap-tag">{item.tag}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={300}>
              <MagneticBtn href="/marrow" className="marrow-cta">
                Join the private beta <Arrow/>
              </MagneticBtn>
            </Reveal>
          </div>

          <div className="marrow-right">
            <div className="marrow-canvas-wrap"><MarrowCanvas/></div>
            <div className="marrow-overlay">
              <div className="marrow-overlay-tag">Marrow · observing</div>
              <div className="marrow-overlay-text">
                &ldquo;You&apos;ve done this three times. Want me to handle it?&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* RETAINDB */}
        <div className="retaindb-section">
          <div className="rdb-left">
            <Reveal>
              <div className="product-label">RetainDB · Memory infrastructure</div>
              <h3 className="marrow-title" style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}>
                Your AI forgets.<br/><em>RetainDB fixes that.</em>
              </h3>
              <p className="marrow-body">
                Persistent memory and grounded retrieval for AI agents. The highest preference
                recall on every public benchmark. Zero hallucinations on stored facts.
                Three lines of code.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <MagneticBtn href="https://retaindb.com" className="marrow-cta">
                  Try RetainDB free <Arrow/>
                </MagneticBtn>
                <a href="https://retaindb.com/benchmark" target="_blank" rel="noreferrer" style={{
                  fontSize: 14, color: 'var(--body)', textDecoration: 'none',
                  padding: '13px 24px', borderRadius: 8, border: '1px solid var(--border)',
                  display: 'inline-flex', alignItems: 'center',
                  transition: 'border-color 0.15s, color 0.15s',
                }}>
                  View benchmark
                </a>
              </div>
            </Reveal>
          </div>

          <div className="rdb-right">
            <Reveal direction="right">
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: 'var(--faint)', letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                LongMemEval benchmark · public · reproducible
              </div>
              <div className="bench-card">
                <table className="bench-table">
                  <thead>
                    <tr>
                      <th>System</th>
                      <th>Overall</th>
                      <th>Single-session</th>
                      <th>Hallucination</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="winner">RetainDB</td>
                      <td>
                        <div className="bench-bar-wrap">
                          <div className="bench-bar-bg">
                            <div className="bench-bar-fill" style={{ width: '79%' }}/>
                          </div>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--ink)', fontWeight: 500 }}>79%</span>
                        </div>
                      </td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 500, color: 'var(--ink)' }}>88%</span></td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, fontWeight: 500, color: 'var(--ink)' }}>0%</span></td>
                    </tr>
                    <tr>
                      <td>Supermemory</td>
                      <td>
                        <div className="bench-bar-wrap">
                          <div className="bench-bar-bg">
                            <div className="bench-bar-fill dim" style={{ width: '70%' }}/>
                          </div>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>70%</span>
                        </div>
                      </td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>—</span></td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>—</span></td>
                    </tr>
                    <tr>
                      <td>Zep</td>
                      <td>
                        <div className="bench-bar-wrap">
                          <div className="bench-bar-bg">
                            <div className="bench-bar-fill dim" style={{ width: '56.7%' }}/>
                          </div>
                          <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>56.7%</span>
                        </div>
                      </td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>—</span></td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>—</span></td>
                    </tr>
                    <tr>
                      <td>GPT-5 baseline</td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>—</span></td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>—</span></td>
                      <td><span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: 'var(--faint)' }}>95.5%</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: 'var(--faint)', lineHeight: 1.75, marginTop: 14,
              }}>
                Methodology: LongMemEval dataset · GPT-5 + Claude Sonnet 4.5 · temperature 0.0<br/>
                Hallucination: 16-question code matrix · bleeding-edge SDK APIs · March 2026<br/>
                <a href="#" style={{ color: 'var(--body)', textDecoration: 'none' }}>Read full benchmark →</a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── RESEARCH ── */}
      <div className="gateway-pilot-section">
        <div className="gateway-pilot-left">
          <Reveal>
            <div className="product-label">BTL Runtime · AI inference gateway</div>
            <h3 className="marrow-title" style={{ fontSize: 'clamp(28px, 3vw, 44px)' }}>
              Lower cost.<br/><em>Lower latency.</em>
            </h3>
            <p className="marrow-body gateway-pilot-copy">
              For teams shipping across OpenAI, Anthropic, Bedrock, Vertex, OpenRouter, and the long tail,
              BTL Runtime is the drop-in gateway for lowering inference cost and latency
              without rewriting the app every time provider economics change.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="gateway-pilot-actions">
              <MagneticBtn href="/contact?subject=BTL%20Runtime%20access%20request&message=We%20want%20to%20use%20BTL%20Runtime.%20Current%20stack,%20providers,%20traffic,%20and%20constraints:" className="marrow-cta">
                Request access <Arrow/>
              </MagneticBtn>
              <a
                href="/contact?subject=BTL%20Runtime%20access%20request&message=We%20want%20to%20use%20BTL%20Runtime.%20Current%20stack,%20providers,%20traffic,%20and%20constraints:"
                className="gateway-pilot-ghost"
              >
                Request access
              </a>
            </div>
          </Reveal>
        </div>

        <div className="gateway-pilot-right">
          <Reveal direction="right">
            <div className="gateway-pilot-label">What teams get</div>
            <div className="gateway-pilot-list">
              {[
                {
                  n: '01',
                  title: 'Drop-in compatibility',
                  body: 'Keep the OpenAI-compatible app surface and switch the base URL instead of the product architecture.',
                },
                {
                  n: '02',
                  title: 'Cheaper and faster execution',
                  body: 'Use routing, cache, and dedupe to push costs down and speed up repeated traffic.',
                },
                {
                  n: '03',
                  title: 'Proof that it is working',
                  body: 'Request ledgering, health snapshots, and runtime metrics make the savings visible.',
                },
              ].map((item) => (
                <div key={item.n} className="gateway-pilot-row">
                  <div className="gateway-pilot-num">{item.n}</div>
                  <div>
                    <div className="gateway-pilot-title">{item.title}</div>
                    <div className="gateway-pilot-body">{item.body}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="gateway-pilot-note">
              Best fit for teams already shipping AI products and feeling real spend or latency pressure.
            </div>
          </Reveal>
        </div>
      </div>

      <div className="research-section" id="research">
        <div className="research-inner">
          <div className="research-left">
            <Reveal direction="left">
              <div className="research-eyebrow">Active research program</div>
              <h2 className="research-title">
                The Compression<br/><em>Program</em>
              </h2>
              <p className="research-body">
                The field has been optimizing the wrong objective for a decade. Next-token
                prediction induces compression as a side effect. We are investigating what
                happens when compression is the objective — not a byproduct.
              </p>
              <blockquote className="research-quote">
                &ldquo;Intelligence is compression. Not metaphorically — mechanically.&rdquo;
              </blockquote>
              <a href="#" className="research-link">Read the full program document →</a>
            </Reveal>
          </div>

          <div className="research-right">
            {[
              {
                num: 'Workstream 01', title: 'Compression as objective',
                body: 'What emerges when you train for compression directly? We replace next-token prediction with a genuine MDL objective and study what representations form.',
              },
              {
                num: 'Workstream 02', title: 'The reasoning gap',
                body: 'Building an evaluation framework that cleanly separates observational from interventional reasoning — and measuring the gap across current frontier models.',
              },
              {
                num: 'Central hypothesis', title: 'Compression → Causal structure → Reasoning',
                body: 'If compression-as-objective produces causally structured representations, and causal structure is what reasoning requires — then compression is the mechanism, and reasoning is what emerges. Falsifiable at every step.',
              },
            ].map((ws, i) => (
              <Reveal key={ws.num} delay={i * 80} direction="right">
                <div className="workstream">
                  <div className="ws-num">{ws.num}</div>
                  <div className="ws-title">{ws.title}</div>
                  <div className="ws-body">{ws.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── RAISE ── */}
      <RaiseSection/>

      {/* ── BTL EVERYWHERE ── */}
      <section className="btl-everywhere">
        <div className="btl-ev-left">
          <div className="btl-ev-orb" />
          <div className="btl-ev-eyebrow">
            <span className="btl-ev-rule" />
            <span>BTL Everywhere</span>
          </div>
          <h2 className="btl-ev-title">
            Bring BTL to your<br />campus or <em>city.</em>
          </h2>
          <p className="btl-ev-body">
            We partner with builders, student communities, and local organisers worldwide to
            bring BTL&apos;s community and events — hackathons, meetups, research sessions —
            closer to where you already are. Any city. Any campus. Any country.
          </p>
          <div className="btl-ev-actions">
            <a href="https://forms.gle/jsdiP7cyV4BqWBy69" target="_blank" rel="noreferrer" className="btn-hero-p">
              Apply to host <Arrow />
            </a>
          </div>
        </div>

        <div className="btl-ev-right">
          <div className="btl-ev-cards">
            {[
              {
                tag: "Campus chapter",
                title: "Bring BTL to your university.",
                body: "We partner with student orgs and CS departments to run hackathons, study groups, and research reading circles on campus. You organise the space — we bring the structure, prizes, and community."
              },
              {
                tag: "City chapter",
                title: "Start a BTL chapter in your city.",
                body: "Host regular BTL meetups, builder nights, and local hackathons. We co-brand and support serious local organisers with resources, speakers, and community infrastructure."
              },
              {
                tag: "Community sprint",
                title: "Run a focused build sprint.",
                body: "A 48-hour event with a specific theme — AI tooling, open source, systems — organised by you, backed by BTL. Open to any group, anywhere in the world."
              },
            ].map(({ tag, title, body }) => (
              <div className="btl-ev-card" key={tag}>
                <div className="btl-ev-card-tag">{tag}</div>
                <div className="btl-ev-card-title">{title}</div>
                <div className="btl-ev-card-body">{body}</div>
              </div>
            ))}
          </div>
          <p className="btl-ev-note">
            Already running a community? We want to hear from you — doesn&apos;t matter where you are.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-cta">
          <Reveal style={{ display: 'contents' }}>
            <div className="footer-cta-left">
              <h3 className="footer-cta-title">
                Building toward<br/><em>a different kind of computing.</em>
              </h3>
              <p className="footer-cta-sub">
                Software that does more than wait for instructions. We want to help define it.
              </p>
              <div className="footer-cta-actions">
                <MagneticBtn href="https://cal.com/alameenpd/quick-chat" className="btn-hero-p">Schedule a call <Arrow/></MagneticBtn>
                <MagneticBtn href="/brief" className="btn-hero-g">Read the brief</MagneticBtn>
              </div>
            </div>
          </Reveal>

          <div className="footer-cta-right">
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: 'rgba(250,250,249,0.28)', letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: 20,
              }}>For investors</div>
              <div style={{
                fontFamily: "'EB Garamond', serif", fontSize: 22,
                color: 'rgba(250,250,249,0.84)', letterSpacing: '-0.02em',
                lineHeight: 1.4, marginBottom: 20,
              }}>
                &ldquo;A research-driven lab model that produces both critical infrastructure
                and defining end-user experiences.&rdquo;
              </div>
              <a href="/brief" style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: 'rgba(250,250,249,0.32)', textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                transition: 'color 0.15s',
              }}>
                Read investor brief →
              </a>
            </div>
            <div style={{
              display: 'flex', gap: 36, paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              position: 'relative', zIndex: 1,
            }}>
              {[
                { n: '02', l: 'Products shipping' },
                { n: '01', l: 'Active research program' },
                { n: '24/7', l: 'Community + build momentum' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontFamily: "'EB Garamond', serif", fontSize: 26,
                    fontWeight: 500, color: 'rgba(250,250,249,0.84)',
                    letterSpacing: '-0.03em', marginBottom: 3,
                  }}>{s.n}</div>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                    color: 'rgba(250,250,249,0.28)',
                  }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Reveal>
          <div className="footer-main">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <OrbitalMark size={22} color="#0E0D0C"/>
                <span style={{
                  fontFamily: "'EB Garamond', serif", fontSize: 15,
                  fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em',
                }}>
                  Bad Theory{' '}
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                    color: 'var(--faint)', letterSpacing: '0.15em',
                  }}>LABS</span>
                </span>
              </div>
              <p className="footer-tagline">
                Research and product studio building the infrastructure and products
                for AI-native computing.
              </p>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9.5, color: 'var(--faint)',
              }}>Lagos, Nigeria · Est. 2025</div>
            </div>
            {[
              {
                title: 'Products',
                links: [
                  { label: 'Marrow', href: '#products' },
                  { label: 'RetainDB', href: 'https://retaindb.com' },
                  { label: 'Benchmark', href: 'https://retaindb.com/benchmark' },
                  { label: 'Open source', href: 'https://github.com/RetainDB' },
                ],
              },
              {
                title: 'Research',
                links: [
                  { label: 'The Compression Program', href: '/papers' },
                  { label: 'Papers', href: '/papers' },
                  { label: 'Reasoning Gap', href: '/reasoning-gap' },
                  { label: 'Reasoning Test', href: '/reasoning-test' },
                  { label: 'Investor brief', href: '/brief' },
                  { label: 'Discord community', href: 'https://discord.gg/QJBCcB7bF' },
                ],
              },
              {
                title: 'Company',
                links: [
                  { label: 'Contact', href: '/contact' },
                  { label: 'Schedule call', href: 'https://cal.com/alameenpd/quick-chat' },
                  { label: 'Email', href: 'mailto:hello@badtheorylabs.com' },
                ],
              },
            ].map(col => (
              <div key={col.title}>
                <div className="footer-col-title">{col.title}</div>
                <div className="footer-links">
                  {col.links.map((l) => (
                    <a key={l.label} href={l.href} className="footer-link" target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noreferrer' : undefined}>
                      {l.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Bad Theory Labs. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#" className="footer-bottom-link">Privacy</a>
            <a href="#" className="footer-bottom-link">Terms</a>
            <a href="#" className="footer-bottom-link">Trust</a>
          </div>
        </div>
      </footer>
    </>
  );
}
