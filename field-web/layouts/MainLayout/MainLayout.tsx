"use client";

import { useUIStore } from "@/core/store/useUIStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MENU_CONFIG, MenuItem } from "@/core/config/menu.config";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const { isSidebarCollapsed } = useUIStore();
  const [isHydrated, setIsHydrated] = useState(false);


  useEffect(() => {
    // Đợi Zustand load xong dữ liệu từ LocalStorage (Hydration)
    const unsub = useAuthStore.persist.onFinishHydration(() => setIsHydrated(true));
    setIsHydrated(useAuthStore.persist.hasHydrated());
    return unsub;
  }, []);

  useEffect(() => {
    // Chỉ kiểm tra và đá về /login khi đã load xong dữ liệu từ két sắt
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isHydrated, isAuthenticated, router]);

  // Kiểm tra quyền truy cập Route hiện tại
  const hasAccess = () => {
    if (!user) return false;
    
    // Tìm kiếm đệ quy path hiện tại trong MENU_CONFIG
    let requiredPermission: string | undefined = undefined;
    const findPermission = (items: MenuItem[]) => {
      for (const item of items) {
        if (item.path === pathname) {
          requiredPermission = item.permission;
          return;
        }
        if (item.subItems) {
          findPermission(item.subItems);
        }
      }
    };
    findPermission(MENU_CONFIG);

    if (!requiredPermission) return true; // Route không yêu cầu quyền đặc biệt
    return user.permissions?.includes(requiredPermission) || false;
  };

  // Ngăn chặn hydration mismatch và flash content khi chưa load xong Auth
  if (!isHydrated || !isAuthenticated) {
    return null; // Có thể thay bằng một màn hình Loading Spinner full page
  }

  if (!hasAccess()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">403</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">Bạn không có quyền truy cập trang này!</p>
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Sidebar />
      <Topbar />

      {/* Main Content Area */}
      <main
        className={`pt-16 pb-6 transition-all duration-300 ease-in-out min-h-screen
          ${isSidebarCollapsed ? "ml-20" : "ml-64"}
        `}
      >
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
