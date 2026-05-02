import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import LineProvider from "next-auth/providers/line";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const supabase = getSupabaseAdmin();
        const { data } = await supabase
          .from("profiles")
          .select("linkedin_id, name, email, image, password_hash")
          .eq("email", credentials.email)
          .not("password_hash", "is", null)
          .single();

        if (!data?.password_hash) return null;
        const valid = await bcrypt.compare(credentials.password, data.password_hash);
        if (!valid) return null;

        return { id: data.linkedin_id, name: data.name, email: data.email, image: data.image };
      },
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
