import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const linkedInOIDC: any = {
  id: "linkedin",
  name: "LinkedIn",
  type: "oauth",
  wellKnown: "https://www.linkedin.com/oauth/.well-known/openid-configuration",
  authorization: { params: { scope: "openid profile email" } },
  idToken: true,
  checks: ["pkce", "state"],
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  profile(profile: Record<string, unknown>) {
    const name =
      (profile.name as string) ??
      [profile.given_name, profile.family_name].filter(Boolean).join(" ") ??
      "";
    return {
      id: profile.sub as string,
      name,
      email: (profile.email as string) ?? "",
      image: (profile.picture as string) ?? null,
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [
    linkedInOIDC,
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
    async signIn({ user, account }) {
      if (!user.email) return false;
      if (account?.provider !== "linkedin") return true;

      try {
        await getSupabaseAdmin()
          .from("profiles")
          .upsert(
            {
              linkedin_id: account.providerAccountId,
              name: user.name ?? "",
              email: user.email,
              image: user.image ?? null,
              linkedin_verified: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "linkedin_id", ignoreDuplicates: false }
          );
      } catch (e) {
        console.error("[auth] Supabase upsert failed:", e);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account, user }) {
      if (account?.provider === "linkedin") {
        token.sub = account.providerAccountId;
      } else if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
