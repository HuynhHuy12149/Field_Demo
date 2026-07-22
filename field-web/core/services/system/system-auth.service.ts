import { apiClient } from "@/core/lib/apiClient";

export interface SystemLoginRequest {
    email: string;
    password: string;
}

export interface SystemLoginResponse {
    token: string;
    user: {
        id: number;
        fullName: string;
        email: string;
        type: string;
    };
}

export const systemAuthService = {
    async login(data: SystemLoginRequest): Promise<SystemLoginResponse> {
        return await apiClient.post<SystemLoginResponse>("/SystemAuth/login", data);
    },
    async changePassword(data: any): Promise<any> {
        return await apiClient.put("/SystemAuth/change-password", data);
    }
};
