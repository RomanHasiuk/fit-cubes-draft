import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { ChevronLeft, Plus, X, Check } from "lucide-react";
import type { FoodItem } from "@/types";

interface FoodCreatorProps {
  onClose: () => void;
  editingFood?: FoodItem;
}

export default function FoodCreator({ onClose, editingFood }: FoodCreatorProps) {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const customCategories = useStore((state) => state.customCategories);
  const addCustomCategory = useStore((state) => state.addCustomCategory);
  
  const [name, setName] = useState(editingFood?.name || "");
  const [calories, setCalories] = useState<number | "">(editingFood?.caloriesPer100g ?? "");
  const [protein, setProtein] = useState<number | "">(editingFood?.proteinPer100g ?? "");
  const [fats, setFats] = useState<number | "">(editingFood?.fatsPer100g ?? "");
  const [carbs, setCarbs] = useState<number | "">(editingFood?.carbsPer100g ?? "");
  
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  useEffect(() => {
    const p = Number(protein) || 0;
    const c = Number(carbs) || 0;
    const f = Number(fats) || 0;
    if (p > 0 || c > 0 || f > 0) {
      setCalories(Math.round(p * 4 + c * 4 + f * 9));
    } else if (p === 0 && c === 0 && f === 0 && calories !== "") {
      setCalories("");
    }
  }, [protein, carbs, fats, calories]);
  
  const defaultCategories = ["My Meals"];
  const allCategories = [...defaultCategories, ...customCategories];
  
  const [selectedCategory, setSelectedCategory] = useState(editingFood?.category || defaultCategories[0]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Dynamically include the selected category in the list even if it's not saved to the global store yet
  const displayedCategories = allCategories.includes(selectedCategory)
    ? allCategories
    : [selectedCategory, ...allCategories];

  const allExistingCategories = Array.from(new Set(products.map(p => p.category)));

  const handleSaveClick = () => {
    if (!name.trim()) return;
    const isDuplicate = products.some(
      p => p.name.toLowerCase() === name.trim().toLowerCase() && p.id !== editingFood?.id
    );
    if (isDuplicate) {
      setShowDuplicateWarning(true);
    } else {
      executeSave();
    }
  };

  const executeSave = () => {
    if (!name.trim()) return;
    
    let finalCategory = selectedCategory;
    if (isCreatingCategory && newCategoryName.trim()) {
      finalCategory = newCategoryName.trim();
      addCustomCategory(finalCategory);
    }

    const newFood: FoodItem = {
      id: editingFood ? editingFood.id : "custom_" + Date.now().toString(),
      name: name.trim(),
      caloriesPer100g: Number(calories) || 0,
      proteinPer100g: Number(protein) || 0,
      fatsPer100g: Number(fats) || 0,
      carbsPer100g: Number(carbs) || 0,
      category: finalCategory,
      isFavorite: editingFood?.isFavorite,
    };

    if (editingFood) {
      updateProduct(editingFood.id, newFood);
    } else {
      addProduct(newFood);
    }
    onClose();
  };

  const totalMacros = (Number(protein) || 0) + (Number(carbs) || 0) + (Number(fats) || 0);
  const isMacrosValid = totalMacros <= 100;
  const isValid = name.trim().length > 0 && calories !== "" && isMacrosValid;

  return (
    <div className="flex flex-col h-full bg-background relative z-50">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-lg active:bg-secondary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {editingFood ? "Edit product" : "Create product"}
          </h2>
        </div>
        <button
          onClick={handleSaveClick}
          disabled={!isValid}
          className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 transition-opacity"
        >
          {editingFood ? "Update" : "Save"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              // \p{L} allows letters from ANY language (Polish, Chinese, Arabic, etc.)
              const val = e.target.value.replace(/[^0-9\p{L}\s.,'%-]/gu, '');
              setName(val);
            }}
            className="w-full bg-secondary/50 border border-white/5 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            placeholder="e.g. Chicken Soup"
            maxLength={60}
          />
        </div>

        {/* Macros */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-orange-500">Kcal per 100g</label>
            <input
              type="number"
              value={calories}
              readOnly
              className="w-full bg-secondary/20 border border-white/5 rounded-xl px-4 py-3 text-muted-foreground outline-none cursor-not-allowed"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-500">Protein per 100g</label>
            <input
              type="number"
              min="0"
              onKeyDown={(e) => ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault()}
              value={protein}
              onChange={(e) => setProtein(e.target.value === "" ? "" : Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-yellow-500">Fats per 100g</label>
            <input
              type="number"
              min="0"
              onKeyDown={(e) => ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault()}
              value={fats}
              onChange={(e) => setFats(e.target.value === "" ? "" : Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500/50"
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-green-500">Carbs per 100g</label>
            <input
              type="number"
              min="0"
              onKeyDown={(e) => ['-', 'e', 'E', '+'].includes(e.key) && e.preventDefault()}
              value={carbs}
              onChange={(e) => setCarbs(e.target.value === "" ? "" : Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/50"
              placeholder="0"
            />
          </div>
        </div>
        {!isMacrosValid && (
          <p className="text-xs text-destructive mt-1 font-medium bg-destructive/10 p-2 rounded-lg border border-destructive/20">
            The sum of protein, fats, and carbs cannot exceed 100g (currently {Math.round(totalMacros * 10) / 10}g).
          </p>
        )}

        {/* Category */}
        <div className="space-y-3 pt-2 border-t border-border/50">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          
          {!isCreatingCategory ? (
            <div className="flex flex-wrap gap-2">
              {displayedCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={() => setIsCreatingCategory(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-dashed border-primary/50 text-primary hover:bg-primary/10 transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                New category
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                list="category-suggestions"
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newCategoryName.trim()) {
                    e.preventDefault();
                    setSelectedCategory(newCategoryName.trim());
                    setIsCreatingCategory(false);
                    setNewCategoryName("");
                  }
                }}
                autoFocus
                className="flex-1 bg-secondary/50 border border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                placeholder="Start typing name..."
              />
              <datalist id="category-suggestions">
                {allExistingCategories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              <button
                onClick={() => {
                  if (newCategoryName.trim()) {
                    setSelectedCategory(newCategoryName.trim());
                  }
                  setIsCreatingCategory(false);
                  setNewCategoryName("");
                }}
                className="p-3 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setIsCreatingCategory(false);
                  setNewCategoryName("");
                }}
                className="p-3 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Duplicate Warning Modal */}
      <AnimatePresence>
        {showDuplicateWarning && (
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
              <h3 className="text-xl font-bold mb-2">This product already exists</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Product named <strong>"{name.trim()}"</strong> already exists in your database. Are you sure you want to save with the same name?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDuplicateWarning(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDuplicateWarning(false);
                    executeSave();
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  {editingFood ? "Update" : "Create"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
