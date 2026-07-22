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
  login: async (data: LoginRequest & { tenantSchema?: string }): Promise<LoginResponse> => {
    const headers: Record<string, string> = {};
    if (data.tenantSchema) {
      headers["X-Tenant-Schema"] = data.tenantSchema;
    }
    return await apiClient.post<LoginResponse>("/Auth/login", 
      { email: data.email, password: data.password }, 
      { headers }
    );
  },
  changePassword: async (data: any): Promise<any> => {
    return await apiClient.put("/Auth/change-password", data);
  }
};
