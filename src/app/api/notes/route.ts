export const dynamic = 'force-dynamic';

import { getAllNotes } from "@/lib/notes";

export async function GET(req: Request) {
  try {
    const notes = await getAllNotes();
    return Response.json({ success: true, notes });
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
} 