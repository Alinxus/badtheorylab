"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/home.module.css";

// The right-hand rail holds a short sequence. Scrolling the pinned hero walks
// through it, one panel at a time, instead of everything arriving at once.

const PANELS = 2;

export default function HeroRail({ children }: { children: React.ReactNode[] }) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [at, setAt] = useState(0);

  useEffect(() => {
    const stage = holder.current?.closest<HTMLElement>("[data-hero-stage]");
    if (!stage) return;

    const read = () => {
      const span = Math.max(stage.offsetHeight - window.innerHeight, 1);
      const p = Math.min(1, Math.max(0, -stage.getBoundingClientRect().top / span));
      stage.style.setProperty("--open", p.toFixed(4));
      // a little past the midpoint so the first panel gets the longer look
      setAt(p < 0.55 ? 0 : 1);
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div className={styles.qRail} ref={holder}>
      <p className={styles.railIndex}>
        <b>{String(at + 1).padStart(2, "0")}</b>
        <i />
        <span>{String(PANELS).padStart(2, "0")}</span>
      </p>

      <div className={styles.slides}>
        {items.map((node, i) => (
          <div
            key={i}
            className={styles.slide}
            data-on={i === at ? "1" : "0"}
            data-past={i < at ? "1" : "0"}
            aria-hidden={i === at ? undefined : true}
          >
            {node}
          </div>
        ))}
      </div>

      <div className={styles.railFoot}>
        {items.map((_, i) => (
          <span key={i} className={styles.railTick} data-on={i === at ? "1" : "0"} />
        ))}
        <span className={styles.railHint}>{at === 0 ? "Keep scrolling" : "Latest"}</span>
      </div>
    </div>
  );
}
