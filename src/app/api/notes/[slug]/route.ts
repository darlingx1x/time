import { NextRequest, NextResponse } from "next/server";
import { getNoteBySlug } from "@/lib/notes";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const note = await getNoteBySlug(params.slug);
    
    if (!note) {
      return NextResponse.json(
        { success: false, error: "Заметка не найдена" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 