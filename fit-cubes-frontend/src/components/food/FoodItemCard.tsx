import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Edit2, Trash2 } from 'lucide-react';
import type { FoodItem } from '@/types';

interface FoodItemCardProps {
  food: FoodItem;
  usageCount: number;
  isFavorite: boolean;
  isCustom: boolean;
  onSelect: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
  onEdit?: (food: FoodItem) => void;
  onDelete?: (food: FoodItem) => void;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  food,
  usageCount,
  isFavorite,
  isCustom,
  onSelect,
  onToggleFavorite,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      onClick={() => onSelect(food)}
      className="w-full rounded-[5px] border border-[#32363E] bg-[#16181D]/60 hover:border-white/25 hover:bg-[#16181D]/80 transition-all p-3 mb-2.5 select-none cursor-pointer group"
    >
      {/* Top Row: Food Name & Calories + Heart */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="font-serif text-[15px] md:text-[16px] font-semibold text-[#F5F6FA] truncate">
            {food.name}
          </h3>
          {usageCount > 0 && !isFavorite && (
            <span className="text-[10px] bg-white/5 border border-[#32363E] px-1.5 py-0.5 rounded-[4px] text-[#8E8F96] font-sans font-normal shrink-0">
              {usageCount}x
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs md:text-[14px] font-medium text-[#F5F6FA]">
            {food.caloriesPer100g} kcal/100g
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(food.id);
            }}
            className="p-1 text-[#F59F0A] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className="w-4 h-4 stroke-[2]"
              fill={isFavorite ? '#F59F0A' : 'none'}
              stroke="#F59F0A"
            />
          </button>
          {isCustom && (
            <div className="flex items-center gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(food)}
                  className="p-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  title="Edit food"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(food)}
                  className="p-1 text-destructive/60 hover:text-destructive transition-colors cursor-pointer"
                  title="Delete food"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Middle Row: Macronutrients */}
      <div className="text-xs text-[#8E8F96] mt-1 font-sans font-medium">
        P:{food.proteinPer100g}g C:{food.carbsPer100g}g F:{food.fatsPer100g}g
        {food.rawWeight && food.cookedWeight
          ? ` · raw→cooked ratio ${(food.rawWeight / food.cookedWeight).toFixed(1)}x`
          : ''}
      </div>

      {/* Bottom Row: Category */}
      <div className="text-xs text-[#8E8F96]/80 mt-1 font-sans">
        {food.category}
      </div>
    </motion.div>
  );
};

export default FoodItemCard;
