import { NextRequest, NextResponse } from "next/server";
import { saveNote, validateObsidianToken } from "@/lib/notes";
import { NoteApiRequest } from "@/types/note";

// Обработка preflight запросов
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'app://obsidian.md',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Отсутствует токен авторизации" },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': 'app://obsidian.md',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      );
    }

    const token = authHeader.substring(7);
    if (!validateObsidianToken(token)) {
      return NextResponse.json(
        { success: false, error: "Неверный токен авторизации" },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Origin': 'app://obsidian.md',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
      );
    }

    // Получаем данные заметки
    const body = await req.json();
    const { slug, title, content, frontmatter, updatedAt }: NoteApiRequest = body;

    // Валидация обязательных полей
    if (!slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: "Отсутствуют обязательные поля: slug, title, content" },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': 'app://obsidian.md',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
          }
        }
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

    return NextResponse.json({ 
      success: true, 
      note,
      message: "Заметка успешно сохранена"
    }, {
      headers: {
        'Access-Control-Allow-Origin': 'app://obsidian.md',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      }
    });

  } catch (error: any) {
    console.error('Error uploading note:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': 'app://obsidian.md',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    );
  }
} 