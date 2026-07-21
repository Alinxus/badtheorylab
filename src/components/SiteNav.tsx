'use client';

import { useState } from "react";
import Link from "next/link";

const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
const CAL_URL = "https://cal.com/alameenpd/quick-chat";

// one source of truth for the nav. the home page used to spill 11 links across
// the bar — folded them into three dropdowns + Stats so it breathes again.
type Item = { label: string; href: string; external?: boolean; live?: boolean };
type Group = { label: string; items: Item[] };

const GROUPS: Group[] = [
  {
    label: "Products",
    items: [
      { label: "BTL-3", href: "/btl-3" },
      { label: "BTL-3 Compact", href: "https://huggingface.co/badtheorylabs/BTL-3-Compact", external: true },
      { label: "BTL Runtime", href: "/runtime" },
      { label: "RetainDB", href: "https://retaindb.com", external: true },
      { label: "Prism", href: "https://github.com/Badtheorylabs/Prism", external: true },
      { label: "Marrow", href: "/marrow" },
      { label: "BTL-2 Coder", href: "/btl-2-coder" },
    ],
  },
  {
    label: "Research",
    items: [
      { label: "Papers", href: "/papers" },
      { label: "Context Integrity", href: "/context-integrity" },
      { label: "ESP", href: "/esp" },
      { label: "Reasoning Gap", href: "/reasoning-gap" },
      { label: "Reasoning Test", href: "/reasoning-test" },
    ],
  },
  {
    label: "Community",
    items: [
      { label: "GitHub", href: "https://github.com/Badtheorylabs", external: true },
      { label: "Contact", href: "/contact" },
      { label: "Join Discord", href: DISCORD_URL, external: true },
    ],
  },
];

function Mark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3" fill="currentColor" />
      <ellipse cx="12" cy="12" rx="10.5" ry="4.5" stroke="currentColor" strokeOpacity="0.55" />
      <ellipse cx="12" cy="12" rx="10.5" ry="4.5" stroke="currentColor" strokeOpacity="0.35" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10.5" ry="4.5" stroke="currentColor" strokeOpacity="0.35" transform="rotate(120 12 12)" />
    </svg>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <style>{css}</style>
      <nav className="sn">
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
          <Link href="/stats" className="sn-stats">
            <span className="sn-live-dot" /> Stats
          </Link>
        </div>

        <div className="sn-right">
          <a className="sn-cta" href={CAL_URL} target="_blank" rel="noreferrer">Schedule call</a>
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
        <div className="sn-drawer">
          <Link href="/stats" className="sn-drawer-item sn-drawer-stats" onClick={close}>
            <span className="sn-live-dot" /> Live Stats
          </Link>
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
          <a href={CAL_URL} target="_blank" rel="noreferrer" className="sn-drawer-cta" onClick={close}>
            Schedule call
          </a>
        </div>
      )}
    </>
  );
}

