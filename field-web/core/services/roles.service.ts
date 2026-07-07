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
  getAll: async (params: {
    pageIndex: number;
    pageSize: number;
    searchTerm?: string;
    sortColumn?: string;
    sortOrder?: string;
  }): Promise<PagedResponse<RoleResponse>> => {
    return apiClient.get("/Roles", { params });
  },

  create: async (data: RoleRequest): Promise<RoleResponse> => {
    return apiClient.post("/Roles", data);
  },

  update: async (id: number, data: RoleRequest): Promise<RoleResponse> => {
    return apiClient.put(`/Roles/${id}`, data);
  },

  delete: async (id: number): Promise<boolean> => {
    return apiClient.delete(`/Roles/${id}`);
  },

  getClaims: async (id: number): Promise<string[]> => {
    return apiClient.get(`/Roles/${id}/claims`);
  },

  updateClaims: async (id: number, claims: string[]): Promise<boolean> => {
    return apiClient.post(`/Roles/${id}/claims`, claims);
  }
};
