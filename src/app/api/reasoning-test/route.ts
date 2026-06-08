import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  let payload: {
    participantId: string;
    score: number;
    total: number;
    answers: { questionId: string; chosen: number; correct: boolean }[];
    timestamp: string;
    userAgent: string;
  };

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (typeof payload.score !== "number" || typeof payload.total !== "number") {
    return NextResponse.json({ error: "Score and total required." }, { status: 400 });
  }

  try {
    await sql`
      INSERT INTO reasoning_test_responses (participant_id, score, total, answers, user_agent)
      VALUES (${payload.participantId}, ${payload.score}, ${payload.total}, ${JSON.stringify(payload.answers)}, ${payload.userAgent})
    `;
  } catch (err) {
    console.error("db insert error:", err);
    return NextResponse.json({ error: "Unable to save response." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  try {
    const { rows } = await sql`SELECT id, participant_id, score, total, answers, user_agent, created_at FROM reasoning_test_responses ORDER BY created_at DESC`;
    return NextResponse.json(rows);
  } catch (err) {
    console.error("db query error:", err);
    return NextResponse.json({ error: "Unable to fetch responses." }, { status: 500 });
  }
}
