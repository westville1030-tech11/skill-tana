import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "このサービスについて | 経験イチバ",
  description: "経験の流通市場をつくる。経験イチバが生まれた理由。",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="max-w-2xl mx-auto px-4 pt-20 pb-24">
        <Link href="/" className="text-sm text-teal-600 hover:underline">← トップへ戻る</Link>

        <p className="text-sm font-bold text-teal-600 tracking-widest mt-10 mb-4">このサービスについて</p>
        <h1 className="text-4xl font-black text-gray-900 leading-tight mb-12">
          埋もれた経験を、<br />社会に循環させる
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
          <p>
            会社員も、個人事業主も、研究員も、教員も、その人がその場で積み上げた経験は、関わった環境の外には出ません。書籍として残す人はほんの一握りで、多くの経験は引退とともに失われます。
          </p>
          <p>
            専門知識、公知情報はAIによって誰もが簡単に手にできる時代になりました。これまで「価値がある」とされてきたことがAIに置き換わる今、我々は何を考えて行動すべきでしょうか。
          </p>
          <p>
            私達は、個人が積み上げる生きた現場での経験が、それであると考えています。ヒトとヒトのつながりの中で、何が起こり、どう感じ、どう行動したか。これはヒトにしかなしえない所業です。
          </p>
          <p>
            このプラットフォームは、皆様がAIと伴走しながら、皆様の中に埋もれている経験を掘り起こし、皆様が新たな経験を積み、皆様の経験により社会を循環させることをミッションとしております。
          </p>
        </div>

        {/* Mission box */}
        <div className="mt-14 rounded-2xl bg-teal-600 p-8 text-white">
          <p className="font-bold mb-5">経験イチバが目指すこと</p>
          <ul className="space-y-4 text-sm leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-teal-300 font-bold flex-shrink-0">—</span>
              日本中に眠る経験を、社会に循環させる
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal-300 font-bold flex-shrink-0">—</span>
              退職後も、現役中も、自分の経験が誰かの力になれる場所をつくる
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col sm:flex-row gap-4">
          <Link
            href="/try"
            className="inline-block bg-teal-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors text-center"
          >
            AIに経験を話してみる
          </Link>
          <Link
            href="/"
            className="inline-block border border-gray-200 text-gray-600 font-bold px-8 py-4 rounded-xl hover:border-gray-300 transition-colors text-center"
          >
            サービスの仕組みを見る
          </Link>
        </div>
      </section>
    </div>
  );
}
