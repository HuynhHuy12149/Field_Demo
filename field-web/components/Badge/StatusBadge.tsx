import React from "react";

export const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  return isActive ? (
    <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
      Hoạt động
    </span>
  ) : (
    <span className="inline-flex items-center rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10">
      Khóa
    </span>
  );
};
