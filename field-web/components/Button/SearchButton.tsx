import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export const SearchButton = ({ onClick, label = "Tìm kiếm", className = "" }: SearchButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`gap-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white ${className}`}
    >
      <Search size={16} />
      <span>{label}</span>
    </Button>
  );
};
