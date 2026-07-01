# Context Integrity

## A Benchmark for Long-Running AI Agent Memory and Action

Olajide Al-ameen  
Bad Theory Labs, Lagos  
Draft v0.1 · June 2026

## Abstract

AI agents are increasingly expected to operate across long-running workflows: reading documents, remembering user preferences, updating stale facts, retrieving evidence, and choosing actions. Existing evaluations usually isolate one piece of this system. Long-context benchmarks test whether a model can attend over a fixed prompt. Retrieval benchmarks test whether a relevant passage can be found. Agent benchmarks test whether a model can call tools. None of these alone measures whether an agent preserves context integrity across time.

We introduce Context Integrity Benchmark (CIB), a proposed evaluation framework for persistent AI agents. A system has context integrity when every answer or action can be traced to the right stored evidence, updated against newer evidence, bounded by uncertainty, and executed only when the evidence supports it. CIB evaluates seven task families: selective memory writes, evidence retrieval, knowledge update, abstention, multi-session reasoning, action grounding, and causal action. The benchmark compares long-context prompting, naive vector RAG, hybrid lexical-semantic retrieval, memory systems such as RetainDB, and retrieval-plus-critic pipelines under the same answer model. We define metrics for answer accuracy, retrieval sufficiency, unsupported claim rate, stale-fact error, abstention precision and recall, action correctness, latency, token cost, and grounded utility per token.

This draft does not report model results. It defines the benchmark, the falsifiable claims, the evaluation protocol, and the failure modes a real agent memory system must survive.

## 1. Introduction

The current AI stack has a context integrity problem.

Models can answer a question from a prompt. Retrieval systems can return a chunk. Agents can call a tool. But real work does not arrive as a single prompt with all relevant facts neatly attached. It unfolds over time. A user changes their mind. A document supersedes an older document. A preference applies in one situation but not another. An instruction is remembered, then contradicted. The agent must decide what to store, what to ignore, what to retrieve, what to update, when to ask for clarification, and whether an action is justified.

Long context is not memory. It is capacity. Memory is state maintained across time. Retrieval is not understanding. It is access. Reasoning is not a fluent explanation. It is the correct use of evidence under constraints.

Current evaluations often blur those distinctions. A model may pass a long-context needle test while still failing as a memory system because it never had to choose what to write. A RAG system may retrieve a passage while still producing unsupported claims. An agent may complete a tool-use task while relying on stale or ungrounded context. In deployment, these are not separate problems. They are the same failure viewed from different angles.

This paper proposes Context Integrity Benchmark (CIB): a benchmark for evaluating whether AI agents preserve, retrieve, update, and use context correctly across sessions.

Our main contributions are:

- We define context integrity as a measurable property of agent systems.
- We propose seven task families that stress persistent memory, retrieval, abstention, and action grounding.
- We define metrics that evaluate not only final answer accuracy but evidence use, unsupported claims, stale facts, and cost.
- We describe a reproducible evaluation protocol comparing long-context, RAG, hybrid retrieval, memory, and critic-based systems.
- We connect context integrity to causal action: agents that act must distinguish evidence of association from evidence that an intervention will work.

## 2. Definition

A system has context integrity when:

1. It stores facts that matter and ignores noise.
2. It retrieves the minimum sufficient evidence for the current decision.
3. It updates stale facts when newer evidence supersedes older evidence.
4. It preserves history when the question asks for history.
5. It abstains when evidence is absent or ambiguous.
6. It grounds answers and actions in retrieved evidence.
7. It distinguishes observed correlations from justified interventions.

This definition is deliberately operational. Context integrity is not a vibe, a product promise, or a model capability in the abstract. It is measured by comparing a system's memory writes, retrieved sources, answers, and actions against a gold evidence graph.

## 3. Related Work

Retrieval-augmented generation was introduced to address the limits of parametric memory and to give generated answers access to external knowledge (Lewis et al., 2020). RAG remains the dominant pattern for grounding LLM outputs, but RAG evaluation often focuses on retrieval relevance and answer faithfulness within a single query.

Long-context evaluation studies whether models can use information placed far inside a prompt. "Lost in the Middle" showed that language models can be sensitive to where relevant information appears in long contexts (Liu et al., 2023). These evaluations are useful, but they test a fixed input. They do not test whether a system can maintain memory across time.

MemGPT frames LLM agents as systems that require virtual context management, with memory tiers inspired by operating systems (Packer et al., 2023). LongMemEval evaluates long-term memory in chat assistants across information extraction, multi-session reasoning, temporal reasoning, knowledge updates, and abstention (Wu et al., 2024). CIB builds in the same direction but adds evidence-level grading, write precision, action grounding, and cost-aware metrics.

Agent benchmarks such as AgentBench and SWE-bench evaluate tool use and task completion. They are essential for measuring whether agents can act. CIB asks a prior question: whether the action is grounded in valid remembered evidence.

