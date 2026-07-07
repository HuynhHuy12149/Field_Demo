import { apiClient } from "@/core/lib/apiClient";

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  email: string;
  permissions: string[];
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Lưu ý: apiClient đã được cấu hình trả về thẳng response.data
    return await apiClient.post<LoginResponse>("/Auth/login", data);
  }
};
