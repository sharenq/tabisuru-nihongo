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

const prefChineseName: Record<string, string> = {
  hokkaido: "北海道",
  aomori: "青森", iwate: "岩手", miyagi: "宮城", akita: "秋田", yamagata: "山形", fukushima: "福島",
  ibaraki: "茨城", tochigi: "栃木", gunma: "群馬", saitama: "埼玉", chiba: "千葉", tokyo: "東京", kanagawa: "神奈川",
  niigata: "新潟", toyama: "富山", ishikawa: "石川", fukui: "福井", yamanashi: "山梨", nagano: "長野", gifu: "岐阜", shizuoka: "靜岡", aichi: "愛知",
  mie: "三重", shiga: "滋賀", kyoto: "京都", osaka: "大阪", hyogo: "兵庫", nara: "奈良", wakayama: "和歌山",
  tottori: "鳥取", shimane: "島根", okayama: "岡山", hiroshima: "廣島", yamaguchi: "山口",
  tokushima: "德島", kagawa: "香川", ehime: "愛媛", kochi: "高知",
  fukuoka: "福岡", saga: "佐賀", nagasaki: "長崎", kumamoto: "熊本", oita: "大分", miyazaki: "宮崎", kagoshima: "鹿兒島", okinawa: "沖繩",
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

const regionNames: Record<string, string> = {
  hokkaido: "北海道", tohoku: "東北", kanto: "關東", chubu: "中部",
  kinki: "近畿", chugoku: "中國", shikoku: "四國", kyushu: "九州",
};

// Region label positions within 0-1000 x 0-846 viewBox
const regionLabelPositions: Record<string, { x: number; y: number }> = {
  hokkaido: { x: 700, y: 130 },
  tohoku: { x: 600, y: 290 },
  kanto: { x: 570, y: 410 },
  chubu: { x: 470, y: 380 },
  kinki: { x: 395, y: 445 },
  chugoku: { x: 310, y: 440 },
  shikoku: { x: 350, y: 510 },
  kyushu: { x: 230, y: 520 },
};

// Prefecture label positions (from SVG circle centers)
const prefLabelPositions: Record<string, { x: number; y: number }> = {
  hokkaido: { x: 626.5, y: 123.4 },
  aomori: { x: 562.3, y: 233.6 }, iwate: { x: 585.2, y: 275.2 }, miyagi: { x: 570.6, y: 313.1 },
  akita: { x: 557.1, y: 268 }, yamagata: { x: 549.5, y: 312.8 }, fukushima: { x: 560.1, y: 357.8 },
  ibaraki: { x: 553.9, y: 402 }, tochigi: { x: 540.2, y: 381.9 }, gunma: { x: 514.3, y: 389.4 },
  saitama: { x: 525.2, y: 407.3 }, chiba: { x: 550.4, y: 430.9 }, tokyo: { x: 526.9, y: 419.8 }, kanagawa: { x: 524.2, y: 427.8 },
  niigata: { x: 511.7, y: 361.1 }, toyama: { x: 464.1, y: 385.6 }, ishikawa: { x: 444.9, y: 395.6 },
  fukui: { x: 435, y: 409 }, yamanashi: { x: 504, y: 420.8 }, nagano: { x: 487.5, y: 399.3 },
  gifu: { x: 458.6, y: 419.2 }, shizuoka: { x: 488, y: 443.9 }, aichi: { x: 463.4, y: 442.6 },
  mie: { x: 439.9, y: 463.4 }, shiga: { x: 431.3, y: 436.6 }, kyoto: { x: 415.8, y: 438.2 },
  osaka: { x: 414, y: 457.4 }, hyogo: { x: 391.7, y: 440.8 }, nara: { x: 424.6, y: 468 }, wakayama: { x: 410.7, y: 481.6 },
  tottori: { x: 364.7, y: 429.9 }, shimane: { x: 326, y: 442.9 }, okayama: { x: 362.4, y: 447.5 },
  hiroshima: { x: 337, y: 456.8 }, yamaguchi: { x: 297.8, y: 469.6 },
  tokushima: { x: 377.3, y: 482.6 }, kagawa: { x: 368.6, y: 471.3 }, ehime: { x: 337.3, y: 487.6 }, kochi: { x: 348.7, y: 493.7 },
  fukuoka: { x: 272.8, y: 492.5 }, saga: { x: 254.5, y: 504.2 }, nagasaki: { x: 253.2, y: 517.3 },
  kumamoto: { x: 278.6, y: 522.3 }, oita: { x: 294.3, y: 512 }, miyazaki: { x: 291.2, y: 539.2 },
  kagoshima: { x: 266.4, y: 553.1 }, okinawa: { x: 196.1, y: 730.3 },
};

const SVG_W = 1000;
const SVG_H = 846;
const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const PREF_LABEL_ZOOM_THRESHOLD = 1.8;

interface JapanMapProps {
  onPrefectureClick: (regionId: string, prefId: string) => void;
}

export default function JapanMap({ onPrefectureClick }: JapanMapProps) {
  const svgRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const onClickRef = useRef(onPrefectureClick);
  onClickRef.current = onPrefectureClick;

  // Zoom/pan state stored in refs for performance (no re-render on every pan)
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const hasDragged = useRef(false);

  const applyTransform = useCallback(() => {
    const svg = svgRef.current?.querySelector("svg");
    if (!svg) return;
    const z = zoomRef.current;
    const p = panRef.current;
    svg.setAttribute("viewBox", `${-p.x} ${-p.y} ${SVG_W / z} ${SVG_H / z}`);

    // Toggle prefecture labels visibility
    const prefLabels = svg.querySelector("#pref-labels");
    const regionLabels = svg.querySelector("#region-labels");
    if (prefLabels) {
      (prefLabels as SVGElement).style.display = z >= PREF_LABEL_ZOOM_THRESHOLD ? "" : "none";
      // Scale font size inversely with zoom so labels stay readable
      prefLabels.querySelectorAll("text").forEach((t) => {
        t.setAttribute("font-size", String(12 / z));
        t.setAttribute("stroke-width", String(2 / z));
      });
    }
    if (regionLabels) {
      regionLabels.querySelectorAll("text").forEach((t) => {
        t.setAttribute("font-size", String(18 / z));
        t.setAttribute("stroke-width", String(3 / z));
      });
    }
  }, []);

  const clampPan = useCallback((px: number, py: number, z: number) => {
    const viewW = SVG_W / z;
    const viewH = SVG_H / z;
    const maxX = SVG_W - viewW;
    const maxY = SVG_H - viewH;
    return {
      x: Math.max(0, Math.min(px, maxX)),
      y: Math.max(0, Math.min(py, maxY)),
    };
  }, []);

  const zoomTo = useCallback((newZoom: number, pivotX?: number, pivotY?: number) => {
    const svg = svgRef.current?.querySelector("svg");
    const wrapper = wrapperRef.current;
    if (!svg || !wrapper) return;

    const oldZ = zoomRef.current;
    const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    const p = panRef.current;

    if (pivotX !== undefined && pivotY !== undefined) {
      const rect = wrapper.getBoundingClientRect();
      const fracX = pivotX / rect.width;
      const fracY = pivotY / rect.height;
      const oldVW = SVG_W / oldZ;
      const oldVH = SVG_H / oldZ;
      const newVW = SVG_W / z;
      const newVH = SVG_H / z;
      const svgPtX = p.x + fracX * oldVW;
      const svgPtY = p.y + fracY * oldVH;
      const newPx = svgPtX - fracX * newVW;
      const newPy = svgPtY - fracY * newVH;
      panRef.current = clampPan(newPx, newPy, z);
    } else {
      // Zoom towards center
      const oldVW = SVG_W / oldZ;
      const oldVH = SVG_H / oldZ;
      const newVW = SVG_W / z;
      const newVH = SVG_H / z;
      const cx = p.x + oldVW / 2;
      const cy = p.y + oldVH / 2;
      panRef.current = clampPan(cx - newVW / 2, cy - newVH / 2, z);
    }

    zoomRef.current = z;
    setZoom(z);
    applyTransform();
  }, [applyTransform, clampPan]);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}jp.svg`)
      .then((res) => res.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg || !svgRef.current) return;

        const vb = svg.getAttribute("viewbox");
        if (vb) {
          svg.removeAttribute("viewbox");
          svg.setAttribute("viewBox", vb);
        }
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.width = "100%";
        svg.style.height = "auto";
        svg.style.touchAction = "none";

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

        const svgNS = "http://www.w3.org/2000/svg";

        // Region labels (always visible)
        const regionGroup = doc.createElementNS(svgNS, "g");
        regionGroup.setAttribute("id", "region-labels");
        for (const [regionId, pos] of Object.entries(regionLabelPositions)) {
          const label = doc.createElementNS(svgNS, "text");
          label.setAttribute("x", String(pos.x));
          label.setAttribute("y", String(pos.y));
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("font-size", "18");
          label.setAttribute("font-weight", "bold");
          label.setAttribute("fill", "#333");
          label.setAttribute("stroke", "#fff");
          label.setAttribute("stroke-width", "3");
          label.setAttribute("paint-order", "stroke");
          label.setAttribute("pointer-events", "none");
          label.textContent = regionNames[regionId] || "";
          regionGroup.appendChild(label);
        }
        svg.appendChild(regionGroup);

        // Prefecture labels (visible only when zoomed in)
        const prefGroup = doc.createElementNS(svgNS, "g");
        prefGroup.setAttribute("id", "pref-labels");
        prefGroup.style.display = "none";
        for (const [prefId, pos] of Object.entries(prefLabelPositions)) {
          const label = doc.createElementNS(svgNS, "text");
          label.setAttribute("x", String(pos.x));
          label.setAttribute("y", String(pos.y));
          label.setAttribute("text-anchor", "middle");
          label.setAttribute("font-size", "12");
          label.setAttribute("font-weight", "600");
          label.setAttribute("fill", "#1a1a1a");
          label.setAttribute("stroke", "#fff");
          label.setAttribute("stroke-width", "2");
          label.setAttribute("paint-order", "stroke");
          label.setAttribute("pointer-events", "none");
          label.textContent = prefChineseName[prefId] || "";
          prefGroup.appendChild(label);
        }
        svg.appendChild(prefGroup);

        svgRef.current.innerHTML = "";
        svgRef.current.appendChild(svg);
      })
      .catch(() => {});
  }, []);

  // Mouse wheel zoom
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      zoomTo(zoomRef.current * delta, px, py);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, [zoomTo]);

  // Touch pinch zoom & pan
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const getTouchDist = (e: TouchEvent) => {
      const [a, b] = [e.touches[0], e.touches[1]];
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };
    const getTouchCenter = (e: TouchEvent) => {
      const [a, b] = [e.touches[0], e.touches[1]];
      const rect = el.getBoundingClientRect();
      return { x: (a.clientX + b.clientX) / 2 - rect.left, y: (a.clientY + b.clientY) / 2 - rect.top };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        lastTouchDist.current = getTouchDist(e);
        lastTouchCenter.current = getTouchCenter(e);
      } else if (e.touches.length === 1 && zoomRef.current > 1) {
        isDragging.current = true;
        hasDragged.current = false;
        dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        panStart.current = { ...panRef.current };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDist.current !== null) {
        e.preventDefault();
        const dist = getTouchDist(e);
        const center = getTouchCenter(e);
        const scale = dist / lastTouchDist.current;
        zoomTo(zoomRef.current * scale, center.x, center.y);
        lastTouchDist.current = dist;
        lastTouchCenter.current = center;
      } else if (e.touches.length === 1 && isDragging.current) {
        e.preventDefault();
        const dx = e.touches[0].clientX - dragStart.current.x;
        const dy = e.touches[0].clientY - dragStart.current.y;
        if (Math.abs(dx) > 5 || Math.abs(dy) > 5) hasDragged.current = true;
        const rect = el.getBoundingClientRect();
        const z = zoomRef.current;
        const svgDx = (dx / rect.width) * (SVG_W / z);
        const svgDy = (dy / rect.height) * (SVG_H / z);
        panRef.current = clampPan(panStart.current.x - svgDx, panStart.current.y - svgDy, z);
        applyTransform();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        lastTouchDist.current = null;
        lastTouchCenter.current = null;
      }
      if (e.touches.length === 0) {
        isDragging.current = false;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [zoomTo, applyTransform, clampPan]);

  // Mouse drag pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...panRef.current };
  }, []);

  const handleMouseMoveDrag = useCallback((e: React.MouseEvent) => {
    // Hover highlight + tooltip
    const target = (e.target as Element).closest("[data-pref]");
    const wrapper = wrapperRef.current;
    const container = svgRef.current;
    if (wrapper && container) {
      container.querySelectorAll("[data-pref]").forEach((el) => {
        (el as SVGElement).setAttribute("opacity", "0.7");
      });
      if (target) {
        (target as SVGElement).setAttribute("opacity", "1");
        const prefId = target.getAttribute("data-pref") || "";
        const regionId = target.getAttribute("data-region") || "";
        const zhName = prefChineseName[prefId] || prefId;
        const regionZh = regionNames[regionId] || "";
        const rect = wrapper.getBoundingClientRect();
        setTooltip({
          text: `${zhName}（${regionZh}）`,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top - 35,
        });
      } else {
        setTooltip(null);
      }
    }

    // Drag pan
    if (!isDragging.current || !wrapper) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged.current = true;
    const rect = wrapper.getBoundingClientRect();
    const z = zoomRef.current;
    const svgDx = (dx / rect.width) * (SVG_W / z);
    const svgDy = (dy / rect.height) * (SVG_H / z);
    panRef.current = clampPan(panStart.current.x - svgDx, panStart.current.y - svgDy, z);
    applyTransform();
  }, [applyTransform, clampPan]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (hasDragged.current) return; // ignore click after drag
    const target = (e.target as Element).closest("[data-pref]");
    if (!target) return;
    const prefId = target.getAttribute("data-pref")!;
    const regionId = target.getAttribute("data-region")!;
    onClickRef.current(regionId, prefId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTooltip(null);
    isDragging.current = false;
    svgRef.current?.querySelectorAll("[data-pref]").forEach((el) => {
      (el as SVGElement).setAttribute("opacity", "0.7");
    });
  }, []);

  const handleReset = useCallback(() => {
    zoomRef.current = 1;
    panRef.current = { x: 0, y: 0 };
    setZoom(1);
    applyTransform();
  }, [applyTransform]);

  return (
    <div ref={wrapperRef} className="relative w-full mx-auto select-none">
      <div
        ref={svgRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveDrag}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="w-full"
        style={{ cursor: zoom > 1 ? "grab" : "default" }}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap z-10"
          style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
        >
          {tooltip.text}
        </div>
      )}
      {/* Zoom controls */}
      <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
        <button
          onClick={() => zoomTo(zoomRef.current * 1.4)}
          className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100"
        >
          +
        </button>
        <button
          onClick={() => zoomTo(zoomRef.current / 1.4)}
          className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 flex items-center justify-center text-lg font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100"
        >
          −
        </button>
        {zoom > 1.05 && (
          <button
            onClick={handleReset}
            className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100"
            title="重置縮放"
          >
            ↺
          </button>
        )}
      </div>
      {zoom > 1.05 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full z-10">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}
