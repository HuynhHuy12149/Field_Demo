import { apiClient } from "@/core/lib/apiClient";

export interface SystemErrorLogResponse {
  id: number;
  errorMessage: string;
  stackTrace: string;
  tenantSchema: string;
  createdAt: string;
}

export interface SystemPagedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const systemLogsService = {
  getLogs: async (
    page: number = 1,
    pageSize: number = 10,
    tenantSchema?: string,
    sortBy?: string,
    isDescending: boolean = true
  ): Promise<SystemPagedResponse<SystemErrorLogResponse>> => {
    let url = `/SystemErrorLogs?page=${page}&pageSize=${pageSize}&isDescending=${isDescending}`;
    if (tenantSchema) {
      url += `&tenantSchema=${tenantSchema}`;
    }
    if (sortBy) {
      url += `&sortBy=${sortBy}`;
    }
    return await apiClient.get<SystemPagedResponse<SystemErrorLogResponse>>(url);
  },
};
