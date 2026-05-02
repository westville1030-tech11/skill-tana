import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone } = await req.json();
  if (!phone) {
    return NextResponse.json({ error: "電話番号を入力してください" }, { status: 400 });
  }

  const normalized = phone.replace(/[\s\-()]/g, "");
  const e164 = normalized.startsWith("+") ? normalized : `+81${normalized.replace(/^0/, "")}`;

  const res = await fetch(
    `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/Verifications`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: e164, Channel: "sms" }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return NextResponse.json({ error: err.message ?? "送信に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, e164 });
}
