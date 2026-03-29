import { useState } from "react";

const FALLBACK_RATE = 0.215; // 1 JPY ≈ 0.215 TWD

const QUICK_AMOUNTS = [1000, 5000, 10000, 50000];

type Direction = "jpy-to-twd" | "twd-to-jpy";

function formatNumber(value: number): string {
  if (Number.isNaN(value)) return "";
  return value % 1 === 0
    ? value.toLocaleString("zh-TW")
    : value.toLocaleString("zh-TW", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function parseInput(raw: string): number {
  const cleaned = raw.replace(/,/g, "");
  const num = parseFloat(cleaned);
  return Number.isNaN(num) ? 0 : num;
}

function CurrencyCalculator() {
  const [jpyValue, setJpyValue] = useState("");
  const [twdValue, setTwdValue] = useState("");
  const [direction, setDirection] = useState<Direction>("jpy-to-twd");

  function handleJpyChange(raw: string) {
    setJpyValue(raw);
    const num = parseInput(raw);
    if (raw === "" || num === 0) {
      setTwdValue("");
      return;
    }
    setTwdValue(formatNumber(num * FALLBACK_RATE));
  }

  function handleTwdChange(raw: string) {
    setTwdValue(raw);
    const num = parseInput(raw);
    if (raw === "" || num === 0) {
      setJpyValue("");
      return;
    }
    setJpyValue(formatNumber(num / FALLBACK_RATE));
  }

  function handleSwap() {
    setDirection((prev) => (prev === "jpy-to-twd" ? "twd-to-jpy" : "jpy-to-twd"));
    setJpyValue("");
    setTwdValue("");
  }

  function handleQuickAmount(amount: number) {
    if (direction === "jpy-to-twd") {
      const raw = amount.toString();
      setJpyValue(raw);
      setTwdValue(formatNumber(amount * FALLBACK_RATE));
    } else {
      const twdAmount = amount * FALLBACK_RATE;
      setTwdValue(formatNumber(twdAmount));
      setJpyValue(formatNumber(amount));
    }
  }

  const topCurrency = direction === "jpy-to-twd" ? "JPY" : "TWD";
  const bottomCurrency = direction === "jpy-to-twd" ? "TWD" : "JPY";
  const topLabel = direction === "jpy-to-twd" ? "日圓 (JPY)" : "新台幣 (TWD)";
  const bottomLabel = direction === "jpy-to-twd" ? "新台幣 (TWD)" : "日圓 (JPY)";
  const topSymbol = direction === "jpy-to-twd" ? "¥" : "NT$";
  const bottomSymbol = direction === "jpy-to-twd" ? "NT$" : "¥";

  const topValue = direction === "jpy-to-twd" ? jpyValue : twdValue;
  const bottomValue = direction === "jpy-to-twd" ? twdValue : jpyValue;
  const handleTopChange = direction === "jpy-to-twd" ? handleJpyChange : handleTwdChange;
  const handleBottomChange = direction === "jpy-to-twd" ? handleTwdChange : handleJpyChange;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
        {"💴 匯率計算"}
      </h2>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
        近似匯率：1 JPY ≈ {FALLBACK_RATE} TWD（僅供參考）
      </p>

      {/* Top input */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {topLabel}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none">
            {topSymbol}
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={topValue}
            onChange={(e) => handleTopChange(e.target.value)}
            placeholder="0"
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
            {topCurrency}
          </span>
        </div>
      </div>

      {/* Swap button */}
      <div className="flex justify-center my-2">
        <button
          onClick={handleSwap}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 transition-colors"
          title="交換方向"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Bottom input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {bottomLabel}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm pointer-events-none">
            {bottomSymbol}
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={bottomValue}
            onChange={(e) => handleBottomChange(e.target.value)}
            placeholder="0"
            className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
            {bottomCurrency}
          </span>
        </div>
      </div>

      {/* Quick-select buttons */}
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">快速選擇（日圓）</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => handleQuickAmount(amount)}
              className="min-h-[44px] px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
            >
              ¥{amount.toLocaleString("zh-TW")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrencyCalculator;
