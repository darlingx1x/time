import { NextRequest, NextResponse } from "next/server";
import { getUserDataFile, saveUserDataFile } from "@/lib/github";

// POST: sync user data (update or create)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { telegram_id, userData, sha } = body;
    
    if (!telegram_id || !userData) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }
    
    const res = await saveUserDataFile(telegram_id, JSON.stringify(userData, null, 2), sha);
    return NextResponse.json({ ok: true, res });
  } catch (error: any) {
    console.error('Error syncing data:', error);
    return NextResponse.json(
      { error: error.message || 'Ошибка синхронизации' },
      { status: 500 }
    );
  }
}
