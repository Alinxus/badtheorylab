import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

type SubmissionPayload = {
  email?: string;
  teamName?: string;
  projectName?: string;
  members?: string;
  description?: string;
  repoUrl?: string;
  demoVideoUrl?: string;
  liveUrl?: string;
  runtimeRoutes?: string;
  runtimeProof?: string;
  usesRuntime?: boolean;
};

// Hard deadline — matches /submit and the /hackathon timeline.
const DEADLINE = new Date("2026-07-05T15:00:00Z");

// Same disposable-domain guard as the registration route.
const DISPOSABLE_EMAIL_DOMAINS = [
  "10minutemail.com", "20minutemail.com", "33mail.com", "anonaddy.com",
  "burnermail.io", "dispostable.com", "emailondeck.com", "fakeinbox.com",
  "getnada.com", "guerrillamail.com", "maildrop.cc", "mailinator.com",
  "mailnesia.com", "mohmal.com", "moakt.com", "sharklasers.com",
  "temp-mail.org", "tempail.com", "tempmail.com", "tempmailo.com",
  "throwawaymail.com", "trashmail.com", "yopmail.com",
] as const;

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const validUrl = (v: string) => /^https?:\/\/.+/i.test(v);
const emailDomain = (email: string) => email.split("@").at(1)?.toLowerCase() || "";

function blockedEmailDomains() {
  const extra = (process.env.BLOCKED_HACKATHON_EMAIL_DOMAINS || "")
    .split(",").map(d => d.trim().toLowerCase()).filter(Boolean);
  return new Set([...DISPOSABLE_EMAIL_DOMAINS, ...extra]);
}

function isBlockedEmailDomain(domain: string) {
  for (const blocked of blockedEmailDomains()) {
    if (domain === blocked || domain.endsWith(`.${blocked}`)) return true;
  }
  return false;
}

export async function POST(req: Request) {
  if (Date.now() > DEADLINE.getTime()) {
    return NextResponse.json(
      { error: "Submissions are closed. The deadline (Jul 5, 15:00 UTC) has passed." },
      { status: 410 },
    );
  }

  let payload: SubmissionPayload;
  try {
    payload = (await req.json()) as SubmissionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase() || "";
  const teamName = payload.teamName?.trim() || "";
  const projectName = payload.projectName?.trim() || "";
  const description = payload.description?.trim() || "";
  const repoUrl = payload.repoUrl?.trim() || "";
  const runtimeRoutes = payload.runtimeRoutes?.trim() || "";

  if (!validEmail(email)) {
    return NextResponse.json({ error: "A valid registered email is required." }, { status: 400 });
  }
  if (isBlockedEmailDomain(emailDomain(email))) {
    return NextResponse.json({ error: "Please use your permanent registered email." }, { status: 400 });
  }
  if (!teamName || !projectName) {
    return NextResponse.json({ error: "Team name and project name are required." }, { status: 400 });
  }
  if (!description) {
    return NextResponse.json({ error: "A short description is required." }, { status: 400 });
  }
  if (!validUrl(repoUrl)) {
    return NextResponse.json({ error: "A valid GitHub repo URL is required." }, { status: 400 });
  }
  if (!runtimeRoutes) {
    return NextResponse.json({ error: "List the BTL Runtime routes/models you used." }, { status: 400 });
  }
  if (!payload.usesRuntime) {
    return NextResponse.json(
      { error: "Projects must call the BTL Runtime to be eligible for prizes." },
      { status: 400 },
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "Submission service is not configured yet." }, { status: 500 });
  }

  const row = {
    email,
    team_name: teamName,
    project_name: projectName,
    members: payload.members?.trim() || "",
    description,
    repo_url: repoUrl,
    demo_video_url: payload.demoVideoUrl?.trim() || "",
    live_url: payload.liveUrl?.trim() || "",
    runtime_routes: runtimeRoutes,
    runtime_proof: payload.runtimeProof?.trim() || "",
    uses_runtime: true,
    user_agent: req.headers.get("user-agent") || "",
  };

  // Was there already a submission for this email? Drives the "updated" flag + email copy.
  const { data: existing } = await supabase
    .from("hackathon_submissions")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const { error } = await supabase
    .from("hackathon_submissions")
    .upsert(row, { onConflict: "email" });

  if (error) {
    if (error.code === "23514") {
      return NextResponse.json({ error: "Please use your permanent registered email." }, { status: 400 });
    }
    console.error("[hackathon/submit] supabase upsert failed:", error.message, error.code);
    return NextResponse.json(
      { error: "Couldn't save your submission. Please try again in a moment." },
      { status: 502 },
    );
  }

  const updated = Boolean(existing);
  const emailed = await sendConfirmation(email, projectName, updated);
  return NextResponse.json({ ok: true, updated, emailed });
}

async function sendConfirmation(to: string, projectName: string, updated: boolean): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return false;

  const port = Number(process.env.SMTP_PORT || 465);
  const secure = (process.env.SMTP_SECURE || "true") === "true";
  const from = process.env.FROM_EMAIL || "team@notifications.retaindb.com";
  const project = escapeHtml(projectName);
  const verb = updated ? "updated" : "received";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 560px;">
      <h2 style="margin: 0 0 14px; font-size: 22px;">Submission ${verb} — ${project}</h2>
      <p>We've ${verb} your project for the <strong>BTL Runtime Hackathon</strong>.</p>
      <p>You can edit your submission with the same email any time before the deadline —
         <strong>Jul 5, 2026 at 15:00 UTC</strong>. The last saved version is the one we judge.</p>
      <p>Demo day is Jul 5 at 17:00 UTC in Discord, where finalists present live.</p>
      <hr style="margin: 22px 0; border: 0; border-top: 1px solid #ddd;" />
      <p style="color:#888;font-size:12px;">Bad Theory Labs · You keep full ownership of whatever you build.</p>
    </div>
  `;
  const text =
    `Submission ${verb} for the BTL Runtime Hackathon: ${projectName}.\n` +
    `Edit any time with the same email before Jul 5, 2026 15:00 UTC — last version wins.\n` +
    `Demo day: Jul 5, 17:00 UTC in Discord.\n— Bad Theory Labs`;

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  try {
    await transporter.sendMail({
      from: `Bad Theory Labs <${from}>`,
      to,
      subject: `Submission ${verb} — BTL Runtime Hackathon`,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("[hackathon/submit] confirmation email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
