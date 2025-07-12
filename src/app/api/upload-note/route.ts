export const dynamic = 'force-dynamic';

import { saveNote, validateObsidianToken } from "@/lib/notes";
import { NoteApiRequest } from "@/types/note";

export async function POST(req: Request) {
  try {
    // Проверяем авторизацию
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { success: false, error: "Отсутствует токен авторизации" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!validateObsidianToken(token)) {
      return Response.json(
        { success: false, error: "Неверный токен авторизации" },
        { status: 401 }
      );
    }

    // Получаем данные заметки
    const body = await req.json();
    const { slug, title, content, frontmatter, updatedAt }: NoteApiRequest = body;

    if (!slug || !title || !content) {
      return Response.json(
        { success: false, error: "Отсутствуют обязательные поля: slug, title, content" },
        { status: 400 }
      );
    }

    // Сохраняем заметку
    const note = await saveNote({
      slug,
      title,
      content,
      frontmatter: frontmatter || {},
      updatedAt: updatedAt || new Date().toISOString()
    });

    return Response.json({ 
      success: true, 
      note, 
      message: "Заметка успешно сохранена" 
    });

  } catch (error: any) {
    console.error('Error uploading note:', error);
    return Response.json(
      { success: false, error: error?.message || 'Ошибка сервера' },
      { status: 500 }
    );
  }
} 