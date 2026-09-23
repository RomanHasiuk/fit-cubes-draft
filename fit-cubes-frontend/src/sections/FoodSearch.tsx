import { useState, useMemo } from 'react';
import { ChevronLeft, Plus, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useFoodFilter } from '@/hooks/useFoodFilter';
import { FoodFilterBar } from '@/components/food/FoodFilterBar';
import { FoodItemCard } from '@/components/food/FoodItemCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import FoodAdd from './FoodAdd';
import FoodCreator from './FoodCreator';
import { FoodItemCardSkeleton } from '@/components/food/FoodItemCardSkeleton';
import { authService, recipeService, productService } from '@/services';
import type { FoodItem, MealType } from '@/types';
import { MEAL_TYPE } from '@/constants';

interface FoodSearchProps {
  mealType?: MealType;
  onClose: () => void;
  onSelect?: (food: FoodItem) => void;
  recipesOnly?: boolean;
}

export default function FoodSearch({
  mealType,
  onClose,
  onSelect,
  recipesOnly = false,
}: FoodSearchProps) {
  const products = useStore((state) => state.products);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const customCategories = useStore((state) => state.customCategories);
  const favoriteProductIds = useStore((state) => state.favoriteProductIds);
  const toggleFavorite = useStore((state) => state.toggleFavorite);
  const dailyLogs = useStore((state) => state.dailyLogs);

  const [foodToDelete, setFoodToDelete] = useState<FoodItem | null>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isCreatingFood, setIsCreatingFood] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const isLoadingData = useStore((state) => state.isLoadingData);

  const availableProducts = useMemo(() => {
    if (!recipesOnly) return products;
    return products.filter(
      (p) =>
        p.id.startsWith('recipe_') ||
        p.category === 'My Meals' ||
        p.category === 'My Recipes' ||
        Boolean(p.ingredients && p.ingredients.length > 0) ||
        p.cookedWeight !== undefined
    );
  }, [products, recipesOnly]);

  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    usageCounts,
    uniqueCategories,
    filteredFoods,
  } = useFoodFilter({
    products: availableProducts,
    dailyLogs,
    customCategories,
    favoriteProductIds,
  });

  const handleSelect = (food: FoodItem) => {
    if (onSelect) {
      onSelect(food);
      onClose();
    } else {
      setSelectedFood(food);
    }
  };

  if (isCreatingFood || editingFood) {
    return (
      <FoodCreator
        onClose={() => {
          setIsCreatingFood(false);
          setEditingFood(null);
        }}
        editingFood={editingFood || undefined}
      />
    );
  }

  if (selectedFood && !onSelect) {
    return (
      <FoodAdd
        food={selectedFood}
        mealType={mealType || MEAL_TYPE.BREAKFAST}
        onClose={() => setSelectedFood(null)}
        onDone={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Header */}
      <div className="shrink-0 px-2.5 pt-safe pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2]" />
          </button>
          <h2 className="heading-h2 font-serif text-[22px] md:text-[26px] font-semibold text-[#F5F6FA] leading-tight">
            {recipesOnly ? 'Select Recipe' : 'Search food'}
          </h2>
        </div>
        {!recipesOnly && (
          <button
            type="button"
            onClick={() => setIsCreatingFood(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F59F0A] text-black font-semibold rounded-[5px] text-xs md:text-sm hover:bg-[#F59F0A]/90 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <FoodFilterBar
        query={query}
        onQueryChange={setQuery}
        onClearQuery={() => setQuery('')}
        selectedCategory={selectedCategory}
        uniqueCategories={uniqueCategories}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSelectSort={setSortBy}
        onToggleSortDirection={() =>
          setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
        }
      />

      {/* Food List with Custom Blue Scrollbar and 10px insets */}
      <div className="flex-1 overflow-hidden px-2.5 pt-2">
        <div className="h-full overflow-y-auto custom-scrollbar pr-2.5" data-scrolling="true">
          <div className="pb-6">
            {isLoadingData && products.length === 0 ? (
              <FoodItemCardSkeleton count={5} />
            ) : filteredFoods.length === 0 ? (
              <div className="text-center py-12">
                <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {recipesOnly
                    ? 'No saved recipes found. Build a recipe and save it first!'
                    : 'No foods found'}
                </p>
              </div>
            ) : (
              filteredFoods.map((food) => {
                const isCustom =
                  food.category === 'My Meals' ||
                  food.category === 'My Recipes' ||
                  customCategories.includes(food.category);

                return (
                  <FoodItemCard
                    key={food.id}
                    food={food}
                    usageCount={usageCounts[food.id] || 0}
                    isFavorite={favoriteProductIds.includes(food.id)}
                    isCustom={isCustom}
                    onSelect={handleSelect}
                    onToggleFavorite={toggleFavorite}
                    onEdit={setEditingFood}
                    onDelete={setFoodToDelete}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Universal Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!foodToDelete}
        title="Delete food?"
        description={
          foodToDelete && (
            <>
              Are you sure you want to permanently delete{' '}
              <strong>"{foodToDelete.name}"</strong>? It will also be removed from
              all diary entries. This action cannot be undone.
            </>
          )
        }
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          if (foodToDelete) {
            const targetId = foodToDelete.id;
            deleteProduct(targetId);
            setFoodToDelete(null);

            if (authService.isAuthenticated()) {
              if (targetId.startsWith('recipe_')) {
                const numericId = targetId.replace('recipe_', '');
                recipeService.deleteRecipe(numericId).catch((err) => {
                  console.error('Failed to sync recipe deletion with backend:', err);
                });
              } else if (targetId.startsWith('custom_')) {
                const numericId = targetId.replace('custom_', '');
                productService.deleteProduct(numericId).catch((err) => {
                  console.error('Failed to sync product deletion with backend:', err);
                });
              }
            }
          }
        }}
        onCancel={() => setFoodToDelete(null)}
      />
    </div>
  );
}
