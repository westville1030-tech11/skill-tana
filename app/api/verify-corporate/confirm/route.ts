import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "コードが必要です" }, { status: 400 });

  const { data, error } = await supabase()
    .from("corporate_email_verifications")
    .select("*")
    .eq("linkedin_id", session.user.id)
    .eq("code", code)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "コードが正しくないか、有効期限が切れています" }, { status: 400 });
  }

  // プロフィールに反映
  await supabase().from("profiles").update({
    corporate_email_verified: true,
    corporate_email_domain: data.email.split("@")[1],
    updated_at: new Date().toISOString(),
  }).eq("linkedin_id", session.user.id);

  // 使用済みコードを削除
  await supabase().from("corporate_email_verifications").delete().eq("id", data.id);

  return NextResponse.json({ ok: true, domain: data.email.split("@")[1] });
}
