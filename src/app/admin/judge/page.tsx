import { createClient } from "@supabase/supabase-js";
import { isJudgeAuthed } from "../adminAuth";
import JudgeLogin from "./JudgeLogin";
import JudgeBoard, { type JudgeEntry } from "./JudgeBoard";

export const dynamic = "force-dynamic";

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key);
}

/** github.com/owner/repo(.git)?(/…)? -> {owner, repo} */
function parseRepo(url: string): { owner: string; repo: string } | null {
  const m = url.match(/github\.com[/:]([^/]+)\/([^/#?]+)/i);
  if (!m) return null;
  return { owner: m[1], repo: m[2].replace(/\.git$/i, "") };
}

async function fetchReadme(repoUrl: string): Promise<string> {
  const parsed = parseRepo(repoUrl);
  if (!parsed) return "";
  const token = process.env.GITHUB_TOKEN;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "User-Agent": "btl-hackathon-judge",
        },
        // README doesn't change often mid-judging; cache briefly.
        next: { revalidate: 120 },
      },
    );
    if (!res.ok) return "";
    const text = await res.text();
    return text.slice(0, 8000); // keep the payload sane
  } catch {
    return "";
  }
}

export default async function JudgePage() {
  if (!(await isJudgeAuthed())) {
    return <JudgeLogin configured={Boolean(process.env.ADMIN_JUDGE_PASSWORD)} />;
  }

  const supabase = getSupabase();
  if (!supabase) {
    return (
      <main style={{ padding: 40, fontFamily: "system-ui", color: "#0E0D0C", background: "#FAFAF9", minHeight: "100vh" }}>
        <h1>Judge dashboard</h1>
        <p>Supabase isn&rsquo;t configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.</p>
      </main>
    );
  }

  const [{ data: subs }, { data: scores }] = await Promise.all([
    supabase.from("hackathon_submissions").select("*").order("created_at", { ascending: true }),
    supabase.from("hackathon_scores").select("*"),
  ]);

  const scoreById = new Map((scores || []).map(s => [s.submission_id, s]));

  const readmes = await Promise.all((subs || []).map(s => fetchReadme(s.repo_url)));

  const entries: JudgeEntry[] = (subs || []).map((s, i) => {
    const sc = scoreById.get(s.id);
    return {
      id: s.id,
      email: s.email,
      teamName: s.team_name,
      projectName: s.project_name,
      members: s.members,
      description: s.description,
      repoUrl: s.repo_url,
      demoVideoUrl: s.demo_video_url,
      liveUrl: s.live_url,
      xPostUrl: s.x_post_url,
      runtimeRoutes: s.runtime_routes,
      runtimeProof: s.runtime_proof,
      updatedAt: s.updated_at,
      readme: readmes[i] || "",
      score: {
        runtimeUsage: sc?.runtime_usage ?? 0,
        usefulness: sc?.usefulness ?? 0,
        execution: sc?.execution ?? 0,
        creativity: sc?.creativity ?? 0,
        demoClarity: sc?.demo_clarity ?? 0,
        publicityBonus: sc?.publicity_bonus ?? 0,
        runtimeVerified: sc?.runtime_verified ?? false,
        spotPrize: sc?.spot_prize ?? false,
        notes: sc?.notes ?? "",
        saved: Boolean(sc),
      },
    };
  });

  return <JudgeBoard entries={entries} />;
}
