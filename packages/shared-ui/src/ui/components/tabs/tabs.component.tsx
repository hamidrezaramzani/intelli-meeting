import { useState } from "react";

import type { TabsProps } from "./tabs.type";

export const Tabs = ({ tabs, defaultIndex = 0 }: TabsProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="w-full">
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`py-2 px-4 -mb-px font-medium text-sm border-b-2 transition-colors duration-200
              ${
                activeIndex === index
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tabs[activeIndex] && <div>{tabs[activeIndex].content}</div>}
      </div>
    </div>
  );
};
