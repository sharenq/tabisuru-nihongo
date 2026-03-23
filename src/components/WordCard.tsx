import { useState } from "react";
import type { Word } from "../data/regions";

interface WordCardProps {
  word: Word;
  learned?: boolean;
  onToggleLearned?: () => void;
}

export default function WordCard({ word, learned = false, onToggleLearned }: WordCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer select-none"
    >
      <div
        className={`relative w-full h-44 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className={`absolute inset-0 [backface-visibility:hidden] rounded-xl shadow-md border flex flex-col items-center justify-center p-4 ${
          learned ? "bg-green-50 border-green-200" : "bg-white border-gray-100"
        }`}>
          {learned && (
            <span className="absolute top-2 right-2 text-green-500 text-sm">✓</span>
          )}
          <span className="text-3xl font-bold text-gray-800 mb-2">
            {word.japanese}
          </span>
          <span className="text-xs text-gray-400">(點擊翻轉)</span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-md border border-indigo-100 flex flex-col items-center justify-center p-4 gap-1">
          <span className="text-xl font-bold text-gray-800">
            {word.chinese}
          </span>
          <span className="text-lg text-indigo-600">{word.hiragana}</span>
          <span className="text-sm text-gray-500">{word.romaji}</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-1">
            {word.category}
          </span>
          {onToggleLearned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLearned();
              }}
              className={`mt-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                learned
                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {learned ? "已學會 ✓" : "標記為已學會"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
