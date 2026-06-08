import { chainGraph } from "../src/bench/graphs/chain";
import { forkGraph } from "../src/bench/graphs/fork";
import { colliderGraph } from "../src/bench/graphs/collider";
import { mbiasGraph } from "../src/bench/graphs/mbias";
import { instrumentGraph } from "../src/bench/graphs/instrument";
import { frontdoorGraph } from "../src/bench/graphs/frontdoor";
import { backdoorGraph } from "../src/bench/graphs/backdoor";
import { marginalProb, interventionalProb } from "../src/lib/inference";
import type { CausalGraph } from "../src/bench/types";
import * as fs from "fs";
import * as path from "path";

const gs = { chainGraph, forkGraph, colliderGraph, mbiasGraph, instrumentGraph, frontdoorGraph, backdoorGraph } as const;

function pct(n: number) { return Math.round(n * 100) + "%"; }

function fmtCPTs(g: CausalGraph): string {
  const lines: string[] = [];
  for (const v of g.variables) {
    const table = g.cpts[v.id];
    if (!table) continue;
    if (Object.keys(table).length === 1 && "" in table) {
      lines.push(`P(${v.id}) = ${table[""].map(p => pct(p)).join(" ")}`);
    } else {
      for (const [cond, probs] of Object.entries(table)) {
        lines.push(`P(${v.id} | ${cond.replace(/,/g, " ")}) = ${probs.map(p => pct(p)).join(" ")}`);
      }
    }
  }
  return lines.join("\n");
}

function desc(g: CausalGraph): string {
  const names: Record<string, string> = {};
  for (const v of g.variables) names[v.id] = v.name;
  return g.edges.map(e => `${names[e.from] || e.from} → ${names[e.to] || e.to}`).join(", ");
}

function genChoices(correct: number): { choices: string[]; answer: number } {
  const pool = [5, 12, 15, 20, 25, 30, 32, 35, 37, 40, 42, 44, 45, 48, 49, 50, 52, 54, 55, 56, 57, 58, 60, 61, 62, 63, 65, 67, 68, 69, 70, 71, 73, 75, 80, 81, 82, 84, 85, 86, 88, 90, 92, 95].filter(x => x !== correct);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const distractors = shuffled.slice(0, 3).sort(() => Math.random() - 0.5);
  const choices = [correct, ...distractors];
  // shuffle and track answer position
  const entries = choices.map((v, i) => ({ v, orig: i }));
  entries.sort(() => Math.random() - 0.5);
  return { choices: entries.map(e => e.v + "%"), answer: entries.findIndex(e => e.orig === 0) };
}

interface OutQ {
  graphDescription: string; kind: string; query: string; choices: string[]; answer: number;
  cptsDisplay: string; variables: any[]; edges: any[];
}

const out: OutQ[] = [];

// Define each question with explicit target + evidence + intervention
interface Task {
  gKey: string; kind: "obs" | "ivn"; targetVar: string; targetVal: string;
  ev: Record<string, string>; iv?: string; ivv?: string; query: string;
}

function run(task: Task) {
  const g = gs[task.gKey as keyof typeof gs];
  let prob: number | null = null;
  try {
    if (task.kind === "obs") prob = marginalProb(g, task.targetVar, task.targetVal as any, task.ev as any);
    else if (task.kind === "ivn") prob = interventionalProb(g, task.targetVar, task.targetVal as any, task.iv!, task.ivv!);
  } catch (e) { console.error(`Error computing "${task.query.slice(0, 40)}":`, e); }
  if (prob === null) return;
  const c = Math.round(prob * 100);
  const { choices, answer } = genChoices(c);
  const kindLbl = task.kind === "obs" ? "observational" : "interventional";
  out.push({
    graphDescription: desc(g),
    kind: kindLbl,
    query: task.query,
    choices,
    answer,
    cptsDisplay: fmtCPTs(g),
    variables: g.variables.map(v => ({ id: v.id, name: v.name, values: v.values })),
    edges: g.edges,
  });
}

