"use client";

import { Button } from '@headlessui/react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const AddButton = ({ onClick, label = "Thêm mới" }: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-colors cursor-pointer"
    >
      <Plus size={18} strokeWidth={2.5} />
      <span className="mt-1">{label}</span>
    </Button>
  );
};
