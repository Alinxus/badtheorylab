// everything on the Macaw page pulls from here. numbers are from bench.py
// against the frozen MACAW-V1 MLX checkpoint on an Apple M2. measured, not
// projected — the boundaries section says which machine and which surface.

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
  { k: "macOS tools", v: "97" },
  { k: "Runtime", v: "MLX · Metal" },
  { k: "Weights license", v: "LFM v1.0" },
];

// the two shipped artifacts. the on-device MLX build is the product; the BF16
// build exists for people who want the exact weights.
export const editions = [
  {
    id: "mlx",
    tag: "On-device · MLX 4-bit",
    name: "Macaw",
    blurb:
      "The build the app runs. 4-bit affine on Apple Silicon via MLX — no network, no server, no accounts.",
    href: HF_MLX,
    primary: true,
    rows: [
      ["Format", "4-bit affine · MLX"],
      ["Size on disk", "1.5 GB"],
      ["Runtime", "mlx-lm · Metal"],
      ["Serves", "127.0.0.1:8138"],
      ["Identity", "System-prompt steered"],
    ] as [string, string][],
  },
  {
    id: "full",
    tag: "Full · BF16",
    name: "Macaw-BF16",
    blurb:
      "The exact checkpoint, 5.4 GB, for Transformers. Same weights the 4-bit build quantizes — handy for eval or fine-tuning.",
    href: HF_FULL,
    primary: false,
    rows: [
      ["Dtype", "bfloat16"],
      ["Size on disk", "5.4 GB"],
      ["Runtime", "Transformers"],
      ["Base", "LFM2.5-2.6B"],
      ["License", "LFM v1.0"],
    ] as [string, string][],
  },
];

// measured on the frozen checkpoint with bench.py: one representative request
// per capability, tool chosen from the top-12 retrieved schema. no hand-tuning
// between rows.
export const evals = [
  { name: "Tool-call accuracy", sub: "10 requests · top-12 retrieval", label: "10/10", pct: 100 },
  { name: "Mean end-to-end request", sub: "request → tool call", label: "1.21 s", pct: 61 },
  { name: "Best request", sub: "disk / battery queries", label: "0.77 s", pct: 39 },
  { name: "Decode throughput", sub: "Apple M2 · 4-bit", label: "40.3 tok/s", pct: 52 },
];

export const boundaries = [
  {
    sev: "note",
    h: "Identity is prompt-steered",
    b: "The base model is LFM2.5. Macaw presents as Macaw because the app injects a system prompt on every turn. No retraining was involved.",
  },
  {
    sev: "warn",
    h: "Tool surface is the eval surface",
    b: "The 10/10 number is the 10-request capability suite, not a frontier benchmark. No agentic, vision, or long-horizon evals yet. Do not extrapolate.",
  },
  {
    sev: "warn",
    h: "Apple Silicon only",
    b: "MLX runs on Metal. No CUDA build. The BF16 weights run anywhere Transformers does, but the on-device story is Apple-only today.",
  },
  {
    sev: "crit",
    h: "Weights license restricts commerce",
    b: "LFM Open License v1.0 caps commercial use at $10M revenue per entity and requires redistribution under the same license. The code is MIT; the weights are not.",
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
