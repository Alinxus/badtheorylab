import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

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

  const { error } = await supabase.from("reasoning_test_responses").insert({
    participant_id: payload.participantId,
    score: payload.score,
    total: payload.total,
    answers: JSON.stringify(payload.answers),
    user_agent: payload.userAgent,
  });

  if (error) {
    console.error("supabase insert error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured." }, { status: 500 });

  const { data, error } = await supabase
    .from("reasoning_test_responses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("supabase query error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
