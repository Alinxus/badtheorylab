// copy for /macaw. the page sells the promise first (like the waitlisted Mac-1
// pages do) and proves it with measured numbers — but Macaw is real: live today,
// open source, MIT code, no payments. every capability card is a tool that
// exists in tools.json, every number is bench.py on the frozen checkpoint.

export const HF_MLX = "https://huggingface.co/badtheorylabs/Macaw-4bit-MLX";
export const HF_FULL = "https://huggingface.co/badtheorylabs/Macaw";
export const GH_URL = "https://github.com/Badtheorylabs/Macaw";
export const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
export const CAL_URL = "https://cal.com/alameenpd/quick-chat";
export const BASE_LICENSE = "https://huggingface.co/LiquidAI/LFM2.5-2.6B/raw/main/LICENSE";

export const headline = [
  { k: "Tool-call accuracy", v: "10 / 10" },
  { k: "Mean request", v: "1.21 s" },
  { k: "Decode · M2", v: "40.3 tok/s" },
  { k: "On-device size", v: "1.5 GB" },
];

export const specStrip = [
  { k: "Params", v: "2.70B" },
  { k: "Base model", v: "LFM2.5-2.6B" },
  { k: "Context", v: "128K" },
  { k: "macOS tools", v: "97 verified" },
  { k: "Runtime", v: "MLX · Metal" },
  { k: "Weights license", v: "LFM v1.0" },
];

// capability cards — the "what it does for you" section. each one maps to a real
// tool family in tools.json.
export const capabilities = [
  {
    icon: "calendar",
    title: "Calendar & Scheduling",
    ask: "Am I free at 3?",
    body: "Check your day, create events, find free slots, spot conflicts. Handles relative dates and recurring meetings.",
  },
  {
    icon: "folder",
    title: "Files & Finder",
    ask: "Find the budget spreadsheet from yesterday",
    body: "Spotlight search, open files, read documents, check storage. Finds the PDF even when you forgot its name.",
  },
  {
    icon: "mail",
    title: "Mail & Messages",
    ask: "Email Daisy the meeting agenda",
    body: "Drafts and sends mail, checks unread, resolves contacts by name — and asks when there are two Daisys.",
  },
  {
    icon: "music",
    title: "Music & Podcasts",
    ask: "Play something chill for focusing",
    body: "Play, pause, skip, queue, volume. Search by artist or mood without leaving whatever you're doing.",
  },
  {
    icon: "sliders",
    title: "System Controls",
    ask: "DND on and dim the screen",
    body: "Volume, brightness, dark mode, Focus modes, battery, lock, sleep. Plain English in, settings out.",
  },
  {
    icon: "bolt",
    title: "Multi-step chains",
    ask: "Check 3pm, email Daisy the agenda, set a reminder",
    body: "One sentence triggers calendar, mail, and reminders in sequence — the follow-through Siri never shipped.",
  },
];

// the comparison table. Mac-1 pages compare against Siri; Macaw compares
// against Siri AND against the closed "coming soon" apps — being live and
// open source is the honest differentiator.
export const comparison = {
  cols: ["Siri", "Macaw"],
  rows: [
    ["Where it runs", "Apple's servers", "100% on your Mac"],
    ["Needs internet", "Always", "Only for optional web search"],
    ["Multi-step chains", "No", "Yes — 3–5 tools in one sentence"],
    ["Reads your files", "No", "PDFs, notes, documents, mail"],
    ["Writes & sends mail", "Opens the app", "Drafts and sends"],
    ["Open source", "No", "Yes — MIT code, weights published"],
    ["Live today", "—", "Yes — downloadable now"],
  ],
};

// three steps — copied in spirit from Mac-1's "how it works", because the app
// genuinely does install this fast.
export const steps = [
  {
    n: "01",
    title: "Install the app",
    body: "Clone the repo, swift build, done. No installer to hunt for.",
  },
  {
    n: "02",
    title: "Press ⌥ Space",
    body: "The floating bar opens from any app, any window, any time.",
  },
  {
    n: "03",
    title: "Type what you need",
    body: "Plain English or fragments. Macaw picks the tool, runs it, returns the result.",
  },
];

export const compatibility = [
  { chip: "Apple Silicon", note: "M1 or later · macOS 14+" },
  { chip: "RAM", note: "8 GB+ · 1.5 GB model footprint" },
  { chip: "Offline", note: "Fully local · no accounts" },
  { chip: "Open", note: "MIT code · weights on Hugging Face" },
];

// receipts — the proof, kept on the page but no longer the headline.
export const evals = [
  { name: "Tool-call accuracy", sub: "10 requests · top-12 retrieval", label: "10/10", pct: 100 },
  { name: "Mean end-to-end request", sub: "request → tool call", label: "1.21 s", pct: 61 },
  { name: "Best request", sub: "disk / battery queries", label: "0.77 s", pct: 39 },
  { name: "Decode throughput", sub: "Apple M2 · 4-bit", label: "40.3 tok/s", pct: 52 },
];

// small honest asterisks, kept to a single compact strip at the bottom.
export const boundaries = [
  {
    sev: "note",
    h: "Identity is prompt-steered",
    b: "Base model is LFM2.5; the app injects a system prompt so it presents as Macaw.",
  },
  {
    sev: "note",
    h: "Apple Silicon only",
    b: "MLX runs on Metal. BF16 weights run anywhere Transformers does.",
  },
  {
    sev: "warn",
    h: "Weights license restricts commerce",
    b: "LFM Open License v1.0 caps commercial use at $10M revenue. The code is MIT.",
  },
];

export const qs = {
  serve: `pip install mlx mlx-lm
python -m mlx_lm.server \\
  --model badtheorylabs/Macaw-4bit-MLX \\
  --port 8138`,
  py: `from mlx_lm import load, generate
model, tok = load("badtheorylabs/Macaw-4bit-MLX")
prompt = tok.apply_chat_template([
  {"role":"system","content":
    "You are Macaw, an on-device AI assistant on this Mac."},
  {"role":"user","content":"What are you?"},
], add_generation_prompt=True)
print(generate(model, tok, prompt=prompt, max_tokens=128))`,
  app: `git clone https://github.com/Badtheorylabs/Macaw
cd Macaw/app
swift build        # menu-bar app, ⌥ Space
# point MACAW_PYTHON at a python with mlx-lm if it's not on PATH`,
};
