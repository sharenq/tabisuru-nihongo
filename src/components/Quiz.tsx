import { useState, useMemo, useCallback } from "react";
import type { Prefecture, Word } from "../data/regions";

interface QuizProps {
  prefecture: Prefecture;
  regionColor: string;
  onBack: () => void;
  onComplete: (correct: number, total: number) => void;
}

interface Question {
  word: Word;
  options: string[];
  correctIndex: number;
  type: "ja-to-zh" | "zh-to-ja" | "listen-romaji";
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateQuestions(words: Word[], count: number): Question[] {
  const picked = shuffle(words).slice(0, count);
  return picked.map((word) => {
    const typeRoll = Math.random();
    let type: Question["type"];
    let questionOptions: string[];
    let correctAnswer: string;

    if (typeRoll < 0.4) {
      type = "ja-to-zh";
      correctAnswer = word.chinese;
      const others = shuffle(words.filter((w) => w.chinese !== word.chinese))
        .slice(0, 3)
        .map((w) => w.chinese);
      questionOptions = shuffle([correctAnswer, ...others]);
    } else if (typeRoll < 0.8) {
      type = "zh-to-ja";
      correctAnswer = word.japanese;
      const others = shuffle(words.filter((w) => w.japanese !== word.japanese))
        .slice(0, 3)
        .map((w) => w.japanese);
      questionOptions = shuffle([correctAnswer, ...others]);
    } else {
      type = "listen-romaji";
      correctAnswer = word.chinese;
      const others = shuffle(words.filter((w) => w.chinese !== word.chinese))
        .slice(0, 3)
        .map((w) => w.chinese);
      questionOptions = shuffle([correctAnswer, ...others]);
    }

    return {
      word,
      options: questionOptions,
      correctIndex: questionOptions.indexOf(correctAnswer),
      type,
    };
  });
}

export default function Quiz({ prefecture, regionColor, onBack, onComplete }: QuizProps) {
  const questionCount = Math.min(10, prefecture.words.length);
  const questions = useMemo(
    () => generateQuestions(prefecture.words, questionCount),
    [prefecture, questionCount]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const question = questions[currentIndex];

  const handleSelect = useCallback(
    (idx: number) => {
      if (answered) return;
      setSelected(idx);
      setAnswered(true);
      if (idx === question.correctIndex) {
        setCorrect((c) => c + 1);
      }
    },
    [answered, question]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
      onComplete(correct, questions.length);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  }, [currentIndex, questions.length, correct, onComplete]);

  if (finished) {
    const score = correct;
    const total = questions.length;
    const percent = Math.round((score / total) * 100);
    const emoji = percent >= 80 ? "🎉" : percent >= 50 ? "👍" : "💪";
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center max-w-sm w-full">
          <div className="text-5xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">測驗完成！</h2>
          <p className="text-gray-600 mb-1">{prefecture.name} 測驗</p>
          <div className="text-4xl font-bold my-4" style={{ color: regionColor }}>
            {score}/{total}
          </div>
          <p className="text-gray-500 mb-6">正確率 {percent}%</p>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              返回
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelected(null);
                setAnswered(false);
                setCorrect(0);
                setFinished(false);
              }}
              className="flex-1 py-3 rounded-xl text-white font-medium"
              style={{ backgroundColor: regionColor }}
            >
              再測一次
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getPrompt = () => {
    switch (question.type) {
      case "ja-to-zh":
        return (
          <div>
            <p className="text-sm text-gray-500 mb-2">這個日文是什麼意思？</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{question.word.japanese}</p>
            <p className="text-sm text-gray-400 mt-1">{question.word.hiragana}</p>
          </div>
        );
      case "zh-to-ja":
        return (
          <div>
            <p className="text-sm text-gray-500 mb-2">「{question.word.chinese}」的日文是？</p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">{question.word.chinese}</p>
          </div>
        );
      case "listen-romaji":
        return (
          <div>
            <p className="text-sm text-gray-500 mb-2">這個發音是什麼意思？</p>
            <p className="text-2xl font-bold text-indigo-600">{question.word.romaji}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-600">
            {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-green-600 font-medium">{correct} 正確</span>
        </div>
        <div className="max-w-lg mx-auto mt-2">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className="rounded-full h-1.5 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                backgroundColor: regionColor,
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 mb-6 text-center">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4"
            style={{ backgroundColor: regionColor }}
          >
            {prefecture.name}
          </span>
          {getPrompt()}
        </div>

        <div className="grid gap-3">
          {question.options.map((opt, idx) => {
            let bg = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-gray-300";
            if (answered) {
              if (idx === question.correctIndex) {
                bg = "bg-green-50 border-green-400 text-green-800";
              } else if (idx === selected && idx !== question.correctIndex) {
                bg = "bg-red-50 border-red-400 text-red-800";
              } else {
                bg = "bg-gray-50 border-gray-100 text-gray-400";
              }
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-colors ${bg}`}
              >
                <span className="text-sm text-gray-400 mr-3">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
            <p className="text-sm text-gray-600">
              <span className="font-bold">{question.word.japanese}</span>
              （{question.word.hiragana}）= {question.word.chinese}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {question.word.romaji} · {question.word.category}
            </p>
          </div>
        )}

        {answered && (
          <button
            onClick={handleNext}
            className="w-full mt-4 py-3 rounded-xl text-white font-semibold"
            style={{ backgroundColor: regionColor }}
          >
            {currentIndex + 1 >= questions.length ? "查看結果" : "下一題"}
          </button>
        )}
      </div>
    </div>
  );
}
