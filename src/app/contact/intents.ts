export type Field = {
  key: string;
  label: string;
  hint?: string;
  lines?: number;
  required?: boolean;
};

export type Intent = {
  id: string;
  label: string;
  note: string;
  lead: string;
  fields: Field[];
  // only the contract route gets the bar readout, because only it has a bar
  bar?: string[];
  after: { step: string; body: string }[];
};

export const INTENTS: Intent[] = [
  {
    id: "contract",
    label: "Contract the lab",
    note: "Governments, enterprises and institutions with a problem for BTL.",
    lead: "Four answers tell us whether this is a product problem, an engineering problem or a research problem. If it is the third, that is where we are useful.",
    bar: ["change", "fixed", "stack", "measure"],
    fields: [
      {
        key: "change",
        label: "What are you trying to change?",
        hint: "The problem as it stands today, not the solution you have in mind.",
        lines: 4,
        required: true,
      },
      {
        key: "fixed",
        label: "What cannot move?",
        hint: "Data that cannot leave, hardware you are stuck with, a latency ceiling, a regulator.",
        lines: 3,
      },
      {
        key: "stack",
        label: "What runs it today?",
        hint: "Hardware, infrastructure, and whichever model or system is in place now.",
        lines: 3,
      },
      {
        key: "measure",
        label: "How would you know it had worked?",
        hint: "A number, a behaviour, or an operating condition. This one is the most useful.",
        lines: 3,
        required: true,
      },
    ],
    after: [
      { step: "We read it", body: "Whoever would actually run the work, not a sales desk." },
      { step: "Discovery", body: "Two to four weeks defining the real problem with your team." },
      { step: "Pilot", body: "Six to twelve weeks on one bounded version, against the agreed measurement." },
      { step: "Delivery", body: "Scoped per contract, built into the environment it was designed for." },
    ],
  },
  {
    id: "research",
    label: "Research",
    note: "Published results, replication, and the open questions.",
    lead: "We publish method and measurements, failed runs included. If something does not reproduce, we want to hear it.",
    fields: [
      {
        key: "which",
        label: "Which work?",
        hint: "A paper, a result, or one of the seven open questions.",
        lines: 2,
        required: true,
      },
      {
        key: "detail",
        label: "What do you want to know, or what are you proposing?",
        lines: 6,
        required: true,
      },
    ],
    after: [
      { step: "We read it", body: "A researcher on the relevant work, usually within the week." },
      { step: "You get the run", body: "Method, conditions and the numbers behind whatever you asked about." },
    ],
  },
  {
    id: "press",
    label: "Press",
    note: "Interviews, citations, and corrections to published numbers.",
    lead: "Numbers we have published are on the papers with the conditions they were measured under. Ask and we will point you at the run.",
    fields: [
      { key: "outlet", label: "Outlet", lines: 1, required: true },
      {
        key: "detail",
        label: "What do you need, and by when?",
        lines: 5,
        required: true,
      },
    ],
    after: [
      { step: "We read it", body: "Same day where the deadline says so." },
      { step: "You get the conditions", body: "Every number we quote comes with what it was measured under." },
    ],
  },
  {
    id: "other",
    label: "Something else",
    note: "Investors, hiring, the Discord, everything above misses.",
    lead: "",
    fields: [
      { key: "detail", label: "What is this about?", lines: 7, required: true },
    ],
    after: [
      { step: "We read it", body: "All of it reaches the same inbox, and a person answers." },
    ],
  },
];

export function findIntent(id: string | null | undefined): Intent {
  return INTENTS.find((i) => i.id === id) ?? INTENTS[0];
}

// the API takes one message body, so flatten the answers into something a
// human can read in an inbox
export function composeMessage(intent: Intent, answers: Record<string, string>) {
  const parts: string[] = [];
  for (const f of intent.fields) {
    const v = answers[f.key]?.trim();
    if (!v) continue;
    parts.push(`${f.label}\n${v}`);
  }
  return parts.join("\n\n");
}
