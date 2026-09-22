"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/home-systems.module.css";

const SYSTEMS = [
  {
    name: "Tinfield",
    kind: "Model family",
    state: "Live on Runtime",
    title: "The open-weight flagship model on Runtime.",
    body: "Tinfield 1 is built for terminal work and long-horizon software engineering. Call it through the same OpenAI-compatible Runtime API used by every other route.",
    facts: [["Terminal-Bench 4.0", "33.0"], ["DeepSWE v1.1", "62.0"], ["price", "$0.15 in · $0.60 out / M"]],
    href: "https://rntm.sh/models/tinfield-1",
    external: true,
  },
  {
    name: "Runtime",
    kind: "Serving layer",
    state: "Running",
    title: "The deployment surface for BTL models.",
    body: "Inference, usage accounting and production controls for models running inside someone else's infrastructure.",
    facts: [["scope", "BTL models"], ["mode", "production API"], ["accounting", "per request"]],
    href: "/runtime",
  },
  {
    name: "RetainDB",
    kind: "Memory layer",
    state: "Live system",
    title: "Persistent context with evidence boundaries.",
    body: "A memory layer that keeps retrieval, scope and working context separate from whatever the model happens to know.",
    facts: [["role", "external memory"], ["focus", "evidence"], ["surface", "managed API"]],
    href: "https://retaindb.com",
    external: true,
  },
  {
    name: "BTL Commercial",
    kind: "Commercial arm",
    state: "Open",
    title: "Contract the lab for a defined AI problem.",
    body: "Applied research, model development and deployment for governments and enterprises working under hard operating constraints.",
    facts: [["clients", "government + enterprise"], ["deployment", "client-controlled"], ["scope", "measured outcome"]],
    href: "/contact",
  },
] as const;

const PATTERNS = [
  [2, 2, 1, 0, 0, 2, 1, 2, 0, 0, 1, 1, 2, 2, 0, 1, 0, 2, 2, 1],
  [0, 2, 0, 1, 2, 1, 1, 2, 2, 0, 1, 0, 2, 1, 2, 1, 0, 2, 0, 1],
  [1, 0, 2, 2, 0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 1, 2, 1, 0],
  [2, 1, 2, 0, 1, 0, 2, 2, 1, 2, 0, 1, 2, 1, 0, 2, 0, 1, 2, 2],
] as const;

function Arrow() {
  return <span aria-hidden="true">↗︎</span>;
}

function SystemVisual({ active }: { active: number }) {
  const pattern = PATTERNS[active];
  return (
    <svg viewBox="0 0 500 420" role="img" aria-label={SYSTEMS[active].name + " system map"}>
      <rect width="500" height="420" fill="#171a19" />
      <g stroke="rgba(247,247,240,.11)" strokeWidth="1" shapeRendering="crispEdges">
        {[50, 150, 250, 350, 450].map((x) => <line key={"x" + x} x1={x} x2={x} y1="0" y2="420" />)}
        {[70, 170, 270, 370].map((y) => <line key={"y" + y} x1="0" x2="500" y1={y} y2={y} />)}
      </g>
      {pattern.map((tone, index) => {
        const col = index % 5;
        const row = Math.floor(index / 5);
        const color = tone === 2 ? "#FF4D00" : tone === 1 ? "#65706a" : "#252b28";
        return (
          <rect
            className={styles.systemTile}
            key={index}
            x={col * 100 + 9}
            y={row * 70 + 9}
            width="82"
            height="52"
            fill={color}
          />
        );
      })}
      <path d="M32 390H468" stroke="#FF4D00" strokeWidth="2" />
      <text className={styles.systemVisualLabel} x="24" y="32">{SYSTEMS[active].kind.toUpperCase()}</text>
      <text className={styles.systemVisualSignal} x="468" y="390" textAnchor="end">BTL / 0{active + 1}</text>
    </svg>
  );
}

export default function SystemDeck() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const system = SYSTEMS[active];

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % SYSTEMS.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div className={styles.systemDeck}>
      <div className={styles.systemTabs} role="tablist" aria-label="BTL systems">
        {SYSTEMS.map((item, index) => (
          <button
            className={styles.systemTab}
            key={item.name}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls="system-detail"
            onClick={() => setActive(index)}
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
          >
            <span className={styles.systemTabIndex}>0{index + 1}</span>
            <span className={styles.systemTabName}>{item.name}</span>
            <span className={styles.systemTabState}>{item.state}</span>
          </button>
        ))}
        <button
          className={styles.systemPanelPause}
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play system rotation" : "Pause system rotation"}
        >
          {paused ? "Play rotation" : "Pause rotation"}
        </button>
      </div>
      <article className={styles.systemPanel} id="system-detail" role="tabpanel" key={system.name}>
        <div>
          <span className={styles.systemPanelKicker}>{system.kind} · {system.state}</span>
          <h3>{system.name}</h3>
          <p className={styles.systemPanelTitle}>{system.title}</p>
          <p className={styles.systemPanelBody}>{system.body}</p>
          <div className={styles.systemPanelFacts}>
            {system.facts.map(([label, value]) => (
              <div key={label}><span>{label}</span><b>{value}</b></div>
            ))}
          </div>
          {"external" in system && system.external ? (
            <a className={styles.systemPanelLink} href={system.href} target="_blank" rel="noreferrer">
              Open {system.name} <Arrow />
            </a>
          ) : (
            <Link className={styles.systemPanelLink} href={system.href}>
              Explore {system.name} <Arrow />
            </Link>
          )}
        </div>
        <div className={styles.systemVisual}>
          <SystemVisual active={active} />
        </div>
      </article>
    </div>
  );
}
