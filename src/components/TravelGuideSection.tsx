import { useState } from "react";
import type { TravelGuide } from "../data/regions";

interface TravelGuideSectionProps {
  travelGuide: TravelGuide;
}

interface CollapsibleSectionProps {
  icon: string;
  title: string;
  items: string[];
  defaultOpen?: boolean;
}

function CollapsibleSection({ icon, title, items, defaultOpen = false }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200">
          <span className="text-lg">{icon}</span>
          {title}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TravelGuideSection({ travelGuide }: TravelGuideSectionProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">旅遊指南</h2>
      <CollapsibleSection
        icon="🚃"
        title="交通指南"
        items={travelGuide.transport}
        defaultOpen
      />
      <CollapsibleSection
        icon="🍜"
        title="必吃美食"
        items={travelGuide.mustEat}
      />
      <CollapsibleSection
        icon="📍"
        title="必訪景點"
        items={travelGuide.mustVisit}
      />
      <CollapsibleSection
        icon="🎌"
        title="當地禮儀"
        items={travelGuide.etiquette}
      />
    </div>
  );
}
