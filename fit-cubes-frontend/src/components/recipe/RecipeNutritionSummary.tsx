import React from 'react';
import { Save, Check, Loader2 } from 'lucide-react';
import InfoTooltip from '@/components/InfoTooltip';
import FoodAnalysis from '@/components/FoodAnalysis';
import { Button } from '@/components/ui/button';

interface RecipeNutritionSummaryProps {
  resultMacros: {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
  };
  recipeName: string;
  editingRecipeId: string | null;
  isSaving: boolean;
  isLoadingRecipe: boolean;
  onSaveClick: (asNew?: boolean) => void;
}

export const RecipeNutritionSummary: React.FC<RecipeNutritionSummaryProps> = ({
  resultMacros,
  recipeName,
  editingRecipeId,
  isSaving,
  isLoadingRecipe,
  onSaveClick,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Result per 100g Card */}
      <div className="flex flex-col gap-4 rounded-[5px] border border-[#4F3911] bg-[#251F13]/80 p-5 shadow-lg backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[#4F3911]/60 pb-3">
          <div className="flex items-center gap-1.5">
            <h3 className="font-sans text-[15px] font-semibold text-[#F59F0A]">
              Nutritional Yield (per 100g finished dish)
            </h3>
            <InfoTooltip
              title="How is this calculated?"
              content="We sum all raw nutrients and divide them by the finished cooked mass of the dish, giving you accurate calories and macros per 100g."
              align="right"
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col items-center">
            <span className="font-serif text-[26px] md:text-[32px] font-bold text-[#F59F0A] leading-tight">
              {Math.round(resultMacros.calories)}
            </span>
            <span className="font-sans text-[11px] font-medium uppercase text-[#8E8F96]">
              kcal
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-sans text-[20px] md:text-[24px] font-bold text-emerald-400 leading-tight">
              {resultMacros.protein}g
            </span>
            <span className="font-sans text-[11px] font-medium uppercase text-[#8E8F96]">
              Protein
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-sans text-[20px] md:text-[24px] font-bold text-blue-400 leading-tight">
              {resultMacros.carbs}g
            </span>
            <span className="font-sans text-[11px] font-medium uppercase text-[#8E8F96]">
              Carbs
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="font-sans text-[20px] md:text-[24px] font-bold text-amber-400 leading-tight">
              {resultMacros.fats}g
            </span>
            <span className="font-sans text-[11px] font-medium uppercase text-[#8E8F96]">
              Fats
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {editingRecipeId ? (
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSaving || isLoadingRecipe}
                onClick={() => onSaveClick(true)}
                className="h-11 text-[14px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
                Save as New
              </Button>
              <Button
                type="button"
                disabled={isSaving || isLoadingRecipe}
                onClick={() => onSaveClick(false)}
                className="h-11 text-[14px]"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Check className="w-4 h-4 mr-1.5" />}
                Update Recipe
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              disabled={isSaving || isLoadingRecipe}
              onClick={() => onSaveClick(false)}
              className="w-full h-11 text-[16px]"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Recipe to Catalog
            </Button>
          )}
        </div>
      </div>

      {/* Visual Macro breakdown */}
      <FoodAnalysis
        food={{
          id: 'recipe_preview',
          name: recipeName || 'Custom Recipe',
          category: 'My Meals',
          caloriesPer100g: resultMacros.calories,
          proteinPer100g: resultMacros.protein,
          carbsPer100g: resultMacros.carbs,
          fatsPer100g: resultMacros.fats,
        }}
        weight={100}
        isCooked={false}
        hasConversion={false}
      />
    </div>
  );
};
