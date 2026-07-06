import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-slate-800/60 p-8 min-h-[calc(100vh-10rem)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl">
          <Settings size={24} strokeWidth={2} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Cài đặt hệ thống
        </h1>
      </div>
      
      <p className="text-slate-600 dark:text-slate-400 text-lg">
        Trang Cài đặt đang được xây dựng. Nơi cấu hình Profile người dùng, 
        phân quyền (Roles) và các tham số hệ thống.
      </p>

      <div className="mt-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 space-y-4">
        <div>Các form nhập liệu cấu hình sẽ đặt ở đây</div>
      </div>
    </div>
  );
}
