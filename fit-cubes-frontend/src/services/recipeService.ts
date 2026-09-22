import { apiClient, type ApiResponse } from './apiClient';
import type {
  RecipeSummaryDto,
  RecipeDto,
  CreateRecipeDto,
  UpdateRecipeDto,
  PageResponse,
  PageQueryParams,
} from '@/types/api';

export interface RecipeQueryParams extends PageQueryParams {
  category?: string;
}

export const recipeService = {
  async getRecipes(params?: RecipeQueryParams): Promise<ApiResponse<PageResponse<RecipeSummaryDto>>> {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page !== undefined) searchParams.append('page', String(params.page));
    if (params?.size !== undefined) searchParams.append('size', String(params.size));
    if (params?.sort) searchParams.append('sort', params.sort);

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return apiClient.get<PageResponse<RecipeSummaryDto>>(`/recipes${queryString}`);
  },

  async getRecipeById(id: number | string): Promise<ApiResponse<RecipeDto>> {
    return apiClient.get<RecipeDto>(`/recipes/${id}`);
  },

  async createRecipe(payload: CreateRecipeDto): Promise<ApiResponse<RecipeDto>> {
    return apiClient.post<RecipeDto>('/recipes', payload);
  },

  async updateRecipe(
    id: number | string,
    payload: UpdateRecipeDto
  ): Promise<ApiResponse<RecipeDto>> {
    return apiClient.patch<RecipeDto>(`/recipes/${id}`, payload);
  },

  async deleteRecipe(id: number | string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/recipes/${id}`);
  },

  async getCategoryPresets(): Promise<ApiResponse<string[]>> {
    return apiClient.get<string[]>('/categories/presets');
  },
};
