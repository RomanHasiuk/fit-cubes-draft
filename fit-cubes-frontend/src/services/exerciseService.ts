import { apiClient, type ApiResponse } from './apiClient';
import type { ActivityDto, PageResponse, PageQueryParams } from '@/types/api';

export const exerciseService = {
  async getActivities(params?: PageQueryParams): Promise<ApiResponse<PageResponse<ActivityDto>>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.append('page', String(params.page));
    if (params?.size !== undefined) searchParams.append('size', String(params.size));
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get<PageResponse<ActivityDto>>(`/activities${queryString}`);
  },

  async searchActivities(
    query: string,
    params?: PageQueryParams
  ): Promise<ApiResponse<PageResponse<ActivityDto>>> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return {
        status: 400,
        ok: false,
        error: 'Search query cannot be empty',
      };
    }

    const searchParams = new URLSearchParams();
    searchParams.append('query', cleanQuery);
    if (params?.page !== undefined) searchParams.append('page', String(params.page));
    if (params?.size !== undefined) searchParams.append('size', String(params.size));
    if (params?.sort) searchParams.append('sort', params.sort);

    return apiClient.get<PageResponse<ActivityDto>>(`/activities/search?${searchParams.toString()}`);
  },
};
