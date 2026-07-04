import { NextResponse } from "next/server";
import { verifyPassword, cookieName } from "../../../admin/adminAuth";

export async function POST(req: Request) {
  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = body.password || "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!process.env.ADMIN_JUDGE_PASSWORD) {
    return NextResponse.json(
      { error: "Judge access is not configured (set ADMIN_JUDGE_PASSWORD)." },
      { status: 500 },
    );
  }

  const token = verifyPassword(password);
  if (!token) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // a week — covers the whole event
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookieName(), "", { path: "/", maxAge: 0 });
  return res;
}
