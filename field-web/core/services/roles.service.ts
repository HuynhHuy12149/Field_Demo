import { apiClient } from "@/core/lib/apiClient";
import { ApiResponse, PagedResponse } from "../models/common.types";

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
}

export interface RoleRequest {
  name: string;
  description: string;
  isActive: boolean;
}

export const rolesService = {
  getAll: async (pageIndex = 1, pageSize = 10, searchTerm = "", sortColumn?: string, sortOrder?: string): Promise<PagedResponse<RoleResponse>> => {
    return await apiClient.get<any, PagedResponse<RoleResponse>>("/Roles", {
      params: { pageIndex, pageSize, searchTerm, sortColumn, sortOrder }
    });
  },

  create: async (data: RoleRequest): Promise<ApiResponse<RoleResponse>> => {
    return await apiClient.post<any, ApiResponse<RoleResponse>>("/Roles", data);
  },

  update: async (id: number, data: RoleRequest): Promise<ApiResponse<RoleResponse>> => {
    return await apiClient.put<any, ApiResponse<RoleResponse>>(`/Roles/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<boolean>> => {
    return await apiClient.delete<any, ApiResponse<boolean>>(`/Roles/${id}`);
  }
};