const css = `
.sn {
  position: sticky; top: 0; z-index: 1000; height: 58px; padding: 0 clamp(16px, 4vw, 52px);
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
  background: rgba(250,250,249,0.85); backdrop-filter: blur(22px) saturate(1.4);
  border-bottom: 1px solid var(--border, #E8E6E1);
  font-family: 'DM Sans', system-ui, sans-serif;
}
.sn-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink, #0E0D0C); }
.sn-mark { display: flex; color: var(--ink, #0E0D0C); }
.sn-name { font-family: 'EB Garamond', Georgia, serif; font-size: 17px; font-weight: 500; letter-spacing: -0.02em; white-space: nowrap; }
.sn-tag { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: var(--faint, #9C9890); letter-spacing: 0.18em; margin-left: 2px; }

.sn-center { display: flex; align-items: center; gap: 6px; }
.sn-group { position: relative; }
.sn-group-btn {
  display: inline-flex; align-items: center; gap: 5px; cursor: pointer;
  background: none; border: none; font-family: inherit; font-size: 13px;
  color: var(--body, #5C5954); padding: 8px 12px; border-radius: 7px; transition: color .15s, background .15s;
}
.sn-group:hover .sn-group-btn { color: var(--ink, #0E0D0C); background: rgba(14,13,12,0.04); }
.sn-caret { transition: transform .2s; opacity: .6; }
.sn-group:hover .sn-caret { transform: rotate(180deg); }
.sn-menu {
  position: absolute; top: calc(100% + 6px); left: 0; min-width: 184px;
  background: rgba(252,252,251,0.97); backdrop-filter: blur(18px);
  border: 1px solid var(--border, #E8E6E1); border-radius: 12px; padding: 7px;
  box-shadow: 0 14px 40px rgba(14,13,12,0.10);
  opacity: 0; visibility: hidden; transform: translateY(-6px);
  transition: opacity .16s ease, transform .16s ease, visibility .16s;
}
/* small invisible bridge so the cursor can cross the gap without dropping the menu */
.sn-group::after { content: ''; position: absolute; top: 100%; left: 0; right: 0; height: 10px; }
.sn-group:hover .sn-menu, .sn-group:focus-within .sn-menu { opacity: 1; visibility: visible; transform: translateY(0); }
.sn-menu-item {
  display: block; padding: 9px 12px; border-radius: 7px; text-decoration: none;
  font-size: 13.5px; color: var(--body, #5C5954); transition: color .12s, background .12s;
}
.sn-menu-item:hover { color: var(--ink, #0E0D0C); background: rgba(14,13,12,0.045); }

.sn-stats {
  display: inline-flex; align-items: center; gap: 7px; text-decoration: none;
  font-size: 13px; color: var(--body, #5C5954); padding: 8px 12px; border-radius: 7px;
  transition: color .15s, background .15s;
}
.sn-stats:hover { color: var(--ink, #0E0D0C); background: rgba(14,13,12,0.04); }
.sn-live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #2bb673; flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(43,182,115,0.6); animation: sn-pulse 2s ease-in-out infinite;
}
@keyframes sn-pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(43,182,115,0.55); }
  50% { box-shadow: 0 0 0 5px rgba(43,182,115,0); }
}

.sn-right { display: flex; align-items: center; }
.sn-cta {
  font-size: 13px; font-weight: 500; color: var(--bg, #FAFAF9); background: var(--ink, #0E0D0C);
  padding: 9px 18px; border-radius: 8px; text-decoration: none; white-space: nowrap;
  transition: opacity .12s;
}
.sn-cta:hover { opacity: 0.85; }

.sn-burger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  width: 38px; height: 38px; background: none; border: none; cursor: pointer; padding: 7px; border-radius: 6px;
}
.sn-burger:hover { background: var(--surface, #F3F2EF); }
.sn-burger span { display: block; height: 1.5px; background: var(--ink, #0E0D0C); border-radius: 2px; transition: transform .22s, opacity .22s, width .22s; }
.sn-burger span:nth-child(1) { width: 20px; }
.sn-burger span:nth-child(2) { width: 14px; }
.sn-burger span:nth-child(3) { width: 20px; }
.sn-burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); width: 20px; }
.sn-burger.open span:nth-child(2) { opacity: 0; }
.sn-burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); width: 20px; }

.sn-drawer {
  position: fixed; top: 58px; left: 0; right: 0; z-index: 999; max-height: calc(100vh - 58px); overflow-y: auto;
  background: rgba(250,250,249,0.98); backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--border, #E8E6E1); padding: 12px 0 22px;
  font-family: 'DM Sans', system-ui, sans-serif; animation: sn-drawer-in .2s ease;
}
@keyframes sn-drawer-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
.sn-drawer-group { padding: 4px 0; }
.sn-drawer-head {
  font-family: 'JetBrains Mono', monospace; font-size: 9.5px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--faint, #9C9890); padding: 12px 22px 6px;
}
.sn-drawer-item {
  display: flex; align-items: center; gap: 8px; padding: 11px 22px; font-size: 15px;
  color: var(--body, #5C5954); text-decoration: none; transition: color .12s, background .12s;
}
.sn-drawer-item:hover { color: var(--ink, #0E0D0C); background: var(--surface, #F3F2EF); }
.sn-drawer-stats { font-size: 15px; font-weight: 500; color: var(--ink, #0E0D0C); }
.sn-drawer-cta {
  display: block; margin: 14px 22px 0; padding: 13px 20px; border-radius: 9px; text-align: center;
  background: var(--ink, #0E0D0C); color: var(--bg, #FAFAF9); font-size: 14px; font-weight: 500; text-decoration: none;
}

@media (max-width: 940px) {
  .sn-center, .sn-right { display: none; }
  .sn-burger { display: flex; }
}
`;
