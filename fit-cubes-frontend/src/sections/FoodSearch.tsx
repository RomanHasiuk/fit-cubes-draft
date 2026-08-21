import { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Search } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useFoodFilter } from '@/hooks/useFoodFilter';
import { FoodFilterBar } from '@/components/food/FoodFilterBar';
import { FoodItemCard } from '@/components/food/FoodItemCard';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import FoodAdd from './FoodAdd';
import FoodCreator from './FoodCreator';
import { FoodItemCardSkeleton } from '@/components/food/FoodItemCardSkeleton';
import type { FoodItem } from '@/types';

interface FoodSearchProps {
  mealType?: string;
  onClose: () => void;
  onSelect?: (food: FoodItem) => void;
}

export default function FoodSearch({
  mealType,
  onClose,
  onSelect,
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
  const [isLoading, setIsLoading] = useState(true);

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
    products,
    dailyLogs,
    customCategories,
    favoriteProductIds,
  });

  // Simulated Database API Fetch delay (1500ms)
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

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
        mealType={mealType || 'breakfast'}
        onClose={() => setSelectedFood(null)}
        onDone={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="shrink-0 px-4 pt-safe pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl active:bg-secondary transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Search foods</h2>
        </div>
        <button
          type="button"
          onClick={() => setIsCreatingFood(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-[10px] font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          ADD
        </button>
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

      {/* Food List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2">
        <div className="pb-6">
          {isLoading ? (
            <FoodItemCardSkeleton count={5} />
          ) : filteredFoods.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No foods found</p>
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
            deleteProduct(foodToDelete.id);
            setFoodToDelete(null);
          }
        }}
        onCancel={() => setFoodToDelete(null)}
      />
    </div>
  );
}
