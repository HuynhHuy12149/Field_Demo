import axios, { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/core/store/useAuthStore';

// Tạo một Instance của Axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7198/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout sau 10s
});

// Request Interceptor: Tự động đính kèm Token trước khi gửi
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token trực tiếp từ Zustand store
    const token = useAuthStore.getState().token;
    
    if (token && config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý dữ liệu trả về và lỗi chung
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;

    // Tự động unbox ApiResponse chung của hệ thống
    if (res && typeof res === 'object' && 'success' in res) {
      // Nếu API trả về success = false, ném lỗi
      if (res.success === false) {
        return Promise.reject(new Error(res.message || "Lỗi từ server"));
      }

      // Nếu là PagedResponse (có totalPages), giữ nguyên object để UI dùng phân trang
      if ('totalPages' in res) {
        return res;
      }

      // Nếu là ApiResponse bình thường, chỉ trả về phần data
      if (res.data !== undefined && res.data !== null) {
        return res.data;
      }

      // Trường hợp success nhưng không có data (như Delete), trả về boolean hoặc true
      return true;
    }

    return res;
  },
  (error) => {
    // Xử lý lỗi 401 Unauthorized (Token hết hạn hoặc không hợp lệ)
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Trích xuất thông báo lỗi thực tế từ C# (.NET)
    let errorMsg = "Đã xảy ra lỗi kết nối với máy chủ";
    if (error?.response?.data) {
      const data = error.response.data;
      if (data.message) errorMsg = data.message;
      else if (data.title) errorMsg = data.title;
      else if (typeof data === 'string') errorMsg = data;
      
      // Nếu là lỗi Validation của .NET (400 Bad Request)
      if (data.errors && typeof data.errors === 'object') {
        const firstErrorKey = Object.keys(data.errors)[0];
        errorMsg = data.errors[firstErrorKey][0];
      }
    }
    
    return Promise.reject(new Error(errorMsg));
  }
);

// Bọc lại các phương thức để TypeScript không còn nhận diện là AxiosResponse nữa
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.get<any, T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.post<any, T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.put<any, T>(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.delete<any, T>(url, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => 
    axiosInstance.patch<any, T>(url, data, config),
};
