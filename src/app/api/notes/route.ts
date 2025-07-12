import { NextRequest, NextResponse } from "next/server";
import { getAllNotes } from "@/lib/notes";

export async function GET(req: NextRequest) {
  try {
    const notes = await getAllNotes();
    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 