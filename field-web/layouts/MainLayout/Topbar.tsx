"use client";

import { useAuthStore } from "@/core/store/useAuthStore";
import { useUIStore } from "@/core/store/useUIStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, Menu as MenuIcon, User, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Topbar = () => {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { isSidebarCollapsed, toggleSidebar } = useUIStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout();
    queryClient.clear();
    localStorage.clear();
    router.push("/login");
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

        {/* Headless UI Dropdown Menu */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer">
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
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-slate-100 dark:divide-slate-800/50 rounded-xl bg-white dark:bg-slate-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" : "text-slate-700 dark:text-slate-300"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors cursor-pointer`}
                    >
                      <User className="mr-2 h-4 w-4" aria-hidden="true" />
                      Hồ sơ của tôi
                    </button>
                  )}
                </Menu.Item>
              </div>
              
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "text-red-500 dark:text-red-500"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium transition-colors cursor-pointer`}
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Đăng xuất
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};
