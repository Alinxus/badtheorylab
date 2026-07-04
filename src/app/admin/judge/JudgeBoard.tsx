'use client';

import { useMemo, useState } from "react";

export type JudgeScore = {
  runtimeUsage: number;
  usefulness: number;
  execution: number;
  creativity: number;
  demoClarity: number;
  publicityBonus: number;
  runtimeVerified: boolean;
  spotPrize: boolean;
  notes: string;
  saved: boolean;
};

export type JudgeEntry = {
  id: string;
  email: string;
  teamName: string;
  projectName: string;
  members: string;
  description: string;
  repoUrl: string;
  demoVideoUrl: string;
  liveUrl: string;
  xPostUrl: string;
  runtimeRoutes: string;
  runtimeProof: string;
  updatedAt: string;
  readme: string;
  score: JudgeScore;
};

const RUBRIC = [
  { key: "runtimeUsage", label: "Runtime usage", max: 30 },
  { key: "usefulness", label: "Usefulness", max: 25 },
  { key: "execution", label: "Execution", max: 20 },
  { key: "creativity", label: "Creativity", max: 15 },
  { key: "demoClarity", label: "Demo clarity", max: 10 },
  { key: "publicityBonus", label: "X publicity bonus", max: 3 },
] as const;

type SortKey = "total" | "name" | "updated" | "unscored";
const MAX_TOTAL = 103;

function total(s: JudgeScore) {
  return s.runtimeUsage + s.usefulness + s.execution + s.creativity + s.demoClarity +
    s.publicityBonus;
}

