"use client";

import { useState } from "react";
import { Input } from "@headlessui/react";
import { SearchButton } from "@/components/Button/SearchButton";

interface UsersSearchProps {
  onSearch: (value: string) => void;
}

export const UsersSearch = ({ onSearch }: UsersSearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className="flex items-center gap-2">
      <Input
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(searchInput)}
        placeholder="Tìm kiếm theo tên, email..."
        className="h-10 w-64 md:w-80 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-inset focus:ring-blue-500 data-[focus]:outline-none data-[focus]:ring-1 data-[focus]:ring-inset data-[focus]:ring-blue-500 data-[focus]:border-blue-500"
      />
      <SearchButton onClick={() => onSearch(searchInput)} />
    </div>
  );
};
