"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/core/store/useUIStore";
import { useAuthStore } from "@/core/store/useAuthStore";
import { MENU_CONFIG, MenuItem } from "@/core/config/menu.config";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

export const Sidebar = () => {
  const pathname = usePathname();
  const { isSidebarCollapsed, toggleSidebar, setSidebarCollapsed } = useUIStore();
  
  const user = useAuthStore((state) => state.user);
  const userPermissions = user?.permissions || [];

  // Khởi tạo state openMenus dựa trên URL hiện tại để khi F5 không bị đóng menu đang active
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    MENU_CONFIG.forEach(item => {
      if (item.subItems?.some(sub => sub.path === pathname)) {
        initialState[item.name] = true;
      }
    });
    return initialState;
  });

  // Tự động mở menu cha nếu URL thay đổi (VD: Navigate qua link khác)
  useEffect(() => {
    MENU_CONFIG.forEach(item => {
      if (item.subItems?.some(sub => sub.path === pathname)) {
        setOpenMenus(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [pathname]);

  const toggleSubMenu = (menuName: string) => {
    if (isSidebarCollapsed) {
      setSidebarCollapsed(false);
      setOpenMenus(prev => ({ ...prev, [menuName]: true }));
    } else {
      setOpenMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
    }
  };

  const hasPermission = (permission?: string) => {
    const isSystemAdmin = userPermissions.includes("SystemAdmin");
    if (isSystemAdmin && permission !== "SystemAdmin") return false;
    if (!isSystemAdmin && permission === "SystemAdmin") return false;
    if (!permission) return true;
    return userPermissions.includes(permission);
  };

  // Render Item (isFloating để render bên trong popup hover khi sidebar thu gọn)
  const renderSingleItem = (item: MenuItem, isSubItem: boolean = false, isFloating: boolean = false) => {
    if (!hasPermission(item.permission)) return null;
    
    const isActive = item.path ? pathname === item.path : false;
    const Icon = item.icon;

    // Tính toán class padding/margin tùy ngữ cảnh
    let basePadding = "p-3 rounded-xl";
    if (isSubItem && !isFloating) basePadding = "p-2.5 rounded-lg text-sm";
    if (isFloating) basePadding = "p-2 rounded-lg text-sm w-full";

    return (
      <Link 
        key={item.name} 
        href={item.path || "#"}
        className={`flex items-center transition-all duration-200 group/link relative
          ${basePadding}
          ${isActive 
            ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400 font-medium" 
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          }
          ${isSidebarCollapsed && !isSubItem && !isFloating ? "justify-center" : "justify-start"}
        `}
        title={isSidebarCollapsed && !isSubItem && !isFloating ? item.name : ""}
      >
        {isSubItem ? (
          <div className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 transition-colors ${isActive ? "bg-purple-600 dark:bg-purple-400" : "bg-slate-300 dark:bg-slate-600 group-hover/link:bg-slate-400"}`} />
        ) : (
          Icon && (
            <Icon 
              size={22} 
              className={`shrink-0 ${isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400 group-hover/link:text-slate-700 dark:group-hover/link:text-slate-300"}`} 
            />
          )
        )}
        
        {(!isSidebarCollapsed || isSubItem || isFloating) && (
          <span className={`${isSubItem ? "" : "ml-3"} whitespace-nowrap`}>
            {item.name}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 
        ${isSidebarCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        {!isSidebarCollapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 truncate">
            FieldService
          </span>
        )}
        <button 
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${isSidebarCollapsed ? "mx-auto" : ""}`}
        >
          {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2 overflow-y-visible h-[calc(100vh-4rem)]">
        {MENU_CONFIG.map((item) => {
          const hasSubItemsConfigured = item.subItems && item.subItems.length > 0;
          const visibleSubItems = item.subItems?.filter(sub => hasPermission(sub.permission)) || [];
          const hasVisibleSubItems = visibleSubItems.length > 0;

          // Nếu menu này là một thư mục (có cấu hình subItems) nhưng lại không có subItem nào được phép hiển thị, thì ẩn thư mục đó luôn
          if (hasSubItemsConfigured && !hasVisibleSubItems) {
            return null;
          }

          if (!hasPermission(item.permission) && !hasVisibleSubItems) {
            return null;
          }

          if (hasVisibleSubItems) {
            const isOpen = openMenus[item.name] || false;
            const isChildActive = visibleSubItems.some(sub => sub.path === pathname);
            const ParentIcon = item.icon;

            return (
              <div key={item.name} className="flex flex-col space-y-1 relative group/parent">
                <button
                  onClick={() => toggleSubMenu(item.name)}
                  className={`flex items-center rounded-xl p-3 transition-all duration-200 w-full cursor-pointer
                    ${isChildActive
                      ? "text-purple-700 dark:text-purple-400 font-medium bg-purple-50/50 dark:bg-purple-900/10"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }
                    ${isSidebarCollapsed ? "justify-center" : "justify-start"}
                  `}
                >
                  {ParentIcon && (
                    <ParentIcon 
                      size={22} 
                      className={`shrink-0 ${isChildActive ? "text-purple-600 dark:text-purple-400" : "text-slate-500 dark:text-slate-400"}`} 
                    />
                  )}
                  
                  {!isSidebarCollapsed && (
                    <>
                      <span className="ml-3 whitespace-nowrap">{item.name}</span>
                      {/* Chevron icon được đẩy hoàn toàn sang bên phải nhờ ml-auto */}
                      <div className={`ml-auto text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                        <ChevronDown size={16} />
                      </div>
                    </>
                  )}
                </button>

                {/* Sub Menu hiển thị dạng Tree-line khi sidebar MỞ */}
                {isOpen && !isSidebarCollapsed && (
                  <div className="flex flex-col space-y-1 mt-1 mb-2 ml-[1.35rem] pl-4 border-l-2 border-slate-100 dark:border-slate-800">
                    {visibleSubItems.map((subItem) => renderSingleItem(subItem, true))}
                  </div>
                )}

                {/* Sub Menu hiển thị dạng Popup/Tooltip Floating khi sidebar GẬP (Hover) */}
                {isSidebarCollapsed && (
                  <div className="absolute left-full top-0 pl-2 hidden group-hover/parent:flex z-50 animate-in fade-in slide-in-from-left-2 duration-200">
                    <div className="flex flex-col bg-white dark:bg-slate-800 shadow-xl rounded-xl p-2 w-48 border border-slate-100 dark:border-slate-700">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 mb-2 px-3 pb-2 pt-1 border-b border-slate-100 dark:border-slate-700">
                        {item.name}
                      </div>
                      {visibleSubItems.map((subItem) => renderSingleItem(subItem, true, true))}
                    </div>
                  </div>
                )}
              </div>
            );
          }

          return renderSingleItem(item);
        })}
      </nav>
    </aside>
  );
};
