import { regions } from "../data/regions";

interface RegionListProps {
  onRegionClick: (regionId: string) => void;
}

export default function RegionList({ onRegionClick }: RegionListProps) {
  return (
    <div className="grid gap-3">
      {regions.map((region) => (
        <button
          key={region.id}
          onClick={() => onRegionClick(region.id)}
          className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left"
        >
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shrink-0"
            style={{ backgroundColor: region.color }}
          >
            {region.name[0]}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-800">
              {region.name}
              <span className="text-sm font-normal text-gray-400 ml-2">
                {region.nameJa}
              </span>
            </div>
            <div className="text-sm text-gray-500 truncate">
              {region.words.length} 個單字 · {region.prefectures.join("、")}
            </div>
          </div>
          <svg className="w-5 h-5 text-gray-300 shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      ))}
    </div>
  );
}
