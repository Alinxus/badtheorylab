'use client';

import { useState, useMemo } from "react";
import Link from "next/link";

const QUESTIONS = [
  {kind:"observational",graph:"chain",tag:"OBS",scenario:"A company offers optional Training to employees and tracks their Performance.",query:"Among employees who COMPLETED the training, what percentage achieved HIGH performance?",choices:["44%","49%","12%","71%"],answer:1},
  {kind:"observational",graph:"chain",tag:"OBS",scenario:"A company offers optional Training to employees and tracks their Performance.",query:"Among employees who did NOT take the training, what percentage achieved HIGH performance?",choices:["49%","27%","12%","63%"],answer:2},
  {kind:"interventional",graph:"chain",tag:"IVN",scenario:"A company offers optional Training to employees and tracks their Performance.",query:"If the company FORCED every employee to complete the training, what percentage would achieve HIGH performance?",choices:["12%","23%","49%","81%"],answer:2},
  {kind:"observational",graph:"fork",tag:"OBS",scenario:"Researchers track education levels and income across a population.",query:"Among people with ADVANCED education, what percentage have HIGH income?",choices:["35%","20%","50%","65%"],answer:2},
  {kind:"observational",graph:"fork",tag:"OBS",scenario:"Researchers track education levels and income across a population.",query:"Among people with BASIC education, what percentage have HIGH income?",choices:["50%","35%","60%","20%"],answer:3},
  {kind:"interventional",graph:"fork",tag:"IVN",scenario:"Researchers track education levels and income across a population.",query:"If the government PAID for everyone to get ADVANCED education, what percentage would have HIGH income?",choices:["35%","50%","20%","65%"],answer:0},
  {kind:"counterfactual",graph:"fork",tag:"CF",scenario:"A person has BASIC education and LOW income.",query:"If that person had instead received ADVANCED education, what would their income PROBABLY be?",choices:["LOW","MEDIUM","HIGH","UNCLEAR"],answer:1},
  {kind:"observational",graph:"collider",tag:"OBS",scenario:"A company evaluates candidates on talent and interview performance before hiring.",query:"Among HIRED candidates, what proportion had a STRONG interview?",choices:["50%","42%","69%","31%"],answer:2},
  {kind:"observational",graph:"collider",tag:"OBS",scenario:"A company evaluates candidates on talent and interview performance before hiring.",query:"Among HIRED candidates, what proportion had HIGH talent?",choices:["50%","69%","31%","42%"],answer:1},
  {kind:"interventional",graph:"collider",tag:"IVN",scenario:"A company evaluates candidates on talent and interview performance before hiring.",query:"If the company FORCED all hired candidates to have HIGH talent, what proportion would have had a STRONG interview?",choices:["50%","69%","31%","42%"],answer:0},
  {kind:"observational",graph:"mbias",tag:"OBS",scenario:"A clinical trial tracks a new drug, a biomarker, and patient recovery.",query:"Among patients who TOOK the drug and had a POSITIVE biomarker, what percentage achieved FULL recovery?",choices:["82%","12%","37%","55%"],answer:2},
  {kind:"interventional",graph:"mbias",tag:"IVN",scenario:"A clinical trial tracks a new drug, a biomarker, and patient recovery.",query:"If the trial GAVE the drug to ALL patients, what percentage would achieve FULL recovery?",choices:["36%","12%","55%","73%"],answer:0},
  {kind:"interventional",graph:"mbias",tag:"IVN",scenario:"A clinical trial tracks a new drug, a biomarker, and patient recovery.",query:"If the trial gave NO patients the drug, what percentage would achieve FULL recovery?",choices:["55%","12%","36%","32%"],answer:3},
  {kind:"counterfactual",graph:"mbias",tag:"CF",scenario:"A patient took the drug and made a FULL recovery.",query:"If that patient had NOT taken the drug, would they still have recovered?",choices:["Yes, likely","No","Maybe","Probably not"],answer:0},
  {kind:"observational",graph:"instrument",tag:"OBS",scenario:"A lottery randomly awards scholarships. Researchers track college attendance and later income.",query:"Among people who ATTENDED college, what percentage earn HIGH income?",choices:["38%","52%","25%","17%"],answer:0},
  {kind:"interventional",graph:"instrument",tag:"IVN",scenario:"A lottery randomly awards scholarships. Researchers track college attendance and later income.",query:"If the government FORCED everyone to attend college, what percentage would earn HIGH income?",choices:["38%","52%","29%","36%"],answer:3},
  {kind:"observational",graph:"backdoor",tag:"OBS",scenario:"A hospital studies a new drug. Older patients and severe cases are more likely to get the drug, but also have worse recovery.",query:"Among patients who TOOK the drug, what percentage had GOOD recovery?",choices:["25%","52%","37%","63%"],answer:1},
  {kind:"interventional",graph:"backdoor",tag:"IVN",scenario:"A hospital studies a new drug. Older patients and severe cases are more likely to get the drug, but also have worse recovery.",query:"If the hospital GAVE the drug to ALL patients, what percentage would have GOOD recovery?",choices:["52%","63%","37%","25%"],answer:2},
];

