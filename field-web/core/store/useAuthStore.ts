import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { encryptedStorage } from '@/core/lib/storage';
import { STORE_NAMES } from './store-names';

interface User {
  id: string;
  email: string;
  fullName: string;
  permissions?: string[];
  type?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: STORE_NAMES.AUTH_STORE, // Sử dụng hằng số tên store
      storage: createJSONStorage(() => encryptedStorage), // Cắm cơ chế mã hóa vào đây
    }
  )
);
