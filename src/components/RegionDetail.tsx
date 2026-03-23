import { useState } from "react";
import type { Region } from "../data/regions";
import { categories } from "../data/regions";
import WordCard from "./WordCard";
import SearchBar from "./SearchBar";
import { useSpeech } from "../hooks/useSpeech";

interface RegionDetailProps {
  region: Region;
  onBack: () => void;
  onStartQuiz: () => void;
  isLearned: (regionId: string, japanese: string) => boolean;
  toggleLearned: (regionId: string, japanese: string) => void;
  regionProgress: { count: number; total: number; percent: number };
  quizScores?: { correct: number; total: number; date: string }[];
}

export default function RegionDetail({
  region,
  onBack,
  onStartQuiz,
  isLearned,
  toggleLearned,
  regionProgress,
  quizScores = [],
}: RegionDetailProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { speak, isSupported } = useSpeech();

  const filteredWords = region.words.filter((w) => {
    const matchCategory =
      selectedCategory === "all" || w.category === selectedCategory;
    const matchSearch =
      !search ||
      w.japanese.includes(search) ||
      w.hiragana.includes(search) ||
      w.chinese.includes(search) ||
      w.romaji.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const availableCategories = categories.filter(
    (c) => c.id === "all" || region.words.some((w) => w.category === c.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div
        className="text-white px-4 pt-6 pb-8"
        style={{ backgroundColor: region.color }}
      >
        <button
          onClick={onBack}
          className="mb-4 flex items-center gap-1 text-white/80 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回地圖
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              {region.name}
              <span className="text-lg font-normal ml-2 opacity-80">
                {region.nameJa}
              </span>
            </h1>
            <p className="text-sm opacity-90 leading-relaxed mt-2">
              {region.description}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${regionProgress.percent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs opacity-80">
            已學會 {regionProgress.count}/{regionProgress.total} 個單字
          </span>
          <span className="text-xs opacity-80">{regionProgress.percent}%</span>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">當地特色</h2>
          <div className="flex flex-wrap gap-2">
            {region.features.map((f) => (
              <span
                key={f}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Prefectures */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">包含地區</h2>
          <p className="text-gray-700 dark:text-gray-300 text-sm">
            {region.prefectures.join("、")}
          </p>
        </div>

        {/* Quiz section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">測驗</h2>
            {quizScores.length > 0 && (
              <span className="text-xs text-gray-400">
                最近: {quizScores[quizScores.length - 1].correct}/
                {quizScores[quizScores.length - 1].total}
              </span>
            )}
          </div>
          <button
            onClick={onStartQuiz}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl py-3 font-semibold shadow-sm hover:shadow-md transition-shadow"
          >
            {quizScores.length > 0 ? "再測一次" : "開始測驗"}
          </button>
          {quizScores.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {quizScores.slice(-5).map((s, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 text-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {Math.round((s.correct / s.total) * 100)}%
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(s.date).toLocaleDateString("zh-TW", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <SearchBar value={search} onChange={setSearch} />

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Word Cards */}
        <div className="grid grid-cols-2 gap-3 pb-8">
          {filteredWords.map((word) => (
            <WordCard
              key={word.japanese}
              word={word}
              learned={isLearned(region.id, word.japanese)}
              onToggleLearned={() => toggleLearned(region.id, word.japanese)}
              onSpeak={isSupported ? speak : undefined}
            />
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {search ? "找不到相關單字" : "此分類暫無單字"}
          </div>
        )}
      </div>
    </div>
  );
}
