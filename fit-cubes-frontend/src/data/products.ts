import type { FoodItem } from '@/types';

export const FOOD_DATABASE: FoodItem[] = [
  // Proteins
  { id: '1', name: 'Chicken Breast (Raw)', category: 'Proteins', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatsPer100g: 3.6, rawWeight: 200, cookedWeight: 130 },
  { id: '2', name: 'Chicken Thigh (Raw)', category: 'Proteins', caloriesPer100g: 226, proteinPer100g: 25, carbsPer100g: 0, fatsPer100g: 15, rawWeight: 200, cookedWeight: 140 },
  { id: '3', name: 'Ground Beef 90/10 (Raw)', category: 'Proteins', caloriesPer100g: 176, proteinPer100g: 20, carbsPer100g: 0, fatsPer100g: 10, rawWeight: 200, cookedWeight: 135 },
  { id: '4', name: 'Ground Beef 80/20 (Raw)', category: 'Proteins', caloriesPer100g: 254, proteinPer100g: 17, carbsPer100g: 0, fatsPer100g: 20, rawWeight: 200, cookedWeight: 130 },
  { id: '5', name: 'Salmon Fillet (Raw)', category: 'Proteins', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatsPer100g: 13, rawWeight: 200, cookedWeight: 145 },
  { id: '6', name: 'Tuna (Canned in Water)', category: 'Proteins', caloriesPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 1 },
  { id: '7', name: 'Egg (Whole)', category: 'Proteins', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatsPer100g: 11 },
  { id: '8', name: 'Egg Whites', category: 'Proteins', caloriesPer100g: 52, proteinPer100g: 11, carbsPer100g: 0.7, fatsPer100g: 0.2 },
  { id: '9', name: 'Greek Yogurt (0%)', category: 'Proteins', caloriesPer100g: 59, proteinPer100g: 10, carbsPer100g: 3.6, fatsPer100g: 0.4 },
  { id: '10', name: 'Greek Yogurt (2%)', category: 'Proteins', caloriesPer100g: 73, proteinPer100g: 10, carbsPer100g: 3.6, fatsPer100g: 2 },
  { id: '11', name: 'Cottage Cheese (Low Fat)', category: 'Proteins', caloriesPer100g: 72, proteinPer100g: 12, carbsPer100g: 2.7, fatsPer100g: 1 },
  { id: '12', name: 'Turkey Breast (Raw)', category: 'Proteins', caloriesPer100g: 135, proteinPer100g: 30, carbsPer100g: 0, fatsPer100g: 1, rawWeight: 200, cookedWeight: 140 },
  { id: '13', name: 'Pork Tenderloin (Raw)', category: 'Proteins', caloriesPer100g: 143, proteinPer100g: 26, carbsPer100g: 0, fatsPer100g: 3.5, rawWeight: 200, cookedWeight: 145 },
  { id: '14', name: 'Shrimp (Raw)', category: 'Proteins', caloriesPer100g: 99, proteinPer100g: 24, carbsPer100g: 0.2, fatsPer100g: 0.3, rawWeight: 200, cookedWeight: 120 },
  { id: '15', name: 'Tofu (Firm)', category: 'Proteins', caloriesPer100g: 144, proteinPer100g: 17, carbsPer100g: 2.3, fatsPer100g: 8.7 },
  { id: '16', name: 'Whey Protein Powder', category: 'Proteins', caloriesPer100g: 400, proteinPer100g: 80, carbsPer100g: 8, fatsPer100g: 5 },

  // Carbohydrates
  { id: '17', name: 'White Rice (Raw)', category: 'Carbs', caloriesPer100g: 365, proteinPer100g: 7.1, carbsPer100g: 80, fatsPer100g: 0.7, rawWeight: 100, cookedWeight: 300 },
  { id: '18', name: 'Brown Rice (Raw)', category: 'Carbs', caloriesPer100g: 362, proteinPer100g: 7.5, carbsPer100g: 76, fatsPer100g: 2.7, rawWeight: 100, cookedWeight: 280 },
  { id: '19', name: 'Oats (Raw/Dry)', category: 'Carbs', caloriesPer100g: 389, proteinPer100g: 16.9, carbsPer100g: 66, fatsPer100g: 6.9 },
  { id: '20', name: 'Pasta (Raw/Dry)', category: 'Carbs', caloriesPer100g: 371, proteinPer100g: 13, carbsPer100g: 75, fatsPer100g: 1.5, rawWeight: 100, cookedWeight: 250 },
  { id: '21', name: 'Sweet Potato (Raw)', category: 'Carbs', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatsPer100g: 0.1, rawWeight: 200, cookedWeight: 160 },
  { id: '22', name: 'Potato (Raw)', category: 'Carbs', caloriesPer100g: 77, proteinPer100g: 2, carbsPer100g: 17, fatsPer100g: 0.1, rawWeight: 200, cookedWeight: 165 },
  { id: '23', name: 'Quinoa (Raw)', category: 'Carbs', caloriesPer100g: 368, proteinPer100g: 14, carbsPer100g: 64, fatsPer100g: 6, rawWeight: 100, cookedWeight: 300 },
  { id: '24', name: 'Whole Wheat Bread', category: 'Carbs', caloriesPer100g: 247, proteinPer100g: 13, carbsPer100g: 41, fatsPer100g: 3.4 },
  { id: '25', name: 'White Bread', category: 'Carbs', caloriesPer100g: 265, proteinPer100g: 9, carbsPer100g: 49, fatsPer100g: 3.2 },
  { id: '26', name: 'Banana', category: 'Carbs', caloriesPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatsPer100g: 0.3 },
  { id: '27', name: 'Apple', category: 'Carbs', caloriesPer100g: 52, proteinPer100g: 0.3, carbsPer100g: 14, fatsPer100g: 0.2 },
  { id: '28', name: 'Blueberries', category: 'Carbs', caloriesPer100g: 57, proteinPer100g: 0.7, carbsPer100g: 14, fatsPer100g: 0.3 },
  { id: '29', name: 'Strawberries', category: 'Carbs', caloriesPer100g: 32, proteinPer100g: 0.7, carbsPer100g: 7.7, fatsPer100g: 0.3 },

  // Fats
  { id: '30', name: 'Olive Oil', category: 'Fats', caloriesPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100 },
  { id: '31', name: 'Coconut Oil', category: 'Fats', caloriesPer100g: 862, proteinPer100g: 0, carbsPer100g: 0, fatsPer100g: 100 },
  { id: '32', name: 'Butter', category: 'Fats', caloriesPer100g: 717, proteinPer100g: 0.9, carbsPer100g: 0.1, fatsPer100g: 81 },
  { id: '33', name: 'Almonds', category: 'Fats', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatsPer100g: 50 },
  { id: '34', name: 'Peanut Butter', category: 'Fats', caloriesPer100g: 588, proteinPer100g: 25, carbsPer100g: 20, fatsPer100g: 50 },
  { id: '35', name: 'Avocado', category: 'Fats', caloriesPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatsPer100g: 15 },
  { id: '36', name: 'Walnuts', category: 'Fats', caloriesPer100g: 654, proteinPer100g: 15, carbsPer100g: 14, fatsPer100g: 65 },
  { id: '37', name: 'Chia Seeds', category: 'Fats', caloriesPer100g: 486, proteinPer100g: 17, carbsPer100g: 42, fatsPer100g: 31 },
  { id: '38', name: 'Flaxseeds', category: 'Fats', caloriesPer100g: 534, proteinPer100g: 18, carbsPer100g: 29, fatsPer100g: 42 },

  // Vegetables
  { id: '39', name: 'Broccoli', category: 'Vegetables', caloriesPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatsPer100g: 0.4 },
  { id: '40', name: 'Spinach', category: 'Vegetables', caloriesPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatsPer100g: 0.4 },
  { id: '41', name: 'Kale', category: 'Vegetables', caloriesPer100g: 49, proteinPer100g: 4.3, carbsPer100g: 9, fatsPer100g: 0.9 },
  { id: '42', name: 'Bell Pepper', category: 'Vegetables', caloriesPer100g: 20, proteinPer100g: 0.9, carbsPer100g: 4.6, fatsPer100g: 0.2 },
  { id: '43', name: 'Tomato', category: 'Vegetables', caloriesPer100g: 18, proteinPer100g: 0.9, carbsPer100g: 3.9, fatsPer100g: 0.2 },
  { id: '44', name: 'Cucumber', category: 'Vegetables', caloriesPer100g: 15, proteinPer100g: 0.7, carbsPer100g: 3.6, fatsPer100g: 0.1 },
  { id: '45', name: 'Carrot', category: 'Vegetables', caloriesPer100g: 41, proteinPer100g: 0.9, carbsPer100g: 10, fatsPer100g: 0.2 },
  { id: '46', name: 'Onion', category: 'Vegetables', caloriesPer100g: 40, proteinPer100g: 1.1, carbsPer100g: 9, fatsPer100g: 0.1 },
  { id: '47', name: 'Garlic', category: 'Vegetables', caloriesPer100g: 149, proteinPer100g: 6.4, carbsPer100g: 33, fatsPer100g: 0.5 },
  { id: '48', name: 'Lettuce', category: 'Vegetables', caloriesPer100g: 15, proteinPer100g: 1.4, carbsPer100g: 2.9, fatsPer100g: 0.2 },
  { id: '49', name: 'Cauliflower', category: 'Vegetables', caloriesPer100g: 25, proteinPer100g: 1.9, carbsPer100g: 5, fatsPer100g: 0.3 },
  { id: '50', name: 'Asparagus', category: 'Vegetables', caloriesPer100g: 20, proteinPer100g: 2.2, carbsPer100g: 3.9, fatsPer100g: 0.1 },
  { id: '51', name: 'Zucchini', category: 'Vegetables', caloriesPer100g: 17, proteinPer100g: 1.2, carbsPer100g: 3.1, fatsPer100g: 0.3 },
  { id: '52', name: 'Mushrooms', category: 'Vegetables', caloriesPer100g: 22, proteinPer100g: 3.1, carbsPer100g: 3.3, fatsPer100g: 0.3 },
  { id: '53', name: 'Green Beans', category: 'Vegetables', caloriesPer100g: 31, proteinPer100g: 1.8, carbsPer100g: 7, fatsPer100g: 0.1 },

  // Dairy
  { id: '54', name: 'Milk (Whole)', category: 'Dairy', caloriesPer100g: 61, proteinPer100g: 3.2, carbsPer100g: 4.8, fatsPer100g: 3.3 },
  { id: '55', name: 'Milk (Skim)', category: 'Dairy', caloriesPer100g: 34, proteinPer100g: 3.4, carbsPer100g: 5, fatsPer100g: 0.1 },
  { id: '56', name: 'Cheddar Cheese', category: 'Dairy', caloriesPer100g: 402, proteinPer100g: 25, carbsPer100g: 1.3, fatsPer100g: 33 },
  { id: '57', name: 'Mozzarella (Part Skim)', category: 'Dairy', caloriesPer100g: 254, proteinPer100g: 24, carbsPer100g: 2.8, fatsPer100g: 16 },
  { id: '58', name: 'Feta Cheese', category: 'Dairy', caloriesPer100g: 264, proteinPer100g: 14, carbsPer100g: 4.1, fatsPer100g: 21 },
  { id: '59', name: 'Parmesan Cheese', category: 'Dairy', caloriesPer100g: 431, proteinPer100g: 38, carbsPer100g: 4.1, fatsPer100g: 29 },

  // Grains & Legumes
  { id: '60', name: 'Lentils (Raw/Dry)', category: 'Legumes', caloriesPer100g: 352, proteinPer100g: 25, carbsPer100g: 63, fatsPer100g: 1.1, rawWeight: 100, cookedWeight: 250 },
  { id: '61', name: 'Black Beans (Raw/Dry)', category: 'Legumes', caloriesPer100g: 341, proteinPer100g: 22, carbsPer100g: 62, fatsPer100g: 1.4, rawWeight: 100, cookedWeight: 250 },
  { id: '62', name: 'Chickpeas (Raw/Dry)', category: 'Legumes', caloriesPer100g: 364, proteinPer100g: 19, carbsPer100g: 61, fatsPer100g: 6, rawWeight: 100, cookedWeight: 240 },
  { id: '63', name: 'Whole Wheat Pasta (Raw)', category: 'Carbs', caloriesPer100g: 348, proteinPer100g: 14, carbsPer100g: 68, fatsPer100g: 2.7, rawWeight: 100, cookedWeight: 250 },

  // Pre-made / Common meals
  { id: '64', name: 'Grilled Chicken Salad', category: 'Meals', caloriesPer100g: 120, proteinPer100g: 15, carbsPer100g: 5, fatsPer100g: 4.5 },
  { id: '65', name: 'Chicken Stir-Fry', category: 'Meals', caloriesPer100g: 145, proteinPer100g: 14, carbsPer100g: 8, fatsPer100g: 6 },
  { id: '66', name: 'Omelette (2 eggs + veggies)', category: 'Meals', caloriesPer100g: 160, proteinPer100g: 12, carbsPer100g: 3, fatsPer100g: 11 },
  { id: '67', name: 'Protein Smoothie', category: 'Meals', caloriesPer100g: 85, proteinPer100g: 12, carbsPer100g: 8, fatsPer100g: 1.5 },
  { id: '68', name: 'Chicken Wrap', category: 'Meals', caloriesPer100g: 195, proteinPer100g: 14, carbsPer100g: 20, fatsPer100g: 6 },
  { id: '69', name: 'Rice Bowl (Chicken + Rice + Veg)', category: 'Meals', caloriesPer100g: 155, proteinPer100g: 12, carbsPer100g: 18, fatsPer100g: 3.5 },
  { id: '70', name: 'Greek Yogurt Bowl', category: 'Meals', caloriesPer100g: 120, proteinPer100g: 10, carbsPer100g: 15, fatsPer100g: 2 },

  // Beverages
  { id: '71', name: 'Black Coffee', category: 'Beverages', caloriesPer100g: 2, proteinPer100g: 0.1, carbsPer100g: 0, fatsPer100g: 0 },
  { id: '72', name: 'Green Tea', category: 'Beverages', caloriesPer100g: 1, proteinPer100g: 0, carbsPer100g: 0.2, fatsPer100g: 0 },
  { id: '73', name: 'Orange Juice', category: 'Beverages', caloriesPer100g: 45, proteinPer100g: 0.7, carbsPer100g: 10, fatsPer100g: 0.2 },
  { id: '74', name: 'Protein Shake (Ready-to-Drink)', category: 'Beverages', caloriesPer100g: 65, proteinPer100g: 12, carbsPer100g: 4, fatsPer100g: 1 },
];

export function searchFoods(query: string): FoodItem[] {
  if (!query.trim()) return FOOD_DATABASE;
  const lower = query.toLowerCase();
  return FOOD_DATABASE.filter(
    (f) =>
      f.name.toLowerCase().includes(lower) ||
      f.category.toLowerCase().includes(lower)
  );
}
