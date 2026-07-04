import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isJudgeAuthed } from "../../../admin/adminAuth";

type ScorePayload = {
  submissionId?: string;
  runtimeUsage?: number;
  usefulness?: number;
  execution?: number;
  creativity?: number;
  demoClarity?: number;
  runtimeVerified?: boolean;
  spotPrize?: boolean;
  notes?: string;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

const clamp = (v: unknown, max: number) => {
  const n = Math.round(Number(v) || 0);
  return Math.max(0, Math.min(max, n));
};

export async function POST(req: Request) {
  if (!(await isJudgeAuthed())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  let payload: ScorePayload;
  try {
    payload = (await req.json()) as ScorePayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!payload.submissionId) {
    return NextResponse.json({ error: "submissionId required." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Scoring service not configured." }, { status: 500 });
  }

  const row = {
    submission_id: payload.submissionId,
    runtime_usage: clamp(payload.runtimeUsage, 30),
    usefulness: clamp(payload.usefulness, 25),
    execution: clamp(payload.execution, 20),
    creativity: clamp(payload.creativity, 15),
    demo_clarity: clamp(payload.demoClarity, 10),
    runtime_verified: Boolean(payload.runtimeVerified),
    spot_prize: Boolean(payload.spotPrize),
    notes: (payload.notes || "").slice(0, 4000),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("hackathon_scores")
    .upsert(row, { onConflict: "submission_id" });

  if (error) {
    console.error("[hackathon/score] upsert failed:", error.message, error.code);
    return NextResponse.json({ error: "Couldn't save score." }, { status: 502 });
  }

  const total = row.runtime_usage + row.usefulness + row.execution + row.creativity + row.demo_clarity;
  return NextResponse.json({ ok: true, total });
}
