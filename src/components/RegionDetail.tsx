import type { Region } from "../data/regions";

interface RegionDetailProps {
  region: Region;
  onBack: () => void;
  onPrefectureClick: (prefId: string) => void;
  getRegionProgress: (id: string, total: number) => { count: number; total: number; percent: number };
}

export default function RegionDetail({
  region,
  onBack,
  onPrefectureClick,
  getRegionProgress,
}: RegionDetailProps) {
  const totalWords = region.prefectures.reduce((s, p) => s + p.words.length, 0);
  const totalLearned = region.prefectures.reduce(
    (s, p) => s + getRegionProgress(p.id, p.words.length).count,
    0
  );
  const totalPercent = totalWords > 0 ? Math.round((totalLearned / totalWords) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="text-white px-4 pt-6 pb-8" style={{ backgroundColor: region.color }}>
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
          <span className="text-lg font-normal ml-2 opacity-80">{region.nameJa}</span>
        </h1>
        <p className="text-sm opacity-90 leading-relaxed mt-2">{region.description}</p>
        {/* Progress */}
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div
            className="bg-white rounded-full h-2 transition-all duration-300"
            style={{ width: `${totalPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs opacity-80">
            已學會 {totalLearned}/{totalWords} 個單字
          </span>
          <span className="text-xs opacity-80">{totalPercent}%</span>
        </div>
      </div>

      <div className="px-4 -mt-4">
        {/* Prefecture list */}
        <div className="grid gap-3 pb-8">
          {region.prefectures.map((pref) => {
            const progress = getRegionProgress(pref.id, pref.words.length);
            return (
              <button
                key={pref.id}
                onClick={() => onPrefectureClick(pref.id)}
                className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold shrink-0"
                  style={{ backgroundColor: region.color, opacity: 0.85 }}
                >
                  {pref.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-gray-800 dark:text-gray-100">
                    {pref.name}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      {pref.nameJa}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {pref.words.length} 個單字 · {pref.features.slice(0, 3).join("、")}
                  </div>
                  <div className="mt-1.5 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="rounded-full h-1.5 transition-all duration-300"
                      style={{ width: `${progress.percent}%`, backgroundColor: region.color }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {progress.count}/{progress.total} 已學會
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
