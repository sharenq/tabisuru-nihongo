import { useState } from "react";
import JapanMap from "./components/JapanMap";
import RegionDetail from "./components/RegionDetail";
import RegionList from "./components/RegionList";
import Quiz from "./components/Quiz";
import { regions } from "./data/regions";
import { useProgress } from "./hooks/useProgress";

type View =
  | { type: "home" }
  | { type: "region"; id: string }
  | { type: "quiz"; id: string };

function App() {
  const [view, setView] = useState<View>({ type: "home" });
  const {
    toggleLearned,
    isLearned,
    getRegionProgress,
    addQuizScore,
    getQuizScores,
    totalLearned,
  } = useProgress();

  const totalWords = regions.reduce((sum, r) => sum + r.words.length, 0);

  if (view.type === "quiz") {
    const region = regions.find((r) => r.id === view.id);
    if (!region) return null;
    return (
      <Quiz
        region={region}
        onBack={() => setView({ type: "region", id: view.id })}
        onComplete={(correct, total) => addQuizScore(view.id, correct, total)}
      />
    );
  }

  if (view.type === "region") {
    const region = regions.find((r) => r.id === view.id);
    if (!region) return null;
    const scores = getQuizScores(region.id);
    return (
      <RegionDetail
        region={region}
        onBack={() => setView({ type: "home" })}
        onStartQuiz={() => setView({ type: "quiz", id: view.id })}
        isLearned={isLearned}
        toggleLearned={toggleLearned}
        regionProgress={getRegionProgress(region.id, region.words.length)}
        quizScores={scores}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          旅する日本語
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          點擊地圖或選擇地區，學習旅遊日文
        </p>
        {/* Overall progress */}
        <div className="max-w-xs mx-auto mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>總學習進度</span>
            <span>
              {totalLearned}/{totalWords} 單字
            </span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full h-2 transition-all duration-300"
              style={{
                width: `${totalWords > 0 ? Math.round((totalLearned / totalWords) * 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 text-center">
            日本地圖
          </h2>
          <JapanMap
            onRegionClick={(id) => setView({ type: "region", id })}
            selectedRegion={null}
          />
        </div>

        {/* Region List */}
        <h2 className="text-sm font-semibold text-gray-500 mb-3">全部地區</h2>
        <RegionList
          onRegionClick={(id) => setView({ type: "region", id })}
          getRegionProgress={getRegionProgress}
        />

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-8 pb-6">
          旅する日本語 — 邊旅行邊學日文
        </footer>
      </div>
    </div>
  );
}

export default App;
