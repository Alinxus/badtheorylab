# Bad Theory Labs AI Research Brief

Version: v0.1
Date: 2026-06-30
Status: Draft

## Working Title

Context Integrity: Measuring Whether AI Agents Preserve, Retrieve, and Use the Right Evidence Across Time

## One-Line Thesis

The next useful AI systems will not win because they talk better. They will win because they preserve context, retrieve the right evidence, update stale beliefs, and act only when the evidence supports action.

## Why This Fits Bad Theory Labs

Bad Theory Labs already has the right triangle:

- RetainDB: persistent memory and retrieval infrastructure for agents.
- Marrow: an ambient action layer that observes workflow context and decides when to intervene.
- BTL Runtime: an inference gateway that can measure cost, latency, routing, and token waste across providers.

The research program should turn that triangle into a falsifiable claim:

> AI agents fail when their context pipeline fails. The core bottleneck is not only model intelligence, but the integrity of memory, retrieval, evidence, and action over time.

This is a stronger and more product-native claim than "agents need memory." It gives BTL a research wedge, a benchmark, and a reason the products belong together.

## The Research Question

Can an AI agent maintain a stable, auditable working model of a user or task across multiple sessions, retrieve only the evidence needed for the current decision, update stale facts, abstain when evidence is missing, and choose actions that follow from the retrieved evidence?

## Core Hypothesis

Long context is capacity. Memory is continuity. Retrieval is access. Reasoning is use.

Current AI systems often conflate these. A model may pass a long-context retrieval test while still failing as a memory system because it never has to decide what to store, what to update, what to forget, or what evidence justifies action.

## Related Evidence

- Retrieval-augmented generation was originally motivated by the limits of parametric memory, provenance, and updating model knowledge. See Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks": https://arxiv.org/abs/2005.11401
- MemGPT frames agent memory as virtual context management, with memory tiers and control flow inspired by operating systems. See Packer et al., "MemGPT: Towards LLMs as Operating Systems": https://arxiv.org/abs/2310.08560
- LongMemEval evaluates long-term chat memory across information extraction, multi-session reasoning, temporal reasoning, knowledge updates, and abstention. Its paper reports that commercial chat assistants and long-context LLMs show a 30 percent accuracy drop across sustained interactions. See Wu et al., "LongMemEval": https://arxiv.org/abs/2410.10813
- CLadder evaluates associational, interventional, and counterfactual causal reasoning in language models using formal causal graphs translated into natural language. See Jin et al., "CLadder": https://arxiv.org/abs/2312.04350
- Toolformer, ReAct, and Voyager show the move from pure text generation toward tool use, reasoning-action loops, and learned skill libraries. See Toolformer: https://arxiv.org/abs/2302.04761, ReAct: https://arxiv.org/abs/2210.03629, Voyager: https://arxiv.org/abs/2305.16291
- Anthropic's Model Context Protocol is a signal that model-context integration is becoming infrastructure, not an application detail: https://www.anthropic.com/news/model-context-protocol

## Proposed Benchmark

Name: Context Integrity Benchmark, or CIB.

Goal: evaluate full context pipelines, not just model answers.

A benchmark item is a multi-session workflow with timestamped events, user preferences, documents, contradictions, stale facts, missing facts, and possible tool actions. The system must process events over time, maintain memory, retrieve evidence, and answer or act later.

### Task Families

1. Selective write
   - Did the system store the facts that matter?
   - Did it avoid storing irrelevant noise?

2. Evidence retrieval
   - Did the system retrieve the minimum sufficient evidence?
   - Did it retrieve source-backed context, not vague summaries?

3. Knowledge update
   - Did the system replace stale facts when newer evidence contradicts old evidence?
   - Did it preserve temporal history when the question asks for history?

4. Abstention
   - Did the system refuse to answer when evidence is absent?
   - Did it separate "not in memory" from "false"?

5. Multi-session reasoning
   - Can it combine facts from separate sessions without pulling in unrelated context?

6. Action grounding
   - Given the same memory state, does the agent choose the correct action?
   - Does the action follow from evidence, or from plausible but unsupported assumptions?

7. Causal action
   - Can the agent distinguish "this happened after X" from "doing X caused this"?
   - This connects directly to the existing Reasoning Gap work.

## Experimental Design

Compare at least five systems:

