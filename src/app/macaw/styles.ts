// self-contained styles for /macaw. same palette + type system as /btl-3 but
// namespaced mw- and with a green accent (the bird). one page renders at a
// time so the duplication is cheap and the route stays hermetic.

export const styles = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.mw {
  --bg:#FAFAF9; --surface:#F3F2EF; --ink:#0E0D0C; --body:#5C5954; --faint:#9C9890;
  --border:#E8E6E1; --border2:#D6D3CC; --accent:#1F7A4D; --accent-soft:#2bb673;
  --warn:#B26A1B; --crit:#B23A28;
  background:var(--bg); color:var(--ink);
  font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; min-height:100vh;
}
.mw *,.mw *::before,.mw *::after { box-sizing:border-box; }
.mw em { font-style:italic; font-weight:400; }
.mw code { font-family:'JetBrains Mono',monospace; font-size:0.85em; background:var(--surface); padding:1px 5px; border-radius:4px; color:var(--accent); }
.mw .mono { font-family:'JetBrains Mono',monospace; }
.mw .tnum { font-variant-numeric:tabular-nums; }

.mw-nav {
  position:sticky; top:0; z-index:50; height:56px; padding:0 clamp(20px,4vw,52px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(250,250,249,0.85); backdrop-filter:blur(24px) saturate(1.4);
  border-bottom:1px solid var(--border);
}
.mw-brand { font-family:'EB Garamond',serif; font-size:16px; font-weight:500; letter-spacing:-0.02em; color:var(--ink); text-decoration:none; }
.mw-nav-links { display:flex; gap:26px; }
.mw-nav-links a { font-size:13px; color:var(--body); text-decoration:none; transition:color .15s; }
.mw-nav-links a:hover,.mw-nav-links a.mw-active { color:var(--ink); }
.mw-nav-cta { display:flex; align-items:center; gap:10px; }
.mw-nav-cta a { font-size:13px; color:var(--body); text-decoration:none; }
.mw-solid { background:var(--ink); color:var(--bg)!important; padding:7px 16px; border-radius:7px; font-weight:500; transition:opacity .12s; }
.mw-solid:hover { opacity:.85; }
@media (max-width:760px){ .mw-nav-links{ display:none; } }

.mw-hero { display:grid; grid-template-columns:1.05fr 0.95fr; border-bottom:1px solid var(--border); }
.mw-hero-copy { padding:clamp(48px,7vw,92px) clamp(24px,4vw,56px); border-right:1px solid var(--border); }
.mw-eyebrow { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:26px; display:flex; align-items:center; gap:10px; }
.mw-dot { width:7px; height:7px; border-radius:50%; background:var(--accent-soft); display:inline-block; }
.mw-h1 { font-family:'EB Garamond',serif; font-weight:500; font-size:clamp(52px,7.5vw,88px); line-height:0.98; letter-spacing:-0.035em; margin:0 0 24px; }
.mw-h1 em { font-weight:400; }
.mw-lede { font-size:19px; line-height:1.55; color:var(--body); max-width:34em; margin:0 0 16px; }
.mw-lede b { color:var(--ink); font-weight:600; }
.mw-sub { font-size:14px; line-height:1.6; color:var(--faint); max-width:38em; margin:0 0 30px; }
.mw-hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.mw-btn { display:inline-block; padding:12px 22px; border-radius:8px; font-size:14px; font-weight:500; text-decoration:none; transition:opacity .12s, background .12s, color .12s, border-color .12s; }
.mw-btn-solid { background:var(--ink); color:var(--bg); }
.mw-btn-solid:hover { opacity:.85; }
.mw-btn-outline { border:1px solid var(--border2); color:var(--ink); }
.mw-btn-outline:hover { border-color:var(--ink); }
.mw-btn-light { background:var(--bg); color:var(--ink); }
.mw-btn-ghost { border:1px solid rgba(250,250,249,0.35); color:var(--bg); }
.mw-btn-ghost:hover { border-color:var(--bg); }

.mw-readout { padding:clamp(48px,7vw,92px) clamp(24px,4vw,56px); }
.mw-readout-head { display:flex; gap:5px; align-items:center; margin-bottom:22px; }
.mw-readout-head span:not(:last-child){ width:8px; height:8px; border-radius:50%; background:var(--border2); }
.mw-readout-label { margin-left:8px; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.1em; text-transform:uppercase; color:var(--faint); }
.mw-readout-row { display:flex; justify-content:space-between; align-items:baseline; padding:13px 0; border-bottom:1px solid var(--border); }
.mw-readout-row:last-child{ border-bottom:none; }
.mw-readout-k { font-size:13px; color:var(--body); }
.mw-readout-v { font-family:'JetBrains Mono',monospace; font-size:15px; color:var(--ink); }

.mw-strip { display:grid; grid-template-columns:repeat(6,1fr); border-bottom:1px solid var(--border); }
.mw-strip-cell { padding:22px 18px; border-right:1px solid var(--border); }
.mw-strip-cell:last-child{ border-right:none; }
.mw-strip-k { font-family:'JetBrains Mono',monospace; font-size:10px; text-transform:uppercase; letter-spacing:0.08em; color:var(--faint); margin-bottom:8px; }
.mw-strip-v { font-size:14px; font-weight:500; color:var(--ink); }
@media (max-width:960px){ .mw-strip{ grid-template-columns:repeat(3,1fr); } .mw-strip-cell:nth-child(3){ border-right:none; } }
@media (max-width:560px){ .mw-strip{ grid-template-columns:repeat(2,1fr); } .mw-strip-cell:nth-child(2n){ border-right:none; } }

.mw-block { padding:clamp(56px,9vw,110px) clamp(24px,4vw,56px); border-bottom:1px solid var(--border); }
.mw-block-alt { background:var(--surface); }
.mw-block-head { max-width:46em; margin-bottom:44px; }
.mw-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:16px; }
.mw-h2 { font-family:'EB Garamond',serif; font-weight:500; font-size:clamp(32px,4.4vw,48px); line-height:1.02; letter-spacing:-0.025em; margin:0 0 20px; }
.mw-h2 em { font-weight:400; }
.mw-body { font-size:15px; line-height:1.65; color:var(--body); max-width:40em; }
.mw-body em { color:var(--ink); }
.mw-body a { color:var(--ink); text-underline-offset:3px; text-decoration-color:var(--accent-soft); }

