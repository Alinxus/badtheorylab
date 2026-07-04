-- Run this in the Supabase SQL Editor for the hackathon submission database.
-- Creates the submission + scoring tables used by /submit and /admin/judge.
--
-- Design notes:
--   * One row per team, keyed by the registered email (unique). The /submit
--     route upserts on that email, so a team can edit freely until the deadline
--     and always has exactly one final submission.
--   * repo_url is required at the app layer; demo video / live link / proof are
--     optional so repo-only projects are first-class.
--   * Scores live in a separate table so the judge dashboard can save/refresh
--     without touching the submission itself.

create table if not exists hackathon_submissions (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  team_name      text not null default '',
  project_name   text not null default '',
  members        text not null default '',   -- comma / newline separated emails or Discord handles
  description    text not null default '',
  repo_url       text not null default '',
  demo_video_url text not null default '',    -- optional
  live_url       text not null default '',    -- optional
  runtime_routes text not null default '',    -- models / routes used through BTL Runtime
  runtime_proof  text not null default '',    -- optional: request id, screenshot url, log snippet
  uses_runtime   boolean not null default false,
  user_agent     text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Keep updated_at honest on every edit/upsert.
create or replace function touch_hackathon_submission_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists hackathon_submissions_touch_updated_at on hackathon_submissions;
create trigger hackathon_submissions_touch_updated_at
before update on hackathon_submissions
for each row execute function touch_hackathon_submission_updated_at();

-- Reuse the disposable-domain guard from hackathon-block-disposable-emails.sql
-- if that function already exists. This block is a no-op if it doesn't.
do $$
begin
  if exists (
    select 1 from pg_proc where proname = 'is_blocked_hackathon_email_domain'
  ) then
    execute $f$
      create or replace function block_disposable_hackathon_submission_email()
      returns trigger as $t$
      begin
        if is_blocked_hackathon_email_domain(new.email) then
          raise exception 'Disposable submission email domain is blocked: %',
            lower(split_part(new.email, '@', 2))
            using errcode = 'check_violation';
        end if;
        return new;
      end;
      $t$ language plpgsql;
    $f$;

    execute 'drop trigger if exists hackathon_submissions_block_disposable_email on hackathon_submissions';
    execute $f$
      create trigger hackathon_submissions_block_disposable_email
      before insert or update of email on hackathon_submissions
      for each row execute function block_disposable_hackathon_submission_email();
    $f$;
  end if;
end$$;

-- One score row per submission. Judge dashboard upserts on submission_id.
create table if not exists hackathon_scores (
  submission_id      uuid primary key references hackathon_submissions(id) on delete cascade,
  runtime_usage      int  not null default 0,   -- /30
  usefulness         int  not null default 0,   -- /25
  execution          int  not null default 0,   -- /20
  creativity         int  not null default 0,   -- /15
  demo_clarity       int  not null default 0,   -- /10
  runtime_verified   boolean not null default false,
  spot_prize         boolean not null default false,
  notes              text not null default '',
  updated_at         timestamptz not null default now()
);
