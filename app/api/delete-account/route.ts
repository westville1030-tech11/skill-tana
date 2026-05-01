import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

function supabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });

  const id = session.user.id;

  await supabase().from("corporate_email_verifications").delete().eq("linkedin_id", id);
  await supabase().from("profiles").delete().eq("linkedin_id", id);

  return NextResponse.json({ ok: true });
}
