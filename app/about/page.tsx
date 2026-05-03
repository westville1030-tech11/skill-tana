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
          経験の流通市場を<br />つくる。
        </h1>

        <div className="space-y-6 text-gray-600 leading-relaxed text-[15px]">
          <p>
            「歴史に学べ」とはよく言う。先人たちはどうやっていたのか——。<br />
            でも、社会の中で積み上げられた歴史が書き残されるのは、ほんの一部だ。
          </p>
          <p>
            どの交渉で何が決め手になったか。どんな判断が危機を救ったか。<br />
            それは報告書にも教科書にも残らない。経験した人の頭の中にだけあり、引退とともに使われなくなる。
          </p>
          <p>
            経験をシェアしたくても、その場がなかった。<br />
            AIの到来で、それが可能な時代になった。
          </p>
          <p>
            専門知識や情報は、AIで誰でも手に入る時代になった。<br />
            だからこそ、個人が積み上げた生きた現場での経験に、かつてない価値が宿る。
          </p>
          <p>
            そんな経験が巡るイチバでありたい。
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
