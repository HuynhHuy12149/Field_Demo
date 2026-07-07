import { apiClient } from "@/core/lib/apiClient";
import { PagedResponse } from "../models/common.types";

export interface UserRequest {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  password?: string;
  avatarUrl?: string;
  isActive: boolean;
  roleIds?: number[];
}

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  isActive: boolean;
  roleIds: number[];
}

export const usersService = {
  getAll: async (params: {
    pageIndex: number;
    pageSize: number;
    searchTerm?: string;
    sortColumn?: string;
    sortOrder?: string;
  }): Promise<PagedResponse<UserResponse>> => {
    return apiClient.get("/users", { params });
  },

  create: async (data: UserRequest): Promise<UserResponse> => {
    return apiClient.post("/users", data);
  },

  update: async (id: number, data: UserRequest): Promise<UserResponse> => {
    return apiClient.put(`/users/${id}`, data);
  },

  delete: async (id: number): Promise<boolean> => {
    return apiClient.delete(`/users/${id}`);
  }
};
