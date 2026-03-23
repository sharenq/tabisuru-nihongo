import { useState } from "react";
import type { Word } from "../data/regions";

interface WordCardProps {
  word: Word;
}

export default function WordCard({ word }: WordCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer select-none"
    >
      <div
        className={`relative w-full h-40 transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center p-4">
          <span className="text-3xl font-bold text-gray-800 mb-2">
            {word.japanese}
          </span>
          <span className="text-sm text-gray-400">(點擊翻轉)</span>
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
        </div>
      </div>
    </div>
  );
}