run({ gKey: "chainGraph", kind: "obs", targetVar: "P", targetVal: "high", ev: { T: "yes" }, query: "Among employees who COMPLETED training, what % achieved HIGH performance?" });
run({ gKey: "chainGraph", kind: "obs", targetVar: "P", targetVal: "high", ev: { T: "no" }, query: "Among employees who did NOT take training, what % achieved HIGH performance?" });
run({ gKey: "chainGraph", kind: "ivn", targetVar: "P", targetVal: "high", ev: {}, iv: "T", ivv: "yes", query: "If the company FORCED everyone to complete training, what % would achieve HIGH performance?" });
run({ gKey: "forkGraph", kind: "obs", targetVar: "I", targetVal: "high", ev: { E: "advanced" }, query: "Among people with ADVANCED education, what % have HIGH income?" });
run({ gKey: "forkGraph", kind: "obs", targetVar: "I", targetVal: "high", ev: { E: "basic" }, query: "Among people with BASIC education, what % have HIGH income?" });
run({ gKey: "forkGraph", kind: "ivn", targetVar: "I", targetVal: "high", ev: {}, iv: "E", ivv: "advanced", query: "If the government PAID for everyone to get ADVANCED education, what % would have HIGH income?" });
run({ gKey: "colliderGraph", kind: "obs", targetVar: "I", targetVal: "strong", ev: { H: "yes" }, query: "Among HIRED candidates, what proportion had a STRONG interview?" });
run({ gKey: "colliderGraph", kind: "obs", targetVar: "T", targetVal: "high", ev: { H: "yes" }, query: "Among HIRED candidates, what proportion had HIGH talent?" });
run({ gKey: "colliderGraph", kind: "ivn", targetVar: "I", targetVal: "strong", ev: { H: "yes" }, iv: "T", ivv: "high", query: "If the company forced ALL hired candidates to have HIGH talent, what proportion would have a STRONG interview?" });
run({ gKey: "mbiasGraph", kind: "obs", targetVar: "Y", targetVal: "full", ev: { X: "drug", M: "positive" }, query: "Among patients who TOOK the drug and had POSITIVE biomarker, what % achieved FULL recovery?" });
run({ gKey: "mbiasGraph", kind: "ivn", targetVar: "Y", targetVal: "full", ev: {}, iv: "X", ivv: "drug", query: "If the trial GAVE the drug to ALL patients, what % would achieve FULL recovery?" });
run({ gKey: "instrumentGraph", kind: "obs", targetVar: "Y", targetVal: "high", ev: { X: "yes" }, query: "Among people who ATTENDED college, what % earn HIGH income?" });
run({ gKey: "instrumentGraph", kind: "ivn", targetVar: "Y", targetVal: "high", ev: {}, iv: "X", ivv: "yes", query: "If the government FORCED everyone to attend college, what % would earn HIGH income?" });
run({ gKey: "frontdoorGraph", kind: "obs", targetVar: "Y", targetVal: "high", ev: { X: "yes" }, query: "Among people who are ACTIVE, what % have STRONG health?" });
run({ gKey: "frontdoorGraph", kind: "ivn", targetVar: "Y", targetVal: "high", ev: {}, iv: "X", ivv: "yes", query: "If the government MANDATED exercise for everyone, what % would have STRONG health?" });
run({ gKey: "backdoorGraph", kind: "obs", targetVar: "Y", targetVal: "high", ev: { X: "yes" }, query: "Among patients who TOOK the drug, what % had GOOD recovery?" });
run({ gKey: "backdoorGraph", kind: "ivn", targetVar: "Y", targetVal: "high", ev: {}, iv: "X", ivv: "yes", query: "If the hospital GAVE the drug to ALL patients, what % would have GOOD recovery?" });

for (const q of out) {
  console.log(`${q.kind.padEnd(16)} answer=${q.answer} "${q.choices[q.answer]}" — ${q.query.slice(0, 45)}`);
}

const outPath = path.resolve(import.meta.dirname, "../src/app/reasoning-test/question-data.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(`\nGenerated ${out.length} questions ✓`);
