import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "スキル棚 — プロのスキルと成果物が並ぶ棚",
  description:
    "一流企業で活躍するプロに直接依頼。手数料ゼロ、固定価格、LinkedIn認証で安心。CSV分析・戦略相談・開発など週末スポット対応。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900 antialiased">
        <SessionProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-100 bg-white py-8 text-center text-sm text-gray-400">
            © 2025 スキル棚 · 登録料・利用料・手数料、すべて永久無料
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
