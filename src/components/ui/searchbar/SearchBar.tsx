import clsx from "clsx";
import { Search } from "lucide-react";
import React, { useState } from "react";

interface SearchBarProps {
  placeHolder?: string;
  className?: string;
  direction?: "right" | "left";
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className,
  direction,
  placeHolder,
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(query);
    }
  };

  return (
    <div
      className={clsx(
        "bg-themeBackgroundColor dark:bg-white/[0.2] w-[310px] h-[51px] rounded-[31px] flex items-center",
        className
      )}
    >
      <Search className="ml-3 text-[#5A5A5A] dark:text-white/50" />
      <input
        type="text"
        placeholder={placeHolder || "Search..."}
        className="bg-transparent border-none outline-none flex-1 px-2 text-[#adadad] dark:text-white"
        value={query}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default SearchBar;