The Reasoning Gap benchmark from Bad Theory Labs tests whether models can distinguish observational from interventional causal queries over explicit probability tables. CIB extends this concern into agent behavior. If an agent chooses actions, it must reason about what will happen if it acts, not only what patterns appeared in the past.

## 4. Benchmark Design

CIB is built from multi-session workflows. Each workflow contains timestamped events, evidence sources, distractors, contradictions, user preferences, documents, possible tool actions, and final questions.

A task instance includes:

- Session events: user messages, documents, code changes, emails, calendar events, API outputs, or prior agent actions.
- Gold memory writes: the facts a memory system should store.
- Gold evidence: the source IDs required to answer or act.
- Stale evidence markers: older facts that should be superseded.
- Questions: natural-language queries over the state.
- Allowed actions: discrete actions the agent may choose.
- Gold answer and gold action.
- Split tags: task family, difficulty, domain, and failure mode.

The benchmark evaluates the full pipeline:

1. Ingestion: the system receives events over time.
2. Memory: the system decides what to write.
3. Retrieval: the system receives a later query and retrieves evidence.
4. Answer/action: the system answers or chooses an action.
5. Audit: the system returns citations or source IDs.

## 5. Task Families

### 5.1 Selective Write

The system receives many events. Some are useful long-term facts. Others are noise. The benchmark checks whether the system writes durable facts without storing everything.

Example failure: the agent remembers a joke, ignores the user's invoice format preference, then fails later.

### 5.2 Evidence Retrieval

The system must retrieve the smallest evidence set sufficient to answer. This penalizes both missing evidence and irrelevant context flooding.

Example failure: the retriever finds the right document but also includes a contradictory old note, and the model answers from the wrong one.

### 5.3 Knowledge Update

The system receives a fact, then receives a newer fact that supersedes it. It must use the newer fact for current-state questions and preserve the older fact for history questions.

Example failure: the agent still uses the old API endpoint after a migration notice.

### 5.4 Abstention

The system must say when evidence is missing. This is central because unsupported confidence is often worse than no answer.

Example failure: the agent invents a budget number because related planning notes exist.

### 5.5 Multi-Session Reasoning

The answer requires combining facts from multiple sessions without pulling in unrelated context.

Example failure: the agent combines a design preference from one project with a legal constraint from another.

### 5.6 Action Grounding

The system chooses an action from a small action set. The action must follow from retrieved evidence.

Example failure: the agent sends a follow-up email even though the user only asked for a draft.

### 5.7 Causal Action

The system must distinguish observed correlation from justified intervention. This connects context integrity to causal reasoning.

Example failure: the agent recommends increasing marketing spend because revenue rose after the last campaign, even though the evidence says the revenue change was caused by seasonality.

## 6. Baselines

CIB should compare at least five systems:

1. Full-history prompting: pass the entire available history when it fits.
2. Long-context truncation: pass the most recent history up to the model limit.
3. Naive vector RAG: chunk, embed, top-k retrieve.
4. Hybrid retrieval: lexical BM25 plus vector retrieval.
5. Memory system: explicit write/update/retrieve pipeline.
6. Memory plus critic: retrieval with a verification stage before final answer or action.

The first evaluation should hold the answer model constant. This isolates context-system quality from model quality. A second evaluation can vary the answer model through a gateway such as BTL Runtime to measure how memory systems interact with model capability, cost, and latency.

## 7. Metrics

CIB reports pipeline metrics, not only final answer accuracy.

- Answer accuracy: whether the final answer matches the gold answer.
- Action accuracy: whether the selected action matches the gold action.
- Evidence recall: fraction of gold evidence source IDs retrieved.
- Evidence precision: fraction of retrieved source IDs that are gold evidence.
- Retrieval sufficiency: whether retrieved evidence is enough to answer.
- Unsupported claim rate: claims not supported by retrieved evidence.
- Stale fact error rate: answers or actions based on superseded facts.
- Abstention precision: when the system abstains, was evidence actually missing?
- Abstention recall: when evidence was missing, did the system abstain?
- Write precision: fraction of written memories that should have been written.
- Write recall: fraction of gold memories written.
- Latency: end-to-end task time.
- Token cost: total billable input and output tokens.

The core production metric is grounded utility per token:

`grounded_utility = supported_correct_outcomes / billable_tokens`

This matters because production agents do not operate in a vacuum. A memory system that improves accuracy while doubling context cost may be less useful than a system that preserves groundedness under a tighter token budget.

