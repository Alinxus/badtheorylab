import { mkdirSync, writeFileSync } from "fs";
import { resolve } from "path";

const outDir = resolve("reports/context-integrity");
const benchmarkDate = "2026-07-01";
const datasetVersion = "CIB-v0";
const families = [
  ["selective_write", 50],
  ["evidence_retrieval", 40],
  ["knowledge_update", 40],
  ["abstention", 35],
  ["multi_session", 35],
  ["action_grounding", 30],
  ["causal_action", 20],
];

const projects = ["atlas", "marrow", "runtime", "retain", "ledger"];
const domains = ["finance", "support", "research", "engineering", "ops"];
const noise = [
  "The dashboard color felt too bright during the review.",
  "Someone mentioned moving the weekly meeting by fifteen minutes.",
  "The scratch document has a temporary title that should not be remembered.",
  "A teammate joked that the old spreadsheet was cursed.",
  "The staging run produced logs that were only useful during debugging.",
];

function words(s) {
  return new Set(String(s).toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean));
}

function overlap(a, b) {
  const aw = words(a);
  const bw = words(b);
  let n = 0;
  for (const w of aw) if (bw.has(w)) n++;
  return n;
}

function stamp(i, j) {
  return `2026-06-${String(1 + (i % 24)).padStart(2, "0")}T${String(9 + j).padStart(2, "0")}:00:00Z`;
}

function event(task, j, text, opts = {}) {
  return {
    source_id: `${task}_e${j}`,
    timestamp: stamp(Number(task.split("_").pop()), j),
    text,
    should_write: Boolean(opts.write),
    project: opts.project,
    domain: opts.domain,
    stale: Boolean(opts.stale),
    superseded_by: opts.supersededBy || null,
  };
}

function addNoise(taskId, events, project, domain, count = 3) {
  for (let i = 0; i < count; i++) {
    events.push(event(taskId, events.length + 1, noise[(i + events.length) % noise.length], { project, domain }));
  }
}

function makeTask(family, i) {
  const project = projects[i % projects.length];
  const domain = domains[(i + 2) % domains.length];
  const id = `cib_${family}_${String(i).padStart(3, "0")}`;
  const events = [];
  let question = "";
  let gold = [];
  let stale = [];
  let action = "answer";
  let abstain = false;

  if (family === "selective_write") {
    const pref = event(id, 1, `For ${domain} work in ${project}, remember that exports must be grouped by client.`, { write: true, project, domain });
    events.push(pref);
    addNoise(id, events, project, domain, 4);
    question = `How should the agent group ${domain} exports for ${project}?`;
    gold = [pref.source_id];
    action = "group_by_client";
  }

  if (family === "evidence_retrieval") {
    const a = event(id, 1, `${project} uses the northbound API for ${domain} ingestion.`, { write: true, project, domain });
    const b = event(id, 2, `The northbound API requires the signed batch header for production calls.`, { write: true, project, domain });
    events.push(a, ...noise.slice(0, 2).map((t, n) => event(id, n + 3, t, { project, domain })), b);
    question = `Which API and header should the agent use for ${project} ${domain} production ingestion?`;
    gold = [a.source_id, b.source_id];
    action = "use_northbound_signed_batch";
  }

  if (family === "knowledge_update") {
    const oldFact = event(id, 1, `${project} deploys ${domain} jobs to endpoint v1/orders.`, { write: true, project, domain, stale: true });
    const newFact = event(id, 4, `${project} migrated ${domain} jobs to endpoint v2/orders; do not use v1/orders for current work.`, { write: true, project, domain });
    oldFact.superseded_by = newFact.source_id;
    events.push(oldFact);
    addNoise(id, events, project, domain, 2);
    events.push(newFact);
    question = `Which endpoint should the agent use now for ${project} ${domain} jobs?`;
    gold = [newFact.source_id];
    stale = [oldFact.source_id];
    action = "use_v2_orders";
  }

  if (family === "abstention") {
    const missing = event(id, 1, `${project} has a draft budget note, but it does not include the approved vendor cap.`, { write: true, project, domain });
    events.push(missing);
    addNoise(id, events, project, domain, 4);
    question = `What is the approved vendor cap for ${project} ${domain}?`;
    gold = [missing.source_id];
    action = "ask_user";
    abstain = true;
  }

  if (family === "multi_session") {
    const first = event(id, 1, `${project} prefers short incident summaries with owner initials.`, { write: true, project, domain });
    const second = event(id, 5, `For ${domain} incidents, include customer impact before remediation steps.`, { write: true, project, domain });
    events.push(first);
    addNoise(id, events, project, domain, 3);
    events.push(second);
    question = `What format should the agent use for ${project} ${domain} incident summaries?`;
    gold = [first.source_id, second.source_id];
    action = "short_summary_owner_initials_impact_first";
  }

  if (family === "action_grounding") {
    const rule = event(id, 1, `For ${project} ${domain} follow-ups, draft the email only; do not send without explicit approval.`, { write: true, project, domain });
    events.push(rule);
    addNoise(id, events, project, domain, 4);
    question = `A ${project} ${domain} follow-up is needed. What should the agent do?`;
    gold = [rule.source_id];
    action = "draft_only";
  }

  if (family === "causal_action") {
    const corr = event(id, 1, `${project} revenue rose after the ${domain} campaign last month.`, { write: true, project, domain, stale: true });
    const cause = event(id, 3, `The revenue lift was attributed to seasonal renewal timing, not the ${domain} campaign.`, { write: true, project, domain });
    corr.superseded_by = cause.source_id;
    events.push(corr, event(id, 2, noise[i % noise.length], { project, domain }), cause);
    question = `Should the agent increase ${domain} campaign spend for ${project} based on the revenue lift?`;
    gold = [cause.source_id];
    stale = [corr.source_id];
    action = "do_not_increase_spend";
  }

  return { id, family, project, domain, events, question, gold_evidence: gold, stale_evidence: stale, requires_abstention: abstain, gold_action: action };
}

