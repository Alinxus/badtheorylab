import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type RewardPayload = {
  claimType?: string;
  name?: string;
  email?: string;
  product?: string;
  platform?: string;
  reviewUrl?: string;
  wallet?: string;
  summary?: string;
};

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function validHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let payload: RewardPayload;
  try {
    payload = (await req.json()) as RewardPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const claimType = payload.claimType?.trim() || "review";
  const name = payload.name?.trim() || "";
  const email = payload.email?.trim().toLowerCase() || "";
  const product = payload.product?.trim() || "";
  const platform = payload.platform?.trim() || "";
  const reviewUrl = payload.reviewUrl?.trim() || "";
  const wallet = payload.wallet?.trim() || "";
  const summary = payload.summary?.trim() || "";

  if (claimType !== "review") {
    return NextResponse.json({ error: "Unsupported reward claim type." }, { status: 400 });
  }
  if (!name || !validEmail(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }
  if (!product || !platform) {
    return NextResponse.json({ error: "Product and review platform are required." }, { status: 400 });
  }
  if (!validHttpUrl(reviewUrl)) {
    return NextResponse.json({ error: "Paste a public review URL." }, { status: 400 });
  }
  if (wallet.length < 20) {
    return NextResponse.json({ error: "Paste the wallet address for $BTL rewards." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Rewards service is not configured yet." }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("reward_claims")
    .insert({
      claim_type: claimType,
      name,
      email,
      product,
      platform,
      review_url: reviewUrl,
      wallet,
      summary,
      status: "pending",
      user_agent: req.headers.get("user-agent") || "",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That review URL has already been submitted." }, { status: 409 });
    }
    console.error("[rewards] claim insert failed:", error.message, error.code);
    return NextResponse.json(
      { error: "Couldn't save your reward claim. Please try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, claimId: data?.id });
}
