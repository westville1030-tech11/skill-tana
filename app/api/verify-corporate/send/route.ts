import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const PERSONAL_DOMAINS = [
  "gmail.com", "yahoo.co.jp", "yahoo.com", "hotmail.com", "outlook.com",
  "icloud.com", "me.com", "live.com", "docomo.ne.jp", "softbank.ne.jp", "ezweb.ne.jp",
];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

  const { email } = await req.json();
  if (!email?.includes("@")) return NextResponse.json({ error: "メールアドレスが不正です" }, { status: 400 });

  const domain = email.split("@")[1].toLowerCase();
  if (PERSONAL_DOMAINS.includes(domain)) {
    return NextResponse.json({ error: "フリーメールアドレスは使用できません。会社のメールアドレスを入力してください。" }, { status: 400 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  // 既存の未使用コードを削除
  await supabase().from("corporate_email_verifications").delete().eq("linkedin_id", session.user.id);

  const { error: insertError } = await supabase().from("corporate_email_verifications").insert({
    linkedin_id: session.user.id,
    email,
    code,
    expires_at: expiresAt,
  });
  if (insertError) return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });

  // Resendでメール送信
  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "スキル棚 <onboarding@resend.dev>",
      to: [email],
      subject: "【スキル棚】法人メール認証コード",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
          <h2 style="color:#1d4ed8;margin-bottom:16px;">法人メール認証</h2>
          <p style="color:#374151;">以下の認証コードをスキル棚の認証画面に入力してください。</p>
          <div style="background:#f3f4f6;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <span style="font-size:36px;font-weight:900;letter-spacing:8px;color:#1d4ed8;">${code}</span>
          </div>
          <p style="color:#9ca3af;font-size:13px;">有効期限：15分間。このメールに心当たりのない場合は無視してください。</p>
        </div>
      `,
    }),
  });

  if (!resendRes.ok) {
    console.error("[verify-corporate] Resend error:", await resendRes.text());
    return NextResponse.json({ error: "メール送信に失敗しました" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
