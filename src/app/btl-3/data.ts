// everything on the BTL-3 page pulls from here. numbers are the frozen RL-0013
// release straight out of BTL-3/RESULTS.md — do NOT "round up" a point to make a
// bar look nicer, the boundaries section calls out every asterisk on purpose.

export const HF_FULL = "https://huggingface.co/badtheorylabs/BTL-3";
export const HF_COMPACT = "https://huggingface.co/badtheorylabs/BTL-3-Compact";
export const GH_URL = "https://github.com/Badtheorylabs/BTL-3";
export const DISCORD_URL = "https://discord.gg/QJBCcB7bF";
export const CAL_URL = "https://cal.com/alameenpd/quick-chat";

// the four we lead with in the hero readout. keep the trailing units where they
// exist — a bare "43.16" reads like a percentage and it is not.
export const headline = [
  { k: "HumanEval pass@1", v: "95.12%" },
  { k: "BFCL v4 AST · full set", v: "88.5%" },
  { k: "LiveCodeBench v6 *", v: "88.1%" },
  { k: "Compact gen · RTX PRO 6000", v: "43.16 tok/s" },
];

export const specStrip = [
  { k: "Base model", v: "Qwen3.6-27B" },
  { k: "Checkpoint", v: "BTL-3 RL-0013" },
  { k: "Arch. context", v: "262,144 tokens" },
  { k: "License", v: "Apache-2.0 · MIT runtime" },
];

// the two shipped artifacts. the whole point of the page is that these are NOT
// interchangeable — different runtimes, different limits.
export const editions = [
  {
    id: "full",
    tag: "Full · PEFT adapter",
    name: "BTL-3",
    blurb:
      "Rank-32 LoRA on a pinned Qwen3.6-27B revision. Full-precision, deploy with Transformers or vLLM.",
    href: HF_FULL,
    primary: false,
    rows: [
      ["Adapter", "LoRA r32 / α64"],
      ["Adapter size", "933,974,032 B"],
      ["Max RL sequence", "65,536 tok"],
      ["Launch bench ctx", "32,768 tok"],
      ["Recommended", "Thinking mode"],
    ] as [string, string][],
  },
  {
    id: "compact",
    tag: "Compact · Native GGUF",
    name: "BTL-3 Compact",
    blurb:
      "The complete 27B text model — decoder, vocab, corrections — packed into one native file. No BF16 reconstruction at runtime.",
    href: HF_COMPACT,
    primary: true,
    rows: [
      ["Representation", "AVQ2 / UniSVQ"],
      ["File size", "8.39 GB / 7.82 GiB"],
      ["Exact bytes", "8,392,369,600"],
      ["Packed tensors", "2,416 verified"],
      ["Runtime", "CUDA · Metal"],
    ] as [string, string][],
  },
];

// bars are drawn to a flat 0-100 scale so BigCodeBench-Hard reads as honestly
// low as it actually is. pct is only for the bar width; label carries the truth.
export const evals = [
  { name: "HumanEval", sub: "pass@1 · thinking · T=0", label: "95.1%", pct: 95.12 },
  { name: "BFCL v4 AST", sub: "official full set · 1097/1240", label: "88.5%", pct: 88.5 },
  { name: "LiveCodeBench v6", sub: "completed 193-case run · 170/193 *", label: "88.1%", pct: 88.08 },
  { name: "BigCodeBench functional", sub: "supplementary test-level · 506/854", label: "59.3%", pct: 59.25 },
  { name: "BigCodeBench-Hard", sub: "official strict pass@1 · 39/148", label: "26.4%", pct: 26.35 },
];

export const bfcl = [
  { cat: "Simple", frac: "373/400", label: "93.2%", pct: 93.2 },
  { cat: "Multiple", frac: "191/200", label: "95.5%", pct: 95.5 },
  { cat: "Parallel", frac: "174/200", label: "87.0%", pct: 87 },
  { cat: "Parallel-multiple", frac: "140/200", label: "70.0%", pct: 70 },
  { cat: "Irrelevance", frac: "219/240", label: "91.2%", pct: 91.2 },
  { cat: "Overall", frac: "1097/1240", label: "88.5%", pct: 88.5, strong: true },
];

// private post-freeze tool-contract gate. this is NOT bfcl and NOT a public
// benchmark — the retention section says so out loud.
export const retention = [
  { cat: "Single call", label: "100%", pct: 100, weak: false },
  { cat: "Parallel call", label: "100%", pct: 100, weak: false },
  { cat: "Sequential call", label: "100%", pct: 100, weak: false },
  { cat: "Abstention", label: "100%", pct: 100, weak: false },
  { cat: "Parallel-multiple", label: "30%", pct: 30, weak: true },
  { cat: "Overall", label: "92.2%", pct: 92.2, weak: false, strong: true },
];

export const perf = [
  { dev: "RTX PRO 6000 Blackwell 96 GB", note: "full CUDA offload · mean of 3", pp: "84.70", gen: "43.16", star: true },
  { dev: "Apple M2 16 GB", note: "Metal compatibility smoke", pp: "2.30", gen: "2.48", star: false },
  { dev: "Full BTL-3 · one B200", note: "vLLM 0.23.0 · eager · aggregate", pp: "—", gen: "17.45", star: false },
];

// severity is a UI signal, not a claim. warn = disclosed weak spot, crit = the
// one number people misread the most, note = scope of measurement.
export const boundaries = [
  {
    sev: "note",
    h: "LiveCodeBench is a partial slice",
    b: "The 88.1% is a completed 193 of 442 v6 cases — completion-time-biased, not a random sample. Publishable only as a 193-case slice, never a full score or a leaderboard win.",
  },
  {
    sev: "crit",
    h: "BigCodeBench-Hard is genuinely hard",
    b: "Official strict pass@1 is 26.35% — one failed assertion zeroes a task. The 59.25% figure is a supplementary test-level read for error analysis, not the leaderboard metric.",
  },
  {
    sev: "note",
    h: "HumanEval is saturated",
    b: "A compatibility check, not repo-level autonomy. Base Qwen3.6-27B scored 95.7% on the same harness, so 95.12% shows coding was preserved, not a raw short-code gain.",
  },
  {
    sev: "warn",
    h: "Context is architectural, not validated",
    b: "The architecture declares 262,144 tokens. Launch benchmarks ran a 32,768-token window; the RL curriculum allowed up to 65,536. Full-window behavior is not validated.",
  },
  {
    sev: "warn",
    h: "Compact retention is conditional",
    b: "92.2% is an internal tool-contract gate, not a public benchmark. Parallel-multiple composition retains only 30%. Compact and Full are not interchangeable.",
  },
  {
    sev: "note",
    h: "Runtime speeds are device-exact",
    b: "Measured on the exact hardware listed. RTX 4090, RTX 5090, DGX Spark, Windows and newer Apple packages remain device-specific gates. No SWE-bench or Terminal-Bench score yet.",
  },
];

export const hashes = [
  {
    lab: "BTL-3 · adapter_model.safetensors",
    sha: "37a8f519039707eba5906591cdb14268768db43f80489a9c2f83b3e51e5e89db",
    meta: "933,974,032 bytes · LoRA r32 / α64 · RL-0013",
  },
  {
    lab: "BTL-3 Compact · BTL-3-Compact-AVQ2.gguf",
    sha: "2ddf9527620a17a2a6739d184a7096c45712092e6589128792ec6254e94dc30c",
    meta: "8,392,369,600 bytes · 2,416 tensors byte-verified",
  },
];
