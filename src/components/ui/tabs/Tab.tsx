"use client";
 

 
interface SimpleTabsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  tabItems : string[];
}
 
export default function Tabs({ currentTab, onTabChange,tabItems }: SimpleTabsProps) {
  return (
    <div className="flex space-x-1 rounded-t-xl px-0.5">
      {tabItems.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-6 py-2   rounded-t-lg font-lg text-sm transition-all duration-300 ease-in-out ${
            currentTab === tab
              ? "bg-white md:ml-[2px] dark:bg-white/[0.05] border border-white dark:border dark:border-white/10 text-black dark:text-white transform  scale-105"
              : "dark:text-white/50  hover:text-gray-800 border border-transparent dark:border dark:border-transparent"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}