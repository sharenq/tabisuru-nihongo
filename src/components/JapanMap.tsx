import { useEffect, useRef, useState, useCallback } from "react";

const svgIdToOurId: Record<string, string> = {
  JP01: "hokkaido",
  JP02: "aomori", JP03: "iwate", JP04: "miyagi", JP05: "akita", JP06: "yamagata", JP07: "fukushima",
  JP08: "ibaraki", JP09: "tochigi", JP10: "gunma", JP11: "saitama", JP12: "chiba", JP13: "tokyo", JP14: "kanagawa",
  JP15: "niigata", JP16: "toyama", JP17: "ishikawa", JP18: "fukui", JP19: "yamanashi", JP20: "nagano", JP21: "gifu", JP22: "shizuoka", JP23: "aichi",
  JP24: "mie", JP25: "shiga", JP26: "kyoto", JP27: "osaka", JP28: "hyogo", JP29: "nara", JP30: "wakayama",
  JP31: "tottori", JP32: "shimane", JP33: "okayama", JP34: "hiroshima", JP35: "yamaguchi",
  JP36: "tokushima", JP37: "kagawa", JP38: "ehime", JP39: "kochi",
  JP40: "fukuoka", JP41: "saga", JP42: "nagasaki", JP43: "kumamoto", JP44: "oita", JP45: "miyazaki", JP46: "kagoshima", JP47: "okinawa",
};

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
  const svgRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const onClickRef = useRef(onPrefectureClick);
  onClickRef.current = onPrefectureClick;

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}jp.svg`)
      .then((res) => res.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg || !svgRef.current) return;

        // Fix viewbox → viewBox (simplemaps uses lowercase which is invalid)
        const vb = svg.getAttribute("viewbox");
        if (vb) {
          svg.removeAttribute("viewbox");
          svg.setAttribute("viewBox", vb);
        }
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.width = "100%";
        svg.style.height = "auto";

        for (const [svgId, ourId] of Object.entries(svgIdToOurId)) {
          const el = doc.getElementById(svgId);
          if (!el) continue;
          const regionId = prefToRegion[ourId];
          const color = regionColors[regionId] || "#6f9c76";
          el.setAttribute("fill", color);
          el.setAttribute("opacity", "0.7");
          el.setAttribute("data-pref", ourId);
          el.setAttribute("data-region", regionId);
          el.style.cursor = "pointer";
          el.style.transition = "opacity 0.2s";
        }

        svgRef.current.innerHTML = "";
        svgRef.current.appendChild(svg);
      })
      .catch(() => {});
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = (e.target as Element).closest("[data-pref]");
    if (!target) return;
    const prefId = target.getAttribute("data-pref")!;
    const regionId = target.getAttribute("data-region")!;
    onClickRef.current(regionId, prefId);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const target = (e.target as Element).closest("[data-pref]");
    const wrapper = wrapperRef.current;
    const container = svgRef.current;
    if (!wrapper || !container) return;

    // Reset all
    container.querySelectorAll("[data-pref]").forEach((el) => {
      (el as SVGElement).setAttribute("opacity", "0.7");
    });

    if (target) {
      (target as SVGElement).setAttribute("opacity", "1");
      const name = target.getAttribute("name") || "";
      const rect = wrapper.getBoundingClientRect();
      setTooltip({
        text: name,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 30,
      });
    } else {
      setTooltip(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    svgRef.current?.querySelectorAll("[data-pref]").forEach((el) => {
      (el as SVGElement).setAttribute("opacity", "0.7");
    });
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div
        ref={svgRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full"
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
