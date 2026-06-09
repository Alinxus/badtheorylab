'use client';

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import data from "./question-data.json";

const TOTAL_Q = 12;
const LETTERS = ["A","B","C","D"];

type Q = typeof data[number];
type Answer = { q: Q; chosen: number; correct: boolean };

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}

type VarInfo = { id: string; name: string; values: string[] };

function fmtPlainCPTs(text: string, variables: VarInfo[]): string[] {
  const varMap = new Map(variables.map(v => [v.id, v]));
  const out: string[] = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^P\((\w+)(?:\s*\|\s*(.+))?\)\s*=\s*(.+)$/);
    if (!m) continue;
    const varId = m[1];
    const condRaw = m[2] || "";
    const probs = m[3].trim().split(/\s+/);
    const vi = varMap.get(varId);
    if (!vi) { out.push(line); continue; }
    if (!condRaw) {
      out.push(`${vi.name}: ${vi.values.map((vl, i) => `${vl} ${probs[i] || "?"}`).join(", ")}`);
    } else {
      // Parse conditions like "T=no,A=yes"
      const condParts = condRaw.split(",").map(c => c.trim());
      const condStr = condParts.map(c => {
        const [id, val] = c.split("=");
        const cv = varMap.get(id);
        return cv ? `${cv.name} = ${val}` : c;
      }).join(", ");
      out.push(`When ${condStr}:`);
      vi.values.forEach((vl, i) => out.push(`  ${vi.name} = ${vl} → ${probs[i] || "?"}`));
    }
  }
  return out;
}

