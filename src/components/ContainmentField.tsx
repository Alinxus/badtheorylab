"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/home-audience.module.css";

// The whole pitch is that nothing leaves the perimeter. So the card holds a
// field that visibly cannot get out: every particle that reaches an edge is
// turned back, and the counter for escapes stays where it started.

type Dot = { x: number; y: number; vx: number; vy: number; r: number };
type Hit = { x: number; y: number; t: number };

export default function ContainmentField({
  count = 34,
  speed = 1,
  children,
}: {
  count?: number;
  speed?: number;
  children: React.ReactNode;
}) {
  const holder = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const hot = useRef(false);
  const [bounces, setBounces] = useState(0);

  useEffect(() => {
    const box = holder.current;
    const cv = canvas.current;
    if (!box || !cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rng = (seed: number) => () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const rand = rng(count * 7919);

    // the card inverts with the theme, so take the ink from the card itself
    let fg = "236,238,233";
    const readFg = () => {
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(box).color);
      if (m) fg = `${m[1]},${m[2]},${m[3]}`;
    };

    const PAD = 14;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let hitCount = 0;
    let dots: Dot[] = [];
    let hits: Hit[] = [];

    const fit = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(r.width, 1);
      h = Math.max(r.height, 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readFg();
      if (!dots.length) {
        dots = Array.from({ length: count }, () => {
          const a = rand() * Math.PI * 2;
          const s = (10 + rand() * 22) * speed;
          return {
            x: PAD + rand() * (w - PAD * 2),
            y: PAD + rand() * (h - PAD * 2),
            vx: Math.cos(a) * s,
            vy: Math.sin(a) * s,
            r: rand() < 0.16 ? 2.2 : 1.3,
          };
        });
      }
    };

    const frame = (now: number) => {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const boost = hot.current ? 1.55 : 1;

      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        if (!still) {
          d.x += d.vx * dt * boost;
          d.y += d.vy * dt * boost;
        }
        // the edge turns everything back. nothing gets out.
        if (d.x < PAD) { d.x = PAD; d.vx = Math.abs(d.vx); hits.push({ x: PAD, y: d.y, t: now }); hitCount++; }
        else if (d.x > w - PAD) { d.x = w - PAD; d.vx = -Math.abs(d.vx); hits.push({ x: w - PAD, y: d.y, t: now }); hitCount++; }
        if (d.y < PAD) { d.y = PAD; d.vy = Math.abs(d.vy); hits.push({ x: d.x, y: PAD, t: now }); hitCount++; }
        else if (d.y > h - PAD) { d.y = h - PAD; d.vy = -Math.abs(d.vy); hits.push({ x: d.x, y: h - PAD, t: now }); hitCount++; }

        ctx.fillStyle = hot.current ? "rgba(255,77,0,.7)" : `rgba(${fg},.34)`;
        ctx.fillRect(d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
      }

      // the perimeter, and a flare wherever something just struck it
      ctx.strokeStyle = hot.current ? "rgba(255,77,0,.5)" : `rgba(${fg},.16)`;
      ctx.lineWidth = 1;
      ctx.strokeRect(PAD + 0.5, PAD + 0.5, w - PAD * 2 - 1, h - PAD * 2 - 1);

      hits = hits.filter((k) => now - k.t < 620);
      for (const k of hits) {
        const a = 1 - (now - k.t) / 620;
        ctx.fillStyle = `rgba(255,77,0,${(a * 0.85).toFixed(3)})`;
        const s = 3 + a * 5;
        ctx.fillRect(k.x - s / 2, k.y - s / 2, s, s);
      }

      raf = window.requestAnimationFrame(frame);
    };

    fit();
    raf = window.requestAnimationFrame(frame);
    const tick = window.setInterval(() => setBounces(hitCount), 400);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    const on = () => { hot.current = true; };
    const off = () => { hot.current = false; };
    box.addEventListener("pointerenter", on);
    box.addEventListener("pointerleave", off);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearInterval(tick);
      ro.disconnect();
      box.removeEventListener("pointerenter", on);
      box.removeEventListener("pointerleave", off);
    };
  }, [count, speed]);

  return (
    <div className={styles.contain} ref={holder}>
      <canvas ref={canvas} className={styles.containCanvas} aria-hidden="true" />
      <p className={styles.containMeter} aria-hidden="true">
        <span>turned back at the edge <b>{bounces.toLocaleString()}</b></span>
        <span>left the perimeter <b className={styles.zero}>0</b></span>
      </p>
      {children}
    </div>
  );
}
