import { NextRequest, NextResponse } from "next/server";
import { getUserDataFile, saveUserDataFile } from "@/lib/github";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get("telegram_id");
  if (!telegramId) return NextResponse.json({ error: "telegram_id required" }, { status: 400 });
  const data = await getUserDataFile(telegramId);
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { telegram_id, userData, sha } = body;
  if (!telegram_id || !userData) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const res = await saveUserDataFile(telegram_id, JSON.stringify(userData, null, 2), sha);
  return NextResponse.json({ ok: true, res });
}
