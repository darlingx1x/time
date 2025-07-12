import { NextRequest, NextResponse } from "next/server";
import { getUserDataFile, saveUserDataFile, octokit, repoUrl } from "@/lib/github";

function parseRepo(repo: string) {
  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error("Invalid GitHub repo format. Expected 'owner/repo'");
  return { owner, repo: name };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegram_id");
  if (!telegramId) return NextResponse.json({ error: "telegram_id required" }, { status: 400 });
  const data = await getUserDataFile(telegramId);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { telegram_id, userData } = body;
  if (!telegram_id || !userData) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  let sha: string | undefined = undefined;
  const { owner, repo } = parseRepo(repoUrl);
  const path = `users/${telegram_id}.json`;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if (typeof data === "object" && "sha" in data) {
      sha = data.sha as string;
    }
  } catch (e: any) {
    if (e.status !== 404) return NextResponse.json({ error: e.message }, { status: 500 });
  }
  const res = await saveUserDataFile(telegram_id, JSON.stringify(userData, null, 2), sha);
  return NextResponse.json({ ok: true, res });
}

