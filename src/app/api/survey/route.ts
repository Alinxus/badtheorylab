import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SurveyPayload = {
  email?: string;
  stage?: string;
  blocker?: string;
  feedback?: string;
};

const STAGES = new Set([
  "not_started",
  "signed_up",
  "has_key",
  "sent_requests",
  "paying",
]);

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(req: Request) {
  let payload: SurveyPayload;
  try {
    payload = (await req.json()) as SurveyPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase() || "";
  const stage = payload.stage?.trim() || "";
  const blocker = payload.blocker?.trim() || "";
  const feedback = payload.feedback?.trim() || "";

  if (email && !validEmail(email)) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  if (!STAGES.has(stage)) {
    return NextResponse.json({ error: "Pick where you're at with Runtime." }, { status: 400 });
  }
  if (blocker.length < 3) {
    return NextResponse.json({ error: "Tell us what's stopping you — a sentence is enough." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Survey isn't wired up yet." }, { status: 500 });
  }

  const { error } = await supabase.from("runtime_survey_responses").insert({
    email,
    stage,
    blocker,
    feedback,
    user_agent: req.headers.get("user-agent") || "",
  });

  if (error) {
    console.error("[survey] insert failed:", error.message, error.code);
    return NextResponse.json({ error: "Couldn't save that, try again in a bit." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