const TOTAL_Q = 12;

function shuffle<T>(a: T[]): T[] {
  const arr = [...a];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function ReasoningTestPage() {
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answers, setAnswers] = useState<{q: typeof QUESTIONS[0]; chosen: number; correct: boolean}[]>([]);
  const [seed] = useState(() => Math.floor(Math.random() * 99999));

  const questions = useMemo(() => shuffle(QUESTIONS).slice(0, TOTAL_Q), [seed]);

  const select = (i: number) => {
    const q = questions[idx];
    const isCorrect = i === q.answer;
    setCorrect(c => isCorrect ? c + 1 : c);
    setAnswers(a => [...a, { q, chosen: i, correct: isCorrect }]);
    if (idx + 1 >= TOTAL_Q) {
      setFinished(true);
    } else {
      setIdx(i => i + 1);
    }
  };

  if (!started) {
    return <StartScreen onStart={() => setStarted(true)} />;
  }

  if (finished) {
    return <ResultsScreen correct={correct} total={TOTAL_Q} answers={answers} onRestart={() => { setStarted(false); setFinished(false); setIdx(0); setCorrect(0); setAnswers([]); }} />;
  }

  const q = questions[idx];
  const pct = (idx / TOTAL_Q) * 100;
  const letters = ["A","B","C","D"];

  return (
    <main className="rt-page">
      <style>{styles}</style>
      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links">
          <Link href="/">Home</Link>
          <Link href="/papers">Papers</Link>
        </div>
      </nav>
      <div className="rt-test">
        <div className="rt-progress-wrap">
          <div className="rt-progress"><div className="rt-progress-fill" style={{width:`${pct}%`}} /></div>
          <span className="rt-counter">{idx+1} / {TOTAL_Q}</span>
        </div>
        <div className="rt-card">
          <span className={`rt-tag rt-tag-${q.kind}`}>{q.tag}</span>
          <p className="rt-scenario">{q.scenario}</p>
          <p className="rt-query">{q.query}</p>
          <div className="rt-choices">
            {q.choices.map((c, i) => (
              <button key={i} className="rt-choice" onClick={() => select(i)}>
                <span className="rt-choice-letter">{letters[i]}</span>
                <span className="rt-choice-text">{c}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="rt-page">
      <style>{styles}</style>
      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links">
          <Link href="/">Home</Link>
          <Link href="/papers">Papers</Link>
        </div>
      </nav>
      <div className="rt-start">
        <div className="rt-start-card">
          <p className="rt-start-eyebrow">Research Validation</p>
          <h1 className="rt-start-title">Reasoning Test</h1>
          <p className="rt-start-body">
            You will be shown 12 short reasoning questions. Each asks you to interpret a scenario
            and choose the best answer. Read carefully — the questions look similar but require
            different reasoning.
          </p>
          <div className="rt-start-details">
            <div className="rt-start-detail">
              <span className="rt-start-detail-num">{TOTAL_Q}</span>
              <span className="rt-start-detail-label">questions</span>
            </div>
            <div className="rt-start-detail">
              <span className="rt-start-detail-num">~3</span>
              <span className="rt-start-detail-label">minutes</span>
            </div>
            <div className="rt-start-detail">
              <span className="rt-start-detail-num">—</span>
              <span className="rt-start-detail-label">no wrong answers</span>
            </div>
          </div>
          <button className="rt-start-btn" onClick={onStart}>Begin Test</button>
        </div>
      </div>
    </main>
  );
}

function ResultsScreen({ correct, total, answers, onRestart }: {
  correct: number; total: number;
  answers: {q: typeof QUESTIONS[0]; chosen: number; correct: boolean}[];
  onRestart: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  const letters = ["A","B","C","D"];

  const countKind = (k: string) => {
    const f = answers.filter(a => a.q.kind === k);
    return { t: f.length, c: f.filter(a => a.correct).length };
  };

  return (
    <main className="rt-page">
      <style>{styles}</style>
      <nav className="rt-nav">
        <Link href="/" className="rt-brand">Bad Theory Labs</Link>
        <div className="rt-nav-links">
          <Link href="/">Home</Link>
          <Link href="/papers">Papers</Link>
        </div>
      </nav>
      <div className="rt-results">
        <div className="rt-score-card">
          <p className="rt-score-label">Your Score</p>
          <p className="rt-score">{correct}<span className="rt-score-total">/{total}</span></p>
          <p className="rt-score-pct">{pct}% correct</p>
          <div className="rt-score-bar-bg">
            <div className="rt-score-bar-fill" style={{width:`${pct}%`}} />
          </div>
          {pct >= 90 && <p className="rt-score-msg rt-score-pass">Excellent — you have strong causal reasoning ability.</p>}
          {pct < 90 && pct >= 70 && <p className="rt-score-msg">Good — review the questions you missed below.</p>}
          {pct < 70 && <p className="rt-score-msg rt-score-fail">These questions are designed for human-level performance. Review below.</p>}
          <button className="rt-restart-btn" onClick={onRestart}>Try Again</button>
        </div>
        <div className="rt-breakdown">
          <p className="rt-breakdown-title">Breakdown</p>
          <div className="rt-breakdown-rows">
            {["observational","interventional","counterfactual"].map(k => {
              const { t, c } = countKind(k);
              const label = { observational: "Observational", interventional: "Interventional", counterfactual: "Counterfactual" }[k];
              return t > 0 ? (
                <div key={k} className="rt-breakdown-row">
                  <span className="rt-breakdown-label">{label}</span>
                  <span className="rt-breakdown-score">{c}/{t}</span>
                  <div className="rt-breakdown-bar-bg"><div className="rt-breakdown-bar-fill" style={{width:`${t > 0 ? (c/t)*100 : 0}%`}} /></div>
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="rt-review">
          <p className="rt-review-title">Review</p>
          {answers.map((a, i) => (
            <div key={i} className={`rt-review-item ${a.correct ? "rt-review-correct" : "rt-review-wrong"}`}>
              <div className="rt-review-num">{i+1}.</div>
              <div className="rt-review-body">
                <p className="rt-review-q">{a.q.query}</p>
                <p className="rt-review-a">
                  You chose: <strong>{letters[a.chosen]}. {a.q.choices[a.chosen]}</strong>
                  {!a.correct && <> &nbsp;· Correct: <strong>{letters[a.q.answer]}. {a.q.choices[a.q.answer]}</strong></>}
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
:root {
  --bg:#fafaf9; --surface:#f3f2ef; --border:#e8e6e1; --border2:#d6d3cc;
  --ink:#0e0d0c; --body:#5c5954; --faint:#9c9890;
  --amber:rgba(168,94,26,0.9);
}
.rt-page { min-height:100vh; background:var(--bg); color:var(--ink); font-family:'DM Sans',sans-serif; }
.rt-nav { position:sticky; top:0; z-index:20; height:56px; border-bottom:1px solid var(--border); background:rgba(250,250,249,.88); backdrop-filter:blur(18px); display:flex; align-items:center; justify-content:space-between; padding:0 28px; }
.rt-brand { font-family:'EB Garamond',serif; font-size:20px; color:var(--ink); text-decoration:none; letter-spacing:-.02em; }
.rt-nav-links { display:flex; gap:20px; }
.rt-nav-links a { text-decoration:none; color:var(--body); font-size:13px; transition:color .12s; }
.rt-nav-links a:hover { color:var(--ink); }

/* START */
.rt-start { display:flex; justify-content:center; padding:80px 20px; }
.rt-start-card { max-width:520px; width:100%; text-align:center; }
.rt-start-eyebrow { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:16px; }
.rt-start-title { font-family:'EB Garamond',serif; font-size:clamp(36px,5vw,54px); font-weight:500; letter-spacing:-.03em; line-height:1.05; color:var(--ink); margin-bottom:20px; }
.rt-start-body { font-size:15px; font-weight:300; color:var(--body); line-height:1.75; max-width:400px; margin:0 auto 36px; }
.rt-start-details { display:flex; justify-content:center; gap:32px; margin-bottom:40px; }
.rt-start-detail { display:flex; flex-direction:column; align-items:center; }
.rt-start-detail-num { font-family:'EB Garamond',serif; font-size:28px; font-weight:500; color:var(--ink); }
.rt-start-detail-label { font-family:'JetBrains Mono',monospace; font-size:9px; letter-spacing:.08em; text-transform:uppercase; color:var(--faint); margin-top:2px; }
.rt-start-btn { padding:14px 40px; border-radius:8px; border:none; background:var(--ink); color:var(--bg); font-size:15px; font-weight:500; cursor:pointer; transition:opacity .12s; font-family:'DM Sans',sans-serif; }
.rt-start-btn:hover { opacity:.84; }

/* TEST */
.rt-test { max-width:580px; margin:0 auto; padding:48px 20px 80px; }
.rt-progress-wrap { display:flex; align-items:center; gap:12px; margin-bottom:28px; }
.rt-progress { flex:1; height:3px; background:var(--border); border-radius:2px; overflow:hidden; }
.rt-progress-fill { height:100%; background:var(--ink); border-radius:2px; transition:width .4s cubic-bezier(.16,1,.3,1); }
.rt-counter { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--faint); white-space:nowrap; }
.rt-card { background:#fff; border:1px solid var(--border); border-radius:12px; padding:28px; box-shadow:0 2px 12px rgba(14,13,12,.04); }
.rt-tag { display:inline-block; font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500; letter-spacing:.08em; padding:3px 8px; border-radius:4px; margin-bottom:16px; }
.rt-tag-observational { background:#e8f4fd; color:#0369a1; }
.rt-tag-interventional { background:#fef3c7; color:#92400e; }
.rt-tag-counterfactual { background:#f3e8ff; color:#6b21a8; }
.rt-scenario { font-size:14px; color:var(--body); line-height:1.6; margin-bottom:14px; padding:12px; background:var(--surface); border-radius:8px; border-left:3px solid var(--border); }
.rt-query { font-size:17px; font-weight:500; color:var(--ink); line-height:1.4; margin-bottom:24px; }
.rt-choices { display:flex; flex-direction:column; gap:10px; }
.rt-choice { display:flex; align-items:center; gap:14px; padding:14px 16px; border:1.5px solid var(--border); border-radius:8px; background:#fff; cursor:pointer; transition:all .15s; text-align:left; font-family:'DM Sans',sans-serif; font-size:15px; color:var(--ink); }
.rt-choice:hover { border-color:var(--border2); background:var(--surface); }
.rt-choice-letter { width:24px; height:24px; border-radius:50%; background:var(--surface); display:flex; align-items:center; justify-content:center; font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--body); flex-shrink:0; transition:all .15s; }
.rt-choice:hover .rt-choice-letter { background:var(--border2); color:var(--ink); }
.rt-choice-text { font-weight:400; }

/* RESULTS */
.rt-results { max-width:580px; margin:0 auto; padding:48px 20px 80px; }
.rt-score-card { text-align:center; background:#fff; border:1px solid var(--border); border-radius:12px; padding:36px 28px; margin-bottom:28px; }
.rt-score-label { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:12px; }
.rt-score { font-family:'EB Garamond',serif; font-size:48px; font-weight:500; color:var(--ink); line-height:1; }
.rt-score-total { font-size:24px; color:var(--faint); font-weight:400; }
.rt-score-pct { font-size:16px; color:var(--body); margin-top:4px; margin-bottom:20px; }
.rt-score-bar-bg { height:4px; background:var(--border); border-radius:2px; overflow:hidden; margin-bottom:20px; }
.rt-score-bar-fill { height:100%; background:var(--ink); border-radius:2px; transition:width 1s cubic-bezier(.16,1,.3,1); }
.rt-score-msg { font-size:14px; color:var(--body); margin-bottom:16px; line-height:1.5; }
.rt-score-pass { color:#16a34a; }
.rt-score-fail { color:#dc2626; }
.rt-restart-btn { padding:12px 32px; border-radius:8px; border:none; background:var(--ink); color:var(--bg); font-size:14px; font-weight:500; cursor:pointer; transition:opacity .12s; font-family:'DM Sans',sans-serif; }
.rt-restart-btn:hover { opacity:.84; }
.rt-breakdown { background:#fff; border:1px solid var(--border); border-radius:12px; padding:24px; margin-bottom:28px; }
.rt-breakdown-title { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:16px; }
.rt-breakdown-rows { display:flex; flex-direction:column; gap:12px; }
.rt-breakdown-row { display:flex; align-items:center; gap:12px; }
.rt-breakdown-label { font-size:13px; color:var(--body); width:120px; flex-shrink:0; }
.rt-breakdown-score { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--ink); width:36px; text-align:right; flex-shrink:0; }
.rt-breakdown-bar-bg { flex:1; height:3px; background:var(--border); border-radius:2px; overflow:hidden; }
.rt-breakdown-bar-fill { height:100%; background:var(--ink); border-radius:2px; transition:width 1s cubic-bezier(.16,1,.3,1); }
.rt-review { background:#fff; border:1px solid var(--border); border-radius:12px; padding:24px; }
.rt-review-title { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:var(--faint); margin-bottom:16px; }
.rt-review-item { display:flex; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
.rt-review-item:last-child { border-bottom:none; }
.rt-review-num { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--faint); width:20px; flex-shrink:0; margin-top:2px; }
.rt-review-body { flex:1; }
.rt-review-q { font-size:13px; color:var(--ink); margin-bottom:4px; line-height:1.5; }
.rt-review-a { font-size:12px; color:var(--body); }
.rt-review-correct { border-left:2px solid #16a34a; padding-left:14px; }
.rt-review-wrong { border-left:2px solid #dc2626; padding-left:14px; }
@media (max-width:640px) {
  .rt-nav-links { display:none; }
  .rt-test, .rt-results { padding-left:16px; padding-right:16px; }
  .rt-card { padding:20px; }
  .rt-query { font-size:15px; }
}
`;
