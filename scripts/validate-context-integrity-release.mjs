import { createHash } from "crypto";
import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

const expectedFamilies = new Map([
  ["selective_write", 50],
  ["evidence_retrieval", 40],
  ["knowledge_update", 40],
  ["abstention", 35],
  ["multi_session", 35],
  ["action_grounding", 30],
  ["causal_action", 20],
]);
const expectedSystems = ["recent3", "fullHistory", "lexical3", "writeLexical3", "scopedHybrid3"];

function fail(message) {
  throw new Error(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), "utf8"));
}

function readJsonl(path) {
  return readFileSync(resolve(path), "utf8").trim().split(/\r?\n/).map((line) => JSON.parse(line));
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function lineCount(buffer) {
  return buffer.toString("utf8").split(/\r?\n/).length - 1;
}

function assertBetween(name, value, min, max) {
  if (typeof value !== "number" || value < min || value > max) fail(`${name} outside [${min}, ${max}]: ${value}`);
}

const tasks = readJsonl("reports/context-integrity/cib-v0-dataset.jsonl");
const summary = readJson("reports/context-integrity/cib-v0-summary.json");
const manifest = readJson("reports/context-integrity/cib-v0-manifest.json");

if (summary.datasetVersion !== "CIB-v0") fail("summary datasetVersion mismatch");
if (summary.tasks !== tasks.length) fail("summary task count mismatch");
if (tasks.length !== 250) fail(`expected 250 tasks, got ${tasks.length}`);

const ids = new Set();
const familyCounts = new Map();
for (const task of tasks) {
  if (ids.has(task.id)) fail(`duplicate task id: ${task.id}`);
  ids.add(task.id);
  if (!expectedFamilies.has(task.family)) fail(`unknown family: ${task.family}`);
  familyCounts.set(task.family, (familyCounts.get(task.family) || 0) + 1);
  if (!Array.isArray(task.events) || task.events.length < 1) fail(`missing events: ${task.id}`);
  if (!Array.isArray(task.gold_evidence) || task.gold_evidence.length < 1) fail(`missing gold evidence: ${task.id}`);
  if (!Array.isArray(task.stale_evidence)) fail(`missing stale list: ${task.id}`);
  if (typeof task.gold_action !== "string" || !task.gold_action) fail(`missing gold action: ${task.id}`);
  const eventIds = new Set();
  for (const event of task.events) {
    if (eventIds.has(event.source_id)) fail(`duplicate source id in ${task.id}: ${event.source_id}`);
    eventIds.add(event.source_id);
    if (!event.timestamp || !event.text) fail(`malformed event in ${task.id}`);
  }
  for (const source of [...task.gold_evidence, ...task.stale_evidence]) {
    if (!eventIds.has(source)) fail(`unknown evidence ${source} in ${task.id}`);
  }
  for (const source of task.stale_evidence) {
    const event = task.events.find((e) => e.source_id === source);
    if (!event.stale || !event.superseded_by) fail(`stale source lacks supersession in ${task.id}: ${source}`);
  }
  const gold = new Set(task.gold_evidence);
  for (const source of task.stale_evidence) {
    if (gold.has(source)) fail(`source is both gold and stale in ${task.id}: ${source}`);
  }
}

for (const [family, count] of expectedFamilies) {
  if (familyCounts.get(family) !== count) fail(`family count mismatch for ${family}`);
}

if (JSON.stringify(summary.families) !== JSON.stringify([...expectedFamilies])) fail("summary family declaration mismatch");
if (!Array.isArray(summary.results) || summary.results.length !== expectedSystems.length) fail("unexpected result count");
for (const result of summary.results) {
  if (!expectedSystems.includes(result.name)) fail(`unexpected system: ${result.name}`);
  if (result.overall.n !== tasks.length) fail(`overall n mismatch for ${result.name}`);
  for (const key of ["precision", "recall", "sufficient", "actionCorrect", "stale", "unsupportedRisk", "flood"]) {
    assertBetween(`${result.name}.${key}`, result.overall[key], 0, 1);
  }
  for (const [family, count] of expectedFamilies) {
    if (!result.byFamily[family]) fail(`missing family result ${result.name}.${family}`);
    if (result.byFamily[family].n !== count) fail(`family n mismatch ${result.name}.${family}`);
  }
}

for (const comparison of summary.pairedComparisons || []) {
  if (comparison.reference !== "scopedHybrid3") fail(`unexpected comparison reference: ${comparison.reference}`);
  const total = comparison.bothPass + comparison.referenceOnly + comparison.baselineOnly + comparison.bothFail;
  if (total !== comparison.n || total !== tasks.length) fail(`paired comparison total mismatch: ${comparison.baseline}`);
  assertBetween(`paired delta ${comparison.baseline}`, comparison.delta, -1, 1);
  assertBetween(`paired p ${comparison.baseline}`, comparison.exactP, 0, 1);
}

for (const artifact of manifest.artifacts) {
  const abs = resolve(artifact.path);
  if (!existsSync(abs)) fail(`manifest artifact missing: ${artifact.path}`);
  const buffer = readFileSync(abs);
  const stat = statSync(abs);
  if (artifact.bytes !== stat.size) fail(`manifest byte mismatch: ${artifact.path}`);
  if (artifact.sha256 !== sha256(buffer)) fail(`manifest hash mismatch: ${artifact.path}`);
  const lines = artifact.path.endsWith(".pdf") ? null : lineCount(buffer);
  if (artifact.lines !== lines) fail(`manifest line mismatch: ${artifact.path}`);
}

console.log(JSON.stringify({ ok: true, tasks: tasks.length, families: Object.fromEntries(familyCounts) }));
