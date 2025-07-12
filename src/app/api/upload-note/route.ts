export const dynamic = 'force-dynamic';

import { saveNote, validateObsidianToken } from "@/lib/notes";
import { NoteApiRequest } from "@/types/note";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function POST(req: Request) {
  try {
    // Проверяем авторизацию
    const authHeader = req.headers.get ? req.headers.get('authorization') : undefined;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: "Отсутствует токен авторизации" }), {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }
    const token = authHeader.substring(7);
    if (!validateObsidianToken(token)) {
      return new Response(JSON.stringify({ success: false, error: "Неверный токен авторизации" }), {
        status: 401,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }
    // Получаем данные заметки
    const body = await req.json();
    const { slug, title, content, frontmatter, updatedAt }: NoteApiRequest = body;
    if (!slug || !title || !content) {
      return new Response(JSON.stringify({ success: false, error: "Отсутствуют обязательные поля: slug, title, content" }), {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }
    // Сохраняем заметку
    const note = await saveNote({
      slug,
      title,
      content,
      frontmatter: frontmatter || {},
      updatedAt: updatedAt || new Date().toISOString()
    });
    return new Response(JSON.stringify({ success: true, note, message: "Заметка успешно сохранена" }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error?.message || 'Ошибка сервера' }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
} 