function dataset() {
  const rows = [];
  for (const [family, count] of families) {
    for (let i = 0; i < count; i++) rows.push(makeTask(family, i));
  }
  return rows;
}

const baselines = {
  recent3(task) {
    return task.events.slice(-3).map((e) => e.source_id);
  },
  fullHistory(task) {
    return task.events.map((e) => e.source_id);
  },
  lexical3(task) {
    return ranked(task, task.events).slice(0, 3).map((e) => e.source_id);
  },
  writeLexical3(task) {
    return ranked(task, task.events.filter((e) => e.should_write)).slice(0, 3).map((e) => e.source_id);
  },
  scopedHybrid3(task) {
    const current = !/\b(previous|history|old|before)\b/i.test(task.question);
    const pool = task.events.filter((e) => e.should_write && (!current || !e.superseded_by));
    return ranked(task, pool, true).slice(0, 3).map((e) => e.source_id);
  },
};

function ranked(task, events, scoped = false) {
  return events
    .map((e, idx) => ({
      ...e,
      score:
        overlap(task.question, e.text) +
        (scoped && e.project === task.project ? 2 : 0) +
        (scoped && e.domain === task.domain ? 2 : 0) +
        (e.should_write ? 0.5 : 0) +
        idx / 100,
    }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score);
}

function score(task, retrieved) {
  const gold = new Set(task.gold_evidence);
  const stale = new Set(task.stale_evidence);
  const hits = retrieved.filter((id) => gold.has(id)).length;
  const staleHits = retrieved.some((id) => stale.has(id) && !gold.has(id)) ? 1 : 0;
  const precision = retrieved.length ? hits / retrieved.length : 0;
  const recall = gold.size ? hits / gold.size : 0;
  const sufficient = gold.size ? Number(recall === 1 && !staleHits) : Number(retrieved.length === 0);
  const flood = Number(retrieved.length > gold.size + 2);
  const tokens = retrieved.reduce((n, id) => n + words(task.events.find((e) => e.source_id === id)?.text || "").size, words(task.question).size);
  const unsupportedRisk = Number(retrieved.length > 0 && hits === 0);
  return {
    precision,
    recall,
    sufficient,
    actionCorrect: sufficient,
    abstentionCorrect: task.requires_abstention ? sufficient : null,
    stale: staleHits,
    unsupportedRisk,
    flood,
    tokens,
  };
}

function scoreRows(tasks, fn) {
  return tasks.map((task) => score(task, fn(task)));
}

function summarize(tasks, name, rows) {
  const byFamily = {};
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const s = rows[i];
    (byFamily[task.family] ||= []).push(s);
  }
  return { name, overall: avg(rows), byFamily: Object.fromEntries(Object.entries(byFamily).map(([k, v]) => [k, avg(v)])) };
}

function avg(rows) {
  const n = rows.length || 1;
  const out = {};
  for (const key of ["precision", "recall", "sufficient", "actionCorrect", "stale", "unsupportedRisk", "flood", "tokens"]) {
    out[key] = rows.reduce((sum, r) => sum + r[key], 0) / n;
  }
  const abstentionRows = rows.filter((r) => r.abstentionCorrect !== null);
  out.abstentionCorrect = abstentionRows.length
    ? abstentionRows.reduce((sum, r) => sum + r.abstentionCorrect, 0) / abstentionRows.length
    : null;
  out.n = rows.length;
  out.sufficientCount = rows.reduce((sum, r) => sum + r.sufficient, 0);
  out.actionCorrectCount = rows.reduce((sum, r) => sum + r.actionCorrect, 0);
  out.staleCount = rows.reduce((sum, r) => sum + r.stale, 0);
  out.groundedUtilityPer1k = (out.sufficient * 1000) / Math.max(out.tokens, 1);
  return out;
}

function pct(n) {
  return `${(100 * n).toFixed(1)}%`;
}

function wilson(k, n) {
  if (!n) return [0, 0];
  const z = 1.96;
  const p = k / n;
  const denom = 1 + (z * z) / n;
  const center = (p + (z * z) / (2 * n)) / denom;
  const spread = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / denom;
  return [Math.max(0, center - spread), Math.min(1, center + spread)];
}

function ciText(k, n) {
  const [lo, hi] = wilson(k, n);
  return `[${pct(lo)}, ${pct(hi)}]`;
}

