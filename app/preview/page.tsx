export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-sm p-10">
        <p className="text-xs text-gray-400 mb-8 text-center tracking-widest uppercase">プレビュー（確認用）</p>
        <ConceptDiagram />
      </div>
    </div>
  );
}

function ConceptDiagram() {
  return (
    <svg
      viewBox="0 0 720 310"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: "sans-serif" }}
    >
      {/* ===== BEFORE ===== */}
      <text x="16" y="26" fontSize="10" fill="#9ca3af" fontWeight="700" letterSpacing="3">BEFORE</text>

      {/* クライアントカード */}
      <ActorCard x={14} y={42} icon="🏢" topLabel="クライアント" bottomLabel="依頼する側" color="#f3f4f6" border="#d1d5db" />

      {/* 矢印1 */}
      <ThinArrow x1={122} y1={78} x2={178} y2={78} />

      {/* 仲介ボックス */}
      <FeeBox x={178} y={52} label="仲介会社" sub="手数料 20〜30%" color="#fef2f2" border="#fca5a5" textColor="#dc2626" />

      {/* 矢印2 */}
      <ThinArrow x1={318} y1={78} x2={374} y2={78} />

      {/* エージェントボックス */}
      <FeeBox x={374} y={52} label="エージェント" sub="登録料・成約料" color="#fffbeb" border="#fcd34d" textColor="#b45309" />

      {/* 矢印3 */}
      <ThinArrow x1={514} y1={78} x2={570} y2={78} />

      {/* プロカード */}
      <ActorCard x={570} y={42} icon="💼" topLabel="プロ" bottomLabel="スキルを持つ側" color="#f3f4f6" border="#d1d5db" />

      {/* ===== 区切り線 ===== */}
      <line x1="24" y1="148" x2="696" y2="148" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="6 4" />

      {/* ===== AFTER ===== */}
      <text x="16" y="174" fontSize="10" fill="#16a34a" fontWeight="700" letterSpacing="3">AFTER</text>

      {/* クライアントカード（青） */}
      <ActorCard x={14} y={188} icon="🏢" topLabel="クライアント" bottomLabel="依頼する側" color="#eff6ff" border="#bfdbfe" />

      {/* 直接発注ライン */}
      <line x1="122" y1="224" x2="568" y2="224" stroke="#3b82f6" strokeWidth="2.5" />
      <polygon points="566,217 582,224 566,231" fill="#3b82f6" />

      {/* 中央バッジ */}
      <rect x="240" y="204" width="240" height="42" rx="21" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1.5" />
      <text x="360" y="221" fontSize="13" fill="#1d4ed8" fontWeight="800" textAnchor="middle">直接発注</text>
      <text x="360" y="237" fontSize="10.5" fill="#3b82f6" textAnchor="middle">手数料・仲介料 すべて ¥0</text>

      {/* プロカード（青） */}
      <ActorCard x={582} y={188} icon="💼" topLabel="プロ" bottomLabel="スキルを持つ側" color="#eff6ff" border="#bfdbfe" />

      {/* ✓ 3点 */}
      <text x="360" y="284" fontSize="10.5" fill="#16a34a" fontWeight="600" textAnchor="middle">
        ✓ 登録料 ¥0　　✓ 月額利用料 ¥0　　✓ 成約手数料 ¥0
      </text>
    </svg>
  );
}

function ActorCard({ x, y, icon, topLabel, bottomLabel, color, border }: {
  x: number; y: number; icon: string;
  topLabel: string; bottomLabel: string;
  color: string; border: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={108} height={72} rx={12} fill={color} stroke={border} strokeWidth="1.5" />
      <text x={x + 54} y={y + 28} fontSize="22" textAnchor="middle">{icon}</text>
      <text x={x + 54} y={y + 48} fontSize="11.5" fill="#111827" textAnchor="middle" fontWeight="700">{topLabel}</text>
      <text x={x + 54} y={y + 63} fontSize="9.5" fill="#6b7280" textAnchor="middle">{bottomLabel}</text>
    </g>
  );
}

function ThinArrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 6} y2={y2} stroke="#d1d5db" strokeWidth="1.5" />
      <polygon points={`${x2 - 6},${y2 - 4} ${x2},${y2} ${x2 - 6},${y2 + 4}`} fill="#d1d5db" />
    </g>
  );
}

function FeeBox({ x, y, label, sub, color, border, textColor }: {
  x: number; y: number; label: string; sub: string;
  color: string; border: string; textColor: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={140} height={50} rx={10} fill={color} stroke={border} strokeWidth="1.5" />
      <text x={x + 70} y={y + 21} fontSize="12" fill={textColor} textAnchor="middle" fontWeight="700">{label}</text>
      <text x={x + 70} y={y + 37} fontSize="10" fill={textColor} textAnchor="middle" opacity="0.85">{sub}</text>
    </g>
  );
}
