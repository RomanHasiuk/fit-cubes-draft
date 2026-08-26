import { apiClient, type ApiResponse } from './apiClient';
import type { UserProfile } from '@/types';

export const userService = {
  /**
   * Fetches the authenticated user's profile and macro targets.
   * Maps to Spring Boot GET /api/v1/user/profile.
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return apiClient.get<UserProfile>('/user/profile');
  },

  /**
   * Updates the user's profile (weight, height, age, activity, macro targets).
   * Maps to Spring Boot PUT /api/v1/user/profile.
   */
  async updateProfile(payload: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return apiClient.put<UserProfile>('/user/profile', payload);
  },
};
