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
          background: "#fafaf9",
          color: "#0e0d0c",
          fontFamily: '"EB Garamond", serif',
        }}
      >
        <div style={{ fontSize: 64, fontWeight: 500, letterSpacing: "-.03em" }}>Reasoning Test</div>
        <div
          style={{
            fontSize: 22,
            color: "#5c5954",
            marginTop: 16,
            fontFamily: '"DM Sans", sans-serif',
            fontWeight: 300,
          }}
        >
          Bad Theory Labs · Causal Reasoning Benchmark
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            gap: 24,
            fontSize: 16,
            color: "#9c9890",
            fontFamily: '"JetBrains Mono", monospace',
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
