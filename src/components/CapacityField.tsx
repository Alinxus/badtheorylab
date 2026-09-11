"use client";

import { useState } from "react";
import styles from "@/app/home-experiment.module.css";

const FORMS = [
  { name: "Representation", short: "bits", state: "Measured", body: "How many bits preserve the behaviour?" },
  { name: "Architecture", short: "params", state: "Measured", body: "How much parameter capacity stores it?" },
  { name: "Learning", short: "tokens", state: "Open · next", body: "How much data acquires it?" },
  { name: "Modification", short: "change", state: "Open", body: "How much of the model must move?" },
  { name: "Inference", short: "FLOPs", state: "Evidence only", body: "How much compute executes it?" },
  { name: "Knowledge", short: "memory", state: "Dossier opened", body: "What belongs outside the weights?" },
  { name: "Deployment", short: "joules", state: "Evidence only", body: "What hardware is necessary?" },
] as const;

export default function CapacityField() {
  const [selected, setSelected] = useState(0);
  const current = FORMS[selected];

  return (
    <div className={styles.capacityField}>
      <div className={styles.fieldHeader}>
        <span>Capacity field</span>
        <span>select a form</span>
      </div>
      <div className={styles.fieldGrid} role="tablist" aria-label="Seven forms of capability efficiency">
        {FORMS.map((form, index) => {
          const measured = index < 2;
          const active = selected === index;
          return (
            <button
              className={[styles.fieldColumn, active ? styles.fieldActive : ""].join(" ")}
              key={form.name}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={form.name + ": " + form.state}
              onClick={() => setSelected(index)}
              onFocus={() => setSelected(index)}
              onMouseEnter={() => setSelected(index)}
            >
              <span className={styles.fieldIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.fieldBlocks} aria-hidden="true">
                {Array.from({ length: 6 }, (_, row) => (
                  <i
                    className={[
                      styles.fieldBlock,
                      measured && row < 5 ? styles.fieldMeasured : "",
                      active ? styles.fieldSelected : "",
                    ].join(" ")}
                    key={row}
                  />
                ))}
              </span>
              <strong>{form.short}</strong>
            </button>
          );
        })}
      </div>
      <div className={styles.fieldReadout} aria-live="polite">
        <span>{String(selected + 1).padStart(2, "0")} / {current.name}</span>
        <b>{current.state}</b>
        <em>{current.body}</em>
      </div>
    </div>
  );
}
