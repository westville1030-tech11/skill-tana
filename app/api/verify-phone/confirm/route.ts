import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { phone, code } = await req.json();
  if (!phone || !code) {
    return NextResponse.json({ error: "必須項目が不足しています" }, { status: 400 });
  }

  const res = await fetch(
    `https://verify.twilio.com/v2/Services/${process.env.TWILIO_VERIFY_SERVICE_SID}/VerificationChecks`,
    {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: phone, Code: code }),
    }
  );

  const result = await res.json().catch(() => ({}));
  if (!res.ok || result.status !== "approved") {
    return NextResponse.json({ error: "コードが正しくありません" }, { status: 400 });
  }

  await getAdmin()
    .from("profiles")
    .update({ phone_number: phone, phone_verified: true })
    .eq("linkedin_id", session.user.id);

  return NextResponse.json({ ok: true });
}
