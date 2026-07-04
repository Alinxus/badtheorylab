'use client';

import { useState } from "react";

export default function JudgeLogin({ configured }: { configured: boolean }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed.");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <main style={wrap}>
      <form onSubmit={onSubmit} style={card}>
        <div style={{ fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#9C9890" }}>
          Bad Theory Labs · Judging
        </div>
        <h1 style={{ margin: "10px 0 4px", fontSize: 24 }}>Judge dashboard</h1>
        <p style={{ color: "#5C5954", fontSize: 14, margin: "0 0 18px" }}>
          {configured
            ? "Enter the judge password to review submissions."
            : "Set ADMIN_JUDGE_PASSWORD in the environment to enable access."}
        </p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Judge password"
          autoFocus
          disabled={!configured}
          style={input}
        />
        {error && <p style={{ color: "#b3402e", fontSize: 14, margin: "10px 0 0" }}>{error}</p>}
        <button type="submit" disabled={busy || !configured} style={button}>
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </main>
  );
}

const wrap: React.CSSProperties = {
  minHeight: "100vh", background: "#FAFAF9", display: "flex",
  alignItems: "center", justifyContent: "center", fontFamily: "system-ui,-apple-system,sans-serif",
};
const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #E8E6E1", borderRadius: 14,
  padding: 28, width: 360, boxShadow: "0 4px 24px rgba(0,0,0,.04)",
};
const input: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1px solid #D6D3CC", borderRadius: 10,
  padding: "11px 13px", fontSize: 15, outline: "none",
};
const button: React.CSSProperties = {
  width: "100%", marginTop: 14, background: "#0E0D0C", color: "#fff", border: "none",
  borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 600, cursor: "pointer",
};
