import { apiClient, type ApiResponse } from './apiClient';
import type { UserProfile } from '@/types';

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/users/profile');
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch<UserProfile>('/users/profile', payload);
  },
};
