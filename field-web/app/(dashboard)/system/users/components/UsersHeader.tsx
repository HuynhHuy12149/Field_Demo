"use client";

import { AddButton } from "@/components/Button/AddButton";

interface UsersHeaderProps {
  onAdd: () => void;
}

export const UsersHeader = ({ onAdd }: UsersHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Quản lý Người dùng
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Quản lý tài khoản và thông tin nhân viên trong hệ thống
        </p>
      </div>
      <div>
        <AddButton label="Thêm người dùng" onClick={onAdd} />
      </div>
    </div>
  );
};
