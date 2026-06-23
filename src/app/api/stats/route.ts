import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// live community stats, computed from the anonymous presence table that
// /api/presence writes to. everything here is real — no seeded numbers.

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

const ONLINE_WINDOW_MS = 70_000; // a touch over the 20s client heartbeat * 3 misses

type Row = { last_seen: string; first_seen: string; hits: number | null; path: string | null };

export async function GET() {
  const db = getSupabase();
  if (!db) {
    return NextResponse.json({ configured: false });
  }

  const { data, error } = await db
    .from("site_presence")
    .select("last_seen, first_seen, hits, path")
    .order("last_seen", { ascending: false })
    .limit(100_000);

  if (error) {
    console.error("stats query error:", error);
    return NextResponse.json({ configured: true, error: error.message }, { status: 500 });
  }

  const rows = (data || []) as Row[];
  const now = Date.now();
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const dayStartMs = dayStart.getTime();

  let online = 0;
  let activeToday = 0;
  let newToday = 0;
  let totalViews = 0;
  const liveByPath = new Map<string, number>();

  for (const r of rows) {
    const seen = Date.parse(r.last_seen);
    const first = Date.parse(r.first_seen);
    totalViews += r.hits || 0;
    if (!Number.isNaN(seen)) {
      if (now - seen <= ONLINE_WINDOW_MS) {
        online++;
        const p = r.path || "/";
        liveByPath.set(p, (liveByPath.get(p) || 0) + 1);
      }
      if (seen >= dayStartMs) activeToday++;
    }
    if (!Number.isNaN(first) && first >= dayStartMs) newToday++;
  }

  // persist an all-time concurrency peak so the number only ever ratchets up
  let peakOnline = online;
  const peakRow = await db.from("site_metrics").select("value").eq("id", "peak_online").maybeSingle();
  if (!peakRow.error) {
    const stored = peakRow.data?.value ?? 0;
    if (online > stored) {
      const up = await db.from("site_metrics").upsert({ id: "peak_online", value: online });
      if (up.error) console.error("peak upsert error:", up.error);
      peakOnline = online;
    } else {
      peakOnline = stored;
    }
  }

  const topPaths = [...liveByPath.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([path, count]) => ({ path, count }));

  // total product signups — a head/exact count so we never pull the 14k rows.
  // lives in customer_memberships; if the table isn't in this project we just
  // leave it null rather than blowing up the whole stats payload.
  let totalSignups: number | null = null;
  const signups = await db
    .from("customer_memberships")
    .select("id", { count: "exact", head: true });
  if (signups.error) {
    console.error("signups count error:", signups.error);
  } else {
    totalSignups = signups.count ?? 0;
  }

  return NextResponse.json({
    configured: true,
    online,
    activeToday,
    newToday,
    totalUsers: rows.length,
    totalViews,
    peakOnline,
    totalSignups,
    topPaths,
    serverTime: new Date().toISOString(),
  });
}
