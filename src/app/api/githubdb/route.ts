import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoUrl = process.env.GITHUB_REPO || "";

function parseRepo(url: string) {
  const match = url.match(/github.com[/:]([^/]+)\/(.*?)(?:\.git)?$/);
  if (!match) throw new Error("Invalid GitHub repo URL");
  return { owner: match[1], repo: match[2] };
}

const DATA_PATH = "db.json"; 


export async function GET() {
  const { owner, repo } = parseRepo(repoUrl);
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: DATA_PATH });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      const json = JSON.parse(buff.toString('utf-8'));
      return NextResponse.json({ data: json });
    }
    return NextResponse.json({ data: [] });
  } catch (e: any) {
    if (e.status === 404) return NextResponse.json({ data: [] });
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { newItem } = body;
  if (!newItem) return NextResponse.json({ error: "Missing newItem" }, { status: 400 });
  const { owner, repo } = parseRepo(repoUrl);
  // Get current data and sha
  let oldData = [];
  let sha = undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: DATA_PATH });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      oldData = JSON.parse(buff.toString('utf-8'));
      sha = data.sha;
    }
  } catch (e: any) {
    if (e.status !== 404) return NextResponse.json({ error: e.message }, { status: 500 });
  }
  const newData = [...oldData, newItem];
  const base64Content = Buffer.from(JSON.stringify(newData, null, 2), 'utf-8').toString('base64');
  const message = `Добавлен новый элемент в githubdb: ${newItem.name || newItem.title || "item"}`;
  const opts: any = { owner, repo, path: DATA_PATH, message, content: base64Content };
  if (sha) opts.sha = sha;
  const res = await octokit.rest.repos.createOrUpdateFileContents(opts);
  return NextResponse.json({ ok: true, res });
}
