"use client";

import { AddButton } from "@/components/Button/AddButton";

interface RolesHeaderProps {
  onAdd: () => void;
}

export const RolesHeader = ({ onAdd }: RolesHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Danh sách Nhóm quyền
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Quản lý các nhóm quyền và phân quyền cho hệ thống
        </p>
      </div>
      <div>
        <AddButton label="Thêm nhóm quyền" onClick={onAdd} />
      </div>
    </div>
  );
};
