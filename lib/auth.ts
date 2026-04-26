import type { NextAuthOptions } from "next-auth";
import LinkedInProvider from "next-auth/providers/linkedin";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid profile email" },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // LinkedInでログイン時にprofilesテーブルへupsert
      await getSupabaseAdmin().from("profiles").upsert(
        {
          linkedin_id: account?.providerAccountId,
          name: user.name ?? "",
          email: user.email,
          image: user.image ?? null,
          linkedin_url: `https://www.linkedin.com/in/${account?.providerAccountId}`,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "linkedin_id", ignoreDuplicates: false }
      );

      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        token.linkedinId = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
