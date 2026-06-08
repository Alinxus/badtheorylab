import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reasoning_test_responses (
        id SERIAL PRIMARY KEY,
        participant_id TEXT NOT NULL,
        score INTEGER NOT NULL,
        total INTEGER NOT NULL,
        answers JSONB NOT NULL,
        user_agent TEXT DEFAULT '',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    return NextResponse.json({ ok: true, message: "Table ready" });
  } catch (err) {
    console.error("setup-db error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
