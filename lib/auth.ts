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
  authorization: {
    url: "https://www.linkedin.com/oauth/v2/authorization",
    params: { scope: "openid profile email" },
  },
  token: {
    url: "https://www.linkedin.com/oauth/v2/accessToken",
    // Strip id_token from response — next-auth v4 tries to validate it but
    // fails because it doesn't know LinkedIn's issuer. We use the userinfo
    // endpoint instead, so the id_token is unnecessary.
    async request(context: Record<string, unknown>) {
      const provider = context.provider as Record<string, unknown>;
      const params = context.params as Record<string, string>;
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: params.code,
        redirect_uri: provider.callbackUrl as string,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      });
      if (params.code_verifier) body.set("code_verifier", params.code_verifier);
      const res = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      const tokens = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id_token: _dropped, ...rest } = tokens;
      return { tokens: rest };
    },
  },
  userinfo: "https://api.linkedin.com/v2/userinfo",
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  profile(profile: Record<string, unknown>) {
    return {
      id: profile.sub as string,
      name: (profile.name as string) ?? "",
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
  logger: {
    error(code, metadata) {
      console.error("[next-auth] ERROR:", code, JSON.stringify(metadata));
    },
    warn(code) {
      console.warn("[next-auth] WARN:", code);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
    state: {
      name: "next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 900,
      },
    },
  },
};