- Long-context baseline: stuff full history into prompt when possible.
- Naive vector RAG: chunk, embed, top-k retrieve.
- Hybrid RAG: BM25 plus vector retrieval.
- RetainDB: BTL memory pipeline.
- RetainDB plus critic: memory retrieval with a verification layer before answer/action.

Use the same answer model across all systems first. Then repeat with multiple answer models through BTL Runtime to separate memory-system quality from model quality.

## Metrics

- Answer accuracy
- Retrieval sufficiency
- Unsupported claim rate
- Abstention precision and recall
- Stale fact error rate
- Source attribution correctness
- Action correctness
- Token cost per task
- Latency per task
- Memory write precision and recall

The strongest BTL metric is not raw accuracy. It is grounded utility per token:

> correct supported outcomes / total billable tokens

That metric ties RetainDB and BTL Runtime together.

## Paper 1

Title: Context Integrity: A Benchmark for Long-Running AI Agent Memory and Action

Claim:
Existing agent evaluations split memory, retrieval, reasoning, and action into separate tests. Real agents fail at the interfaces between those pieces. Context Integrity Benchmark measures the entire pipeline.

Minimum result needed:
Show that long context and naive RAG fail on update, abstention, or action grounding even when they do well on simple recall.

Ideal result:
RetainDB or a BTL memory stack outperforms baselines on grounded utility per token and unsupported claim rate.

## Paper 2

Title: Memory Is Not Context: Evidence, Updates, and Abstention in Persistent AI Agents

Claim:
Long context measures attention over a fixed input. Memory measures state maintenance across time. These are different capabilities and should be benchmarked separately.

Minimum result needed:
Show cases where a large-context model succeeds when all evidence is given at once but fails when required to write, update, and retrieve over sessions.

## Paper 3

Title: From Observation to Action: Testing Whether AI Agents Act on Evidence or Correlation

Claim:
Agents need interventional reasoning because tool use changes the world. A system that cannot distinguish observation from intervention should not be trusted to choose actions.

Minimum result needed:
Extend the Reasoning Gap benchmark into agent tasks where the model must choose between possible tool actions and justify the choice using causal evidence.

## Strongest Public Positioning

Bad Theory Labs should own this line:

> The agent stack has a context integrity problem.

Then define context integrity as:

> A system has context integrity when every answer or action can be traced back to the right stored evidence, updated against newer evidence, bounded by uncertainty, and executed only when the evidence supports it.

This is research language, product language, and infrastructure language at the same time.

## Practical Roadmap

Week 1:
- Define 50 hand-written benchmark tasks.
- Build JSON schema for sessions, memory events, questions, allowed actions, gold evidence, and gold answers.
- Run long-context, vector RAG, and hybrid RAG baselines.

Week 2:
- Add RetainDB as a benchmark backend.
- Add unsupported-claim grading.
- Track token cost and latency through BTL Runtime where possible.

Week 3:
- Expand to 250 tasks.
- Add stale-fact and abstention splits.
- Freeze benchmark v0.

Week 4:
- Write paper draft.
- Publish benchmark repo.
- Add public leaderboard page to Bad Theory Labs.

## What To Avoid

- Do not pitch this as "we built better memory" before there is a reproducible benchmark.
- Do not rely only on LLM judges. Use exact gold evidence matching wherever possible, with LLM judging only for natural-language equivalence.
- Do not hide cost. Cost is part of the research contribution because production agents live under token budgets.
- Do not make the benchmark only conversational. Include documents, code, calendars, tasks, API calls, and stale instructions.

## First Dataset Schema

```json
{
  "id": "cib_0001",
  "sessions": [
    {
      "timestamp": "2026-06-01T09:00:00Z",
      "events": [
        {
          "source_id": "s1_e1",
          "type": "message",
          "text": "The user prefers invoices grouped by client, not by month.",
          "should_write": true
        }
      ]
    }
  ],
  "question": "How should the agent format the next invoice export?",
  "gold_answer": "Group invoices by client.",
  "gold_evidence": ["s1_e1"],
  "allowed_actions": ["group_by_client", "group_by_month", "ask_user"],
  "gold_action": "group_by_client",
  "requires_abstention": false,
  "split": ["preference", "single_session", "action_grounding"]
}
```

## Immediate Next Move

Start with a 50-task hand-authored CIB seed set. It is small enough to finish quickly and strong enough to test whether the research direction has teeth.

