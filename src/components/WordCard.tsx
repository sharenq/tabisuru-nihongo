import { useState } from "react";
import type { Word } from "../data/regions";

interface WordCardProps {
  word: Word;
  learned?: boolean;
  onToggleLearned?: () => void;
  onSpeak?: (text: string) => void;
}

export default function WordCard({
  word,
  learned = false,
  onToggleLearned,
  onSpeak,
}: WordCardProps) {
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
        <div
          className={`absolute inset-0 [backface-visibility:hidden] rounded-xl shadow-md border flex flex-col items-center justify-center p-4 ${
            learned
              ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
              : "bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700"
          }`}
        >
          {learned && (
            <span className="absolute top-2 right-2 text-green-500 text-sm">
              ✓
            </span>
          )}
          <span className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {word.japanese}
          </span>
          {onSpeak && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSpeak(word.japanese);
              }}
              className="mb-1 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="播放發音"
            >
              <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.2-3.15A.5.5 0 0111.5 6v12a.5.5 0 01-.8.4L6.5 15.2H4a1 1 0 01-1-1v-4.4a1 1 0 011-1h2.5z" />
              </svg>
            </button>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            (點擊翻轉)
          </span>
        </div>
        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-800 flex flex-col items-center justify-center p-4 gap-1">
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {word.chinese}
          </span>
          <span className="text-lg text-indigo-600 dark:text-indigo-400">
            {word.hiragana}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {word.romaji}
          </span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full mt-1">
            {word.category}
          </span>
          <div className="flex gap-2 mt-2">
            {onSpeak && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(word.japanese);
                }}
                className="p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                title="播放發音"
              >
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.5 8.8l4.2-3.15A.5.5 0 0111.5 6v12a.5.5 0 01-.8.4L6.5 15.2H4a1 1 0 01-1-1v-4.4a1 1 0 011-1h2.5z" />
                </svg>
              </button>
            )}
            {onToggleLearned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLearned();
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  learned
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {learned ? "已學會 ✓" : "標記為已學會"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
