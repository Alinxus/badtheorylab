import { cookies } from "next/headers";

// Simple single-operator gate: a shared secret in ADMIN_JUDGE_PASSWORD.
// On login we set an httpOnly cookie whose value is a token derived from the
// password, so the raw password isn't stored in the browser and a leaked cookie
// can be rotated by changing the env var.

const COOKIE = "btl_judge";

function expectedToken(): string | null {
  const password = process.env.ADMIN_JUDGE_PASSWORD;
  if (!password) return null;
  // Deterministic, non-reversible-enough token. Not high-security, but this is a
  // solo judging dashboard, not a bank. Rotating ADMIN_JUDGE_PASSWORD invalidates it.
  let hash = 5381;
  const salted = `btl-judge::${password}`;
  for (let i = 0; i < salted.length; i++) {
    hash = ((hash << 5) + hash + salted.charCodeAt(i)) | 0;
  }
  return `v1_${(hash >>> 0).toString(36)}`;
}

export function verifyPassword(input: string): string | null {
  const password = process.env.ADMIN_JUDGE_PASSWORD;
  if (!password || input !== password) return null;
  return expectedToken();
}

export function cookieName() {
  return COOKIE;
}

/** Server-side: is the current request an authenticated judge? */
export async function isJudgeAuthed(): Promise<boolean> {
  const token = expectedToken();
  if (!token) return false; // no password configured => locked
  const store = await cookies();
  return store.get(COOKIE)?.value === token;
}
