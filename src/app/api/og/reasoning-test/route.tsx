import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#edeeea",
          color: "#0b0c0d",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: "-.03em" }}>Reasoning Test</div>
        <div
          style={{
            fontSize: 22,
            color: "#5c5954",
            marginTop: 16,
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            fontWeight: 300,
          }}
        >
          BTL · Causal Reasoning Benchmark
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 24,
            fontSize: 16,
            color: "#62696d",
            fontFamily: "ui-monospace, Menlo, monospace",
          }}
        >
          <span>12 questions</span>
          <span>·</span>
          <span>~5 min</span>
          <span>·</span>
          <span>public results</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
