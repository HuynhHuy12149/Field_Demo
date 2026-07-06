"use client";

import { useUIStore } from "@/core/store/useUIStore";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useAuthStore } from "@/core/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
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

  // Ngăn chặn hydration mismatch và flash content khi chưa load xong Auth
  if (!isHydrated || !isAuthenticated) {
    return null; // Có thể thay bằng một màn hình Loading Spinner full page
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
