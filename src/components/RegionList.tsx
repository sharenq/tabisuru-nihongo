import { regions } from "../data/regions";

interface RegionListProps {
  onRegionClick: (regionId: string) => void;
  getRegionProgress: (regionId: string, total: number) => { count: number; total: number; percent: number };
}

export default function RegionList({ onRegionClick, getRegionProgress }: RegionListProps) {
  return (
    <div className="grid gap-3">
      {regions.map((region) => {
        const progress = getRegionProgress(region.id, region.words.length);
        return (
          <button
            key={region.id}
            onClick={() => onRegionClick(region.id)}
            className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow text-left"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
              style={{ backgroundColor: region.color }}
            >
              {region.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-gray-800 dark:text-gray-100">
                {region.name}
                <span className="text-sm font-normal text-gray-400 ml-2">
                  {region.nameJa}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {region.words.length} 個單字 · {region.prefectures.join("、")}
              </div>
              <div className="mt-1.5 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="rounded-full h-1.5 transition-all duration-300"
                  style={{
                    width: `${progress.percent}%`,
                    backgroundColor: region.color,
                  }}
                />
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {progress.count}/{progress.total} 已學會
              </div>
            </div>
            <svg
              className="w-5 h-5 text-gray-300 dark:text-gray-600 shrink-0 ml-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
