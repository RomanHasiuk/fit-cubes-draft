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
  /**
   * Fetches all user custom recipes from the backend.
   * Maps to Spring Boot GET /api/v1/recipes (KAN-44).
   */
  async getRecipes(): Promise<ApiResponse<FoodItem[]>> {
    return apiClient.get<FoodItem[]>('/recipes');
  },

  /**
   * Fetches a specific recipe by ID.
   */
  async getRecipeById(id: string): Promise<ApiResponse<FoodItem>> {
    return apiClient.get<FoodItem>(`/recipes/${id}`);
  },

  /**
   * Creates a new custom recipe.
   * Maps to Spring Boot POST /api/v1/recipes (KAN-35, KAN-44).
   */
  async createRecipe(payload: CreateRecipePayload): Promise<ApiResponse<FoodItem>> {
    return apiClient.post<FoodItem>('/recipes', payload);
  },

  /**
   * Updates an existing custom recipe in place.
   * Maps to Spring Boot PUT /api/v1/recipes/{id} (KAN-37).
   */
  async updateRecipe(id: string, payload: Partial<CreateRecipePayload>): Promise<ApiResponse<FoodItem>> {
    return apiClient.put<FoodItem>(`/recipes/${id}`, payload);
  },

  /**
   * Deletes a custom recipe.
   * Maps to Spring Boot DELETE /api/v1/recipes/{id}.
   */
  async deleteRecipe(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/recipes/${id}`);
  },
};
