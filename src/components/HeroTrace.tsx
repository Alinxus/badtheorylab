"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/app/home.module.css";
import { WEIGHT_SAMPLE_B64 } from "./weight-sample";

// Two traces of the same real weights. The fine one is what the tensor holds,
// the stepped one is what survives five levels. The gap between them is the
// quantity we spend the whole company measuring.

const SCALE = 1 / 20000;
const CLIP_PCT = 92;
const SPAN = 0.058;        // vertical half-range in weight units
const PX_PER_SAMPLE = 17;  // wide enough that one weight is one readable step
const SPEED = 17;          // px per second, so it advances about a sample a second

function decode(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const i16 = new Int16Array(bytes.buffer);
  const out = new Float32Array(i16.length);
  for (let i = 0; i < i16.length; i++) out[i] = i16[i] * SCALE;
  return out;
}

type Readout = { v: number; q: number; clipped: boolean } | null;


export default function HeroTrace() {
  const holder = useRef<HTMLDivElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef<number | null>(null);
  const [readout, setReadout] = useState<Readout>(null);
  const [levels, setLevels] = useState(5);
  const [err, setErr] = useState(0);
  const levelsRef = useRef(5);
  const reportedRef = useRef(-1);

  useEffect(() => {
    const cv = canvas.current;
    const box = holder.current;
    if (!cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const W = decode(WEIGHT_SAMPLE_B64);
    if (!W.length) return;

    const sorted = Float32Array.from(W).sort();
    const at = (p: number) => sorted[Math.min(sorted.length - 1, Math.round((p / 100) * (sorted.length - 1)))];
    const lo = at(100 - CLIP_PCT);
    const hi = at(CLIP_PCT);

    // how many levels survive at the current scroll position
    let nLevels = levelsRef.current;
    let step = (hi - lo) / (nLevels - 1);
    const snap = (v: number) => {
      const c = v < lo ? lo : v > hi ? hi : v;
      return lo + Math.round((c - lo) / step) * step;
    };


    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let offset = 0;
    let last = 0;

    const fit = () => {
      const r = box.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(r.width, 1);
      h = Math.max(r.height, 1);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const yOf = (v: number) => h / 2 - (v / SPAN) * (h / 2 - 26);

    const frame = (now: number) => {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!still) offset += SPEED * dt;

      nLevels = levelsRef.current;
      step = (hi - lo) / (nLevels - 1);

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0E0F13";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < nLevels; i++) {
        const y = Math.round(yOf(lo + i * step)) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.strokeStyle = i === (nLevels - 1) / 2 ? "rgba(255,77,0,.28)" : "rgba(247,247,240,.13)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const idxAt = (x: number) => {
        const i = Math.floor((offset + x) / PX_PER_SAMPLE);
        return ((i % W.length) + W.length) % W.length;
      };

      // one sample per step. the stem between the two marks is the error, drawn
      // literally rather than implied by a shaded band.
      const first = Math.floor(offset / PX_PER_SAMPLE);
      const count = Math.ceil(w / PX_PER_SAMPLE) + 2;

      ctx.beginPath();
      for (let k = 0; k <= count; k++) {
        const i = ((first + k) % W.length + W.length) % W.length;
        const x0 = (first + k) * PX_PER_SAMPLE - offset;
        const y = yOf(snap(W[i]));
        ctx.lineTo(x0, y);
        ctx.lineTo(x0 + PX_PER_SAMPLE, y);
      }
      ctx.strokeStyle = "rgba(255,77,0,.9)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      for (let k = 0; k <= count; k++) {
        const i = ((first + k) % W.length + W.length) % W.length;
        const v = W[i];
        const cx = (first + k) * PX_PER_SAMPLE - offset + PX_PER_SAMPLE / 2;
        if (cx < -8 || cx > w + 8) continue;
        const yr = yOf(v);
        const yq = yOf(snap(v));
        const out = v < lo || v > hi;

        ctx.beginPath();
        ctx.moveTo(cx, yq);
        ctx.lineTo(cx, yr);
        ctx.strokeStyle = out ? "rgba(247,247,240,.42)" : "rgba(255,77,0,.34)";
        ctx.lineWidth = out ? 1.4 : 1;
        ctx.stroke();

        ctx.fillStyle = out ? "#F1F1F3" : "rgba(247,247,240,.72)";
        ctx.fillRect(cx - 1.5, yr - 1.5, 3, 3);
      }

      const px = pointer.current;
      if (px !== null && px >= 0 && px <= w) {
        ctx.beginPath();
        ctx.moveTo(Math.round(px) + 0.5, 0);
        ctx.lineTo(Math.round(px) + 0.5, h);
        ctx.strokeStyle = "rgba(247,247,240,.55)";
        ctx.setLineDash([2, 5]);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        const v = W[idxAt(px)];
        ctx.fillStyle = "#F1F1F3";
        ctx.fillRect(px - 2.5, yOf(v) - 2.5, 5, 5);
        ctx.fillStyle = "#FF4D00";
        ctx.fillRect(px - 2.5, yOf(snap(v)) - 2.5, 5, 5);
      }

      if (nLevels !== reportedRef.current) {
        reportedRef.current = nLevels;
        let e = 0;
        for (let i = 0; i < W.length; i++) e += Math.abs(snap(W[i]) - W[i]);
        setErr(e / W.length);
      }

      raf = window.requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left;
      pointer.current = x;
      const i = Math.floor((offset + x) / PX_PER_SAMPLE);
      const v = W[((i % W.length) + W.length) % W.length];
      setReadout({ v, q: snap(v), clipped: v < lo || v > hi });
    };
    const onLeave = () => { pointer.current = null; setReadout(null); };

    fit();
    raf = window.requestAnimationFrame(frame);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(raf);
      ro.disconnect();
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const pick = (n: number) => { levelsRef.current = n; setLevels(n); };

  return (
    <div className={styles.trace} ref={holder}>
      <canvas ref={canvas} className={styles.traceCanvas} aria-hidden="true" />

      <p className={styles.traceTitle}>
        <span>One row of a real model. Every dot is a number it learned.</span>
      </p>

      <div className={styles.traceCtl}>
        <span className={styles.ctlLabel}>Store each number in</span>
        {[[17, "4 bits"], [9, "3 bits"], [5, "2.3 bits"], [3, "1.6 bits"]].map(([n, t]) => (
          <button
            key={n as number}
            type="button"
            onClick={() => pick(n as number)}
            aria-pressed={levels === n}
            className={styles.ctlBtn}
          >
            {t as string}
          </button>
        ))}
      </div>

      <p className={styles.traceKey}>
        <span><i className={styles.keyRaw} />what it learned</span>
        <span><i className={styles.keyQ} />what we keep</span>
        <span><i className={styles.keyGap} />what that costs</span>
        <b className={styles.keyTotal}>
          {levels} possible values &middot; average miss {err.toFixed(4)}
        </b>
      </p>

      <p className={styles.traceRead} data-live={readout ? "1" : "0"}>
        {readout ? (
          <>
            <span>{readout.v >= 0 ? "+" : ""}{readout.v.toFixed(5)}</span>
            <span className={styles.readArrow}>&rarr;</span>
            <b>{readout.q >= 0 ? "+" : ""}{readout.q.toFixed(5)}</b>
            <span className={styles.readErr}>
              {readout.clipped ? "too big to store" : `off by ${Math.abs(readout.v - readout.q).toFixed(5)}`}
            </span>
          </>
        ) : (
          <span className={styles.readHint}>Hover any number</span>
        )}
      </p>

      <span className={styles.traceMark} data-c="tl" aria-hidden="true" />
      <span className={styles.traceMark} data-c="br" aria-hidden="true" />
    </div>
  );
}
