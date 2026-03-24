import { useEffect, useRef, useState } from "react";

// SVG prefecture ID → our prefecture ID
const svgIdToOurId: Record<string, string> = {
  JP01: "hokkaido",
  JP02: "aomori",
  JP03: "iwate",
  JP04: "miyagi",
  JP05: "akita",
  JP06: "yamagata",
  JP07: "fukushima",
  JP08: "ibaraki",
  JP09: "tochigi",
  JP10: "gunma",
  JP11: "saitama",
  JP12: "chiba",
  JP13: "tokyo",
  JP14: "kanagawa",
  JP15: "niigata",
  JP16: "toyama",
  JP17: "ishikawa",
  JP18: "fukui",
  JP19: "yamanashi",
  JP20: "nagano",
  JP21: "gifu",
  JP22: "shizuoka",
  JP23: "aichi",
  JP24: "mie",
  JP25: "shiga",
  JP26: "kyoto",
  JP27: "osaka",
  JP28: "hyogo",
  JP29: "nara",
  JP30: "wakayama",
  JP31: "tottori",
  JP32: "shimane",
  JP33: "okayama",
  JP34: "hiroshima",
  JP35: "yamaguchi",
  JP36: "tokushima",
  JP37: "kagawa",
  JP38: "ehime",
  JP39: "kochi",
  JP40: "fukuoka",
  JP41: "saga",
  JP42: "nagasaki",
  JP43: "kumamoto",
  JP44: "oita",
  JP45: "miyazaki",
  JP46: "kagoshima",
  JP47: "okinawa",
};

// Our prefecture ID → region ID
const prefToRegion: Record<string, string> = {
  hokkaido: "hokkaido",
  aomori: "tohoku", iwate: "tohoku", miyagi: "tohoku", akita: "tohoku", yamagata: "tohoku", fukushima: "tohoku",
  tokyo: "kanto", kanagawa: "kanto", chiba: "kanto", saitama: "kanto", tochigi: "kanto", gunma: "kanto", ibaraki: "kanto",
  aichi: "chubu", shizuoka: "chubu", yamanashi: "chubu", nagano: "chubu", niigata: "chubu", toyama: "chubu", ishikawa: "chubu", fukui: "chubu", gifu: "chubu",
  kyoto: "kinki", osaka: "kinki", nara: "kinki", hyogo: "kinki", shiga: "kinki", mie: "kinki", wakayama: "kinki",
  hiroshima: "chugoku", okayama: "chugoku", shimane: "chugoku", tottori: "chugoku", yamaguchi: "chugoku",
  ehime: "shikoku", kagawa: "shikoku", tokushima: "shikoku", kochi: "shikoku",
  fukuoka: "kyushu", saga: "kyushu", nagasaki: "kyushu", kumamoto: "kyushu", oita: "kyushu", miyazaki: "kyushu", kagoshima: "kyushu", okinawa: "kyushu",
};

// Region colors from our data
const regionColors: Record<string, string> = {
  hokkaido: "#3B82F6",
  tohoku: "#8B5CF6",
  kanto: "#EF4444",
  chubu: "#F59E0B",
  kinki: "#EC4899",
  chugoku: "#10B981",
  shikoku: "#6366F1",
  kyushu: "#F97316",
};

interface JapanMapProps {
  onPrefectureClick: (regionId: string, prefId: string) => void;
}

export default function JapanMap({ onPrefectureClick }: JapanMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setHoveredPref] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const obj = container.querySelector("object") as HTMLObjectElement | null;
    if (!obj) return;

    const setup = () => {
      const svgDoc = obj.contentDocument;
      if (!svgDoc) return;

      const svgEl = svgDoc.querySelector("svg");
      if (svgEl) {
        svgEl.style.width = "100%";
        svgEl.style.height = "auto";
      }

      // Style all prefecture paths
      for (const [svgId, ourId] of Object.entries(svgIdToOurId)) {
        const path = svgDoc.getElementById(svgId);
        if (!path) continue;

        const regionId = prefToRegion[ourId];
        const color = regionColors[regionId] || "#6f9c76";

        path.style.fill = color;
        path.style.opacity = "0.7";
        path.style.cursor = "pointer";
        path.style.transition = "opacity 0.2s, fill 0.15s";

        path.addEventListener("mouseenter", (e) => {
          path.style.opacity = "1";
          path.style.fill = color;
          setHoveredPref(ourId);
          const name = path.getAttribute("name") || ourId;
          const rect = container.getBoundingClientRect();
          const ev = e as MouseEvent;
          setTooltip({
            text: name,
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top - 30,
          });
        });

        path.addEventListener("mousemove", (e) => {
          const rect = container.getBoundingClientRect();
          const ev = e as MouseEvent;
          setTooltip((prev) =>
            prev ? { ...prev, x: ev.clientX - rect.left, y: ev.clientY - rect.top - 30 } : prev
          );
        });

        path.addEventListener("mouseleave", () => {
          path.style.opacity = "0.7";
          setHoveredPref(null);
          setTooltip(null);
        });

        path.addEventListener("click", () => {
          const regionId = prefToRegion[ourId];
          if (regionId) {
            onPrefectureClick(regionId, ourId);
          }
        });
      }
    };

    if (obj.contentDocument?.querySelector("svg")) {
      setup();
    } else {
      obj.addEventListener("load", setup);
      return () => obj.removeEventListener("load", setup);
    }
  }, [onPrefectureClick]);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <object
        data={`${import.meta.env.BASE_URL}jp.svg`}
        type="image/svg+xml"
        className="w-full"
        aria-label="日本地圖"
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
