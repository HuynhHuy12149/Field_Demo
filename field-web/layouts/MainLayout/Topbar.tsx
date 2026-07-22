"use client";

import { useAuthStore } from "@/core/store/useAuthStore";
import { useUIStore } from "@/core/store/useUIStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Menu as MenuIcon, User, ChevronDown, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ChangePasswordModal } from "@/components/Modal/ChangePasswordModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Topbar = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const queryClient = useQueryClient();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    const isSuperAdmin = user?.type === "SuperAdmin";
    logout();
    queryClient.clear();
    if (isSuperAdmin) {
      router.push("/system-login");
    } else {
      router.push("/login");
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex items-center justify-between px-4 sm:px-6
        ${isSidebarCollapsed ? "left-20" : "left-64"}
      `}
    >
      <div className="flex items-center gap-4">
        {/* Mobile toggle button */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <MenuIcon size={20} />
        </button>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 hidden sm:block">
          Quản lý Dịch vụ
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="hidden sm:flex flex-col items-start mr-1">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                  {user?.fullName || "Admin"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Quản trị viên
                </span>
              </div>
              <ChevronDown size={16} className="text-slate-400 hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ của tôi</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsPasswordModalOpen(true)}>
              <Key className="mr-2 h-4 w-4" />
              <span>Đổi mật khẩu</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-800" />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </header>
  );
};
