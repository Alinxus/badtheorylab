import puppeteer from "puppeteer";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const sourcePaths = [
  resolve("docs/context-integrity-paper.md"),
  resolve("docs/context-integrity-appendix.md"),
];
const outDir = resolve("public/context-integrity");
const htmlPath = resolve(outDir, "paper.html");
const pdfPath = resolve(outDir, "paper.pdf");

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function inline(value) {
  return esc(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function table(lines) {
  const rows = lines
    .filter((line) => !/^\|\s*-/.test(line))
    .map((line) => line.split("|").slice(1, -1).map((cell) => inline(cell.trim())));
  const [head, ...body] = rows;
  return `<table><thead><tr>${head.map((cell) => `<th>${cell}</th>`).join("")}</tr></thead><tbody>${body
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function flushParagraph(out, paragraph) {
  if (!paragraph.length) return;
  out.push(`<p>${inline(paragraph.join(" "))}</p>`);
  paragraph.length = 0;
}

function flushList(out, list) {
  if (!list.length) return;
  out.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
  list.length = 0;
}

function markdown(md) {
  const out = [];
  const paragraph = [];
  const list = [];
  const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      flushParagraph(out, paragraph);
      flushList(out, list);
      const code = [];
      while (++i < lines.length && !lines[i].startsWith("```")) code.push(lines[i]);
      out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
      continue;
    }
    if (/^\|.*\|$/.test(line) && i + 1 < lines.length && /^\|\s*-/.test(lines[i + 1])) {
      flushParagraph(out, paragraph);
      flushList(out, list);
      const rows = [line, lines[++i]];
      while (i + 1 < lines.length && /^\|.*\|$/.test(lines[i + 1])) rows.push(lines[++i]);
      out.push(table(rows));
      continue;
    }
    if (!line.trim()) {
      flushParagraph(out, paragraph);
      flushList(out, list);
      continue;
    }
    if (line.trim() === "<!-- pagebreak -->") {
      flushParagraph(out, paragraph);
      flushList(out, list);
      out.push('<div class="pagebreak"></div>');
      continue;
    }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(out, paragraph);
      flushList(out, list);
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph(out, paragraph);
      list.push(line.slice(2));
      continue;
    }
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph(out, paragraph);
      list.push(ordered[1]);
      continue;
    }
    if (line.startsWith("> ")) {
      flushParagraph(out, paragraph);
      flushList(out, list);
      out.push(`<blockquote>${inline(line.slice(2))}</blockquote>`);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph(out, paragraph);
  flushList(out, list);
  return out.join("\n");
}

const paper = sourcePaths.map((path) => readFileSync(path, "utf8")).join("\n\n");
const body = markdown(paper);
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Context Integrity: A Benchmark for Long-Running AI Agent Memory and Action</title>
<style>
@page { margin: 2.35cm; size: A4; }
body { font-family: "Times New Roman", Times, serif; font-size: 10.8pt; line-height: 1.42; color: #000; max-width: 160mm; margin: 0 auto; }
h1 { font-size: 23pt; text-align: center; line-height: 1.1; margin: 0 0 7pt; }
h2 { font-size: 14pt; margin: 19pt 0 7pt; page-break-after: avoid; }
h3 { font-size: 12pt; margin: 14pt 0 5pt; page-break-after: avoid; }
h4 { font-size: 11pt; margin: 11pt 0 4pt; page-break-after: avoid; }
p { margin: 6pt 0; text-align: justify; }
body > h1:first-child, body > h2:first-of-type { text-align: center; }
body > h2:first-of-type { font-size: 14pt; margin: 0 0 8pt; }
body > h2:first-of-type + p { text-align: center; margin-bottom: 18pt; }
a { color: #0645ad; text-decoration: none; }
ul { margin: 4pt 0 7pt 18pt; padding: 0; }
li { margin: 2pt 0; }
table { width: 100%; border-collapse: collapse; margin: 9pt 0 11pt; font-size: 9pt; page-break-inside: avoid; }
th { background: #f0f0f0; font-weight: bold; }
th, td { border: 1px solid #bbb; padding: 5pt 6pt; vertical-align: top; }
pre { border: 1px solid #ccc; background: #f7f7f7; padding: 8pt; white-space: pre-wrap; font-size: 8.2pt; line-height: 1.28; page-break-inside: avoid; }
code { font-family: "Courier New", monospace; font-size: 0.92em; }
blockquote { margin: 10pt 0; padding: 0 10pt; border-left: 2px solid #aaa; font-style: italic; color: #333; }
.pagebreak { break-before: page; page-break-before: always; }
</style>
</head>
<body>${body}</body>
</html>`;

mkdirSync(outDir, { recursive: true });
writeFileSync(htmlPath, html);

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: "load" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: "<div></div>",
  footerTemplate:
    '<div style="width:100%;font-size:8px;color:#666;text-align:center;font-family:Times New Roman,serif;"><span class="pageNumber"></span></div>',
  margin: { top: "2.35cm", bottom: "2.35cm", left: "2.35cm", right: "2.35cm" },
});
await browser.close();

console.log(`Generated ${pdfPath}`);
