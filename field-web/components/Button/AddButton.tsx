"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const AddButton = ({ onClick, label = "Thêm mới", className = "" }: AddButtonProps) => {
  return (
    <Button onClick={onClick} className={`gap-2 ${className}`}>
      <Plus size={18} strokeWidth={2.5} />
      <span>{label}</span>
    </Button>
  );
};
