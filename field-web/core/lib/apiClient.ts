import axios from 'axios';
import { useAuthStore } from '@/core/store/useAuthStore';

// Tạo một Instance của Axios
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7198/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10s
});

// Request Interceptor: Tự động đính kèm Token trước khi gửi
apiClient.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand store
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý dữ liệu trả về và lỗi chung
apiClient.interceptors.response.use(
  (response) => {
    // Chỉ trả về data, bỏ qua config/headers của Axios để code gọn hơn
    return response.data;
  },
  (error) => {
    // Xử lý lỗi 401 Unauthorized (Token hết hạn hoặc không hợp lệ)
    if (error.response && error.response.status === 401) {
      // Xóa data trong store
      useAuthStore.getState().logout();
      
      // Chuyển hướng về trang đăng nhập nếu đang ở phía Client
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Ném lỗi ra để hook useQuery/useMutation bắt và xử lý riêng
    return Promise.reject(error);
  }
);
