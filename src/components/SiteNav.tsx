'use client';

import { useState } from "react";
import Link from "next/link";

const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

// one source of truth for the nav. the home page used to spill 11 links across
// the bar. folded into four dropdowns so it breathes again.
type Item = { label: string; href: string; external?: boolean; live?: boolean };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Models",
    items: [
      { label: "BTL-4", href: "https://huggingface.co/badtheorylabs/BTL-4", external: true },
      { label: "BTL-4 Compact", href: "https://huggingface.co/badtheorylabs/BTL-4-Compact", external: true },
      { label: "BTL-3", href: "/btl-3" },
      { label: "BTL-3 Compact", href: "/btl-3-compact" },
      { label: "Macaw", href: "/macaw" },
      { label: "BTL-2 Coder", href: "/btl-2-coder" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Private Frontier Intelligence", href: "/#private-frontier" },
      { label: "Runtime", href: "/runtime" },
      { label: "RetainDB", href: "https://retaindb.com", external: true },
      { label: "Prism", href: "https://github.com/Badtheorylabs/Prism", external: true },
      { label: "Marrow", href: "/marrow" },
    ],
  },
  {
    label: "Research",
    items: [
      { label: "All papers", href: "/papers" },
      { label: "Context Integrity", href: "/context-integrity" },
      { label: "ESP", href: "/esp" },
      { label: "Reasoning Gap", href: "/reasoning-gap" },
      { label: "Reasoning Test", href: "/reasoning-test" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "Why BTL", href: "/#why-btl" },
      { label: "Thesis", href: "/thesis" },
      { label: "GitHub", href: "https://github.com/Badtheorylabs", external: true },
      { label: "Contact", href: "/contact" },
      { label: "Join Discord", href: DISCORD_URL, external: true },
    ],
  },
];

