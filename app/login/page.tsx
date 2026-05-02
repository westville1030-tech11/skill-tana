"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.push("/profile/edit");
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      router.push("/profile/edit");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">ログイン</h1>
      <p className="text-gray-500 text-sm text-center mb-8">経験イチバにログインする</p>

      <button
        onClick={() => signIn("line", { callbackUrl: "/profile/edit" })}
        className="w-full bg-[#06C755] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#05a847] transition-colors flex items-center justify-center gap-3 mb-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.07 2 11.07c0 4.5 3.44 8.26 8.14 8.93.32.07.75.21.86.48.1.24.06.62.03.86l-.14.83c-.04.24-.19.95.83.52 1.02-.44 5.52-3.25 7.53-5.56C20.85 15.42 22 13.35 22 11.07 22 6.07 17.52 2 12 2z"/>
        </svg>
        LINEでログイン
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 border-t border-gray-200" />
        <span className="text-xs text-gray-400">またはメールで</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8文字以上"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        アカウントをお持ちでない方は{" "}
        <Link href="/signup" className="text-blue-600 hover:underline">新規登録</Link>
      </p>
    </div>
  );
}