## 8. Example Task

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
          "text": "For finance exports, group invoices by client, not by month.",
          "should_write": true
        },
        {
          "source_id": "s1_e2",
          "type": "message",
          "text": "The blue dashboard mockup looked funny.",
          "should_write": false
        }
      ]
    },
    {
      "timestamp": "2026-06-12T15:30:00Z",
      "events": [
        {
          "source_id": "s2_e1",
          "type": "message",
          "text": "Actually, for audit exports only, group invoices by month.",
          "should_write": true,
          "supersedes": []
        }
      ]
    }
  ],
  "question": "How should the agent format a normal finance invoice export?",
  "gold_answer": "Group invoices by client.",
  "gold_evidence": ["s1_e1", "s2_e1"],
  "allowed_actions": ["group_by_client", "group_by_month", "ask_user"],
  "gold_action": "group_by_client",
  "requires_abstention": false,
  "split": ["preference", "multi_session", "action_grounding"]
}
```

The second event creates a narrow exception. A brittle system may treat it as a global update and group every export by month. A context-integrity-preserving system uses both evidence sources and notices the scope: audit exports changed, normal finance exports did not.

## 9. Falsifiable Claims

CIB should make claims that can fail.

Claim 1: Long context alone is insufficient for durable agent memory.  
Falsification: full-history prompting matches or beats memory systems on update, abstention, action grounding, cost, and latency.

Claim 2: Hybrid retrieval improves evidence precision over naive vector retrieval.  
Falsification: vector-only retrieval matches hybrid retrieval on evidence precision and stale-fact error.

Claim 3: A critic reduces unsupported claims and stale-fact errors.  
Falsification: critic pipelines increase latency and cost without reducing unsupported claims.

Claim 4: Causal-action tasks expose failures not visible in recall tasks.  
Falsification: systems that score well on recall also score well on causal action.

## 10. Evaluation Protocol

The initial benchmark should contain 250 tasks:

- 50 selective-write tasks
- 40 evidence-retrieval tasks
- 40 knowledge-update tasks
- 35 abstention tasks
- 35 multi-session reasoning tasks
- 30 action-grounding tasks
- 20 causal-action tasks

Each task should include exact source IDs for gold evidence. Grading should be mostly deterministic:

- Exact match for action labels.
- Exact source-ID comparison for retrieval.
- Rule-based stale-fact detection where possible.
- Human or LLM-assisted equivalence checks only for natural-language answer variants.

The benchmark should report aggregate results plus split-level results. A system that performs well on recall but fails abstention should not be described as having good memory.

## 11. Expected Failure Modes

The benchmark is designed to surface eight common failures:

1. Context flooding: retrieving too much and letting irrelevant evidence dominate.
2. Quiet omission: missing the one source needed for the answer.
3. Stale override: using an old fact after a newer one supersedes it.
4. Over-update: treating a narrow exception as a global replacement.
5. False memory: storing a summary that was never stated.
6. Unsupported confidence: answering when evidence is absent.
7. Action drift: choosing a plausible action not licensed by evidence.
8. Causal confusion: recommending an intervention from observed correlation.

## 12. Discussion

The important distinction is between having context and preserving context integrity. A long prompt can contain the right sentence. A vector index can return a similar chunk. Neither guarantees that the system knows which evidence is current, scoped, sufficient, and action-authorizing.

This is why agent memory cannot be evaluated only as recall. The practical question is not "can the system remember something?" It is "can the system maintain an auditable state that supports correct decisions over time?"

For Bad Theory Labs, this frames memory, runtime, and action as one research problem. RetainDB can be evaluated as the memory and retrieval layer. BTL Runtime can measure model, latency, and token-cost effects. Marrow can be evaluated as the action layer that must decide when evidence is strong enough to intervene.

## 13. Limitations

This draft defines a benchmark but does not report empirical model results. The strongest claims require running the benchmark across real systems. Hand-authored tasks may encode designer bias, so later versions should include generated variants with human review. LLM-based answer grading should be minimized because it can introduce evaluator bias. Finally, context integrity is broad; a 250-task benchmark cannot cover every domain where agents operate.

## 14. Conclusion

The next wave of AI agents will be judged less by whether they can talk and more by whether they can follow through. Following through requires context integrity: storing the right facts, retrieving the right evidence, updating beliefs, abstaining under uncertainty, and grounding actions in what is actually known.

Context Integrity Benchmark turns that requirement into an evaluation target. If an agent cannot preserve evidence across time, it does not have memory in the sense real work requires. It has a transcript and a guess.

## References

Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. https://arxiv.org/abs/2005.11401

Liu, N. F. et al. (2023). Lost in the Middle: How Language Models Use Long Contexts. https://arxiv.org/abs/2307.03172

Packer, C. et al. (2023). MemGPT: Towards LLMs as Operating Systems. https://arxiv.org/abs/2310.08560

Wu, Z. et al. (2024). LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory. https://arxiv.org/abs/2410.10813

Jin, Z. et al. (2024). CLadder: Assessing Causal Reasoning in Language Models. https://arxiv.org/abs/2312.04350

Yao, S. et al. (2022). ReAct: Synergizing Reasoning and Acting in Language Models. https://arxiv.org/abs/2210.03629

Schick, T. et al. (2023). Toolformer: Language Models Can Teach Themselves to Use Tools. https://arxiv.org/abs/2302.04761

Jimenez, C. E. et al. (2023). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? https://arxiv.org/abs/2310.06770

Anthropic (2024). Introducing the Model Context Protocol. https://www.anthropic.com/news/model-context-protocol

