import { NextResponse } from "next/server";
import { google } from "googleapis";

type Teammate = { name: string; email: string };

type HackathonPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  github?: string;
  school?: string;
  track?: string;
  teamName?: string;
  teamSize?: string;
  experience?: string;
  idea?: string;
  aiTools?: string;
  teammates?: Teammate[];
};

export async function POST(req: Request) {
  let payload: HackathonPayload;

  try {
    payload = (await req.json()) as HackathonPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const firstName = payload.firstName?.trim();
  const lastName  = payload.lastName?.trim();
  const email     = payload.email?.trim();

  if (!firstName || !lastName || !email || !payload.track) {
    return NextResponse.json(
      { error: "Name, email, and track are required." },
      { status: 400 },
    );
  }

  const sheetId      = process.env.GOOGLE_SHEET_ID;
  const clientEmail  = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey   = process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, "\n");

  if (!sheetId || !clientEmail || !privateKey) {
    return NextResponse.json(
      { error: "Registration service is not configured yet." },
      { status: 500 },
    );
  }

  const teammates = payload.teammates ?? [];

  /* build the row: lead info + up to 3 teammates flattened */
  const now = new Date().toLocaleString("en-NG", {
    timeZone: "Africa/Lagos",
    dateStyle: "short",
    timeStyle: "short",
  });

  const teammateColumns = [0, 1, 2].flatMap(i => [
    teammates[i]?.name  ?? "",
    teammates[i]?.email ?? "",
  ]);

  const row = [
    now,
    `${firstName} ${lastName}`,
    email,
    payload.github?.trim()   || "",
    payload.school?.trim()   || "",
    payload.experience       || "",
    payload.track            || "",
    payload.teamName?.trim() || "",
    payload.teamSize         || "1",
    payload.idea?.trim()     || "",
    payload.aiTools?.trim()  || "",
    ...teammateColumns,       /* teammate 1 name, email | 2 | 3 */
  ];

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: { client_email: clientEmail, private_key: privateKey },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Registrations!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
  } catch (err) {
    console.error("[hackathon] Sheets error:", err);
    return NextResponse.json(
      { error: "Unable to submit registration right now. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
