# Context Integrity Benchmark v0 Results

Benchmark date: 2026-07-01

Tasks: 250

| System | Evidence precision | Evidence recall | Retrieval sufficiency | Action upper bound | Stale error | Unsupported risk | Avg tokens | Grounded utility / 1k tokens |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| recent3 | 18.0% | 39.0% | 16.0% [12.0%, 21.1%] | 16.0% | 8.0% | 46.0% | 40.0 | 4.00 |
| fullHistory | 29.5% | 100.0% | 76.0% [70.3%, 80.9%] | 76.0% | 24.0% | 0.0% | 55.5 | 13.68 |
| lexical3 | 43.3% | 100.0% | 76.0% [70.3%, 80.9%] | 76.0% | 24.0% | 0.0% | 42.1 | 18.03 |
| writeLexical3 | 88.0% | 100.0% | 76.0% [70.3%, 80.9%] | 76.0% | 24.0% | 0.0% | 28.0 | 27.10 |
| scopedHybrid3 | 100.0% | 100.0% | 100.0% [98.5%, 100.0%] | 100.0% | 0.0% | 0.0% | 26.0 | 38.40 |

## Retrieval Sufficiency By Family

| Family | recent3 | fullHistory | lexical3 | writeLexical3 | scopedHybrid3 |
| --- | ---: | ---: | ---: | ---: | ---: |
| selective_write | 0.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| evidence_retrieval | 0.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| knowledge_update | 100.0% | 0.0% | 0.0% | 0.0% | 100.0% |
| abstention | 0.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| multi_session | 0.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| action_grounding | 0.0% | 100.0% | 100.0% | 100.0% | 100.0% |
| causal_action | 0.0% | 0.0% | 0.0% | 0.0% | 100.0% |

## Paired Retrieval Sufficiency Tests

| Baseline vs scopedHybrid3 | Both sufficient | scoped only | Baseline only | Both insufficient | Delta | Exact paired p |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| recent3 | 40 | 210 | 0 | 0 | 84.0% | <0.0001 |
| fullHistory | 190 | 60 | 0 | 0 | 24.0% | <0.0001 |
| lexical3 | 190 | 60 | 0 | 0 | 24.0% | <0.0001 |
| writeLexical3 | 190 | 60 | 0 | 0 | 24.0% | <0.0001 |

## Interpretation

These are retrieval and memory baselines, not LLM agent results. The benchmark separates recency, full-history context, naive lexical retrieval, write-filtered retrieval, and scoped memory. The paired tests compare sufficiency on the same tasks, so the deltas are not artifacts of different task mixes. The full-history baseline reaches 100% recall but still fails update and causal-action tasks because stale evidence remains in context. The next step is to run answer/action models on the same retrieved evidence and measure unsupported claims, abstention behavior, and action correctness.
