import { apiClient } from "@/core/lib/apiClient";
import { PagedResponse } from "@/core/models/common.types"; // Re-use common types if needed, or define them here

export interface TenantResponse {
    id: number;
    name: string;
    adminEmail: string;
    schemaName: string;
    type: number; // 0: Field, 1: Class, 2: ERP
    status: number; // 0: Active, 1: Suspended, 2: Deleted
    createdAt: string;
}

export interface CreateTenantRequest {
    name: string;
    adminEmail: string;
    adminPassword: string;
    adminFullName: string;
    type: number;
}

export interface SystemTenantPagedResponse {
    currentPage: number;
    pageSize: number;
    totalRecords: number;
    totalPages: number;
    success: boolean;
    message: string;
    data: TenantResponse[];
}

export const systemTenantService = {
    async getAll(params: any): Promise<SystemTenantPagedResponse> {
        return await apiClient.get<SystemTenantPagedResponse>("/SystemTenants", { params });
    },

    async create(data: CreateTenantRequest): Promise<TenantResponse> {
        return await apiClient.post<TenantResponse>("/SystemTenants", data);
    },

    async updateStatus(id: number, status: number): Promise<void> {
        return await apiClient.put<void>(`/SystemTenants/${id}/status`, status, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    },

    async delete(id: number): Promise<void> {
        return await apiClient.delete<void>(`/SystemTenants/${id}`);
    },

    async changeAdminPassword(id: number, data: any): Promise<void> {
        return await apiClient.put<void>(`/SystemTenants/${id}/change-admin-password`, data);
    }
};
