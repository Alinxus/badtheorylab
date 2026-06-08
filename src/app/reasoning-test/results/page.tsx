'use client';

import { useState, useEffect } from "react";
import Link from "next/link";

type Response = {
  id: number;
  participant_id: string;
  score: number;
  total: number;
  answers: { questionId: string; chosen: number; correct: boolean }[];
  user_agent: string;
  created_at: string;
};

export default function ResultsPage() {
  const [rows, setRows] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/reasoning-test");
        if (!r.ok) throw new Error(await r.text());
        setRows(await r.json());
      } catch (e: any) {
        setErr(e.message || "failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalAnswered = rows.reduce((s, r) => s + r.total, 0);
  const totalCorrect = rows.reduce((s, r) => s + r.score, 0);

  return (
    <main style={{ minHeight: "100vh", background: "#fafaf9", color: "#0e0d0c", fontFamily: "'DM Sans', sans-serif", padding: "40px 20px" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 20, height: 56, borderBottom: "1px solid #e8e6e1", background: "rgba(250,250,249,.88)", backdropFilter: "blur(18px)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 28px", margin: "-40px -20px 28px" }}>
        <Link href="/" style={{ fontFamily: "'EB Garamond', serif", fontSize: 20, color: "#0e0d0c", textDecoration: "none", letterSpacing: "-.02em" }}>Bad Theory Labs</Link>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/" style={{ textDecoration: "none", color: "#5c5954", fontSize: 13 }}>Home</Link>
          <Link href="/papers" style={{ textDecoration: "none", color: "#5c5954", fontSize: 13 }}>Papers</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: 32, fontWeight: 500, marginBottom: 8 }}>Reasoning Test — Results</h1>

        {loading && <p style={{ color: "#5c5954" }}>Loading...</p>}
        {err && <p style={{ color: "#dc2626" }}>{err}</p>}

        {!loading && !err && (
          <>
            <div style={{ display: "flex", gap: 20, marginBottom: 28 }}>
              <div style={{ background: "#fff", border: "1px solid #e8e6e1", borderRadius: 10, padding: "20px 24px", flex: 1 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9c9890", marginBottom: 6 }}>Participants</p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 36, fontWeight: 500, color: "#0e0d0c" }}>{rows.length}</p>
              </div>
              <div style={{ background: "#fff", border: "1px solid #e8e6e1", borderRadius: 10, padding: "20px 24px", flex: 1 }}>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#9c9890", marginBottom: 6 }}>Overall Accuracy</p>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: 36, fontWeight: 500, color: "#0e0d0c" }}>{totalAnswered ? Math.round((totalCorrect / totalAnswered) * 100) : 0}%</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {rows.map(r => (
                <div key={r.id} style={{ background: "#fff", border: "1px solid #e8e6e1", borderRadius: 10, padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "#0e0d0c" }}>{r.participant_id.slice(0, 3)}•••••</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#5c5954" }}>{r.score}/{r.total} ({Math.round((r.score / r.total) * 100)}%)</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9c9890", fontFamily: "'JetBrains Mono', monospace" }}>{new Date(r.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
