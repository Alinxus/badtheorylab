import { NextResponse } from "next/server";

export async function GET() {
  const reasoningTest = `CREATE TABLE IF NOT EXISTS reasoning_test_responses (
  id BIGSERIAL PRIMARY KEY,
  participant_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`;

  const hackathon = `CREATE TABLE IF NOT EXISTS hackathon_registrations (
  id BIGSERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT DEFAULT '',
  github TEXT DEFAULT '',
  experience TEXT DEFAULT '',
  track TEXT DEFAULT 'General',
  team_name TEXT DEFAULT '',
  team_size TEXT DEFAULT '1',
  idea TEXT DEFAULT '',
  runtime_plan TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- one registration per email; the API treats a duplicate insert as "already in"
CREATE UNIQUE INDEX IF NOT EXISTS hackathon_registrations_email_idx
  ON hackathon_registrations (email);`;

  const rewardClaims = `CREATE TABLE IF NOT EXISTS reward_claims (
  id BIGSERIAL PRIMARY KEY,
  claim_type TEXT NOT NULL DEFAULT 'review',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  product TEXT NOT NULL,
  platform TEXT NOT NULL,
  review_url TEXT NOT NULL,
  wallet TEXT NOT NULL,
  summary TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  payout_amount NUMERIC,
  payout_tx TEXT DEFAULT '',
  reviewer_notes TEXT DEFAULT '',
  user_agent TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- one reward claim per public review URL
CREATE UNIQUE INDEX IF NOT EXISTS reward_claims_review_url_idx
  ON reward_claims (review_url);
CREATE INDEX IF NOT EXISTS reward_claims_status_created_idx
  ON reward_claims (status, created_at DESC);`;

  const presence = `CREATE TABLE IF NOT EXISTS site_presence (
  session_id TEXT PRIMARY KEY,
  first_seen TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  hits INTEGER DEFAULT 1,
  path TEXT DEFAULT '/',
  user_agent TEXT DEFAULT ''
);
-- /api/stats scans last_seen constantly; keep it indexed
CREATE INDEX IF NOT EXISTS site_presence_last_seen_idx ON site_presence (last_seen DESC);

-- tiny key/value bag for ratcheting counters like the all-time concurrency peak
CREATE TABLE IF NOT EXISTS site_metrics (
  id TEXT PRIMARY KEY,
  value BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

  return NextResponse.json({
    ok: false,
    message: "Run this SQL in your Supabase SQL Editor to create the tables the app expects:",
    tables: {
      reasoning_test_responses: reasoningTest,
      hackathon_registrations: hackathon,
      reward_claims: rewardClaims,
      site_presence: presence,
    },
  });
}
