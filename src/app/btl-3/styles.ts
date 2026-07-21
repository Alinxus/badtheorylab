// self-contained styles for /btl-3. same palette + type system as the rest of
// the site (btl-2-coder, runtime) but namespaced b3- so nothing leaks. one page
// renders at a time so the duplication is cheap and keeps this route hermetic.

export const styles = `
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');

.b3 {
  --bg:#FAFAF9; --surface:#F3F2EF; --ink:#0E0D0C; --body:#5C5954; --faint:#9C9890;
  --border:#E8E6E1; --border2:#D6D3CC; --gold:#A85E1A;
  --warn:#B26A1B; --crit:#B23A28;
  background:var(--bg); color:var(--ink);
  font-family:'DM Sans',sans-serif; -webkit-font-smoothing:antialiased; min-height:100vh;
}
.b3 *,.b3 *::before,.b3 *::after { box-sizing:border-box; }
.b3 em { font-style:italic; font-weight:400; }
.b3 code { font-family:'JetBrains Mono',monospace; font-size:0.85em; background:var(--surface); padding:1px 5px; border-radius:4px; color:var(--gold); }
.b3 .mono { font-family:'JetBrains Mono',monospace; }
.b3 .tnum { font-variant-numeric:tabular-nums; }

.b3-nav {
  position:sticky; top:0; z-index:50; height:56px; padding:0 clamp(20px,4vw,52px);
  display:flex; align-items:center; justify-content:space-between;
  background:rgba(250,250,249,0.85); backdrop-filter:blur(24px) saturate(1.4);
  border-bottom:1px solid var(--border);
}
.b3-brand { font-family:'EB Garamond',serif; font-size:16px; font-weight:500; letter-spacing:-0.02em; color:var(--ink); text-decoration:none; }
.b3-nav-links { display:flex; gap:26px; }
.b3-nav-links a { font-size:13px; color:var(--body); text-decoration:none; transition:color .15s; }
.b3-nav-links a:hover,.b3-nav-links a.b3-active { color:var(--ink); }
.b3-nav-cta { display:flex; align-items:center; gap:10px; }
.b3-nav-cta a { font-size:13px; color:var(--body); text-decoration:none; }
.b3-solid { background:var(--ink); color:var(--bg)!important; padding:7px 16px; border-radius:7px; font-weight:500; transition:opacity .12s; }
.b3-solid:hover { opacity:.85; }
@media (max-width:760px){ .b3-nav-links{ display:none; } }

/* hero */
.b3-hero { display:grid; grid-template-columns:1.05fr 0.95fr; border-bottom:1px solid var(--border); }
.b3-hero-copy { padding:clamp(48px,7vw,92px) clamp(24px,4vw,56px); border-right:1px solid var(--border); }
.b3-eyebrow { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:26px; display:flex; align-items:center; gap:10px; }
.b3-eyebrow::before { content:''; width:22px; height:1px; background:var(--gold); opacity:.5; }
.b3-h1 { font-family:'EB Garamond',serif; font-size:clamp(52px,8vw,104px); font-weight:500; letter-spacing:-0.04em; line-height:0.92; margin-bottom:22px; }
.b3-h1 em { color:var(--gold); }
.b3-lede { font-family:'EB Garamond',serif; font-size:clamp(20px,2.4vw,28px); font-weight:500; letter-spacing:-0.02em; line-height:1.32; color:var(--ink); max-width:480px; margin-bottom:20px; }
.b3-lede b { color:var(--gold); font-weight:600; }
.b3-sub { font-size:15px; font-weight:300; line-height:1.78; color:var(--body); max-width:460px; margin-bottom:34px; }
.b3-hero-actions { display:flex; gap:12px; flex-wrap:wrap; }
.b3-btn { font-size:14px; font-weight:500; text-decoration:none; padding:12px 24px; border-radius:8px; display:inline-flex; align-items:center; gap:8px; transition:opacity .12s,border-color .15s,color .15s,background .15s; }
.b3-btn-solid { background:var(--ink); color:var(--bg); }
.b3-btn-solid:hover { opacity:.85; }
.b3-btn-outline { border:1px solid var(--border2); color:var(--body); }
.b3-btn-outline:hover { border-color:var(--ink); color:var(--ink); background:rgba(14,13,12,0.025); }

/* hero readout — dark panel, benchmark ticker */
.b3-readout { background:var(--ink); padding:clamp(30px,4vw,48px); display:flex; flex-direction:column; justify-content:center; }
.b3-readout-head { display:flex; align-items:center; gap:7px; margin-bottom:24px; }
.b3-dot { width:9px; height:9px; border-radius:50%; background:rgba(250,250,249,0.18); }
.b3-readout-label { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(250,250,249,0.35); letter-spacing:0.1em; text-transform:uppercase; margin-left:8px; }
.b3-readout-row { display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:16px 0; border-bottom:1px solid rgba(250,250,249,0.09); }
.b3-readout-row:last-child { border-bottom:none; }
.b3-readout-k { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:rgba(250,250,249,0.5); letter-spacing:0.02em; }
.b3-readout-v { font-family:'EB Garamond',serif; font-size:clamp(24px,3vw,32px); font-weight:500; letter-spacing:-0.02em; color:rgba(250,250,249,0.94); font-variant-numeric:tabular-nums; }

/* spec strip */
.b3-strip { display:grid; grid-template-columns:repeat(4,1fr); border-bottom:1px solid var(--border); background:var(--surface); }
.b3-strip-cell { padding:24px clamp(20px,3vw,36px); border-right:1px solid var(--border); }
.b3-strip-cell:last-child { border-right:none; }
.b3-strip-k { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--faint); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:8px; }
.b3-strip-v { font-family:'EB Garamond',serif; font-size:clamp(16px,1.7vw,21px); font-weight:500; letter-spacing:-0.02em; color:var(--ink); }

/* generic block */
.b3-block { padding:clamp(56px,7vw,92px) clamp(24px,4vw,56px); border-bottom:1px solid var(--border); max-width:1320px; margin:0 auto; }
.b3-block-alt { background:var(--surface); max-width:none; }
.b3-block-head { max-width:700px; margin-bottom:44px; }
.b3-label { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:18px; display:flex; align-items:center; gap:10px; }
.b3-label::before { content:''; width:24px; height:1px; background:var(--border2); }
.b3-h2 { font-family:'EB Garamond',serif; font-size:clamp(30px,3.8vw,48px); font-weight:500; letter-spacing:-0.035em; line-height:1.06; margin-bottom:20px; }
.b3-h2 em { color:var(--gold); }
.b3-body { font-size:15.5px; font-weight:300; line-height:1.78; color:var(--body); }

/* editions */
.b3-editions { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1320px; margin:0 auto; }
.b3-card { background:var(--bg); border:1px solid var(--border); border-radius:14px; padding:30px 28px; display:flex; flex-direction:column; }
.b3-card-feat { border-color:var(--gold); box-shadow:inset 0 0 0 1px rgba(168,94,26,0.16); }
.b3-card-tag { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); border:1px solid rgba(168,94,26,0.4); padding:4px 10px; border-radius:6px; align-self:flex-start; }
.b3-card-name { font-family:'EB Garamond',serif; font-size:30px; font-weight:500; letter-spacing:-0.03em; margin:16px 0 6px; }
.b3-card-blurb { font-size:14px; font-weight:300; line-height:1.65; color:var(--body); margin-bottom:22px; min-height:62px; }
.b3-speclist { list-style:none; margin:0 0 22px; padding:0; border-top:1px solid var(--border); }
.b3-speclist li { display:flex; justify-content:space-between; gap:14px; align-items:baseline; padding:12px 0; border-bottom:1px solid var(--border); }
.b3-spec-k { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--faint); letter-spacing:0.02em; }
.b3-spec-v { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink); text-align:right; font-variant-numeric:tabular-nums; }
.b3-card .b3-btn { margin-top:auto; }

/* benchmark gauges */
.b3-bench { border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.b3-bench-row { display:grid; grid-template-columns:minmax(180px,1.3fr) 84px 2fr; align-items:center; gap:18px; padding:18px 22px; border-bottom:1px solid var(--border); }
.b3-bench-row:last-child { border-bottom:none; }
.b3-bench-name { font-size:14.5px; color:var(--ink); }
.b3-bench-name small { display:block; color:var(--faint); font-family:'JetBrains Mono',monospace; font-size:11px; margin-top:3px; letter-spacing:0.01em; }
.b3-bench-pct { font-family:'EB Garamond',serif; font-weight:500; font-size:22px; text-align:right; font-variant-numeric:tabular-nums; letter-spacing:-0.02em; }
.b3-gauge { position:relative; height:30px; }
.b3-gauge-track { position:absolute; left:0; right:0; top:50%; height:8px; transform:translateY(-50%); background:var(--surface); border:1px solid var(--border); border-radius:5px; }
.b3-gauge-fill { position:absolute; left:0; top:50%; height:8px; transform:translateY(-50%); background:var(--gold); border-radius:5px; }
.b3-gauge-tick { position:absolute; top:50%; height:13px; width:1px; background:var(--border2); transform:translateY(-50%); }
@media (max-width:720px){ .b3-bench-row{ grid-template-columns:1fr auto; } .b3-gauge{ display:none; } }

/* two-up tables (bfcl + perf, retention) */
.b3-two { display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start; max-width:1320px; margin:0 auto; }
.b3-tbl-wrap { overflow-x:auto; }
.b3-cap { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.12em; text-transform:uppercase; color:var(--faint); margin-bottom:14px; }
.b3-tbl { width:100%; border-collapse:collapse; }
.b3-tbl td { padding:11px 4px; border-bottom:1px solid var(--border); font-size:14px; color:var(--body); }
.b3-tbl tr:last-child td { border-bottom:none; }
.b3-tbl .name { color:var(--ink); }
.b3-tbl .frac { font-family:'JetBrains Mono',monospace; font-size:12.5px; text-align:right; color:var(--faint); font-variant-numeric:tabular-nums; white-space:nowrap; }
.b3-tbl .barcell { position:relative; text-align:right; font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink); font-variant-numeric:tabular-nums; min-width:82px; }
.b3-tbl .barcell b { color:var(--gold); font-weight:500; }
.b3-tbl .barcell .bar { position:absolute; left:0; right:auto; bottom:2px; height:2px; background:rgba(168,94,26,0.5); }
.b3-tbl tr.strong td { border-top:1px solid var(--border2); padding-top:14px; }
.b3-tbl tr.strong .name { font-weight:500; }
.b3-weak b { color:var(--crit)!important; }
.b3-weak .bar { background:rgba(178,58,40,0.55)!important; }
.b3-note { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); line-height:1.7; margin-top:14px; }

/* retention callout */
.b3-callout { border:1px solid var(--border); border-radius:12px; padding:24px; background:var(--bg); }
.b3-callout-k { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:var(--faint); }
.b3-callout-nums { display:flex; align-items:baseline; gap:18px; margin-top:16px; flex-wrap:wrap; }
.b3-bignum { font-family:'EB Garamond',serif; font-size:44px; font-weight:500; letter-spacing:-0.03em; line-height:1; font-variant-numeric:tabular-nums; }
.b3-bignum small { font-size:20px; color:var(--faint); }
.b3-bignum.gold { color:var(--gold); }
.b3-bignum-k { font-size:12px; color:var(--body); margin-top:6px; }
.b3-arrow { color:var(--faint); font-size:22px; }

/* boundaries */
.b3-bounds { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
.b3-bnd { background:var(--bg); padding:24px 22px; }
.b3-block-alt .b3-bnd { background:var(--surface); }
.b3-bnd-h { display:flex; align-items:flex-start; gap:10px; font-family:'EB Garamond',serif; font-size:19px; font-weight:500; letter-spacing:-0.02em; line-height:1.2; margin-bottom:10px; }
.b3-sev { width:9px; height:9px; border-radius:50%; flex-shrink:0; margin-top:7px; }
.b3-sev-note { background:var(--faint); }
.b3-sev-warn { background:var(--warn); }
.b3-sev-crit { background:var(--crit); }
.b3-bnd p { margin:0; font-size:13.5px; font-weight:300; line-height:1.65; color:var(--body); }

/* quickstart */
.b3-qs { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; max-width:1320px; margin:0 auto; }
.b3-qs-panel { background:var(--ink); border-radius:12px; overflow:hidden; display:flex; flex-direction:column; }
.b3-qs-tag { font-family:'JetBrains Mono',monospace; font-size:10px; color:rgba(250,250,249,0.4); letter-spacing:0.1em; text-transform:uppercase; padding:16px 20px 0; }
.b3-qs-code { font-family:'JetBrains Mono',monospace; font-size:11.5px; line-height:1.7; color:rgba(250,250,249,0.82); white-space:pre; overflow-x:auto; padding:12px 20px 22px; margin:0; }

/* integrity */
.b3-hashes { display:grid; grid-template-columns:1fr 1fr; gap:20px; max-width:1320px; margin:0 auto; }
.b3-hash { border:1px solid var(--border); border-radius:12px; padding:22px; background:var(--bg); }
.b3-hash-lab { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:0.06em; color:var(--faint); }
.b3-hash-tag { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.14em; text-transform:uppercase; color:var(--body); margin:12px 0 8px; }
.b3-hash-sha { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--gold); word-break:break-all; line-height:1.55; }
.b3-hash-meta { font-family:'JetBrains Mono',monospace; font-size:11.5px; color:var(--faint); margin-top:12px; font-variant-numeric:tabular-nums; }

/* cta + footer */
.b3-cta { background:var(--ink); padding:clamp(60px,8vw,104px) clamp(24px,4vw,56px); text-align:center; }
.b3-cta-title { font-family:'EB Garamond',serif; font-size:clamp(32px,4.5vw,58px); font-weight:500; letter-spacing:-0.04em; color:rgba(250,250,249,0.94); margin-bottom:14px; }
.b3-cta-sub { font-size:15px; font-weight:300; color:rgba(250,250,249,0.45); margin-bottom:32px; }
.b3-cta .b3-hero-actions { justify-content:center; }
.b3-btn-light { background:var(--bg); color:var(--ink); }
.b3-btn-light:hover { opacity:.88; }
.b3-btn-ghost { border:1px solid rgba(255,255,255,0.18); color:rgba(250,250,249,0.7); }
.b3-btn-ghost:hover { border-color:rgba(255,255,255,0.5); color:var(--bg); }
.b3-footer { padding:26px clamp(24px,4vw,56px); display:flex; align-items:flex-start; justify-content:space-between; flex-wrap:wrap; gap:16px; }
.b3-foot-note { font-family:'JetBrains Mono',monospace; font-size:10.5px; color:var(--faint); line-height:1.8; max-width:640px; }
.b3-foot-links { display:flex; gap:22px; }
.b3-foot-links a { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); text-decoration:none; transition:color .12s; }
.b3-foot-links a:hover { color:var(--ink); }

@media (max-width:900px){
  .b3-hero { grid-template-columns:1fr; }
  .b3-hero-copy { border-right:none; border-bottom:1px solid var(--border); }
  .b3-strip { grid-template-columns:1fr 1fr; }
  .b3-strip-cell:nth-child(2){ border-right:none; }
  .b3-strip-cell:nth-child(1),.b3-strip-cell:nth-child(2){ border-bottom:1px solid var(--border); }
  .b3-editions,.b3-two,.b3-hashes { grid-template-columns:1fr; }
  .b3-bounds { grid-template-columns:1fr 1fr; }
  .b3-qs { grid-template-columns:1fr; }
}
@media (max-width:560px){ .b3-bounds { grid-template-columns:1fr; } }
`;