export default function ReasoningTestPage() {
  const [phase, setPhase] = useState<"start"|"test"|"done">("start");
  const [pid, setPid] = useState("");
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [seed] = useState(() => Math.floor(Math.random() * 99999));

  const questions = useMemo(() => shuffle(data).slice(0, TOTAL_Q), [seed]);

  const select = (i: number) => {
    const q = questions[idx];
    const isCorrect = i === q.answer;
    setCorrect(c => isCorrect ? c + 1 : c);
    setAnswers(a => [...a, { q, chosen: i, correct: isCorrect }]);
    if (idx + 1 >= TOTAL_Q) { setPhase("done"); } else { setIdx(i => i + 1); }
  };

  useEffect(() => {
    if (phase !== "done" || saved || saving || !pid) return;
    (async () => {
      setSaving(true);
      try {
        await fetch("/api/reasoning-test", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            participantId: pid,
            score: correct,
            total: TOTAL_Q,
            answers: answers.map(a => ({ questionId: a.q.graphDescription + a.q.query.slice(0, 20), chosen: a.chosen, correct: a.correct })),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
          }),
        });
        setSaved(true);
      } catch {} finally { setSaving(false); }
    })();
  }, [phase, saved, saving, pid, correct, answers]);

  if (phase === "start") return <StartScreen pid={pid} setPid={setPid} onStart={() => setPhase("test")} />;
  if (phase === "done") return <ResultsScreen correct={correct} total={TOTAL_Q} answers={answers} saving={saving} saved={saved} onRestart={() => { setPhase("start"); setIdx(0); setCorrect(0); setAnswers([]); setSaved(false); }} />;

  const q = questions[idx];
  const plainLines = fmtPlainCPTs(q.cptsDisplay, q.variables as VarInfo[]);
  const pct = (idx / TOTAL_Q) * 100;

  return (
    <main className="rt-page"><style>{styles}</style>
      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links"><Link href="/">Home</Link><Link href="/papers">Papers</Link></div>
      </nav>
      <div className="rt-test">
        <div className="rt-progress-wrap">
          <div className="rt-progress"><div className="rt-progress-fill" style={{width:`${pct}%`}} /></div>
          <span className="rt-counter">{idx+1}/{TOTAL_Q}</span>
        </div>
        <div className="rt-card">
          <span className={`rt-tag rt-tag-${q.kind}`}>{q.kind === "observational" ? "OBS" : q.kind === "interventional" ? "IVN" : "CF"}</span>
          <div className="rt-graph">
            <p className="rt-graph-desc">{q.graphDescription}</p>
            <div className="rt-edges">{q.edges.map((e,i) => <span key={i} className="rt-edge">{e.from}→{e.to}</span>)}</div>
          </div>
          <div className="rt-cpts">
            <p className="rt-cpts-title">Probability Tables</p>
            {plainLines.map((l, i) => {
              const isIndent = l.startsWith("  ");
              return <div key={i} className={`rt-cpt-line ${isIndent ? "rt-cpt-indent" : ""}`}>{l}</div>;
            })}
          </div>
          <p className="rt-scenario">{q.query}</p>
          <div className="rt-choices">
            {q.choices.map((c, i) => (
              <button key={i} className="rt-choice" onClick={() => select(i)}>
                <span className="rt-choice-letter">{LETTERS[i]}</span><span className="rt-choice-text">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StartScreen({ pid, setPid, onStart }: { pid: string; setPid: (v: string) => void; onStart: () => void }) {
  return (
    <main className="rt-page"><style>{styles}</style>
      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links"><Link href="/">Home</Link><Link href="/papers">Papers</Link></div>
      </nav>
      <div className="rt-start">
        <div className="rt-start-card">
          <p className="rt-start-eyebrow">Research Validation</p>
          <h1 className="rt-start-title">Reasoning Test</h1>
          <p className="rt-start-body">
            You will be shown {TOTAL_Q} causal reasoning questions. Each includes the causal graph structure
            and probability tables needed to compute the answer. Read the tables carefully — the same
            data can produce different answers depending on whether you&apos;re asked an observational,
            interventional, or counterfactual question.
          </p>
          <p className="rt-start-body">
            Human experts score ~98% on similar tasks. The best LLMs score ~29%.
          </p>
          <div className="rt-field">
            <label className="rt-field-label">Name (anonymous OK)</label>
            <input className="rt-field-input" placeholder="e.g. alice@example.com" value={pid} onChange={e => setPid(e.target.value)} />
          </div>
          <button className="rt-start-btn" onClick={onStart} disabled={!pid.trim()}>Begin Test</button>
        </div>
      </div>
    </main>
  );
}

function ResultsScreen({ correct, total, answers, saving, saved, onRestart }: {
  correct: number; total: number; answers: Answer[]; saving: boolean; saved: boolean; onRestart: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  return (
    <main className="rt-page"><style>{styles}</style>
      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links"><Link href="/">Home</Link><Link href="/papers">Papers</Link></div>
      </nav>
      <div className="rt-results">
        <div className="rt-score-card">
          <p className="rt-score-label">Your Score</p>
          <p className="rt-score">{correct}<span className="rt-score-total">/{total}</span></p>
          <p className="rt-score-pct">{pct}% correct</p>
          <div className="rt-score-bar-bg"><div className="rt-score-bar-fill" style={{width:`${pct}%`}} /></div>
          <p className="rt-score-msg">
            {pct >= 90 ? "Excellent causal reasoning." : pct >= 70 ? "Good — review missed questions below." : "Review the questions below."}
          </p>
          <div className="rt-compare">
            <p className="rt-compare-title">Benchmark comparison</p>
            <div className="rt-compare-rows">
              <div className="rt-compare-row"><span className="rt-compare-label">You</span><span className="rt-compare-val">{pct}%</span></div>
              <div className="rt-compare-row"><span className="rt-compare-label">GPT-5.4</span><span className="rt-compare-val">25.0%</span></div>
              <div className="rt-compare-row"><span className="rt-compare-label">GPT-4o mini</span><span className="rt-compare-val">25.7%</span></div>
              <div className="rt-compare-row"><span className="rt-compare-label">Gemini 2.0 Flash</span><span className="rt-compare-val">29.2%</span></div>
              <div className="rt-compare-row rt-compare-hum"><span className="rt-compare-label">Human experts (CounterBench)</span><span className="rt-compare-val">97.8%</span></div>
            </div>
          </div>
          {saving && <p className="rt-score-msg">Saving your responses...</p>}
          {saved && <p className="rt-score-msg rt-score-pass">Responses saved. Thank you!</p>}
          <button className="rt-restart-btn" onClick={onRestart}>Try Again</button>
        </div>
        <div className="rt-review">
          <p className="rt-review-title">Review</p>
          {answers.map((a, i) => (
            <div key={i} className={`rt-review-item ${a.correct ? "rt-review-correct" : "rt-review-wrong"}`}>
              <div className="rt-review-num">{i+1}.</div>
              <div className="rt-review-body">
                <p className="rt-review-q">{a.q.query}</p>
                <p className="rt-review-a">
                  Your answer: <strong>{LETTERS[a.chosen]}. {a.q.choices[a.chosen]}</strong>
                  {!a.correct && <> · Correct: <strong>{LETTERS[a.q.answer]}. {a.q.choices[a.q.answer]}</strong></>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles = `
:root{--bg:#fafaf9;--surface:#f3f2ef;--border:#e8e6e1;--ink:#0e0d0c;--body:#5c5954;--faint:#9c9890}
.rt-page{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'DM Sans',sans-serif}
.rt-nav{position:sticky;top:0;z-index:20;height:56px;border-bottom:1px solid var(--border);background:rgba(250,250,249,.88);backdrop-filter:blur(18px);display:flex;align-items:center;justify-content:space-between;padding:0 28px}
.rt-brand{font-family:'EB Garamond',serif;font-size:20px;color:var(--ink);text-decoration:none;letter-spacing:-.02em}
.rt-nav-links{display:flex;gap:20px}.rt-nav-links a{text-decoration:none;color:var(--body);font-size:13px}
.rt-start{display:flex;justify-content:center;padding:80px 20px}
.rt-start-card{max-width:520px;width:100%;text-align:center}
.rt-start-eyebrow{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:16px}
.rt-start-title{font-family:'EB Garamond',serif;font-size:clamp(36px,5vw,54px);font-weight:500;letter-spacing:-.03em;line-height:1.05;color:var(--ink);margin-bottom:20px}
.rt-start-body{font-size:14px;font-weight:300;color:var(--body);line-height:1.75;max-width:440px;margin:0 auto 28px}
.rt-field{max-width:340px;margin:0 auto 24px;text-align:left}
.rt-field-label{font-size:12px;color:var(--body);display:block;margin-bottom:6px}
.rt-field-input{width:100%;height:40px;padding:0 14px;border:1px solid var(--border);border-radius:7px;background:#fff;color:var(--ink);font-family:'DM Sans',sans-serif;font-size:14px;outline:none}
.rt-field-input:focus{border-color:var(--ink)}
.rt-start-btn{padding:14px 40px;border-radius:8px;border:none;background:var(--ink);color:var(--bg);font-size:15px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif}
.rt-start-btn:disabled{opacity:.35;cursor:default}
.rt-start-btn:hover:not(:disabled){opacity:.84}
.rt-test{max-width:600px;margin:0 auto;padding:48px 20px 80px}
.rt-progress-wrap{display:flex;align-items:center;gap:12px;margin-bottom:28px}
.rt-progress{flex:1;height:3px;background:var(--border);border-radius:2px;overflow:hidden}
.rt-progress-fill{height:100%;background:var(--ink);border-radius:2px;transition:width .4s cubic-bezier(.16,1,.3,1)}
.rt-counter{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--faint);white-space:nowrap}
.rt-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px;box-shadow:0 2px 12px rgba(14,13,12,.04)}
.rt-tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:500;letter-spacing:.08em;padding:3px 8px;border-radius:4px;margin-bottom:12px}
.rt-tag-observational{background:#e8f4fd;color:#0369a1}
.rt-tag-interventional{background:#fef3c7;color:#92400e}
.rt-tag-counterfactual{background:#f3e8ff;color:#6b21a8}
.rt-graph{background:var(--surface);border-radius:8px;padding:12px 14px;margin-bottom:12px}
.rt-graph-desc{font-family:'EB Garamond',serif;font-size:17px;font-weight:500;color:var(--ink);margin-bottom:6px}
.rt-edges{display:flex;flex-wrap:wrap;gap:4px 10px}
.rt-edge{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--body);letter-spacing:.03em}
.rt-cpts{background:var(--surface);border-radius:8px;padding:12px 14px;margin-bottom:12px}
.rt-cpts-title{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin-bottom:8px}
.rt-cpt-line{font-size:12px;line-height:1.65;color:var(--body);font-family:'JetBrains Mono',monospace}
.rt-cpt-line code{font-family:'JetBrains Mono',monospace;background:transparent;color:inherit}
.rt-cpt-indent{padding-left:12px;border-left:2px solid var(--border);margin-bottom:2px}
.rt-scenario{font-size:16px;font-weight:500;color:var(--ink);line-height:1.4;margin-bottom:20px}
.rt-choices{display:flex;flex-direction:column;gap:8px}
.rt-choice{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1.5px solid var(--border);border-radius:8px;background:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:15px;color:var(--ink);text-align:left;transition:all .12s}
.rt-choice:hover{border-color:#d6d3cc;background:var(--surface)}
.rt-choice-letter{width:24px;height:24px;border-radius:50%;background:var(--surface);display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--body);flex-shrink:0}
.rt-results{max-width:580px;margin:0 auto;padding:48px 20px 80px}
.rt-score-card{text-align:center;background:#fff;border:1px solid var(--border);border-radius:12px;padding:36px 28px;margin-bottom:28px}
.rt-score-label{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:12px}
.rt-score{font-family:'EB Garamond',serif;font-size:48px;font-weight:500;color:var(--ink);line-height:1}
.rt-score-total{font-size:24px;color:var(--faint);font-weight:400}
.rt-score-pct{font-size:16px;color:var(--body);margin-top:4px;margin-bottom:20px}
.rt-score-bar-bg{height:4px;background:var(--border);border-radius:2px;overflow:hidden;margin-bottom:20px}
.rt-score-bar-fill{height:100%;background:var(--ink);border-radius:2px;transition:width 1s cubic-bezier(.16,1,.3,1)}
.rt-score-msg{font-size:14px;color:var(--body);margin-bottom:14px}
.rt-score-pass{color:#16a34a}
.rt-restart-btn{padding:12px 32px;border-radius:8px;border:none;background:var(--ink);color:var(--bg);font-size:14px;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif}
.rt-compare{background:var(--surface);border-radius:8px;padding:16px;margin-bottom:16px;text-align:left}
.rt-compare-title{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--faint);margin-bottom:10px}
.rt-compare-rows{display:flex;flex-direction:column;gap:6px}
.rt-compare-row{display:flex;justify-content:space-between;align-items:center;font-size:13px}
.rt-compare-label{color:var(--body)}
.rt-compare-val{font-family:'JetBrains Mono',monospace;font-weight:500;color:var(--ink)}
.rt-compare-hum .rt-compare-val{color:#16a34a}
.rt-review{background:#fff;border:1px solid var(--border);border-radius:12px;padding:24px}
.rt-review-title{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--faint);margin-bottom:16px}
.rt-review-item{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)}
.rt-review-item:last-child{border-bottom:none}
.rt-review-num{font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--faint);width:20px;flex-shrink:0;margin-top:2px}
.rt-review-body{flex:1}
.rt-review-q{font-size:13px;color:var(--ink);margin-bottom:3px}
.rt-review-a{font-size:12px;color:var(--body)}
.rt-review-correct{border-left:2px solid #16a34a;padding-left:14px}
.rt-review-wrong{border-left:2px solid #dc2626;padding-left:14px}
@media(max-width:640px){.rt-nav-links{display:none}.rt-test,.rt-results{padding-left:16px;padding-right:16px}.rt-card{padding:20px}}
`;
