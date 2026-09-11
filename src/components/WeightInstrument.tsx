"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type WheelEvent,
} from "react";
import styles from "@/app/home-instrument.module.css";
import { WEIGHT_SAMPLE_B64 } from "./weight-sample";

const VIEWBOX_WIDTH = 560;
const VIEWBOX_HEIGHT = 314;
const X0 = 112;
const X1 = 552;
const PLOT_WIDTH = X1 - X0;
const VLO = -0.062;
const VHI = 0.062;
const HISTOGRAM_BINS = 120;
const TENSOR_MIN = -0.226562;
const TENSOR_MAX = 0.228516;
const TENSOR_VALUES = 22_020_096;
const SAMPLE_VALUES = 14_000;

const DEPTHS = [
  { count: 3, label: "1.58" },
  { count: 5, label: "2.32" },
  { count: 9, label: "3.17" },
  { count: 17, label: "4.09" },
] as const;

type Depth = (typeof DEPTHS)[number]["count"];

type Measurement = {
  error: number;
  shares: number[];
  step: number;
  positions: number[];
};

type Distribution = {
  values: Float32Array;
  sorted: Float32Array;
  histogram: number[];
  sampleMin: number;
  sampleMax: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function decodeSample(base64: string) {
  const binary = window.atob(base64);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const view = new DataView(bytes.buffer);
  const values = new Float32Array(bytes.byteLength / 2);

  for (let i = 0; i < values.length; i += 1) {
    values[i] = view.getInt16(i * 2, true) / 20_000;
  }

  return values;
}

function percentile(sorted: Float32Array, percentage: number) {
  if (sorted.length === 0) return 0;
  const index = Math.round((clamp(percentage, 0, 100) / 100) * (sorted.length - 1));
  return sorted[index];
}

function buildDistribution(values: Float32Array): Distribution {
  const sorted = Float32Array.from(values);
  sorted.sort();

  const counts = new Array<number>(HISTOGRAM_BINS).fill(0);
  for (const value of values) {
    const index = clamp(
      Math.floor(((value - VLO) / (VHI - VLO)) * HISTOGRAM_BINS),
      0,
      HISTOGRAM_BINS - 1,
    );
    counts[index] += 1;
  }

  const highest = Math.max(...counts, 1);
  return {
    values,
    sorted,
    histogram: counts.map((count) => Math.pow(count / highest, 0.6)),
    sampleMin: sorted[0] ?? 0,
    sampleMax: sorted[sorted.length - 1] ?? 0,
  };
}

function measure(values: Float32Array, low: number, high: number, count: number): Measurement {
  const safeHigh = high > low ? high : low + 0.000001;
  const step = (safeHigh - low) / (count - 1);
  const shares = new Array<number>(count).fill(0);
  let error = 0;

  for (const value of values) {
    const clipped = clamp(value, low, safeHigh);
    const level = clamp(Math.round((clipped - low) / step), 0, count - 1);
    const quantized = low + level * step;
    shares[level] += 1;
    error += Math.abs(quantized - value);
  }

  return {
    error: values.length ? error / values.length : 0,
    shares: shares.map((share) => share / Math.max(values.length, 1)),
    step,
    positions: Array.from({ length: count }, (_, index) => low + index * step),
  };
}

function xToValue(x: number) {
  return VLO + ((clamp(x, X0, X1) - X0) / PLOT_WIDTH) * (VHI - VLO);
}

function xToClip(x: number, sorted: Float32Array) {
  const magnitude = Math.abs(xToValue(x));
  let low = 50;
  let high = 100;

  for (let i = 0; i < 24; i += 1) {
    const candidate = (low + high) / 2;
    const band = Math.max(
      Math.abs(percentile(sorted, candidate)),
      Math.abs(percentile(sorted, 100 - candidate)),
    );
    if (band < magnitude) low = candidate;
    else high = candidate;
  }

  return clamp((low + high) / 2, 50, 100);
}

function Panel({
  top,
  histogram,
  measurement,
  title,
  subtitle,
  color,
}: {
  top: number;
  histogram: number[];
  measurement: Measurement;
  title: string;
  subtitle: string;
  color: string;
}) {
  const height = 100;
  const baseline = top + height;
  const barWidth = PLOT_WIDTH / histogram.length;
  const showLabels = measurement.positions.length <= 5;

  return (
    <g>
      <text className={styles.svgLabel} x="0" y={top + 10} fill={color}>{title}</text>
      <text className={styles.svgLabel} x="0" y={top + 24} fill="var(--ink-3)">
        {subtitle}
      </text>

      {histogram.map((heightRatio, index) => {
        const heightValue = heightRatio * (height - 16);
        return heightValue < 0.4 ? null : (
          <rect
            key={`hist-${top}-${index}`}
            x={(X0 + index * barWidth).toFixed(2)}
            y={(baseline - heightValue).toFixed(2)}
            width={Math.max(barWidth - 0.5, 0.5).toFixed(2)}
            height={heightValue.toFixed(2)}
            fill="var(--rule-2)"
            opacity="0.42"
          />
        );
      })}

      <line
        x1={X0}
        x2={X1}
        y1={baseline}
        y2={baseline}
        stroke="var(--rule-2)"
        strokeWidth="1"
      />

      {measurement.positions.map((position, index) => {
        const share = measurement.shares[index] ?? 0;
        const live = share > 0.02;
        if (position < VLO || position > VHI) {
          const edge = position < VLO ? X0 - 6 : X1 + 6;
          return (
            <path
              key={`edge-${top}-${index}`}
              d={position < VLO
                ? `M${edge + 4} ${baseline - 12} L${edge - 2} ${baseline - 6} L${edge + 4} ${baseline}`
                : `M${edge - 4} ${baseline - 12} L${edge + 2} ${baseline - 6} L${edge - 4} ${baseline}`}
              fill="none"
              stroke="var(--ink-3)"
              strokeWidth="1"
            />
          );
        }

        const x = X0 + ((position - VLO) / (VHI - VLO)) * PLOT_WIDTH;
        return (
          <g key={`level-${top}-${index}`}>
            <line
              x1={x}
              x2={x}
              y1={baseline}
              y2={top + 30}
              stroke={live ? color : "var(--ink-3)"}
              strokeWidth={live ? "1.5" : "1"}
              strokeDasharray={live ? undefined : "2 3"}
            />
            {live ? (
              <>
                <rect
                  x={x - 3.5}
                  y={baseline - Math.max(share * 46, 4)}
                  width="7"
                  height={Math.max(share * 46, 4)}
                  fill={color}
                />
                {showLabels ? (
                  <text
                    className={styles.svgValue}
                    x={x}
                    y={baseline + 13}
                    fill="var(--ink-2)"
                    textAnchor="middle"
                  >
                    {(share * 100).toFixed(1)}
                  </text>
                ) : null}
              </>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}

export default function WeightInstrument() {
  const [weights, setWeights] = useState<Float32Array | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [clip, setClip] = useState(92);
  const [depth, setDepth] = useState<Depth>(5);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        setWeights(decodeSample(WEIGHT_SAMPLE_B64));
      } catch {
        setLoadError(true);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const distribution = useMemo(
    () => (weights ? buildDistribution(weights) : null),
    [weights],
  );

  const reading = useMemo(() => {
    if (!distribution) return null;

    const naive = measure(distribution.values, TENSOR_MIN, TENSOR_MAX, depth);
    const low = percentile(distribution.sorted, 100 - clip);
    const high = percentile(distribution.sorted, clip);
    const selected = measure(distribution.values, low, high, depth);
    const improvement = naive.error
      ? (1 - selected.error / naive.error) * 100
      : 0;

    return { naive, selected, low, high, improvement };
  }, [clip, depth, distribution]);

  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (!distribution) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH, 0, VIEWBOX_WIDTH);
    setHoverX(x);
    setClip(Number(xToClip(x, distribution.sorted).toFixed(1)));
  };

  const handleWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    setClip((value) => clamp(Number((value + (event.deltaY < 0 ? 1 : -1)).toFixed(1)), 50, 100));
  };

  const handleKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    setClip((value) => clamp(value + (event.key === "ArrowRight" ? 0.5 : -0.5), 50, 100));
  };

  return (
    <figure className={styles.instrument}>
      <span className={styles.registration} aria-hidden="true" />
      <figcaption className={styles.figureLabel}>
        <b>Fig. 01</b>
        <i />
        <span>BTL weight tensor · {SAMPLE_VALUES.toLocaleString()} sampled values</span>
        <strong>Operate it</strong>
      </figcaption>

      {loadError ? (
        <div className={styles.instrumentError} role="status">
          The tensor sample could not be loaded in this browser.
        </div>
      ) : reading && distribution ? (
        <>
          <svg
            className={styles.chart}
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            role="img"
            aria-label="Interactive comparison of naive and selected quantization ranges on a real BTL weight tensor"
            tabIndex={0}
            onPointerDown={(event) => {
              setDragging(true);
              event.currentTarget.setPointerCapture(event.pointerId);
              updateFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (dragging) updateFromPointer(event);
              else {
                const rect = event.currentTarget.getBoundingClientRect();
                setHoverX(clamp(((event.clientX - rect.left) / rect.width) * VIEWBOX_WIDTH, 0, VIEWBOX_WIDTH));
              }
            }}
            onPointerUp={(event) => {
              setDragging(false);
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
            onPointerLeave={() => {
              if (!dragging) setHoverX(null);
            }}
            onDoubleClick={() => setClip(92)}
            onWheel={handleWheel}
            onKeyDown={handleKeyDown}
          >
            <Panel
              top={4}
              histogram={distribution.histogram}
              measurement={reading.naive}
              title="NAIVE RANGE"
              subtitle={`full tensor extremes · ${TENSOR_MIN.toFixed(3)} to ${TENSOR_MAX.toFixed(3)}`}
              color="var(--ink-2)"
            />
            <Panel
              top={176}
              histogram={distribution.histogram}
              measurement={reading.selected}
              title="YOUR RANGE"
              subtitle={`${clip.toFixed(1)}th percentile on each side`}
              color="var(--signal)"
            />
            {hoverX !== null && hoverX > X0 && hoverX < X1 ? (
              <g pointerEvents="none">
                <line
                  x1={hoverX}
                  x2={hoverX}
                  y1="0"
                  y2={VIEWBOX_HEIGHT}
                  stroke="var(--ink-3)"
                  strokeWidth="0.7"
                  strokeDasharray="2 4"
                />
                <text
                  className={styles.svgValue}
                  x={Math.min(hoverX + 5, X1 - 42)}
                  y="10"
                  fill="var(--ink-3)"
                >
                  {xToValue(hoverX).toFixed(4)}
                </text>
              </g>
            ) : null}
          </svg>

          <div className={styles.instrumentHint}>
            Drag the plot · scroll to trim · double-click to reset
          </div>

          <div className={styles.controls}>
            <div className={styles.controlRow}>
              <label className={styles.mono} htmlFor="tensor-clip">Clip</label>
              <input
                id="tensor-clip"
                type="range"
                min="50"
                max="100"
                step="0.5"
                value={clip}
                onChange={(event) => setClip(Number(event.target.value))}
                aria-label="Clipping percentile for the selected quantization range"
              />
              <span className={styles.controlValue}>{clip.toFixed(1)}%</span>
            </div>
            <div className={styles.controlRow}>
              <span className={styles.mono}>Depth</span>
              <div className={styles.segment} role="group" aria-label="Quantization levels">
                {DEPTHS.map((option) => (
                  <button
                    key={option.count}
                    type="button"
                    aria-pressed={depth === option.count}
                    onClick={() => setDepth(option.count)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <span className={styles.controlValue}>bpw</span>
            </div>
            <button
              type="button"
              className={styles.reset}
              onClick={() => {
                setClip(92);
                setDepth(5);
              }}
            >
              Reset instrument
            </button>
          </div>

          <div className={styles.readout} aria-live="polite">
            <span className={styles.readoutBig}>{reading.selected.error.toFixed(5)}</span>
            <span className={styles.readoutUnit}>mean absolute error</span>
            <span className={styles.readoutBigSignal}>{Math.abs(reading.improvement).toFixed(1)}</span>
            <span className={styles.readoutUnit}>
              {reading.improvement >= 0 ? "% below naive range" : "% worse than naive"}
            </span>
          </div>
        </>
      ) : (
        <div className={styles.instrumentLoading} role="status">Reading the tensor sample…</div>
      )}

      <ul className={styles.conditions}>
        <li>{TENSOR_VALUES.toLocaleString()} values in the source tensor</li>
        <li>{SAMPLE_VALUES.toLocaleString()} values carried into the browser</li>
        <li>same quantization levels · no calibration corpus</li>
      </ul>
    </figure>
  );
}
