"use client";

import { useEffect, useState } from "react";
import styles from "@/app/home-signal.module.css";

const SIGNALS = [
  {
    label: "Representation",
    value: "77.1 → 95.8",
    unit: "behaviour retained",
    detail: "Same byte budget. Range selection changed what the bits could preserve.",
  },
  {
    label: "Architecture",
    value: "49.4 vs 23",
    unit: "recovery",
    detail: "3M-parameter experts recovered more behaviour than 190M dense matrices.",
  },
  {
    label: "Deployment",
    value: "31.9",
    unit: "tokens / second",
    detail: "BTL-4 Compact decoding on an M4 with the full model offloaded to Metal.",
  },
  {
    label: "Tinfield 1",
    value: "33.0 / 62.0",
    unit: "TB4 / DeepSWE",
    detail: "Full-suite k=5 scores for the BF16 reference. Runtime serves Compact; its full-suite rerun is still pending.",
  },
] as const;

export default function SignalRail() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const signal = SIGNALS[active];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % SIGNALS.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section className={styles.signalRail} aria-label="Featured BTL signals">
      <div className={styles.signalLead}>
        <span>Featured signal</span>
        <strong>{signal.value}</strong>
        <b>{signal.unit}</b>
      </div>
      <div className={styles.signalCopy}>
        <span>{signal.label}</span>
        <p>{signal.detail}</p>
      </div>
      <div className={styles.signalControls}>
        <div className={styles.signalDots} role="tablist" aria-label="Select featured signal">
          {SIGNALS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              role="tab"
              aria-selected={active === index}
              aria-label={item.label}
              onClick={() => setActive(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <button
          className={styles.signalPause}
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play signal rotation" : "Pause signal rotation"}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>
    </section>
  );
}
