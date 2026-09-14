import { apiClient, type ApiResponse } from './apiClient';
import type { FoodItem, Ingredients } from '@/types';

export interface CreateRecipePayload {
  name: string;
  category?: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatsPer100g: number;
  rawWeight: number;
  cookedWeight: number;
  recipeIngredients: Ingredients[];
}

export const recipeService = {
  async getRecipes(): Promise<ApiResponse<FoodItem[]>> {
    return apiClient.get<FoodItem[]>('/recipes');
  },

  async getRecipeById(id: string): Promise<ApiResponse<FoodItem>> {
    return apiClient.get<FoodItem>(`/recipes/${id}`);
  },

  async createRecipe(payload: CreateRecipePayload): Promise<ApiResponse<FoodItem>> {
    return apiClient.post<FoodItem>('/recipes', payload);
  },

  async updateRecipe(id: string, payload: Partial<CreateRecipePayload>): Promise<ApiResponse<FoodItem>> {
    return apiClient.patch<FoodItem>(`/recipes/${id}`, payload);
  },

  async deleteRecipe(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/recipes/${id}`);
  },
};
