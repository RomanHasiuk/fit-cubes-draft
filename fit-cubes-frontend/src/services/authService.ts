import { apiClient, type ApiResponse } from './apiClient';
import { resetStore } from '@/store/useStore';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  token?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  repeatedPassword: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface AuthResponseData {
  token: string;
  user?: AuthUser;
}

export type SocialProvider = 'apple' | 'google' | 'facebook';

export const authService = {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
    const res = await apiClient.post<AuthResponseData>('/auth/login', payload);
    if (res.ok && res.data?.token) {
      localStorage.setItem('fitcubes_auth_token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('fitcubes_auth_user', JSON.stringify(res.data.user));
      }
      window.dispatchEvent(new Event('fitcubes_auth_change'));
    }
    return res;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> {
    const res = await apiClient.post<AuthResponseData>('/auth/register', payload);
    if (res.ok && res.data?.token) {
      localStorage.setItem('fitcubes_auth_token', res.data.token);
      if (res.data.user) {
        localStorage.setItem('fitcubes_auth_user', JSON.stringify(res.data.user));
      }
      window.dispatchEvent(new Event('fitcubes_auth_change'));
    }
    return res;
  },

  clearLocalSession(): void {
    resetStore();
    localStorage.removeItem('fitcubes_auth_token');
    localStorage.removeItem('fitcubes_auth_user');
    window.dispatchEvent(new Event('fitcubes_auth_change'));
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('[AuthService] Logout backend request failed:', err);
    } finally {
      this.clearLocalSession();
    }
  },

  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem('fitcubes_auth_token'));
  },

  async requestPasswordReset(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/forgot-password', { email });
  },

  async confirmPasswordReset(payload: ResetPasswordPayload): Promise<ApiResponse<void>> {
    return apiClient.post<void>('/auth/reset-password', payload);
  },

  initiateSocialAuth(provider: SocialProvider): void {
    console.log(`[OAuth2] Initiating social authorization for ${provider}`);
  },
};
