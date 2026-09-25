// numbers here come from the paper, the HF cards and the HF api pull on sep 25.
// if you touch one, touch the pitch doc too or they drift.

export const searchRows = [
  ["Qwen3-1.7B thinking in text, 1,500 tokens", "3 / 30", "one token at a time"],
  ["Trained judge in one line of thought, 200 judged positions", "21 / 30", "7.9 on the ones it solves"],
  ["Interference Search, same judge, same 200 positions", "30 / 30", "3"],
];

export const tinfieldRows = [
  ["Terminal-Bench 4.0", "33.0", "29.0", "23.6"],
  ["DeepSWE v1.1", "62", "58.7", "59"],
];

type Release = {
  when: string;
  name: string;
  href: string;
  what: string;
  result: string;
  downloads: string;
};

export const releases: Release[] = [
  {
    when: "Aug 5, 2026",
    name: "BTL-4",
    href: "https://huggingface.co/badtheorylabs/BTL-4",
    what: "35B mixture-of-experts agent model, about 2.1B active per token, fine-tuned from Ornith-1.0-35B",
    result:
      "78.4% SWE-bench Verified, run by an outside lab. 73.5% BFCL v4 against 69.2% for the base, same harness, all 1,240 cases. 66.1% LiveCodeBench v6, 442 problems",
    downloads: "9,995",
  },
  {
    when: "Aug 5, 2026",
    name: "Macaw",
    href: "https://huggingface.co/badtheorylabs/Macaw",
    what: "2.6B assistant that runs entirely on a Mac, built on LFM2.5-2.6B",
    result: "97 hand-written, tested tools across Mail, Calendar, Files, the screen and the system. Chains steps and checks each one",
    downloads: "2,411",
  },
  {
    when: "Jul 20, 2026",
    name: "BTL-3 Compact",
    href: "https://huggingface.co/badtheorylabs/BTL-3-Compact",
    what: "The whole 27B text model in one 8.39 GB file, with our own CUDA and Metal runtime",
    result: "Kept 83 of the 90 tool behaviours the full model got right on a fresh 100-case gate. Smaller than an 8B model in FP16",
    downloads: "2,827",
  },
  {
    when: "Jul 20, 2026",
    name: "BTL-3",
    href: "https://huggingface.co/badtheorylabs/BTL-3",
    what: "27B agent model for coding and tool use, post-trained on Qwen3.6-27B",
    result: "88.5% BFCL v4 on all 1,240 cases. 95.1% HumanEval. 91.2% on knowing when not to call a tool",
    downloads: "313",
  },
  {
    when: "Jun 22, 2026",
    name: "BTL-2 Coder",
    href: "https://huggingface.co/badtheorylabs/btl-2-coder",
    what: "7B code-review adapter on Qwen2.5-Coder-7B",
    result: "Structured security findings: SQL injection, path traversal, auth bypass. Our first release",
    downloads: "71",
  },
];

export const research = [
  [
    "ESP",
    "Lets a text-only model use a screen with no vision model, by probing the interface and streaming what changed",
    "The rewrite takes 255 to 347 ms per action where the first version took 1.4 to 4.4 s, and sends the model 6 to 15 times fewer bytes. Its four registered hypotheses haven't been tested end to end yet",
  ],
  [
    "Research agent loop",
    "A 4B agent drives a retriever on BrowseComp-Plus, a hard web-research benchmark",
    "Beat matched single-shot retrieval by +0.240 recall on a 5-question pilot. It found the same evidence with a third of the documents. Our retrieval harness reproduces the published baselines",
  ],
  [
    "One-bit models",
    "Recovery training for models squeezed to one or two bits per weight",
    "On a small mixture-of-experts model, ternary weights recovered 55.0% top-1 agreement with the original against 46.3% for binary. Neither version knows when to stop generating yet",
  ],
  [
    "Prism",
    "Open-source layer that adds planning, tools and verification around a small local model",
    "MIT-licensed. Early results on a 4B model look positive, but they're one trial on 16 tasks, so I'm not quoting them until they're rerun",
  ],
];
