import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { STORE_NAMES } from './store-names';

interface UIState {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
    }),
    {
      name: STORE_NAMES.UI_STORE,
      storage: createJSONStorage(() => localStorage), // Chỉ lưu trạng thái UI nên dùng localStorage thường là đủ, không cần mã hóa
    }
  )
);
