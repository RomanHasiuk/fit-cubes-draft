import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Edit2, Trash2 } from 'lucide-react';
import type { FoodItem } from '@/types';

interface FoodItemCardProps {
  food: FoodItem;
  index: number;
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
  index,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      className="w-full flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-secondary/20 rounded-xl px-2 transition-colors"
    >
      <button
        type="button"
        onClick={() => onSelect(food)}
        className="flex-1 text-left min-w-0 py-1 cursor-pointer touch-manipulation active:opacity-75"
      >
        <p className="text-sm font-medium flex items-center gap-2">
          <span className="truncate">{food.name}</span>
          {usageCount > 0 && !isFavorite && (
            <span className="text-[10px] bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
              {usageCount} times
            </span>
          )}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          P:{food.proteinPer100g}g C:{food.carbsPer100g}g F:{food.fatsPer100g}g
          {food.rawWeight && food.cookedWeight
            ? ` · raw→cooked ratio ${(food.rawWeight / food.cookedWeight).toFixed(1)}x`
            : ''}
        </p>
        <p className="text-xs text-muted-foreground">{food.category}</p>
      </button>

      <div className="flex items-center gap-2 shrink-0 ml-4">
        <span className="text-sm text-muted-foreground mr-1">
          {food.caloriesPer100g} kcal/100g
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.id);
          }}
          className="p-2.5 text-rose-400 hover:bg-rose-400/10 active:scale-110 rounded-xl transition-all cursor-pointer touch-manipulation"
          title="Add to favorites"
        >
          <Heart
            className="w-4 h-4"
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        </button>
        {isCustom && (
          <>
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(food);
                }}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                title="Edit food"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(food);
                }}
                className="p-2 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                title="Delete food"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default FoodItemCard;
