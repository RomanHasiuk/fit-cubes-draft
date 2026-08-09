import { apiClient, type ApiResponse } from './apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponseData {
  token: string;
  user: AuthUser;
}

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    const res = await apiClient.post<AuthResponseData>('/auth/login', payload);
    if (res.ok && res.data?.token) {
      localStorage.setItem('fitcubes_auth_token', res.data.token);
    }
    return res;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    const res = await apiClient.post<AuthResponseData>('/auth/register', payload);
    if (res.ok && res.data?.token) {
      localStorage.setItem('fitcubes_auth_token', res.data.token);
    }
    return res;
  },

  async getCurrentUser(): Promise<ApiResponse<AuthUser>> {
    return apiClient.get<AuthUser>('/auth/me');
  },

  logout(): void {
    localStorage.removeItem('fitcubes_auth_token');
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('fitcubes_auth_token') || localStorage.getItem('token'));
  },
};
