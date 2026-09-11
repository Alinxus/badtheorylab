"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/home-audience.module.css";

// Four ways in is a router. So route: a signal leaves the heading and takes a
// right-angled path to whichever door you are looking at, and the other three
// go quiet. Left alone it cycles, so the thing demonstrates itself.

const DWELL = 2600;

type Leg = { d: string; len: number };

export default function AudienceRouter({ children }: { children: React.ReactNode }) {
  const holder = useRef<HTMLDivElement | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);
  const [live, setLive] = useState(0);
  const [leg, setLeg] = useState<Leg | null>(null);
  const held = useRef(false);

  // walk the doors on a timer until someone takes over
  useEffect(() => {
    const t = window.setInterval(() => {
      if (!held.current) setLive((n) => (n + 1) % 4);
    }, DWELL);
    return () => window.clearInterval(t);
  }, []);

  // hovering a card takes the wheel
  useEffect(() => {
    const box = holder.current;
    if (!box) return;
    const cards = Array.from(box.querySelectorAll<HTMLElement>("[data-door]"));

    const enter = (i: number) => () => { held.current = true; setLive(i); };
    const leave = () => { held.current = false; };

    cards.forEach((c, i) => {
      c.addEventListener("pointerenter", enter(i));
      c.addEventListener("pointerleave", leave);
      c.dataset.door = String(i);
    });
    return () => {
      cards.forEach((c, i) => {
        c.removeEventListener("pointerenter", enter(i));
        c.removeEventListener("pointerleave", leave);
      });
    };
  }, []);

  // redraw the route whenever the target or the layout changes
  useEffect(() => {
    const box = holder.current;
    const s = svg.current;
    if (!box || !s) return;

    const draw = () => {
      const src = box.querySelector<HTMLElement>("[data-router-source]");
      const doors = box.querySelectorAll<HTMLElement>("[data-door]");
      const dst = doors[live];
      const grid = dst?.parentElement;
      if (!src || !dst || !grid) return;

      const b = box.getBoundingClientRect();
      const a = src.getBoundingClientRect();
      const c = dst.getBoundingClientRect();
      const g = grid.getBoundingClientRect();

      // only ever travel in gutters: the grid edge, the row divider, then the
      // column divider. cutting across a card looks like a mistake.
      const x0 = a.right - b.left;
      const y0 = a.top - b.top + a.height / 2;
      const gx = g.left - b.left - 14;
      const ry = c.top - b.top;
      const cx = c.left - b.left;
      const cy = c.top - b.top + c.height / 2;

      const d = `M${x0} ${y0} H${gx} V${ry} H${cx} V${cy}`;
      const len =
        Math.abs(gx - x0) + Math.abs(ry - y0) + Math.abs(cx - gx) + Math.abs(cy - ry);
      setLeg({ d, len });
      s.setAttribute("viewBox", `0 0 ${b.width} ${b.height}`);
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(box);
    window.addEventListener("resize", draw);
    return () => { ro.disconnect(); window.removeEventListener("resize", draw); };
  }, [live]);

  return (
    <div className={styles.router} ref={holder} data-live={live}>
      <svg ref={svg} className={styles.routeLayer} aria-hidden="true" preserveAspectRatio="none">
        {leg ? (
          <>
            <path d={leg.d} className={styles.routeGhost} />
            <path
              key={live}
              d={leg.d}
              className={styles.routeLive}
              style={{ strokeDasharray: leg.len, strokeDashoffset: leg.len }}
            />
          </>
        ) : null}
      </svg>
      {children}
    </div>
  );
}
