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
  const { telegram_id, userData } = body;
  if (!telegram_id || !userData) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  let sha = undefined;
  try {
    const data = await getUserDataFile(telegram_id);
    if (data) sha = data.sha;
  } catch (e: any) {
    if (e.status !== 404) return NextResponse.json({ error: e.message }, { status: 500 });
  }
  try {
    const latestData = await getUserDataFile(telegram_id);
    if (latestData && latestData.sha !== sha) sha = latestData.sha;
  } catch (e: any) {
    if (e.status !== 404) return NextResponse.json({ error: e.message }, { status: 500 });
  }
  const res = await saveUserDataFile(telegram_id, JSON.stringify(userData, null, 2), sha);
  return NextResponse.json({ ok: true, res });
}
