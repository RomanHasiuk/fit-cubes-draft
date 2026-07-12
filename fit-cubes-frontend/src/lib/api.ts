import type { FoodItem, ActivityConstant } from '@/types';

// Database simulation (in the future, these will be requests to a real backend)
class ApiClient {
  async getStaticProducts(): Promise<FoodItem[]> {
    const res = await fetch('/data/products.json');
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.map((p: any) => ({
      id: String(p.id),
      name: p.name,
      category: p.category,
      caloriesPer100g: p.calories || 0,
      proteinPer100g: p.protein || 0,
      carbsPer100g: p.carbs || 0,
      fatsPer100g: p.fats || 0,
      rawWeight: p.rawWeight,
      cookedWeight: p.cookedWeight,
    }));
  }

  async getActivities(): Promise<ActivityConstant[]> {
    const res = await fetch('/data/activities.json');
    if (!res.ok) throw new Error('Failed to fetch activities');
    const data = await res.json();
    return data.map((a: any) => ({
      name: a.name,
      metricLabel: a.unit || 'units',
      met: a.metValue || 0,
      kcalPerUnit: a.kcalPerUnit || 0,
    }));
  }
}

export const api = new ApiClient();
