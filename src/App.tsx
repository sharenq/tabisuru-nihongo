import { useState } from "react";
import JapanMap from "./components/JapanMap";
import RegionDetail from "./components/RegionDetail";
import RegionList from "./components/RegionList";
import { regions } from "./data/regions";

function App() {
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const selectedRegion = regions.find((r) => r.id === selectedRegionId) ?? null;

  if (selectedRegion) {
    return (
      <RegionDetail
        region={selectedRegion}
        onBack={() => setSelectedRegionId(null)}
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
      </header>

      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-2 text-center">
            日本地圖
          </h2>
          <JapanMap
            onRegionClick={setSelectedRegionId}
            selectedRegion={selectedRegionId}
          />
        </div>

        {/* Region List */}
        <h2 className="text-sm font-semibold text-gray-500 mb-3">全部地區</h2>
        <RegionList onRegionClick={setSelectedRegionId} />

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 mt-8 pb-6">
          旅する日本語 — 邊旅行邊學日文
        </footer>
      </div>
    </div>
  );
}

export default App;
