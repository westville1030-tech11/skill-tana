import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "私たちの想い | 経験イチバ",
  description: "日本企業に眠る膨大な知見を解放し、経済を活性化する。経験イチバが生まれた理由。",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-4 pt-20 pb-16">
        <Link href="/" className="text-sm text-teal-600 hover:underline">← トップへ戻る</Link>
        <p className="text-sm font-bold text-teal-600 tracking-widest mt-8 mb-4">私たちの想い</p>
        <h1 className="text-4xl font-black text-gray-900 leading-tight mb-8">
          会社を去る日、<br />
          35年分の知見も<br />
          去っていく。
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          日本中に眠っている「誰かの役に立つはずの経験」を、
          必要としている人に届ける。それが、経験イチバをつくった理由です。
        </p>
      </section>

      {/* Story: 父親 */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="border-l-4 border-teal-400 pl-6 mb-10">
            <p className="text-sm font-bold text-teal-600 mb-2">創業者の原体験</p>
            <p className="text-2xl font-black text-gray-900 leading-snug">
              父は、35年勤め上げて退職した。
            </p>
          </div>
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              定年の日、送別会があって、花束をもらって、次の日から「ただの人」になった。
            </p>
            <p>
              35年間で積み上げた、仕入れ交渉の感覚、取引先との信頼の作り方、
              数字が示さない市場の変化の読み方——そのすべてが、
              父の頭の中だけに残って、使われなくなった。
            </p>
            <p>
              これは父だけの話ではない。
              日本中で、毎年何万人もの「現役引退」が起きている。
              そのたびに、膨大な知見が社会から消えている。
            </p>
          </div>
        </div>
      </section>

      {/* Problem: 日本の構造 */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm font-bold text-teal-600 tracking-widest mb-4">日本企業の構造問題</p>
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            終身雇用が当たり前の国で、<br />知見は会社の中に閉じ込められている。
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
              <p className="text-3xl font-black text-amber-600 mb-2">35年</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                一つの会社に勤め続けることで積み上がる経験は膨大だ。
                しかしそれは、その会社の「内側の論理」でしか評価されない。
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
              <p className="text-3xl font-black text-blue-600 mb-2">他社は？</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                コンサルタントとして多くの上場企業の現場に入って、
                必ずといっていいほど聞かれる言葉がある。
                「他社さんは、これどうやってますか？」
              </p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">
            転職が少ないから、知見が会社の壁を越えない。
            だから同じ失敗が繰り返される。同じ悩みが別々の場所で解決されずにいる。
            優秀な人材が一流企業で培った知見が、隣の会社に届かない。
          </p>
        </div>
      </section>

      {/* Problem: 埋もれている人たち */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            「埋もれている」のは、<br />
            退職した人だけじゃない。
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              いい大学を出て、努力して、一流企業で結果を出してきた人たちがいる。
              採用面接を10年担当してきた人事担当者。
              融資審査を30年続けてきた銀行員。
              海外拠点を立ち上げてきたビジネスパーソン。
            </p>
            <p>
              彼らの知見は、今この瞬間も活きている。
              でも、会社の外には届いていない。
            </p>
            <p className="font-bold text-gray-900">
              それは、知見を届ける「場所」がなかっただけだ、と私たちは考えている。
            </p>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-sm font-bold text-teal-600 tracking-widest mb-4">経験イチバの存在意義</p>
          <h2 className="text-2xl font-black text-gray-900 mb-8">
            努力の結晶を、<br />
            最大限に活かす場所をつくる。
          </h2>
          <div className="space-y-5 text-gray-600 leading-relaxed mb-10">
            <p>
              「老後2,000万円問題」が語られるようになって久しい。
              でも、長年積み上げてきた知見には、それを補うだけの価値がある。
              まだ気づいていないだけで。
            </p>
            <p>
              経験イチバは、個人の実体験に価格をつけて、必要な人に届けるための市場だ。
              マッチングサービスではない。<strong className="text-gray-900">知見の流通市場</strong>をつくりたい。
            </p>
            <p>
              AIが叩き台を作る。経験者がそこに実体験を加える。
              それは、誰の検索にも引っかからない、その人だけが持っている洞察だ。
            </p>
          </div>
          <div className="rounded-2xl bg-teal-600 p-8 text-white">
            <p className="text-lg font-black mb-3">経験イチバが目指すこと</p>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-teal-300 font-bold flex-shrink-0">—</span>
                日本企業に閉じ込められた知見を、社会に循環させる
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-300 font-bold flex-shrink-0">—</span>
                退職後も、現役中も、自分の経験が誰かの力になれる場所をつくる
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-300 font-bold flex-shrink-0">—</span>
                「他社はどうしているか」に、リアルな声で答えられる国にする
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm mb-6">あなたの経験も、誰かが必要としている。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/try"
              className="inline-block bg-teal-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-700 transition-colors"
            >
              AIに経験を話してみる
            </Link>
            <Link
              href="/"
              className="inline-block border border-gray-200 text-gray-600 font-bold px-8 py-4 rounded-xl hover:border-gray-300 transition-colors"
            >
              サービスの仕組みを見る
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
