import { NextResponse } from "next/server";
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

type ResultPayload = {
  participantId: string;
  score: number;
  total: number;
  answers: { questionId: string; chosen: number; correct: boolean }[];
  timestamp: string;
  userAgent: string;
};

export async function POST(req: Request) {
  let payload: ResultPayload;

  try {
    payload = (await req.json()) as ResultPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  if (typeof payload.score !== "number" || typeof payload.total !== "number") {
    return NextResponse.json({ error: "Score and total required." }, { status: 400 });
  }

  const resultsDir = join(process.cwd(), "results");
  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });

  const line = JSON.stringify(payload) + "\n";
  try {
    appendFileSync(join(resultsDir, "reasoning-test-responses.ndjson"), line, "utf-8");
  } catch {
    return NextResponse.json({ error: "Unable to save response." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
