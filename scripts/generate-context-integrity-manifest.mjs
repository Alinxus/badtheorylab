import { createHash } from "crypto";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { resolve } from "path";

const datasetVersion = "CIB-v0";
const releaseDate = "2026-07-01";
const outPath = resolve("reports/context-integrity/cib-v0-manifest.json");
const artifactPaths = [
  "docs/context-integrity-paper.md",
  "reports/context-integrity/cib-v0-dataset.jsonl",
  "reports/context-integrity/cib-v0-summary.json",
  "reports/context-integrity/cib-v0-report.md",
  "public/context-integrity/paper.html",
  "public/context-integrity/paper.pdf",
  "scripts/evaluate-context-integrity.mjs",
  "scripts/generate-context-integrity-manifest.mjs",
  "scripts/generate-context-integrity-paper-pdf.mjs",
  "scripts/run-context-integrity-model-eval.mjs",
  "scripts/validate-context-integrity-release.mjs",
];
const verify = process.argv.includes("--verify");

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function lines(buffer) {
  return buffer.toString("utf8").split(/\r?\n/).length - 1;
}

const artifacts = artifactPaths.map((path) => {
  const abs = resolve(path);
  if (!existsSync(abs)) throw new Error(`Missing artifact: ${path}`);
  const buffer = readFileSync(abs);
  const stat = statSync(abs);
  return {
    path,
    bytes: stat.size,
    lines: path.endsWith(".pdf") ? null : lines(buffer),
    sha256: sha256(buffer),
  };
});

if (verify) {
  const expected = JSON.parse(readFileSync(outPath, "utf8"));
  const byPath = new Map(expected.artifacts.map((artifact) => [artifact.path, artifact]));
  const mismatches = artifacts.filter((artifact) => {
    const match = byPath.get(artifact.path);
    return !match || match.sha256 !== artifact.sha256 || match.bytes !== artifact.bytes || match.lines !== artifact.lines;
  });
  if (mismatches.length) {
    console.error(JSON.stringify({ ok: false, mismatches }, null, 2));
    process.exit(1);
  }
  console.log(`Verified ${outPath}`);
  process.exit(0);
}

const manifest = {
  datasetVersion,
  releaseDate,
  generatedAt: new Date().toISOString(),
  artifacts,
};

mkdirSync(resolve("reports/context-integrity"), { recursive: true });
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Generated ${outPath}`);
