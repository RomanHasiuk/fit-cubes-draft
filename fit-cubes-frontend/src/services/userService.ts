import { apiClient, type ApiResponse } from './apiClient';
import type { UserProfileDto, UpdateProfilePayload } from '@/types/api';

export const userService = {
  async getProfile(): Promise<ApiResponse<UserProfileDto>> {
    return apiClient.get<UserProfileDto>('/users/profile');
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ApiResponse<UserProfileDto>> {
    return apiClient.patch<UserProfileDto>('/users/profile', payload);
  },
};
