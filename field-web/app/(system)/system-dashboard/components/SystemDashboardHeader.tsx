"use client";
import { AddButton } from "@/components/Button/AddButton";

export function SystemDashboardHeader({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200/50 dark:border-white/10">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          Quản lý Khách hàng (Tenants)
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Hệ thống quản lý Schema và Khách hàng cho nền tảng Multi-Tenant
        </p>
      </div>
      <AddButton label="Tạo Schema / Tenant mới" onClick={onAdd} />
    </div>
  );
}
