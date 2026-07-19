import { useState, useMemo } from 'react';
import { ChevronLeft, Check, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useStore } from '@/store/useStore.ts';
import { calculatePortionOrCookedNutrition } from '@/utils/calculations.ts';
import type { FoodItem, FoodEntry } from '@/types';
import FoodAnalysis from '@/components/FoodAnalysis.tsx';

interface FoodAddProps {
  food: FoodItem;
  mealType: string;
  existingEntry?: FoodEntry;
  onClose: () => void;
  onDone: () => void;
}

export default function FoodAdd({ food, mealType, existingEntry, onClose, onDone }: FoodAddProps) {
  const selectedDate = useStore((state) => state.selectedDate);
  const addFoodEntry = useStore((state) => state.addFoodEntry);
  const updateFoodEntry = useStore((state) => state.updateFoodEntry);
  const setEditingRecipe = useStore((state) => state.setEditingRecipe);
  const navigate = useNavigate();
  const [weight, setWeight] = useState(existingEntry ? existingEntry.weightGrams.toString() : '100');
  const [isCooked, setIsCooked] = useState(existingEntry ? !!existingEntry.isCooked : false);

  const isCustomRecipe = food.category === 'Мої страви' || food.category === 'Мої рецепти';
  const hasConversion = !!(food.rawWeight && food.cookedWeight && !isCustomRecipe);

  const nutrition = useMemo(() =>
    calculatePortionOrCookedNutrition(
      food,
      Number(weight)
      || 0, isCooked,
      !!hasConversion),
    [food, weight, isCooked, hasConversion]
  );

  const handleSave = () => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return;

    const entry: FoodEntry = {
      id: existingEntry ? existingEntry.id : `fe_${Date.now()}_${crypto.randomUUID().slice(0, 5)}`,
      foodItemId: food.id,
      name: food.name,
      weightGrams: w,
      isCooked,
      calories: Math.round(nutrition.calories * 10) / 10,
      protein: Math.round(nutrition.protein * 10) / 10,
      carbs: Math.round(nutrition.carbs * 10) / 10,
      fats: Math.round(nutrition.fats * 10) / 10,
      mealType: mealType as FoodEntry['mealType'],
      timestamp: existingEntry ? existingEntry.timestamp : Date.now(),
    };

    if (existingEntry) {
      updateFoodEntry(selectedDate, entry.id, entry);
    } else {
      addFoodEntry(selectedDate, entry);
    }
    onDone();
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between border-b border-border/40">
        <button
          onClick={onClose}
          className="p-2 rounded-xl active:bg-secondary hover:bg-secondary/60 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <h3 className="font-semibold text-base">Add to Diary</h3>
        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary rounded-xl text-primary-foreground text-sm font-medium active:scale-95 hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
        >
          <Check className="w-4 h-4" />
          {existingEntry ? 'Update' : 'Add'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8 pt-4">
        {/* Food Title & Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{food.name}</h2>
            <p className="text-xs text-muted-foreground mt-1.5 bg-secondary/40 px-2.5 py-1 rounded-md inline-block">
              100g: {food.caloriesPer100g} kcal • P: {food.proteinPer100g}g • C: {food.carbsPer100g}g • F: {food.fatsPer100g}g
            </p>
          </div>

          {food.category === 'Мої страви' && (
            <button
              onClick={() => {
                setEditingRecipe(food);
                navigate('/kitchen', { state: { returnToDiary: true, mealType } });
                onClose();
              }}
              className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl shrink-0 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
              title="Edit recipe"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          )}
        </div>


        {/* Raw/Cooked Toggle */}
        {hasConversion && (
          <div className="mt-5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Weight Type
            </label>
            <div className="flex bg-secondary rounded-xl p-1 border border-border/30">
              <button
                onClick={() => setIsCooked(false)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  !isCooked
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Raw Weight
              </button>
              <button
                onClick={() => setIsCooked(true)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  isCooked
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Cooked Weight
              </button>
            </div>
          </div>
        )}

        {/* Weight Input */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
            Weight ({isCustomRecipe ? 'cooked meal' : (isCooked ? 'cooked' : 'raw')})
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              onKeyDown={(e) => ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault()}
              value={weight}
              onChange={(e) => {
                let val = e.target.value;
                if (val.length > 5) val = val.slice(0, 5);
                setWeight(val);
              }}
              className="w-full h-16 bg-card border border-border rounded-xl text-3xl font-bold text-center text-foreground outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground text-lg font-medium">
              g
            </span>
          </div>
        </div>

        {/* Daily Target Impact (NFS style bars) */}
        <FoodAnalysis
          food={food}
          weight={parseFloat(weight) || 0}
          isCooked={isCooked}
          hasConversion={hasConversion}
        />

      </div>
    </div>
  );
}
