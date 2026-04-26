import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
};

export async function POST(req: Request) {
  let payload: ContactPayload;

  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();
  const company = payload.company?.trim() || "Not provided";
  const subject = payload.subject?.trim() || "Investor inquiry";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpSecure = (process.env.SMTP_SECURE || "true") === "true";
  const fromEmail = process.env.FROM_EMAIL || "team@notifications.retaindb.com";
  const toEmail = process.env.CONTACT_TO_EMAIL || "hello@badtheorylabs.com";

  if (!smtpHost || !smtpUser || !smtpPassword) {
    return NextResponse.json(
      { error: "Contact service is not configured yet." },
      { status: 500 },
    );
  }

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin: 0 0 16px;">New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Company / Fund:</strong> ${escapeHtml(company)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid #ddd;" />
      <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `Bad Theory Labs <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `[Contact] ${subject} - ${name}`,
      html,
      text: `Name: ${name}\nEmail: ${email}\nCompany/Fund: ${company}\nSubject: ${subject}\n\n${message}`,
    });
  } catch {
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
