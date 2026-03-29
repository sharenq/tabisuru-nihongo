import { useState } from "react";
import {
  rankingCategories,
  prefectureChineseName,
  regionChineseName,
} from "../data/rankings";
import type { RankedPrefecture } from "../data/rankings";

interface RankingsProps {
  onBack: () => void;
  onPrefectureClick: (regionId: string, prefId: string) => void;
}

function getRankStyle(rank: number): { color: string; bg: string } {
  if (rank === 1) return { color: "#B8860B", bg: "#FFF8DC" };
  if (rank === 2) return { color: "#808080", bg: "#F0F0F0" };
  if (rank === 3) return { color: "#CD7F32", bg: "#FFF0E0" };
  return { color: "#6B7280", bg: "transparent" };
}

function getRankStyleDark(rank: number): { color: string; bg: string } {
  if (rank === 1) return { color: "#FFD700", bg: "rgba(255,215,0,0.15)" };
  if (rank === 2) return { color: "#C0C0C0", bg: "rgba(192,192,192,0.15)" };
  if (rank === 3) return { color: "#CD7F32", bg: "rgba(205,127,50,0.15)" };
  return { color: "#9CA3AF", bg: "transparent" };
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-400 rounded-full h-2 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-8 text-right">
        {score}
      </span>
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");
  const style = isDark ? getRankStyleDark(rank) : getRankStyle(rank);

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
      style={{ color: style.color, backgroundColor: style.bg }}
    >
      {rank}
    </div>
  );
}

function PrefectureRow({
  item,
  rank,
  onClick,
}: {
  item: RankedPrefecture;
  rank: number;
  onClick: () => void;
}) {
  const prefName = prefectureChineseName[item.prefectureId] ?? item.prefectureId;
  const regionName = regionChineseName[item.regionId] ?? item.regionId;

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
    >
      <RankBadge rank={rank} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-gray-800 dark:text-gray-100">
            {prefName}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {regionName}
          </span>
        </div>
        <ScoreBar score={item.score} />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {item.highlights.map((h) => (
            <span
              key={h}
              className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
      <svg
        className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
}

export default function Rankings({ onBack, onPrefectureClick }: RankingsProps) {
  const [activeCategory, setActiveCategory] = useState(
    rankingCategories[0].id
  );

  const category = rankingCategories.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white px-4 pt-6 pb-8">
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回首頁
        </button>
        <h1 className="text-3xl font-bold mb-1">人氣排行榜</h1>
        <p className="text-sm opacity-90 leading-relaxed mt-2">
          探索最受歡迎的日本旅遊目的地，找到你的下一趟旅程
        </p>
      </div>

      {/* Category tabs */}
      <div className="px-4 -mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {rankingCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? "bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-md border border-amber-200 dark:border-amber-700"
                    : "bg-white/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category description */}
      {category && (
        <div className="px-4 mt-3 mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {category.description}
          </p>
        </div>
      )}

      {/* Ranking list */}
      <div className="px-4 pb-8">
        <div className="grid gap-3">
          {category?.items.map((item, index) => (
            <PrefectureRow
              key={item.prefectureId}
              item={item}
              rank={index + 1}
              onClick={() =>
                onPrefectureClick(item.regionId, item.prefectureId)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
