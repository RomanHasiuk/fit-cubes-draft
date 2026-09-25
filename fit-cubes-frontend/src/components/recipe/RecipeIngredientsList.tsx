import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2 } from 'lucide-react';
import type { FoodItem } from '@/types';
import { blockInvalidIntegerInput } from '@/utils/inputHandlers';
import { Button } from '@/components/ui/button';

export interface RecipeIngredient {
  id: string;
  product: FoodItem;
  weight: number | '';
}

interface RecipeIngredientsListProps {
  ingredients: RecipeIngredient[];
  onAddClick: () => void;
  onUpdateWeight: (id: string, value: string) => void;
  onBlurWeight: (id: string) => void;
  onRemoveIngredient: (id: string) => void;
}

export const RecipeIngredientsList: React.FC<RecipeIngredientsListProps> = ({
  ingredients,
  onAddClick,
  onUpdateWeight,
  onBlurWeight,
  onRemoveIngredient,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-sans text-[15px] font-semibold text-foreground">
            Ingredients (Raw)
          </h3>
          <span className="rounded-full bg-[#251F13] border border-[#4F3911] px-2 py-0.2 text-[11px] font-bold text-[#F59F0A]">
            {ingredients.length}
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onAddClick}
          className="h-8 px-3 text-[13px]"
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Item
        </Button>
      </div>

      {ingredients.length === 0 ? (
        <div
          onClick={onAddClick}
          className="flex flex-col items-center justify-center gap-2.5 rounded-[5px] border-2 border-dashed border-[#32363E] bg-[#16181D]/30 p-8 text-center transition-all hover:border-[#F59F0A]/50 hover:bg-[#16181D]/60 cursor-pointer active:scale-[0.99]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#251F13] text-[#F59F0A]">
            <Search className="h-5 w-5" />
          </div>
          <p className="font-sans text-[14px] font-medium text-foreground">
            No ingredients added yet
          </p>
          <p className="font-sans text-[12px] text-[#8E8F96]">
            Tap here or use the "Add Item" button to select products from database
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ingredients.map((ing) => (
            <motion.div
              key={ing.id}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-[5px] border border-[#32363E] bg-[#16181D]/60 p-3 backdrop-blur-sm transition-all hover:border-white/20"
            >
              <div className="flex-1 min-w-0 mr-3">
                <p className="font-sans text-[14px] font-medium text-foreground truncate">
                  {ing.product.name}
                </p>
                <p className="font-sans text-[12px] text-[#8E8F96]">
                  {ing.product.caloriesPer100g} kcal · P: {ing.product.proteinPer100g}g · C: {ing.product.carbsPer100g}g · F: {ing.product.fatsPer100g}g / 100g
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative w-20">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="100"
                    onKeyDown={blockInvalidIntegerInput}
                    value={ing.weight === 0 ? '' : ing.weight}
                    onChange={(e) => onUpdateWeight(ing.id, e.target.value)}
                    onBlur={() => onBlurWeight(ing.id)}
                    className="w-full h-9 rounded-[5px] border border-[#32363E] bg-[#16181D]/90 px-2 pr-6 text-right font-sans text-[14px] font-bold text-[#F59F0A] outline-none transition-colors focus:border-[#F59F0A]"
                  />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 font-sans text-[11px] text-[#8E8F96]">
                    g
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveIngredient(ing.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-[5px] text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Remove ingredient"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
