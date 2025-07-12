import { NextRequest, NextResponse } from "next/server";
import { deleteNote, validateObsidianToken } from "@/lib/notes";

export async function DELETE(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: "Отсутствует токен авторизации" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    if (!validateObsidianToken(token)) {
      return NextResponse.json(
        { success: false, error: "Неверный токен авторизации" },
        { status: 500 }
      );
    }

    // Получаем slug из query параметров
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Отсутствует параметр slug" },
        { status: 400 }
      );
    }

    // Удаляем заметку
    const deleted = await deleteNote(slug);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Заметка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Заметка успешно удалена"
    });

  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 