import { useState, useEffect, useCallback } from "react";
import JapanMap from "./components/JapanMap";
import RegionDetail from "./components/RegionDetail";
import PrefectureDetail from "./components/PrefectureDetail";
import RegionList from "./components/RegionList";
import Quiz from "./components/Quiz";
import CurrencyCalculator from "./components/CurrencyCalculator";
import Rankings from "./components/Rankings";
import { regions } from "./data/regions";
import { useProgress } from "./hooks/useProgress";
import { useDarkMode } from "./hooks/useDarkMode";

type View =
  | { type: "home" }
  | { type: "region"; id: string }
  | { type: "prefecture"; regionId: string; prefId: string }
  | { type: "quiz"; regionId: string; prefId: string }
  | { type: "rankings" };

function getAllWords() {
  return regions.flatMap((r) => r.prefectures.flatMap((p) => p.words));
}

function App() {
  const [view, setViewState] = useState<View>({ type: "home" });

  const setView = useCallback((newView: View) => {
    setViewState(newView);
    if (newView.type !== "home") {
      window.history.pushState(newView, "", null);
    }
  }, []);

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state) {
        setViewState(e.state as View);
      } else {
        setViewState({ type: "home" });
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const {
    toggleLearned,
    isLearned,
    getRegionProgress,
    addQuizScore,
    getQuizScores,
    totalLearned,
  } = useProgress();
  const { isDark, toggle: toggleDark } = useDarkMode();

  const totalWords = getAllWords().length;

  if (view.type === "quiz") {
    const region = regions.find((r) => r.id === view.regionId);
    const pref = region?.prefectures.find((p) => p.id === view.prefId);
    if (!region || !pref) return null;
    return (
      <Quiz
        prefecture={pref}
        regionColor={region.color}
        onBack={() =>
          setView({ type: "prefecture", regionId: view.regionId, prefId: view.prefId })
        }
        onComplete={(correct, total) =>
          addQuizScore(view.prefId, correct, total)
        }
      />
    );
  }

  if (view.type === "prefecture") {
    const region = regions.find((r) => r.id === view.regionId);
    const pref = region?.prefectures.find((p) => p.id === view.prefId);
    if (!region || !pref) return null;
    const scores = getQuizScores(pref.id);
    return (
      <PrefectureDetail
        prefecture={pref}
        regionColor={region.color}
        onBack={() => setView({ type: "region", id: view.regionId })}
        onStartQuiz={() =>
          setView({ type: "quiz", regionId: view.regionId, prefId: view.prefId })
        }
        isLearned={isLearned}
        toggleLearned={toggleLearned}
        progress={getRegionProgress(pref.id, pref.words.length)}
        quizScores={scores}
      />
    );
  }

  if (view.type === "rankings") {
    return (
      <Rankings
        onBack={() => setView({ type: "home" })}
        onPrefectureClick={(regionId, prefId) =>
          setView({ type: "prefecture", regionId, prefId })
        }
      />
    );
  }

  if (view.type === "region") {
    const region = regions.find((r) => r.id === view.id);
    if (!region) return null;
    return (
      <RegionDetail
        region={region}
        onBack={() => setView({ type: "home" })}
        onPrefectureClick={(prefId) =>
          setView({ type: "prefecture", regionId: view.id, prefId })
        }
        getRegionProgress={getRegionProgress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="w-10" />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              旅する日本語
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              你的日本旅遊隨身工具
            </p>
          </div>
          <button
            onClick={toggleDark}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isDark ? "切換淺色模式" : "切換深色模式"}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm0 15a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm9-8a1 1 0 010 2h-1a1 1 0 110-2h1zM5 11a1 1 0 010 2H4a1 1 0 110-2h1zm14.07-6.36a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.71-.71a1 1 0 011.41 0zM7.05 17.66a1 1 0 010 1.41l-.71.71a1 1 0 11-1.41-1.41l.71-.71a1 1 0 011.41 0zm12.02.71a1 1 0 01-1.41 0l-.71-.71a1 1 0 111.41-1.41l.71.71a1 1 0 010 1.41zM7.05 6.34a1 1 0 01-1.41 0l-.71-.71a1 1 0 011.41-1.41l.71.71a1 1 0 010 1.41zM12 7a5 5 0 100 10 5 5 0 000-10z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.75 15.5a.75.75 0 01-.07 1.05 10 10 0 01-14.23-14.23.75.75 0 011.12.98A8.5 8.5 0 1020.77 15.5a.75.75 0 01.98-.07z" />
              </svg>
            )}
          </button>
        </div>
        <div className="max-w-xs mx-auto mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>總學習進度</span>
            <span>
              {totalLearned}/{totalWords} 單字
            </span>
          </div>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-2 transition-all duration-300"
              style={{
                width: `${totalWords > 0 ? Math.round((totalLearned / totalWords) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </header>

      {/* Map section — full width on mobile, constrained on desktop */}
      <div className="max-w-2xl mx-auto px-2 py-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1 sm:p-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 text-center">
            日本地圖
          </h2>
          <JapanMap
            onPrefectureClick={(regionId, prefId) =>
              setView({ type: "prefecture", regionId, prefId })
            }
          />
        </div>
      </div>

      {/* Tools section */}
      <div className="max-w-lg mx-auto px-4 py-2 flex gap-2">
        <button
          onClick={() => setView({ type: "rankings" })}
          className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-3 text-left hover:shadow-md transition-shadow"
        >
          <span className="text-lg">🏆</span>
          <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-200">人氣排行</span>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">最受歡迎的旅遊地區</p>
        </button>
      </div>

      {/* Currency Calculator */}
      <div className="max-w-lg mx-auto px-4 py-2">
        <CurrencyCalculator />
      </div>

      {/* Region list */}
      <div className="max-w-lg mx-auto px-4 pb-6">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 mt-2">全部地區</h2>
        <RegionList
          onRegionClick={(id) => setView({ type: "region", id })}
          getRegionProgress={getRegionProgress}
        />

        <footer className="text-center text-xs text-gray-400 mt-8 pb-6">
          旅する日本語 — 你的日本旅遊隨身工具
        </footer>
      </div>
    </div>
  );
}

export default App;
