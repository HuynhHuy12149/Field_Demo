import { Search } from "lucide-react";
import { Button } from "@headlessui/react";

interface SearchButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const SearchButton = ({ onClick, label = "Tìm kiếm", className = "" }: SearchButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`inline-flex h-10 font-medium items-center justify-center gap-2 rounded-lg bg-slate-800 dark:bg-slate-700 px-4 border border-transparent text-sm text-white hover:bg-slate-700 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 cursor-pointer ${className}`}
    >
      <Search size={16} />
      <span className="mt-1">{label}</span>
    </Button>
  );
};
