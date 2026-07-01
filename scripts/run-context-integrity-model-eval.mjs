import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const baseUrl = process.env.CIB_MODEL_BASE_URL || process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
const apiKey = process.env.CIB_MODEL_API_KEY || process.env.OPENAI_API_KEY || "";
const model = process.env.CIB_MODEL || "gpt-4o-mini";
const limit = Number(process.env.CIB_LIMIT || "250");
const dryRun = process.argv.includes("--dry-run");
const datasetPath = resolve("reports/context-integrity/cib-v0-dataset.jsonl");
const outDir = resolve("reports/context-integrity/model-runs");
const outPath = resolve(outDir, `${model.replace(/[^a-zA-Z0-9_.-]/g, "_")}.jsonl`);

function readTasks() {
  return readFileSync(datasetPath, "utf8")
    .trim()
    .split("\n")
    .slice(0, limit)
    .map((line) => JSON.parse(line));
}

function prompt(task) {
  const events = task.events
    .map((event) => `${event.source_id} | ${event.timestamp} | ${event.text}`)
    .join("\n");
  return `You are evaluating a persistent AI agent memory state.

Return ONLY valid JSON with this exact shape:
{"action":"one_of_allowed_actions","evidence":["source_id"],"abstain":true_or_false}

Task family: ${task.family}
Allowed action labels include the gold-style label vocabulary used by the benchmark. Choose the best action from the evidence.

Events:
${events}

Question:
${task.question}

Rules:
- Use source IDs from Events only.
- If the evidence says the requested value is missing, set abstain=true and action="ask_user".
- If older evidence is superseded by newer evidence, do not act from the older evidence.
- Do not explain. JSON only.`;
}

function extractJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object found");
    return JSON.parse(match[0]);
  }
}

function score(task, output) {
  const evidence = Array.isArray(output.evidence) ? output.evidence : [];
  const gold = new Set(task.gold_evidence);
  const stale = new Set(task.stale_evidence);
  const hits = evidence.filter((id) => gold.has(id)).length;
  const staleHit = evidence.some((id) => stale.has(id) && !gold.has(id));
  const evidenceRecall = gold.size ? hits / gold.size : 0;
  const evidencePrecision = evidence.length ? hits / evidence.length : 0;
  const actionCorrect = output.action === task.gold_action;
  const abstainCorrect = Boolean(output.abstain) === Boolean(task.requires_abstention);
  const sufficientEvidence = evidenceRecall === 1 && !staleHit;
  return { actionCorrect, abstainCorrect, sufficientEvidence, evidencePrecision, evidenceRecall, staleHit };
}

async function callModel(task) {
  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      messages: [
        { role: "system", content: "You are a strict benchmark participant. Return valid JSON only." },
        { role: "user", content: prompt(task) },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Model API ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.choices?.[0]?.message?.content || "";
}

function dryOutput(task) {
  return {
    action: task.gold_action,
    evidence: task.gold_evidence,
    abstain: task.requires_abstention,
  };
}

function summarize(rows) {
  const n = rows.length || 1;
  const mean = (key) => rows.reduce((sum, row) => sum + Number(row.score[key]), 0) / n;
  return {
    model,
    n: rows.length,
    dryRun,
    actionAccuracy: mean("actionCorrect"),
    abstentionAccuracy: mean("abstainCorrect"),
    evidenceSufficiency: mean("sufficientEvidence"),
    staleRate: mean("staleHit"),
    evidencePrecision: mean("evidencePrecision"),
    evidenceRecall: mean("evidenceRecall"),
  };
}

const tasks = readTasks();
mkdirSync(outDir, { recursive: true });
const rows = [];

if (!apiKey && !dryRun) {
  console.error("Missing CIB_MODEL_API_KEY or OPENAI_API_KEY. Use --dry-run for protocol validation.");
  process.exit(2);
}

for (const task of tasks) {
  const started = Date.now();
  let raw = "";
  let parsed;
  let error = null;
  try {
    parsed = dryRun ? dryOutput(task) : extractJson((raw = await callModel(task)));
  } catch (err) {
    error = err.message;
    parsed = { action: "", evidence: [], abstain: false };
  }
  const row = {
    id: task.id,
    family: task.family,
    model,
    output: parsed,
    raw,
    error,
    score: score(task, parsed),
    latencyMs: Date.now() - started,
  };
  rows.push(row);
  writeFileSync(outPath, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
}

const summary = summarize(rows);
writeFileSync(resolve(outDir, `${model.replace(/[^a-zA-Z0-9_.-]/g, "_")}-summary.json`), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
