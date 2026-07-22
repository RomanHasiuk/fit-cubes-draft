import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore.ts";
import FoodAdd from "./FoodAdd.tsx";
import FoodCreator from "./FoodCreator.tsx";
import type { FoodItem } from "@/types";
import {
  Search,
  X,
  ChevronLeft,
  ChevronDown,
  Check,
  Trash2,
  Heart,
  ArrowDown,
  Plus,
  Edit2,
} from "lucide-react";

interface FoodSearchProps {
  mealType?: string;
  onClose: () => void;
  onSelect?: (food: FoodItem) => void;
}

const SORT_OPTIONS = [
  { key: "usage", label: "Most Used" },
  { key: "name", label: "By name" },
  { key: "calories", label: "Calories" },
  { key: "proteinRatio", label: "Protein density (P/kcal)" },
  { key: "protein", label: "Protein" },
  { key: "fats", label: "Fats" },
  { key: "carbs", label: "Carbs" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];
type SortDirection = "asc" | "desc";

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
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SortKey>("usage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const usageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    dailyLogs.forEach((log) => {
      log.foodEntries.forEach((entry) => {
        counts[entry.foodItemId] = (counts[entry.foodItemId] || 0) + 1;
      });
    });
    return counts;
  }, [dailyLogs]);

  // States for dropdown menus
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isCreatingFood, setIsCreatingFood] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    customCategories.forEach((cat) => cats.add(cat));
    return ["All", "Favorites", ...Array.from(cats)];
  }, [products, customCategories]);

  const filteredFoods = useMemo(() => {
    let foods = [...products];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      foods = foods.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      );
    }

    if (selectedCategory === "Favorites") {
      foods = foods.filter((f) => favoriteProductIds.includes(f.id));
    } else if (selectedCategory !== "All") {
      foods = foods.filter((f) => f.category === selectedCategory);
    }

    foods.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      switch (sortBy) {
        case "calories":
          valA = a.caloriesPer100g;
          valB = b.caloriesPer100g;
          break;
        case "protein":
          valA = a.proteinPer100g;
          valB = b.proteinPer100g;
          break;
        case "proteinRatio":
          valA =
            a.caloriesPer100g > 0 ? a.proteinPer100g / a.caloriesPer100g : 0;
          valB =
            b.caloriesPer100g > 0 ? b.proteinPer100g / b.caloriesPer100g : 0;
          break;
        case "fats":
          valA = a.fatsPer100g;
          valB = b.fatsPer100g;
          break;
        case "carbs":
          valA = a.carbsPer100g;
          valB = b.carbsPer100g;
          break;
        case "usage": {
          const countA = usageCounts[a.id] || 0;
          const countB = usageCounts[b.id] || 0;
          if (countA !== countB) {
            return countB - countA;
          }
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
        }
        case "name":
        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
          break;
      }

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return foods;
  }, [products, query, selectedCategory, sortBy, sortDirection, favoriteProductIds, usageCounts]);

  const handleSelect = (food: FoodItem) => {
    if (onSelect) {
      onSelect(food);
      onClose();
    } else {
      setSelectedFood(food);
    }
  };

  if (isCreatingFood || editingFood) {
    return <FoodCreator 
      onClose={() => {
        setIsCreatingFood(false);
        setEditingFood(null);
      }} 
      editingFood={editingFood || undefined} 
    />;
  }

  if (selectedFood && !onSelect) {
    return (
      <FoodAdd
        food={selectedFood}
        mealType={mealType || "breakfast"}
        onClose={() => setSelectedFood(null)}
        onDone={onClose}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg active:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Search foods</h2>
        </div>
        <button
          onClick={() => setIsCreatingFood(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-[10px] font-bold hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-3 h-3" />
          ADD
        </button>
      </div>

      {/* Search Input */}
      <div className="shrink-0 px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter food name..."
            className="w-full h-11 pl-10 pr-10 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filters & Sorting Control Panel */}
      <div className="shrink-0 px-4 pb-4 flex items-center justify-between gap-2 border-b border-white/5 relative z-20">
        {/* Category Dropdown Toggle */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowSortMenu(false);
            }}
            className="w-full flex items-center justify-between bg-secondary/50 border border-white/5 px-3 py-2 rounded-xl text-xs font-medium"
          >
            <span className="truncate mr-2">{selectedCategory}</span>
            <ChevronDown
              className={`w-3 h-3 shrink-0 transition-transform ${showCategoryMenu ? "rotate-180" : ""}`}
            />
          </button>

          {/* Category Dropdown List */}
          <AnimatePresence>
            {showCategoryMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto custom-scrollbar glass-card rounded-2xl border border-white/10 shadow-2xl py-2"
              >
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-white/5 transition-colors ${selectedCategory === cat ? "text-primary font-bold" : "text-muted-foreground"}`}
                  >
                    {cat}
                    {selectedCategory === cat && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown Toggle */}
        <div className="relative flex-1">
          <button
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowCategoryMenu(false);
            }}
            className="w-full flex items-center justify-between bg-secondary/50 border border-white/5 px-3 py-2 rounded-xl text-xs font-medium"
          >
            <span className="truncate mr-2">
              {SORT_OPTIONS.find((o) => o.key === sortBy)?.label}
            </span>
            <ChevronDown
              className={`w-3 h-3 shrink-0 transition-transform ${showSortMenu ? "rotate-180" : ""}`}
            />
          </button>

          {/* Sort Dropdown List */}
          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 glass-card rounded-2xl border border-white/10 shadow-2xl py-2"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSortBy(opt.key);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-white/5 transition-colors ${sortBy === opt.key ? "text-primary font-bold" : "text-muted-foreground"}`}
                  >
                    {opt.label}
                    {sortBy === opt.key && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Direction Toggle */}
        {sortBy !== "usage" && (
          <button
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
          >
            <ArrowDown
              className={`w-4 h-4 transition-transform duration-300 ${sortDirection === "desc" ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Dropdown Overlay (to close menus when clicking outside) */}
      {(showCategoryMenu || showSortMenu) && (
        <div
          className="absolute inset-0 z-10"
          onClick={() => {
            setShowCategoryMenu(false);
            setShowSortMenu(false);
          }}
        />
      )}

      {/* Food List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2">
        <div className="pb-6">
          {filteredFoods.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No foods found</p>
            </div>
          ) : (
            filteredFoods.map((food, idx) => {
              const isCustom =
                food.category === "My Meals" ||
                food.category === "My Recipes" ||
                customCategories.includes(food.category);
              return (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="w-full flex items-center justify-between py-3 border-b border-border last:border-0 hover:bg-secondary/20 rounded-xl px-2 transition-colors"
                >
                  <button
                    onClick={() => handleSelect(food)}
                    className="flex-1 text-left min-w-0 py-1"
                  >
                    <p className="text-sm font-medium flex items-center gap-2">
                      {food.name}
                      {(usageCounts[food.id] || 0) > 0 && !favoriteProductIds.includes(food.id) && (
                        <span className="text-[10px] bg-secondary/50 px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                          {usageCounts[food.id]} times
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      P:{food.proteinPer100g}g C:{food.carbsPer100g}g F:
                      {food.fatsPer100g}g
                      {food.rawWeight && food.cookedWeight
                        ? ` · raw→cooked ratio ${(food.rawWeight / food.cookedWeight).toFixed(1)}x`
                        : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {food.category}
                    </p>
                  </button>

                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-sm text-muted-foreground mr-1">
                      {food.caloriesPer100g} kcal/100g
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(food.id);
                      }}
                      className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                      title="Add to favorites"
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={favoriteProductIds.includes(food.id) ? "currentColor" : "none"}
                      />
                    </button>
                    {isCustom && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingFood(food);
                          }}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                          title="Edit food"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setFoodToDelete(food);
                          }}
                          className="p-2 text-destructive/60 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                          title="Delete food"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      <AnimatePresence>
        {foodToDelete && (
          <motion.div
            className="fixed inset-0 z-[110] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass border border-white/10 rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-bold mb-2">Delete food?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Are you sure you want to permanently delete{" "}
                <strong>"{foodToDelete.name}"</strong>? It will also be removed from all diary entries. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFoodToDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteProduct(foodToDelete.id);
                    setFoodToDelete(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