function table(results) {
  const lines = [
    "| System | Evidence precision | Evidence recall | Retrieval sufficiency | Action upper bound | Stale error | Unsupported risk | Avg tokens | Grounded utility / 1k tokens |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const r of results) {
    const o = r.overall;
    lines.push(`| ${r.name} | ${pct(o.precision)} | ${pct(o.recall)} | ${pct(o.sufficient)} ${ciText(o.sufficientCount, o.n)} | ${pct(o.actionCorrect)} | ${pct(o.stale)} | ${pct(o.unsupportedRisk)} | ${o.tokens.toFixed(1)} | ${o.groundedUtilityPer1k.toFixed(2)} |`);
  }
  return lines.join("\n");
}

function familyTable(results) {
  const lines = [
    "| Family | recent3 | fullHistory | lexical3 | writeLexical3 | scopedHybrid3 |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const [family] of families) {
    const cells = results.map((r) => pct(r.byFamily[family].sufficient));
    lines.push(`| ${family} | ${cells.join(" | ")} |`);
  }
  return lines.join("\n");
}

function logFactorials(n) {
  const logs = [0];
  for (let i = 1; i <= n; i++) logs[i] = logs[i - 1] + Math.log(i);
  return logs;
}

function exactBinomialTwoSided(k, n, logs) {
  if (!n) return 1;
  const tail = Math.min(k, n - k);
  const terms = [];
  for (let i = 0; i <= tail; i++) terms.push(logs[n] - logs[i] - logs[n - i] - n * Math.log(2));
  const maxLog = Math.max(...terms);
  const logSum = maxLog + Math.log(terms.reduce((sum, term) => sum + Math.exp(term - maxLog), 0));
  return Math.min(1, 2 * Math.exp(logSum));
}

function pairedComparisons(systemScores, reference = "scopedHybrid3") {
  const refRows = systemScores[reference];
  const logs = logFactorials(refRows.length);
  return Object.entries(systemScores)
    .filter(([name]) => name !== reference)
    .map(([name, rows]) => {
      let bothPass = 0;
      let referenceOnly = 0;
      let baselineOnly = 0;
      let bothFail = 0;
      for (let i = 0; i < rows.length; i++) {
        const baselinePass = Boolean(rows[i].sufficient);
        const referencePass = Boolean(refRows[i].sufficient);
        if (baselinePass && referencePass) bothPass++;
        if (!baselinePass && referencePass) referenceOnly++;
        if (baselinePass && !referencePass) baselineOnly++;
        if (!baselinePass && !referencePass) bothFail++;
      }
      return {
        baseline: name,
        reference,
        n: rows.length,
        bothPass,
        referenceOnly,
        baselineOnly,
        bothFail,
        delta: (referenceOnly - baselineOnly) / rows.length,
        exactP: exactBinomialTwoSided(baselineOnly, referenceOnly + baselineOnly, logs),
      };
    });
}

function pText(p) {
  if (p < 0.0001) return "<0.0001";
  return p.toFixed(4);
}

function comparisonTable(comparisons) {
  const lines = [
    "| Baseline vs scopedHybrid3 | Both sufficient | scoped only | Baseline only | Both insufficient | Delta | Exact paired p |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const c of comparisons) {
    lines.push(`| ${c.baseline} | ${c.bothPass} | ${c.referenceOnly} | ${c.baselineOnly} | ${c.bothFail} | ${pct(c.delta)} | ${pText(c.exactP)} |`);
  }
  return lines.join("\n");
}

function jsonl(rows) {
  return rows.map((row) => JSON.stringify(row)).join("\n") + "\n";
}

const tasks = dataset();
const systemScores = Object.fromEntries(Object.entries(baselines).map(([name, fn]) => [name, scoreRows(tasks, fn)]));
const results = Object.entries(systemScores).map(([name, rows]) => summarize(tasks, name, rows));
const comparisons = pairedComparisons(systemScores);
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, "cib-v0-dataset.jsonl"), jsonl(tasks));
writeFileSync(resolve(outDir, "cib-v0-summary.json"), JSON.stringify({ datasetVersion, benchmarkDate, tasks: tasks.length, families, results, pairedComparisons: comparisons }) + "\n");
writeFileSync(resolve(outDir, "cib-v0-report.md"), `# Context Integrity Benchmark v0 Results

Benchmark date: ${benchmarkDate}

Tasks: ${tasks.length}

${table(results)}

## Retrieval Sufficiency By Family

${familyTable(results)}

## Paired Retrieval Sufficiency Tests

${comparisonTable(comparisons)}

## Interpretation

These are retrieval and memory baselines, not LLM agent results. The benchmark separates recency, full-history context, naive lexical retrieval, write-filtered retrieval, and scoped memory. The paired tests compare sufficiency on the same tasks, so the deltas are not artifacts of different task mixes. The full-history baseline reaches 100% recall but still fails update and causal-action tasks because stale evidence remains in context. The next step is to run answer/action models on the same retrieved evidence and measure unsupported claims, abstention behavior, and action correctness.
`);

console.log(table(results));