.mw-editions { display:grid; grid-template-columns:1fr 1fr; gap:18px; }
.mw-card { background:var(--bg); border:1px solid var(--border2); border-radius:14px; padding:28px; display:flex; flex-direction:column; }
.mw-card-feat { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent); }
.mw-card-tag { align-self:flex-start; font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.08em; text-transform:uppercase; color:var(--accent); padding:5px 10px; border:1px solid var(--border2); border-radius:999px; margin-bottom:18px; }
.mw-card-name { font-family:'EB Garamond',serif; font-size:30px; letter-spacing:-0.02em; margin-bottom:8px; }
.mw-card-blurb { font-size:14px; line-height:1.6; color:var(--body); margin-bottom:22px; }
.mw-speclist { list-style:none; margin:0 0 26px; padding:0; border-top:1px solid var(--border); }
.mw-speclist li { display:flex; justify-content:space-between; gap:16px; padding:11px 0; border-bottom:1px solid var(--border); font-size:13px; }
.mw-spec-k { color:var(--faint); }
.mw-spec-v { color:var(--ink); font-weight:500; text-align:right; }
@media (max-width:760px){ .mw-editions{ grid-template-columns:1fr; } }

.mw-bench { max-width:46em; }
.mw-bench-row { display:grid; grid-template-columns:1.3fr 0.7fr 1fr; gap:18px; align-items:center; padding:13px 0; border-bottom:1px solid var(--border); }
.mw-bench-name { font-size:14px; color:var(--ink); }
.mw-bench-name small { display:block; color:var(--faint); font-size:11.5px; margin-top:2px; }
.mw-bench-pct { font-family:'JetBrains Mono',monospace; font-size:14px; text-align:right; }
.mw-gauge { position:relative; height:10px; background:var(--border2); border-radius:6px; }
.mw-gauge-track { position:absolute; inset:0; border-radius:6px; background:var(--border2); }
.mw-gauge-fill { position:absolute; left:0; top:0; bottom:0; border-radius:6px; background:var(--accent-soft); }
.mw-gauge-tick { position:absolute; top:-3px; width:1px; height:16px; background:var(--bg); }

.mw-two { display:grid; grid-template-columns:1fr 1fr; gap:40px; }
.mw-tbl-wrap { min-width:0; }
.mw-cap { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:14px; }
.mw-note { font-size:12.5px; color:var(--faint); margin-top:16px; max-width:40em; line-height:1.6; }
@media (max-width:760px){ .mw-two{ grid-template-columns:1fr; } }

.mw-bounds { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.mw-bnd { border:1px solid var(--border); border-radius:12px; padding:20px; background:var(--bg); }
.mw-bnd-h { display:flex; align-items:center; gap:10px; font-weight:600; font-size:14px; margin-bottom:8px; }
.mw-bnd p { font-size:13px; line-height:1.6; color:var(--body); margin:0; }
.mw-sev { width:9px; height:9px; border-radius:50%; display:inline-block; flex-shrink:0; }
.mw-sev-crit { background:var(--crit); }
.mw-sev-warn { background:var(--warn); }
.mw-sev-note { background:var(--faint); }
@media (max-width:760px){ .mw-bounds{ grid-template-columns:1fr; } }

.mw-qs { display:grid; grid-template-columns:1fr; gap:16px; max-width:58em; }
.mw-qs-panel { border:1px solid var(--border2); border-radius:12px; overflow:hidden; }
.mw-qs-tag { font-family:'JetBrains Mono',monospace; font-size:10.5px; letter-spacing:0.08em; text-transform:uppercase; color:var(--faint); padding:12px 18px; border-bottom:1px solid var(--border); background:var(--bg); }
.mw-qs-code { margin:0; padding:20px; background:#17181A; color:#EDEDEA; font-family:'JetBrains Mono',monospace; font-size:12.5px; line-height:1.65; overflow-x:auto; }

.mw-cta { padding:clamp(56px,9vw,100px) clamp(24px,4vw,56px); background:var(--ink); color:var(--bg); text-align:center; }
.mw-cta-title { font-family:'EB Garamond',serif; font-weight:500; font-size:clamp(30px,4.2vw,46px); letter-spacing:-0.02em; margin:0 0 14px; }
.mw-cta-sub { color:rgba(250,250,249,0.65); font-size:15px; margin:0 0 30px; }

.mw-footer { padding:28px clamp(24px,4vw,56px); display:flex; justify-content:space-between; gap:24px; flex-wrap:wrap; align-items:baseline; }
.mw-foot-note { font-size:11.5px; color:var(--faint); line-height:1.7; max-width:44em; }
.mw-hash { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:16px 18px; }
.mw-hash-sha { font-family:'JetBrains Mono',monospace; font-size:12.5px; word-break:break-all; color:var(--ink); }
.mw-foot-links { display:flex; gap:22px; font-size:13px; }
.mw-foot-links a { color:var(--body); text-decoration:none; }
.mw-foot-links a:hover { color:var(--ink); }
`;
