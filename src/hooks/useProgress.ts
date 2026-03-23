import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "tabisuru-progress";

export interface Progress {
  learned: Record<string, boolean>; // "regionId:japanese" -> true
  quizScores: Record<string, { correct: number; total: number; date: string }[]>;
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { learned: {}, quizScores: {} };
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleLearned = useCallback((regionId: string, japanese: string) => {
    const key = `${regionId}:${japanese}`;
    setProgress((prev) => {
      const next = { ...prev, learned: { ...prev.learned } };
      if (next.learned[key]) {
        delete next.learned[key];
      } else {
        next.learned[key] = true;
      }
      return next;
    });
  }, []);

  const isLearned = useCallback(
    (regionId: string, japanese: string) => {
      return !!progress.learned[`${regionId}:${japanese}`];
    },
    [progress.learned]
  );

  const getRegionProgress = useCallback(
    (regionId: string, totalWords: number) => {
      const count = Object.keys(progress.learned).filter((k) =>
        k.startsWith(`${regionId}:`)
      ).length;
      return { count, total: totalWords, percent: totalWords > 0 ? Math.round((count / totalWords) * 100) : 0 };
    },
    [progress.learned]
  );

  const addQuizScore = useCallback(
    (regionId: string, correct: number, total: number) => {
      setProgress((prev) => {
        const scores = prev.quizScores[regionId] ?? [];
        return {
          ...prev,
          quizScores: {
            ...prev.quizScores,
            [regionId]: [
              ...scores,
              { correct, total, date: new Date().toISOString() },
            ],
          },
        };
      });
    },
    []
  );

  const getQuizScores = useCallback(
    (regionId: string) => progress.quizScores[regionId] ?? [],
    [progress.quizScores]
  );

  const totalLearned = Object.keys(progress.learned).length;

  return {
    toggleLearned,
    isLearned,
    getRegionProgress,
    addQuizScore,
    getQuizScores,
    totalLearned,
  };
}
