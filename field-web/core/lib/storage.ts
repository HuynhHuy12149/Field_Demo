import CryptoJS from 'crypto-js';
import { StateStorage } from 'zustand/middleware';

// Lấy Secret Key từ biến môi trường. Bắt buộc phải có, nếu không thì dùng key tạm (không khuyến cáo)
const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_SECRET || 'fallback-secret-key-do-not-use-in-prod';

/**
 * Custom Storage cho Zustand:
 * Tự động mã hóa (AES) trước khi lưu vào localStorage
 * và giải mã khi lấy dữ liệu ra.
 */
export const encryptedStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      const encryptedValue = localStorage.getItem(name);
      if (!encryptedValue) return null;
      
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      
      return decryptedValue;
    } catch (error) {
      console.error('Error decrypting state from storage', error);
      return null;
    }
  },
  
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      localStorage.setItem(name, encryptedValue);
    } catch (error) {
      console.error('Error encrypting state to storage', error);
    }
  },
  
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};