function Mark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M3 7H29" stroke="currentColor" strokeWidth="2.9" strokeLinecap="square" />
      <path
        d="M3 13H11.7V18.3H20.3V23.6H29"
        stroke="currentColor"
        strokeWidth="2.9"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export default function SiteNav({ dark = false, overlay = false }: { dark?: boolean; overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <style>{css}</style>
      <nav className={`sn${dark ? " sn-dark" : ""}${overlay ? " sn-hero" : ""}`}>
        <Link href="/" className="sn-logo" onClick={close}>
          <span className="sn-mark"><Mark /></span>
          <span className="sn-name">Bad Theory <span className="sn-tag">LABS</span></span>
        </Link>

        <div className="sn-center">
          {GROUPS.map((g) => (
            <div className="sn-group" key={g.label}>
              <button className="sn-group-btn" type="button">
                {g.label}
                <svg className="sn-caret" width="9" height="9" viewBox="0 0 10 10" aria-hidden>
                  <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                </svg>
              </button>
              <div className="sn-menu">
                {g.items.map((it) =>
                  it.external ? (
                    <a key={it.label} href={it.href} target="_blank" rel="noreferrer" className="sn-menu-item">
                      {it.label}
                    </a>
                  ) : (
                    <Link key={it.label} href={it.href} className="sn-menu-item">
                      {it.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="sn-right">
          <Link className="sn-cta" href="/contact" onClick={close}>Talk to BTL</Link>
        </div>

        <button
          className={`sn-burger${open ? " open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          type="button"
        >
          <span /><span /><span />
        </button>
      </nav>

      {open && (
        <div className={`sn-drawer${dark ? " sn-dark" : ""}`}>
          {GROUPS.map((g) => (
            <div key={g.label} className="sn-drawer-group">
              <div className="sn-drawer-head">{g.label}</div>
              {g.items.map((it) =>
                it.external ? (
                  <a key={it.label} href={it.href} target="_blank" rel="noreferrer" className="sn-drawer-item" onClick={close}>
                    {it.label}
                  </a>
                ) : (
                  <Link key={it.label} href={it.href} className="sn-drawer-item" onClick={close}>
                    {it.label}
                  </Link>
                )
              )}
            </div>
          ))}
          <Link href="/contact" className="sn-drawer-cta" onClick={close}>Talk to BTL</Link>
        </div>
      )}
    </>
  );
}

const css = `
.sn {
  position: sticky; top: 0; z-index: 1000; height: 54px; padding: 0;
  display: flex; align-items: stretch; justify-content: space-between; gap: 0;
  background: var(--paper, #F1F1F3); backdrop-filter: blur(18px) saturate(1.2);
  border-bottom: 1px solid var(--rule-2, var(--border, #DCDCE1));
  font-family: var(--font-s), Arial, sans-serif;
}
.sn-logo { display: flex; align-items: center; gap: 10px; padding: 0 clamp(16px, 4.4vw, 68px); padding-right: clamp(16px, 2.2vw, 32px); border-right: 1px solid var(--rule, var(--border, #DCDCE1)); text-decoration: none; color: var(--ink, #0E0F13); }
.sn-mark { display: flex; color: var(--ink, #0E0F13); }
.sn-name { font-family: var(--font-d), 'Helvetica Neue', Arial, sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.02em; white-space: nowrap; }
.sn-tag { font-family: var(--font-m), monospace; font-size: 9px; color: var(--faint, #82848E); letter-spacing: 0.18em; margin-left: 2px; }

.sn-center { display: flex; align-items: stretch; gap: 0; }
.sn-group { position: relative; }
.sn-group-btn {
  display: inline-flex; align-items: center; gap: 5px; cursor: pointer;
  height: 54px; background: transparent; border: 0; border-right: 1px solid var(--rule, var(--border, #DCDCE1)); font-family: inherit; font-size: 13px;
  color: var(--ink-2, var(--body, #52545C)); padding: 0 clamp(13px, 1.5vw, 22px); transition: color .15s, background .15s;
}
.sn-group:hover .sn-group-btn { color: var(--ink, #0E0F13); background: var(--sunk, rgba(14,15,19,0.04)); }
.sn-caret { transition: transform .2s; opacity: .6; }
.sn-group:hover .sn-caret { transform: rotate(180deg); }
.sn-menu {
  position: absolute; top: calc(100% + 6px); left: 0; min-width: 184px;
  background: var(--paper, rgba(252,252,251,0.97)); backdrop-filter: blur(18px);
  border: 1px solid var(--rule, var(--border, #DCDCE1)); border-radius: 0; padding: 7px;
  box-shadow: 0 14px 40px rgba(14,15,19,0.10);
  opacity: 0; visibility: hidden; transform: translateY(-6px);
  transition: opacity .16s ease, transform .16s ease, visibility .16s;
}
/* small invisible bridge so the cursor can cross the gap without dropping the menu */
.sn-group::after { content: ''; position: absolute; top: 100%; left: 0; right: 0; height: 10px; }
.sn-group:hover .sn-menu, .sn-group:focus-within .sn-menu { opacity: 1; visibility: visible; transform: translateY(0); }
.sn-menu-item {
  display: block; padding: 9px 12px; border-radius: 0; text-decoration: none;
  font-size: 13.5px; color: var(--ink-2, var(--body, #52545C)); transition: color .12s, background .12s;
}
.sn-menu-item:hover { color: var(--ink, #0E0F13); background: var(--sunk, rgba(14,15,19,0.045)); }

.sn-stats {
  display: inline-flex; align-items: center; gap: 7px; text-decoration: none;
  font-size: 13px; color: var(--body, #52545C); padding: 8px 12px; border-radius: 7px;
  transition: color .15s, background .15s;
}
.sn-stats:hover { color: var(--ink, #0E0F13); background: rgba(14,15,19,0.04); }
.sn-live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #4FBB85; flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(79,187,133,0.6); animation: sn-pulse 2s ease-in-out infinite;
}
@keyframes sn-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(79,187,133,0.55); }
  50% { box-shadow: 0 0 0 5px rgba(79,187,133,0); }
}

.sn-right { display: flex; align-items: center; }
.sn-cta {
  display: flex; align-items: center; font-size: 13px; font-weight: 500; color: var(--paper, #F1F1F3); background: var(--ink, #0E0F13);
  padding: 0 clamp(16px, 2.2vw, 32px); border-radius: 0; text-decoration: none; white-space: nowrap;
  transition: opacity .12s;
}
.sn-cta:hover { opacity: 0.85; }

.sn-burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  width: 44px; height: 44px; margin: 5px 10px; background: none; border: none; cursor: pointer; padding: 7px; border-radius: 0;
}
.sn-burger:hover { background: var(--surface, #E7E7EA); }
.sn-burger span { display: block; height: 1.5px; background: var(--ink, #0E0F13); border-radius: 2px; transition: transform .22s, opacity .22s, width .22s; }
.sn-burger span:nth-child(1) { width: 20px; }
.sn-burger span:nth-child(2) { width: 14px; }
.sn-burger span:nth-child(3) { width: 20px; }
.sn-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); width: 20px; }
.sn-burger.open span:nth-child(2) { opacity: 0; }
.sn-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 20px; }

.sn-drawer {
  position: fixed; top: 54px; left: 0; right: 0; z-index: 999; max-height: calc(100vh - 54px); overflow-y: auto;
  background: var(--paper, rgba(250,250,249,0.98)); backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--rule-2, var(--border, #DCDCE1)); padding: 12px 0 22px;
  font-family: var(--font-s), Arial, sans-serif; animation: sn-drawer-in .2s ease;
}
@keyframes sn-drawer-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.sn-drawer-group { padding: 4px 0; }
.sn-drawer-head {
  font-family: var(--font-m), monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--faint, #82848E); padding: 12px 22px 6px;
}
.sn-drawer-item {
  display: flex; align-items: center; gap: 8px; padding: 11px 22px; font-size: 15px;
  color: var(--body, #52545C); text-decoration: none; transition: color .12s, background .12s;
}
.sn-drawer-item:hover { color: var(--ink, #0E0F13); background: var(--surface, #E7E7EA); }
.sn-drawer-stats { font-size: 15px; font-weight: 500; color: var(--ink, #0E0F13); }
.sn-drawer-cta {
  display: block; margin: 14px 22px 0; padding: 13px 20px; border-radius: 9px; text-align: center;
  background: var(--ink, #0E0F13); color: var(--bg, #F1F1F3); font-size: 14px; font-weight: 500; text-decoration: none;
}

/* dark ground. the home hero sits under a transparent bar until you scroll. */
.sn-dark {
  background: rgba(11,12,13,0.62);
  border-bottom-color: rgba(247,247,240,0.10);
}
.sn-hero {
  position: sticky;
  margin-bottom: -54px;
  background: linear-gradient(180deg, rgba(11,12,13,0.84), rgba(11,12,13,0.22));
}
.sn-dark .sn-logo,
.sn-dark .sn-group-btn { border-color: rgba(247,247,240,0.10); }
.sn-dark .sn-logo, .sn-dark .sn-mark { color: #F1F1F3; }
.sn-dark .sn-tag { color: rgba(247,247,240,0.42); }
.sn-dark .sn-group-btn { color: rgba(247,247,240,0.62); }
.sn-dark .sn-group:hover .sn-group-btn { color: #F1F1F3; background: rgba(247,247,240,0.07); }
.sn-dark .sn-menu {
  background: rgba(14,16,19,0.97);
  border-color: rgba(247,247,240,0.12);
  box-shadow: 0 18px 48px rgba(0,0,0,0.55);
}
.sn-dark .sn-menu-item { color: rgba(247,247,240,0.62); }
.sn-dark .sn-menu-item:hover { color: #F1F1F3; background: rgba(247,247,240,0.07); }
.sn-dark .sn-cta { background: #F1F1F3; color: #0E0F13; }
.sn-dark .sn-cta:hover { background: #FF4D00; color: #fff; opacity: 1; }
.sn-dark .sn-burger span { background: #F1F1F3; }
.sn-dark .sn-burger:hover { background: rgba(247,247,240,0.08); }
.sn-dark.sn-drawer { background: rgba(11,12,13,0.98); border-bottom-color: rgba(247,247,240,0.12); }
.sn-dark .sn-drawer-head { color: rgba(247,247,240,0.4); }
.sn-dark .sn-drawer-item { color: rgba(247,247,240,0.66); }
.sn-dark .sn-drawer-item:hover { color: #F1F1F3; background: rgba(247,247,240,0.06); }
.sn-dark .sn-drawer-cta { background: #F1F1F3; color: #0E0F13; }

@media (max-width: 940px) {
  .sn-center, .sn-right { display: none; }
  .sn-burger { display: flex; }
}
`;
