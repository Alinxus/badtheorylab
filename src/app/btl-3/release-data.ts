export const links = {
  full: "https://huggingface.co/badtheorylabs/BTL-3",
  compact: "https://huggingface.co/badtheorylabs/BTL-3-Compact",
  github: "https://github.com/Badtheorylabs/BTL-3",
  discord: "https://discord.gg/QJBCcB7bF",
};

export const bfcl = [
  { name: "Simple", score: "93.2%", cases: "373 / 400", value: 93.2 },
  { name: "Multiple", score: "95.5%", cases: "191 / 200", value: 95.5 },
  { name: "Parallel", score: "87.0%", cases: "174 / 200", value: 87 },
  { name: "Parallel-multiple", score: "70.0%", cases: "140 / 200", value: 70 },
  { name: "Irrelevance", score: "91.2%", cases: "219 / 240", value: 91.2 },
  { name: "Overall", score: "88.5%", cases: "1,097 / 1,240", value: 88.5 },
];

export const benchmarks = [
  { metric: "BFCL v4 AST", value: "88.5%", note: "Official full set · 1,240 cases" },
  { metric: "HumanEval", value: "95.12%", note: "156 / 164 · thinking mode" },
  { metric: "BigCodeBench-Hard", value: "26.35%", note: "Strict pass@1 · 39 / 148" },
  { metric: "Functional tests", value: "59.25%", note: "Supplementary · 506 / 854" },
];

export const compactRetention = [
  { name: "Single", value: "20 / 20", pct: 100 },
  { name: "Parallel", value: "20 / 20", pct: 100 },
  { name: "Sequential", value: "20 / 20", pct: 100 },
  { name: "Abstention", value: "20 / 20", pct: 100 },
  { name: "Parallel-multiple", value: "3 / 10", pct: 30 },
];

export const compactSupport = [
  ["macOS arm64 · Metal", "Verified", "Native bundle"],
  ["Linux arm64 · NVIDIA CUDA", "Preview", "DGX Spark package"],
  ["OpenAI-compatible HTTP", "Verified", "btl3-server"],
  ["LM Studio", "Bridge", "Included generator"],
  ["Ollama CLI", "Bridge", "Included launcher"],
];

export const fullHash = "37a8f519039707eba5906591cdb14268768db43f80489a9c2f83b3e51e5e89db";
export const compactHash = "2ddf9527620a17a2a6739d184a7096c45712092e6589128792ec6254e94dc30c";
