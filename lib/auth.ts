import type { NextAuthOptions } from "next-auth";
import LineProvider from "next-auth/providers/line";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CHANNEL_ID!,
      clientSecret: process.env.LINE_CHANNEL_SECRET!,
      authorization: { params: { scope: "profile openid" } },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user?.id) {
        if (account?.provider === "line") {
          const lineInternalId = `line_${user.id}`;
          const supabase = getSupabaseAdmin();
          await supabase.from("profiles").upsert(
            {
              linkedin_id: lineInternalId,
              name: user.name ?? null,
              image: user.image ?? null,
              line_verified: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "linkedin_id" }
          );
          token.sub = lineInternalId;
        } else {
          token.sub = user.id;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
