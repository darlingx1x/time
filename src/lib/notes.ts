import { Octokit } from 'octokit';
import { marked } from 'marked';
import { Note, NoteApiRequest } from '@/types/note';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const repoUrl = process.env.GITHUB_REPO || '';

function parseRepo(repo: string) {
  const [owner, name] = repo.split("/");
  if (!owner || !name) throw new Error("Invalid GitHub repo format. Expected 'owner/repo'");
  return { owner, repo: name };
}

const NOTES_PATH = "notes.json";

// Получить все заметки
export async function getAllNotes(): Promise<Note[]> {
  const { owner, repo } = parseRepo(repoUrl);
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: NOTES_PATH });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      return JSON.parse(buff.toString('utf-8'));
    }
    return [];
  } catch (e: any) {
    if (e.status === 404) return [];
    throw e;
  }
}

// Получить заметку по slug
export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const notes = await getAllNotes();
  return notes.find(note => note.slug === slug) || null;
}

// Сохранить или обновить заметку
export async function saveNote(noteData: NoteApiRequest): Promise<Note> {
  const { owner, repo } = parseRepo(repoUrl);
  
  // Получаем текущие заметки
  let notes: Note[] = [];
  let sha: string | undefined;
  
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: NOTES_PATH });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      notes = JSON.parse(buff.toString('utf-8'));
      sha = data.sha;
    }
  } catch (e: any) {
    if (e.status !== 404) throw e;
  }

  // Конвертируем markdown в HTML
  const html = await marked(noteData.content);
  
  // Создаем объект заметки
  const note: Note = {
    slug: noteData.slug,
    title: noteData.title,
    content: noteData.content,
    html,
    frontmatter: noteData.frontmatter,
    createdAt: new Date().toISOString(),
    updatedAt: noteData.updatedAt,
    published: noteData.frontmatter.published ?? true
  };

  // Проверяем, существует ли заметка
  const existingIndex = notes.findIndex(n => n.slug === noteData.slug);
  
  if (existingIndex >= 0) {
    // Обновляем существующую заметку, сохраняя createdAt
    note.createdAt = notes[existingIndex].createdAt;
    notes[existingIndex] = note;
  } else {
    // Добавляем новую заметку
    notes.push(note);
  }

  // Сохраняем в GitHub
  const base64Content = Buffer.from(JSON.stringify(notes, null, 2), 'utf-8').toString('base64');
  const message = existingIndex >= 0 
    ? `Обновлена заметка: ${note.title}` 
    : `Добавлена новая заметка: ${note.title}`;

  const opts: any = { owner, repo, path: NOTES_PATH, message, content: base64Content };
  if (sha) opts.sha = sha;

  await octokit.rest.repos.createOrUpdateFileContents(opts);
  
  return note;
}

// Удалить заметку
export async function deleteNote(slug: string): Promise<boolean> {
  const { owner, repo } = parseRepo(repoUrl);
  
  // Получаем текущие заметки
  let notes: Note[] = [];
  let sha: string | undefined;
  
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path: NOTES_PATH });
    if ('content' in data) {
      const buff = Buffer.from(data.content, 'base64');
      notes = JSON.parse(buff.toString('utf-8'));
      sha = data.sha;
    }
  } catch (e: any) {
    if (e.status === 404) return false;
    throw e;
  }

  // Удаляем заметку
  const filteredNotes = notes.filter(note => note.slug !== slug);
  
  if (filteredNotes.length === notes.length) {
    return false; // Заметка не найдена
  }

  // Сохраняем обновленный список
  const base64Content = Buffer.from(JSON.stringify(filteredNotes, null, 2), 'utf-8').toString('base64');
  const message = `Удалена заметка: ${slug}`;

  const opts: any = { owner, repo, path: NOTES_PATH, message, content: base64Content };
  if (sha) opts.sha = sha;

  await octokit.rest.repos.createOrUpdateFileContents(opts);
  
  return true;
}

// Проверка авторизации для Obsidian
export function validateObsidianToken(token: string): boolean {
  const expectedToken = process.env.OBSIDIAN_API_TOKEN;
  return token === expectedToken;
} 