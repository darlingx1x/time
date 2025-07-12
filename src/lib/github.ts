import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoUrl = process.env.GITHUB_REPO || '';

function parseRepo(repo: string) {
  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error("Invalid GitHub repo format. Expected 'owner/repo'");
  return { owner, repo: name };
}

export async function getUserDataFile(telegramId: string | number) {
  const { owner, repo } = parseRepo(repoUrl);
  const path = `users/${telegramId}.json`;
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      return buff.toString('utf-8');
    }
    return null;
  } catch (e: any) {
    if (e.status === 404) return null;
    throw e;
  }
}

export async function saveUserDataFile(telegramId: string | number, content: string, sha?: string) {
  const { owner, repo } = parseRepo(repoUrl);
  const path = `users/${telegramId}.json`;
  let base64Content = Buffer.from(content, 'utf-8').toString('base64');
  let message = `Update user data for ${telegramId}`;
  let opts: any = { owner, repo, path, message, content: base64Content };
  if (sha) opts.sha = sha;
  return octokit.rest.repos.createOrUpdateFileContents(opts);
}
