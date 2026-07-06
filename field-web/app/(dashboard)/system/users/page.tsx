import { UserCog } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800/60 p-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
          <UserCog size={24} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Quản lý Người dùng
        </h1>
      </div>
      <div className="mt-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-64 flex items-center justify-center text-slate-400 dark:text-slate-600">
        Danh sách Người dùng (Table)
      </div>
    </div>
  );
}
