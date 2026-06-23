import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// anonymous presence heartbeat. the browser pings this every ~20s with a
// random session id it keeps in sessionStorage — no cookies, no pii. we just
// bump last_seen so /api/stats can count who's around right now.

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(req: Request) {
  const db = getSupabase();
  if (!db) return NextResponse.json({ ok: false, configured: false }, { status: 200 });

  let body: { sessionId?: string; path?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const sid = (body.sessionId || "").trim();
  // sane-length guard so nobody stuffs the table with garbage keys
  if (!sid || sid.length < 8 || sid.length > 64) {
    return NextResponse.json({ error: "missing session" }, { status: 400 });
  }
  const path = (body.path || "/").slice(0, 256);
  const ua = (req.headers.get("user-agent") || "").slice(0, 256);
  const now = new Date().toISOString();

  // read-modify-write on the hit counter. it's a vanity total so the odd lost
  // increment under a race doesn't matter — we're not billing anyone on it.
  const existing = await db
    .from("site_presence")
    .select("hits")
    .eq("session_id", sid)
    .maybeSingle();

  if (existing.error) {
    console.error("presence read error:", existing.error);
    return NextResponse.json({ error: existing.error.message }, { status: 500 });
  }

  if (existing.data) {
    const { error } = await db
      .from("site_presence")
      .update({ last_seen: now, hits: (existing.data.hits || 0) + 1, path })
      .eq("session_id", sid);
    if (error) {
      console.error("presence update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await db.from("site_presence").insert({
      session_id: sid,
      first_seen: now,
      last_seen: now,
      hits: 1,
      path,
      user_agent: ua,
    });
    // unique-violation = another tab inserted first; that's fine, ignore it
    if (error && error.code !== "23505") {
      console.error("presence insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, configured: true });
}
