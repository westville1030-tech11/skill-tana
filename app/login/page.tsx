"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/profile/edit";

  useEffect(() => {
    if (session) router.push(next);
  }, [session, router, next]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">経験イチバ</h1>
      <p className="text-gray-500 text-sm mb-10">LINEアカウントで登録・ログインできます</p>

      <button
        onClick={() => signIn("line", { callbackUrl: next })}
        className="w-full bg-[#06C755] text-white py-4 rounded-xl font-bold text-base hover:bg-[#05a847] transition-colors flex items-center justify-center gap-3"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C6.48 2 2 6.07 2 11.07c0 4.5 3.44 8.26 8.14 8.93.32.07.75.21.86.48.1.24.06.62.03.86l-.14.83c-.04.24-.19.95.83.52 1.02-.44 5.52-3.25 7.53-5.56C20.85 15.42 22 13.35 22 11.07 22 6.07 17.52 2 12 2z"/>
        </svg>
        LINEでログイン / 新規登録
      </button>

      <p className="text-xs text-gray-400 mt-6 leading-relaxed">
        LINEアカウントは電話番号と紐付いているため、<br />なりすまし防止・安心な取引に役立てています。
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
