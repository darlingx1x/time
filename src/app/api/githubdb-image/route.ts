import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "octokit";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoUrl = process.env.GITHUB_REPO || "";

function parseRepo(url: string) {
  const match = url.match(/github.com[/:]([^/]+)\/(.*?)(?:\.git)?$/);
  if (!match) throw new Error("Invalid GitHub repo URL");
  return { owner: match[1], repo: match[2] };
}

const META_PATH = "githubdb/images/meta.json";

export async function GET() {
  const { owner, repo } = parseRepo(repoUrl);
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: META_PATH });
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
  // Ждём multipart/form-data
  const formData = await req.formData();
  const file = formData.get("image");
  const description = formData.get("description") as string;
  if (!file || typeof description !== "string") return NextResponse.json({ error: "Missing image or description" }, { status: 400 });
  if (!(file instanceof Blob)) return NextResponse.json({ error: "Invalid image" }, { status: 400 });

  // Генерируем имя файла
  const ext = file.type.split("/")[1] || "jpg";
  const fileName = `img_${Date.now()}.${ext}`;
  const path = `githubdb/images/${fileName}`;

  // Читаем старый meta.json и sha
  const { owner, repo } = parseRepo(repoUrl);
  let oldMeta = [];
  let sha = undefined;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: META_PATH });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      oldMeta = JSON.parse(buff.toString('utf-8'));
      sha = data.sha;
    }
  } catch (e: any) {
    if (e.status !== 404) return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // Читаем файл в base64
  const arrayBuffer = await file.arrayBuffer();
  const base64Content = Buffer.from(arrayBuffer).toString('base64');

  // Загружаем изображение в репозиторий
  await octokit.rest.repos.createOrUpdateFileContents({
    owner, repo, path, message: `Upload image ${fileName}`, content: base64Content
  });

  // Добавляем запись в meta.json
  const newMeta = [
    ...oldMeta,
    { file: fileName, description, date: new Date().toISOString() }
  ];
  const metaBase64 = Buffer.from(JSON.stringify(newMeta, null, 2), 'utf-8').toString('base64');
  const opts = { owner, repo, path: META_PATH, message: `Update images meta`, content: metaBase64 };
  if (sha) (opts as any).sha = sha;
  await octokit.rest.repos.createOrUpdateFileContents(opts);

  return NextResponse.json({ ok: true, file: fileName });
}
