import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import type { TelegramAuthData } from "@/types/telegram";

function checkTelegramAuth(data: TelegramAuthData): boolean {
  const { hash, ...fields } = data;
  const secret = crypto.createHash("sha256").update(process.env.TELEGRAM_BOT_TOKEN!).digest();
  const dataCheckString = Object.keys(fields)
    .sort()
    .map((key) => `${key}=${fields[key]}`)
    .join("\n");
  const hmac = crypto.createHmac("sha256", secret).update(dataCheckString).digest("hex");
  return hmac === hash;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!checkTelegramAuth(body)) {
      return NextResponse.json({ error: "Invalid Telegram signature" }, { status: 401 });
    }
    // Store user session (in-memory or JWT, for demo)
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Malformed request" }, { status: 400 });
  }
}
