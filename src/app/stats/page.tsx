'use client';

import { useEffect, useRef, useState, useCallback } from "react";
import SiteNav from "@/components/SiteNav";

const CA = "3bBQrzzq9DRXXFfC9nUno9m1MBm9Y7dVnBBK44bVpump";
const DISCORD_URL = "https://discord.gg/QJBCcB7bF";

type Stats = {
  configured: boolean;
  online?: number;
  activeToday?: number;
  newToday?: number;
  totalUsers?: number;
  totalViews?: number;
  peakOnline?: number;
  totalSignups?: number | null;
  topPaths?: { path: string; count: number }[];
  serverTime?: string;
  error?: string;
};

function fmt(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  return n.toLocaleString("en-US");
}

// little inline sparkline from however many live samples we've collected so far
function Spark({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="spark-empty">gathering live signal…</div>;
  const w = 100, h = 30;
  const max = Math.max(...data, 1);
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${(i * step).toFixed(2)},${(h - (v / max) * (h - 3) - 1).toFixed(2)}`);
  return (
    <svg className="spark" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden>
      <polyline points={pts.join(" ")} fill="none" stroke="currentColor" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <circle cx={(data.length - 1) * step} cy={h - (data[data.length - 1] / max) * (h - 3) - 1} r="1.8" fill="currentColor" />
    </svg>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [failed, setFailed] = useState(false);
  const [series, setSeries] = useState<number[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const timer = useRef<number | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/stats", { cache: "no-store" });
      if (!r.ok) throw new Error("bad status");
      const d: Stats = await r.json();
      setStats(d);
      setFailed(false);
      if (d.configured && typeof d.online === "number") {
        setSeries((s) => [...s, d.online as number].slice(-48));
      }
      setUpdatedAt(new Date().toLocaleTimeString("en-US", { hour12: false }));
    } catch {
      setFailed(true);
    }
  }, []);

  useEffect(() => {
    load();
    timer.current = window.setInterval(load, 5000);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [load]);

  const configured = stats?.configured === true;

  return (
    <main className="stats-page">
      <style>{styles}</style>
      <SiteNav />

      <section className="st-hero">
        <div className="st-hero-inner">
          <div className="st-eyebrow">
            <span className={`st-status-dot${failed ? " err" : configured ? " ok" : " idle"}`} />
            {failed ? "reconnecting" : configured ? "live · refreshing every 5s" : "tracker offline"}
          </div>
          <h1>Community, <em>live.</em></h1>
          <p className="st-sub">
            Real presence from real visitors — counted the moment they land, no seeded numbers, no vanity inflation.
            This is who is on Bad Theory Labs right now.
          </p>
        </div>
      </section>

      {!configured && !failed && stats && (
        <div className="st-banner">
          Live tracking isn&apos;t connected yet. Add <code>SUPABASE_URL</code> + <code>SUPABASE_SERVICE_ROLE_KEY</code> and run the
          SQL from <code>/api/setup-db</code> to switch these counters on.
        </div>
      )}
      {failed && (
        <div className="st-banner err">Couldn&apos;t reach the stats service. Retrying…</div>
      )}

      {/* headline live number */}
      <section className="st-live">
        <div className="st-live-card">
          <div className="st-live-label">Online right now</div>
          <div className="st-live-num">
            <span className="st-live-pulse" />
            {configured ? fmt(stats?.online) : "—"}
          </div>
          <div className="st-live-spark">
            <Spark data={series} />
          </div>
        </div>
      </section>

      {/* grid of supporting metrics */}
      <section className="st-gridwrap"><div className="st-grid">
        {[
          { l: "Total signups", v: stats?.totalSignups ?? undefined, s: "registered product accounts" },
          { l: "Active today", v: stats?.activeToday, s: "sessions seen since 00:00 UTC" },
          { l: "New today", v: stats?.newToday, s: "first-time visitors today" },
          { l: "Peak concurrent", v: stats?.peakOnline, s: "all-time high, online at once" },
          { l: "Total visitors", v: stats?.totalUsers, s: "unique sessions, all time" },
          { l: "Page views", v: stats?.totalViews, s: "heartbeats across the site" },
        ].map((m) => (
          <div className="st-cell" key={m.l}>
            <div className="st-cell-v">{configured ? fmt(m.v) : "—"}</div>
            <div className="st-cell-l">{m.l}</div>
            <div className="st-cell-s">{m.s}</div>
          </div>
        ))}
      </div></section>

      {/* where people are right now */}
      <section className="st-where">
        <div className="st-where-head">
          <h2>Where they are <em>right now</em></h2>
          <span className="st-updated">{updatedAt ? `updated ${updatedAt}` : "…"}</span>
        </div>
        {configured && stats?.topPaths && stats.topPaths.length > 0 ? (
          <div className="st-paths">
            {stats.topPaths.map((p) => {
              const top = stats.topPaths![0].count || 1;
              return (
                <div className="st-path" key={p.path}>
                  <span className="st-path-name">{p.path}</span>
                  <span className="st-path-bar"><span style={{ width: `${(p.count / top) * 100}%` }} /></span>
                  <span className="st-path-c">{p.count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="st-quiet">{configured ? "Quiet right now — no one on a page this second." : "Waiting on the tracker."}</p>
        )}
      </section>

      <section className="st-token">
        <div className="st-token-inner">
          <div>
            <div className="st-token-label">$BTL · Solana</div>
            <div className="st-token-ca">{CA}</div>
          </div>
          <a className="st-token-cta" href={DISCORD_URL} target="_blank" rel="noreferrer">Join the community →</a>
        </div>
      </section>
    </main>
  );
}

const styles = `
:root { --bg:#FAFAF9; --surface:#F3F2EF; --border:#E8E6E1; --border2:#D6D3CC; --ink:#0E0D0C; --body:#5C5954; --faint:#9C9890; }
.stats-page { min-height:100vh; background:var(--bg); color:var(--ink); font-family:'DM Sans',system-ui,sans-serif; }
.stats-page em { font-style:italic; font-weight:400; }

.st-hero { border-bottom:1px solid var(--border); }
.st-hero-inner { max-width:1080px; margin:0 auto; padding:72px 28px 56px; }
.st-eyebrow { display:inline-flex; align-items:center; gap:9px; font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.08em; text-transform:uppercase; color:var(--faint); margin-bottom:22px; }
.st-status-dot { width:8px; height:8px; border-radius:50%; background:var(--border2); }
.st-status-dot.ok { background:#2bb673; animation:st-blink 2s ease-in-out infinite; }
.st-status-dot.err { background:#c0492f; }
.st-status-dot.idle { background:#c9a227; }
@keyframes st-blink { 0%,100%{opacity:1} 50%{opacity:.35} }
.st-hero h1 { font-family:'EB Garamond',Georgia,serif; font-size:clamp(44px,6.5vw,82px); font-weight:500; letter-spacing:-.04em; line-height:1.0; margin-bottom:20px; }
.st-sub { font-size:16px; font-weight:300; line-height:1.75; color:var(--body); max-width:560px; }

.st-banner { max-width:1080px; margin:0 auto; padding:16px 28px; font-size:13.5px; color:var(--body); line-height:1.6; border-bottom:1px solid var(--border); background:var(--surface); }
.st-banner.err { color:#8a2f1c; background:#faf0ec; }
.st-banner code { font-family:'JetBrains Mono',monospace; font-size:12px; background:rgba(14,13,12,0.06); padding:1px 6px; border-radius:5px; }

.st-live { max-width:1080px; margin:0 auto; padding:48px 28px 0; }
.st-live-card { border:1px solid var(--border); border-radius:18px; background:var(--ink); color:#fafaf9; padding:40px 40px 32px; position:relative; overflow:hidden; }
.st-live-card::after { content:''; position:absolute; top:-120px; right:-80px; width:360px; height:360px; border-radius:50%; background:radial-gradient(circle,rgba(43,182,115,0.16) 0%,transparent 70%); pointer-events:none; }
.st-live-label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:rgba(250,250,249,0.45); margin-bottom:14px; }
.st-live-num { font-family:'EB Garamond',Georgia,serif; font-size:clamp(72px,13vw,150px); font-weight:500; letter-spacing:-.05em; line-height:.9; display:flex; align-items:center; gap:18px; }
.st-live-pulse { width:16px; height:16px; border-radius:50%; background:#2bb673; flex-shrink:0; box-shadow:0 0 0 0 rgba(43,182,115,0.6); animation:st-ring 2s ease-in-out infinite; }
@keyframes st-ring { 0%,100%{box-shadow:0 0 0 0 rgba(43,182,115,0.55)} 50%{box-shadow:0 0 0 12px rgba(43,182,115,0)} }
.st-live-spark { color:rgba(43,182,115,0.85); height:34px; margin-top:18px; }
.spark { width:100%; height:34px; display:block; }
.spark-empty { font-family:'JetBrains Mono',monospace; font-size:11px; color:rgba(250,250,249,0.35); }

.st-gridwrap { max-width:1080px; margin:0 auto; padding:24px 28px 0; }
.st-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0; border:1px solid var(--border); border-radius:16px; overflow:hidden; }
.st-cell { padding:30px 26px; border-right:1px solid var(--border); border-bottom:1px solid var(--border); }
.st-cell:nth-child(3n) { border-right:none; }
.st-cell:nth-child(n+4) { border-bottom:none; }
.st-cell-v { font-family:'EB Garamond',Georgia,serif; font-size:42px; font-weight:500; letter-spacing:-.03em; line-height:1; margin-bottom:8px; }
.st-cell-l { font-size:14px; font-weight:500; color:var(--ink); margin-bottom:3px; }
.st-cell-s { font-size:12px; font-weight:300; color:var(--faint); line-height:1.5; }

.st-where { max-width:1080px; margin:0 auto; padding:56px 28px 0; }
.st-where-head { display:flex; align-items:baseline; justify-content:space-between; gap:16px; margin-bottom:24px; }
.st-where h2 { font-family:'EB Garamond',Georgia,serif; font-size:clamp(26px,3vw,38px); font-weight:500; letter-spacing:-.03em; }
.st-updated { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); white-space:nowrap; }
.st-paths { display:flex; flex-direction:column; gap:0; border-top:1px solid var(--border); }
.st-path { display:grid; grid-template-columns:200px 1fr 48px; align-items:center; gap:16px; padding:15px 4px; border-bottom:1px solid var(--border); }
.st-path-name { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.st-path-bar { height:5px; background:var(--surface); border-radius:3px; overflow:hidden; }
.st-path-bar span { display:block; height:100%; background:var(--ink); border-radius:3px; transition:width .6s cubic-bezier(.16,1,.3,1); }
.st-path-c { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--body); text-align:right; }
.st-quiet { font-size:14px; color:var(--faint); padding:20px 0; border-top:1px solid var(--border); }

.st-token { max-width:1080px; margin:64px auto 0; padding:0 28px 80px; }
.st-token-inner { display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; padding:26px; border:1px solid var(--border); border-radius:14px; background:var(--surface); }
.st-token-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:7px; }
.st-token-ca { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink); word-break:break-all; }
.st-token-cta { font-size:14px; font-weight:500; color:var(--bg); background:var(--ink); padding:11px 20px; border-radius:9px; text-decoration:none; white-space:nowrap; transition:opacity .12s; }
.st-token-cta:hover { opacity:.85; }

@media (max-width: 720px) {
  .st-grid { grid-template-columns:1fr 1fr; }
  .st-cell:nth-child(3n) { border-right:1px solid var(--border); }
  .st-cell:nth-child(2n) { border-right:none; }
  .st-cell:nth-child(n+4) { border-bottom:1px solid var(--border); }
  .st-cell:nth-last-child(-n+2) { border-bottom:none; }
  .st-path { grid-template-columns:120px 1fr 40px; gap:10px; }
  .st-live-card { padding:28px 22px; }
}
`;
