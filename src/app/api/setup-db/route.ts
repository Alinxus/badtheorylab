import { NextResponse } from "next/server";

export async function GET() {
  const sql = `CREATE TABLE IF NOT EXISTS reasoning_test_responses (
  id BIGSERIAL PRIMARY KEY,
  participant_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  return NextResponse.json({
    ok: false,
    message: "Supabase table not found. Run this SQL in your Supabase SQL Editor:",
    sql,
  });
}
