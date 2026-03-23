import { useState } from "react";
import type { Region } from "../data/regions";
import { categories } from "../data/regions";
import WordCard from "./WordCard";

interface RegionDetailProps {
  region: Region;
  onBack: () => void;
}

export default function RegionDetail({ region, onBack }: RegionDetailProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredWords =
    selectedCategory === "all"
      ? region.words
      : region.words.filter((w) => w.category === selectedCategory);

  const availableCategories = categories.filter(
    (c) => c.id === "all" || region.words.some((w) => w.category === c.id)
  );

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="px-4 -mt-4">
        {/* Features */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">當地特色</h2>
          <div className="flex flex-wrap gap-2">
            {region.features.map((f) => (
              <span
                key={f}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Prefectures */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">包含地區</h2>
          <p className="text-gray-700 text-sm">{region.prefectures.join("、")}</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {availableCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-600 border border-gray-200"
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
            <WordCard key={word.japanese} word={word} />
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            此分類暫無單字
          </div>
        )}
      </div>
    </div>
  );
}
