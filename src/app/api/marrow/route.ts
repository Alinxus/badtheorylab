import { NextResponse } from "next/server";
import { google } from "googleapis";

type Payload = { email?: string; name?: string };

export async function POST(req: Request) {
  let payload: Payload;

  try {
    payload = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = payload.email?.trim();
  const name  = payload.name?.trim() || "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const sheetId     = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey  = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n");

  if (!sheetId || !clientEmail || !privateKey) {
    return NextResponse.json(
      { error: "Waitlist service is not configured yet." },
      { status: 500 },
    );
  }

  const now = new Date().toLocaleString("en-NG", {
    timeZone:  "Africa/Lagos",
    dateStyle: "short",
    timeStyle: "short",
  });

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId:   sheetId,
      range:           "Marrow Waitlist!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [[now, email, name]] },
    });
  } catch (err) {
    console.error("[marrow] Sheets error:", err);
    return NextResponse.json(
      { error: "Unable to join waitlist right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