/** Convert a YouTube / Loom / Vimeo watch URL to an embeddable one. */
function embedUrl(url: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const loom = url.match(/loom\.com\/(?:share|embed)\/([\w-]+)/);
  if (loom) return `https://www.loom.com/embed/${loom[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function cloneCmd(repoUrl: string): string {
  const clean = repoUrl.replace(/\/$/, "").replace(/\.git$/i, "");
  return `git clone ${clean}.git`;
}

export default function JudgeBoard({ entries: initial }: { entries: JudgeEntry[] }) {
  const [entries, setEntries] = useState(initial);
  const [sort, setSort] = useState<SortKey>("updated");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(() => {
    let list = [...entries];
    if (onlyVerified) list = list.filter(e => e.score.runtimeVerified);
    list.sort((a, b) => {
      switch (sort) {
        case "total": return total(b.score) - total(a.score);
        case "name": return a.projectName.localeCompare(b.projectName);
        case "unscored": return (a.score.saved ? 1 : 0) - (b.score.saved ? 1 : 0);
        default: return b.updatedAt.localeCompare(a.updatedAt);
      }
    });
    return list;
  }, [entries, sort, onlyVerified]);

  const scoredCount = entries.filter(e => e.score.saved).length;

  function patch(id: string, next: Partial<JudgeScore>) {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, score: { ...e.score, ...next } } : e));
  }

  async function save(entry: JudgeEntry) {
    const s = entry.score;
    const res = await fetch("/api/hackathon/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId: entry.id,
        runtimeUsage: s.runtimeUsage, usefulness: s.usefulness, execution: s.execution,
        creativity: s.creativity, demoClarity: s.demoClarity, publicityBonus: s.publicityBonus,
        runtimeVerified: s.runtimeVerified, spotPrize: s.spotPrize, notes: s.notes,
      }),
    });
    if (res.ok) patch(entry.id, { saved: true });
    return res.ok;
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <main style={page}>
      <style>{css}</style>
      <header className="jb-head">
        <div>
          <div className="jb-eyebrow">BTL Runtime Hackathon · Judging</div>
          <h1>{entries.length} submission{entries.length === 1 ? "" : "s"}</h1>
          <p className="jb-muted">{scoredCount} scored · {entries.length - scoredCount} left</p>
        </div>
        <div className="jb-controls">
          <label className="jb-toggle">
            <input type="checkbox" checked={onlyVerified} onChange={e => setOnlyVerified(e.target.checked)} />
            Runtime-verified only
          </label>
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)}>
            <option value="updated">Recently updated</option>
            <option value="total">Highest score</option>
            <option value="unscored">Unscored first</option>
            <option value="name">Project name</option>
          </select>
          <button className="jb-logout" onClick={logout}>Log out</button>
        </div>
      </header>

      {sorted.length === 0 && <p className="jb-empty">No submissions match this filter yet.</p>}

      <div className="jb-list">
        {sorted.map(e => {
          const open = openId === e.id;
          const embed = embedUrl(e.demoVideoUrl);
          const t = total(e.score);
          return (
            <article key={e.id} className={`jb-card ${e.score.runtimeVerified ? "verified" : ""}`}>
              <div className="jb-card-head" onClick={() => setOpenId(open ? null : e.id)}>
                <div className="jb-title">
                  <h2>{e.projectName || "(untitled)"}</h2>
                  <span className="jb-team">{e.teamName} · {e.email}</span>
                </div>
                <div className="jb-badges">
                  {e.score.spotPrize && <span className="jb-badge star">★ spot</span>}
                  <span className={`jb-badge ${e.score.runtimeVerified ? "ok" : "warn"}`}>
                    {e.score.runtimeVerified ? "✓ runtime" : "runtime?"}
                  </span>
                  <span className="jb-total">{t}<em>/{MAX_TOTAL}</em></span>
                  <span className="jb-caret">{open ? "▲" : "▼"}</span>
                </div>
              </div>

              <p className="jb-desc">{e.description}</p>

              <div className="jb-links">
                <a href={e.repoUrl} target="_blank" rel="noreferrer" className="jb-link repo">Repo ↗</a>
                {e.liveUrl && <a href={e.liveUrl} target="_blank" rel="noreferrer" className="jb-link">Live ↗</a>}
                {e.demoVideoUrl && <a href={e.demoVideoUrl} target="_blank" rel="noreferrer" className="jb-link">Video ↗</a>}
                {e.xPostUrl && <a href={e.xPostUrl} target="_blank" rel="noreferrer" className="jb-link">X post ↗</a>}
                {e.members && <span className="jb-members">👥 {e.members}</span>}
              </div>

              <div className="jb-clone">
                <code>{cloneCmd(e.repoUrl)}</code>
                <button onClick={() => navigator.clipboard?.writeText(cloneCmd(e.repoUrl))}>Copy</button>
              </div>

              {open && (
                <div className="jb-body">
                  <div className="jb-runtime">
                    <div><strong>Routes / models:</strong> {e.runtimeRoutes || "—"}</div>
                    <div><strong>Proof:</strong> {e.runtimeProof
                      ? (/^https?:\/\//i.test(e.runtimeProof)
                          ? <a href={e.runtimeProof} target="_blank" rel="noreferrer">{e.runtimeProof}</a>
                          : <code>{e.runtimeProof}</code>)
                      : <span className="jb-muted">none provided — verify from repo/logs</span>}</div>
                  </div>

                  {embed && (
                    <div className="jb-video">
                      <iframe src={embed} allowFullScreen loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" />
                    </div>
                  )}

                  <details className="jb-readme" open>
                    <summary>README {e.readme ? "" : "(couldn’t fetch — private repo or no README)"}</summary>
                    {e.readme && <pre>{e.readme}</pre>}
                  </details>

                  <div className="jb-score">
                    {RUBRIC.map(r => (
                      <label key={r.key} className="jb-slider">
                        <span>{r.label} <b>{e.score[r.key]}</b>/{r.max}</span>
                        <input type="range" min={0} max={r.max} value={e.score[r.key]}
                          onChange={ev => patch(e.id, { [r.key]: Number(ev.target.value) } as Partial<JudgeScore>)} />
                      </label>
                    ))}
                    <div className="jb-flags">
                      <label><input type="checkbox" checked={e.score.runtimeVerified}
                        onChange={ev => patch(e.id, { runtimeVerified: ev.target.checked })} /> Runtime verified (eligible)</label>
                      <label><input type="checkbox" checked={e.score.spotPrize}
                        onChange={ev => patch(e.id, { spotPrize: ev.target.checked })} /> Spot-prize candidate</label>
                    </div>
                    <textarea placeholder="Notes…" value={e.score.notes}
                      onChange={ev => patch(e.id, { notes: ev.target.value })} rows={2} />
                    <div className="jb-save-row">
                      <span className="jb-bigtotal">{t}<em>/{MAX_TOTAL}</em></span>
                      <button className="jb-save" onClick={() => save(e)}>
                        {e.score.saved ? "Update score" : "Save score"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh", background: "#FAFAF9", color: "#0E0D0C",
  fontFamily: "'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif",
  padding: "0 0 80px",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
.jb-eyebrow,.jb-badge,.jb-total em,.jb-bigtotal em{font-family:'JetBrains Mono',monospace}
.jb-head h1,.jb-title h2{font-family:'EB Garamond',serif;font-weight:500;letter-spacing:-.03em}
.jb-head{max-width:920px;margin:0 auto;padding:26px 24px 18px;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap}
.jb-eyebrow{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:#9C9890}
.jb-total,.jb-bigtotal{font-family:'EB Garamond',serif;letter-spacing:-.03em}
.jb-head h1{margin:6px 0 2px;font-size:28px;letter-spacing:-.02em}
.jb-muted{color:#9C9890;font-size:13px;margin:0}
.jb-controls{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.jb-toggle{display:flex;gap:7px;align-items:center;font-size:13px;color:#4a4540;background:#fff;border:1px solid #E8E6E1;border-radius:8px;padding:8px 11px}
.jb-controls select{border:1px solid #D6D3CC;border-radius:8px;padding:8px 11px;font-size:13px;background:#fff}
.jb-logout{border:1px solid #D6D3CC;background:#fff;border-radius:8px;padding:8px 12px;font-size:13px;cursor:pointer}
.jb-empty{max-width:920px;margin:40px auto;padding:0 24px;color:#9C9890}
.jb-list{max-width:920px;margin:0 auto;padding:0 24px;display:flex;flex-direction:column;gap:14px}
.jb-card{background:#fff;border:1px solid #E8E6E1;border-radius:14px;padding:18px 20px}
.jb-card.verified{border-color:#bcd6bf;box-shadow:0 0 0 1px #d6ead8 inset}
.jb-card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;cursor:pointer}
.jb-title h2{margin:0;font-size:19px}
.jb-team{font-size:12.5px;color:#9C9890}
.jb-badges{display:flex;gap:8px;align-items:center;flex-shrink:0}
.jb-badge{font-size:11px;padding:3px 9px;border-radius:999px;font-weight:600}
.jb-badge.ok{background:#e5f3e6;color:#2f6b34}
.jb-badge.warn{background:#f6ece0;color:#9a6a2e}
.jb-badge.star{background:#0E0D0C;color:#fff}
.jb-total{font-size:18px;font-weight:700}
.jb-total em{font-size:12px;color:#9C9890;font-style:normal;font-weight:400}
.jb-caret{color:#9C9890;font-size:11px}
.jb-desc{color:#4a4540;font-size:14.5px;line-height:1.55;margin:12px 0}
.jb-links{display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-size:13.5px}
.jb-link{color:#0E0D0C;text-decoration:none;font-weight:600;border-bottom:1px solid #D6D3CC}
.jb-link.repo{background:#0E0D0C;color:#fff;padding:5px 11px;border-radius:7px;border:none}
.jb-members{color:#9C9890;font-size:12.5px}
.jb-clone{display:flex;gap:8px;align-items:center;margin-top:12px;background:#F3F2EF;border:1px solid #E8E6E1;border-radius:8px;padding:8px 10px}
.jb-clone code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px;color:#4a4540;flex:1;overflow:auto;white-space:nowrap}
.jb-clone button{border:none;background:#0E0D0C;color:#fff;border-radius:6px;padding:5px 11px;font-size:12px;cursor:pointer}
.jb-body{margin-top:16px;border-top:1px solid #F3F2EF;padding-top:16px;display:flex;flex-direction:column;gap:16px}
.jb-runtime{font-size:13.5px;color:#4a4540;display:flex;flex-direction:column;gap:6px;background:#F3F2EF;border-radius:8px;padding:11px 13px}
.jb-runtime code{font-family:ui-monospace,monospace;font-size:12px;background:#E8E6E1;padding:1px 6px;border-radius:4px}
.jb-video{position:relative;padding-top:56.25%;border-radius:10px;overflow:hidden;background:#000}
.jb-video iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.jb-readme summary{cursor:pointer;font-size:13px;font-weight:600;color:#5C5954}
.jb-readme pre{margin-top:10px;background:#0E0D0C;color:#e8e6e1;border-radius:10px;padding:14px;font-size:12px;line-height:1.5;overflow:auto;max-height:340px;white-space:pre-wrap;word-break:break-word}
.jb-score{background:#FAFAF9;border:1px solid #E8E6E1;border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:11px}
.jb-slider{display:flex;flex-direction:column;gap:4px;font-size:13px;color:#4a4540}
.jb-slider b{color:#0E0D0C}
.jb-slider input[type=range]{width:100%;accent-color:#0E0D0C}
.jb-flags{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;color:#4a4540;margin-top:4px}
.jb-flags label{display:flex;gap:6px;align-items:center;cursor:pointer}
.jb-score textarea{border:1px solid #D6D3CC;border-radius:8px;padding:9px 11px;font-size:13.5px;font-family:inherit;resize:vertical}
.jb-save-row{display:flex;justify-content:space-between;align-items:center;margin-top:2px}
.jb-bigtotal{font-size:22px;font-weight:700}
.jb-bigtotal em{font-size:13px;color:#9C9890;font-style:normal;font-weight:400}
.jb-save{background:#0E0D0C;color:#fff;border:none;border-radius:8px;padding:10px 20px;font-size:14px;font-weight:600;cursor:pointer}
`;
