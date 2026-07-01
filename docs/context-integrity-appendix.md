<!-- pagebreak -->

## Appendix A. Task Schema

CIB tasks are JSON objects with the following required fields:

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | string | Stable task identifier. |
| `family` | string | One of the seven task-family labels. |
| `project` | string | Scope field used to test project isolation. |
| `domain` | string | Scope field used to test domain isolation. |
| `events` | array | Timestamped event stream. |
| `question` | string | Later query or decision point. |
| `gold_evidence` | array | Source IDs required for a sufficient answer or action. |
| `stale_evidence` | array | Source IDs that should not authorize current action. |
| `requires_abstention` | boolean | Whether the correct behavior is to ask or abstain. |
| `gold_action` | string | Discrete gold action label. |

Each event has a `source_id`, `timestamp`, `text`, `should_write`, `project`, `domain`, `stale`, and optional `superseded_by` field. A stale event must point to the newer event that supersedes it.

## Appendix B. Release Checklist

A CIB v0 release should pass all of the following checks:

- `npm run cib:release`
- `npm run cib:manifest:verify`
- `npm run cib:validate`
- `npm run build`

The release validator checks task counts, family counts, source-ID uniqueness, evidence pointers, stale supersession metadata, summary totals, paired-comparison totals, metric ranges, and manifest hashes. A release should not be compared against another run until these checks pass.

## Appendix C. Model Evaluation Contract

For frontier model evaluation, the model receives timestamped task events and the task question. It must return strict JSON:

```json
{
  "action": "one_of_allowed_actions",
  "evidence": ["source_id"],
  "abstain": true
}
```

The harness scores action accuracy, abstention accuracy, evidence precision, evidence recall, retrieval sufficiency, and stale-evidence rate. Runs should report model name, endpoint family, date, temperature, maximum output tokens, prompt template, and any non-deterministic grading.
