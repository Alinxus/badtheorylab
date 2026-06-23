import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

type HackathonPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  country?: string;
  github?: string;
  experience?: string;
  track?: string;
  teamName?: string;
  teamSize?: string;
  idea?: string;
  runtimePlan?: string;
};

const EVENT_DATES = "July 3–5, 2026";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(req: Request) {
  let payload: HackathonPayload;
  try {
    payload = (await req.json()) as HackathonPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = payload.firstName?.trim() || "";
  const lastName  = payload.lastName?.trim() || "";
  const email     = payload.email?.trim().toLowerCase() || "";
  const track     = payload.track?.trim() || "";

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  }
  if (!validEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }
  if (!track) {
    return NextResponse.json({ error: "Please pick a track." }, { status: 400 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { error: "Registration service is not configured yet." },
      { status: 500 },
    );
  }

  const row = {
    first_name:  firstName,
    last_name:   lastName,
    email,
    country:     payload.country?.trim()     || "",
    github:      payload.github?.trim()       || "",
    experience:  payload.experience?.trim()   || "",
    track,
    team_name:   payload.teamName?.trim()     || "",
    team_size:   payload.teamSize?.trim()     || "1",
    idea:        payload.idea?.trim()         || "",
    runtime_plan: payload.runtimePlan?.trim() || "",
    user_agent:  req.headers.get("user-agent") || "",
  };

  const { error } = await supabase.from("hackathon_registrations").insert(row);

  if (error) {
    // 23505 = unique_violation — they already signed up with this email. Not an error worth scaring them with.
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, already: true });
    }
    console.error("[hackathon] supabase insert failed:", error.message, error.code);
    return NextResponse.json(
      { error: "Couldn't save your registration. Please try again in a moment." },
      { status: 502 },
    );
  }

  // Registration is safely stored at this point. The confirmation email is a nicety —
  // if SMTP isn't wired up or the send hiccups, we still report success but flag it.
  const emailed = await sendConfirmation(firstName, email, track);

  return NextResponse.json({ ok: true, emailed });
}

async function sendConfirmation(firstName: string, to: string, track: string): Promise<boolean> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return false;

  const port   = Number(process.env.SMTP_PORT || 465);
  const secure = (process.env.SMTP_SECURE || "true") === "true";
  const from   = process.env.FROM_EMAIL || "team@notifications.retaindb.com";
  const discord = process.env.NEXT_PUBLIC_DISCORD_URL || "https://discord.gg/QJBCcB7bF";

  const safeName  = escapeHtml(firstName);
  const safeTrack = escapeHtml(track);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 560px;">
      <h2 style="margin: 0 0 14px; font-size: 22px;">You're registered — see you ${escapeHtml(EVENT_DATES)}.</h2>
      <p>Hi ${safeName}, you're in for the <strong>BTL Runtime Hackathon</strong> — online, global, 48 hours.</p>
      <p>Your track: <strong>${safeTrack}</strong>. One rule: your project runs on the BTL runtime, our
         OpenAI-compatible gateway. We'll email your scoped API key and free credits before kickoff.</p>
      <p style="margin: 22px 0;">
        <a href="${discord}" style="background:#0E0D0C;color:#fff;text-decoration:none;padding:11px 20px;border-radius:8px;display:inline-block;">Join the Discord →</a>
      </p>
      <p style="color:#555;font-size:14px;">Kickoff stream and team formation happen in Discord — that's where everything runs.
         Questions? Just reply to this email.</p>
      <hr style="margin: 22px 0; border: 0; border-top: 1px solid #ddd;" />
      <p style="color:#888;font-size:12px;">Bad Theory Labs · You keep full ownership of whatever you build.</p>
    </div>
  `;

  const text =
    `You're registered for the BTL Runtime Hackathon (${EVENT_DATES}), online and global.\n` +
    `Track: ${track}. Every project runs on the BTL runtime; we'll send your API key + free credits before kickoff.\n` +
    `Join the Discord: ${discord}\n\nQuestions? Reply to this email.\n— Bad Theory Labs`;

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    await transporter.sendMail({
      from: `Bad Theory Labs <${from}>`,
      to,
      subject: "You're in — BTL Runtime Hackathon",
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("[hackathon] confirmation email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
