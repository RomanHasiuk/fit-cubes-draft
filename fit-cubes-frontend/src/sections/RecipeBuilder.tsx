import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Scale,
  UtensilsCrossed,
  Save,
  Calculator,
  Search,
  FolderOpen,
  Check,
  Loader2,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { useModalOpen } from "@/hooks/useModalOpen";
import type { FoodItem } from "@/types";
import InfoTooltip from "@/components/InfoTooltip";
import FoodSearch from "./FoodSearch";
import FoodAnalysis from "@/components/FoodAnalysis";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { blockInvalidIntegerInput, sanitizePositiveInt, sanitizeNameInput } from "@/utils/inputHandlers";
import { generateSafeId } from "@/utils/calculations";
import { recipeService } from "@/services/recipeService";
import { authService } from "@/services/authService";
import { mapFoodItemToCreateRecipeDto, mapRecipeDtoToFoodItem } from "@/utils/apiMappers";

interface Ingredient {
  id: string;
  product: FoodItem;
  weight: number | "";
}

export default function RecipeBuilder() {
  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const editingRecipe = useStore((state) => state.editingRecipe);
  const setEditingRecipe = useStore((state) => state.setEditingRecipe);
  const setPendingFoodLog = useStore((state) => state.setPendingFoodLog);
  const location = useLocation();
  const navigate = useNavigate();
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [finalWeight, setFinalWeight] = useState<number | "">("");
  const [recipeName, setRecipeName] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoadRecipe, setShowLoadRecipe] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<Ingredient | null>(null);

  useModalOpen(showSearch);
  useModalOpen(showLoadRecipe);
  useModalOpen(showConfirm);
  useModalOpen(showDeleteConfirm);
  useModalOpen(!!ingredientToDelete);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadExistingRecipe = useCallback(
    async (recipeFood: FoodItem) => {
      let targetRecipe = recipeFood;

      // If backend recipe without detailed ingredients (from summary list), fetch complete details
      if (
        (!targetRecipe.ingredients || targetRecipe.ingredients.length === 0) &&
        targetRecipe.id.startsWith("recipe_")
      ) {
        setIsLoadingRecipe(true);
        const numericId = targetRecipe.id.replace("recipe_", "");
        try {
          const res = await recipeService.getRecipeById(numericId);
          if (res.ok && res.data) {
            targetRecipe = mapRecipeDtoToFoodItem(res.data);
            updateProduct(recipeFood.id, targetRecipe);
          } else {
            setError(res.error || "Failed to load recipe details from server.");
            setIsLoadingRecipe(false);
            return;
          }
        } catch (err) {
          console.error("Failed to load recipe from backend:", err);
          setError("Network error while loading recipe details.");
          setIsLoadingRecipe(false);
          return;
        } finally {
          setIsLoadingRecipe(false);
        }
      }

      if (!targetRecipe.ingredients || targetRecipe.ingredients.length === 0) {
        setError("This is not a custom recipe or it has no ingredients, it cannot be edited.");
        return;
      }

      const loadIngredients: Ingredient[] = targetRecipe.ingredients.map(
        (ing) => {
          const originalProduct = products.find((p) => p.id === ing.foodItemId);

          return {
            id: generateSafeId("ing"),
            product: originalProduct || {
              id: ing.foodItemId,
              name: ing.name,
              category: "My Recipes",
              caloriesPer100g: ing.calories,
              proteinPer100g: ing.protein,
              carbsPer100g: ing.carbs,
              fatsPer100g: ing.fats,
            },
            weight: ing.weight,
          };
        }
      );

      setIngredients(loadIngredients);
      setRecipeName(targetRecipe.name);
      setFinalWeight(targetRecipe.cookedWeight || "");
      setEditingRecipeId(targetRecipe.id);
      setShowLoadRecipe(false);

      setSuccess(`Recipe "${targetRecipe.name}" loaded for editing.`);
    },
    [products, updateProduct]
  );

  useEffect(() => {
    if (editingRecipe) {
      // Defer state updates to the next tick to avoid cascading renders warning
      const timer = setTimeout(() => {
        loadExistingRecipe(editingRecipe);
        setEditingRecipeId(editingRecipe.id);
        setEditingRecipe(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [editingRecipe, setEditingRecipe, loadExistingRecipe]);

  const handleClear = () => {
    setIngredients([]);
    setRecipeName("");
    setFinalWeight("");
    setEditingRecipeId(null);
    setError(null);
    setSuccess(null);

    if (location.state?.returnToDiary) {
      navigate("/diary");
    }
  };

  const addIngredient = (product: FoodItem) => {
    const newIngredient: Ingredient = {
      id: generateSafeId('ing'),
      product,
      weight: 100,
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    const ingredient = ingredients.find((i) => i.id === id);
    if (ingredient) {
      setIngredientToDelete(ingredient);
    }
  };

  const updateWeight = (id: string, value: string) => {
    const newWeight = sanitizePositiveInt(value);
    setIngredients((prev) =>
      prev.map((i) => (i.id === id ? { ...i, weight: newWeight } : i)),
    );
  };

  const handleCookedWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalWeight(sanitizePositiveInt(e.target.value));
  };

  const handleRecipeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeName(sanitizeNameInput(e.target.value));
  };

  const handleRecipeNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveClick(false);
    }
  };

  const handleIngredientBlur = (id: string) => {
    setIngredients((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const val = Number(i.weight);
          // If left empty or <= 0 on blur, auto-restore 100g default
          return { ...i, weight: !i.weight || val <= 0 ? 100 : val };
        }
        return i;
      }),
    );
  };

  const handleCookedWeightBlur = () => {
    if (finalWeight !== "" && Number(finalWeight) <= 0) {
      setFinalWeight("");
    }
  };

  const totals = useMemo(() => {
    return ingredients.reduce(
      (acc, curr) => {
        const w = Number(curr.weight) || 0;
        const factor = w / 100;
        return {
          calories: acc.calories + curr.product.caloriesPer100g * factor,
          protein: acc.protein + curr.product.proteinPer100g * factor,
          fats: acc.fats + curr.product.fatsPer100g * factor,
          carbs: acc.carbs + curr.product.carbsPer100g * factor,
          weight: acc.weight + w,
        };
      },
      { calories: 0, protein: 0, fats: 0, carbs: 0, weight: 0 },
    );
  }, [ingredients]);

  const rawWeight = totals.weight;

  // Per 100g of FINISHED product
  const resultMacros = useMemo(() => {
    const weightToUse =
      typeof finalWeight === "number" && finalWeight > 0
        ? finalWeight
        : rawWeight;
    if (weightToUse === 0)
      return { calories: 0, protein: 0, fats: 0, carbs: 0 };

    const factor = 100 / weightToUse;
    return {
      calories: Math.round(totals.calories * factor * 10) / 10,
      protein: Math.round(totals.protein * factor * 10) / 10,
      fats: Math.round(totals.fats * factor * 10) / 10,
      carbs: Math.round(totals.carbs * factor * 10) / 10,
    };
  }, [totals, finalWeight, rawWeight]);

  const handleSaveClick = (asNew: boolean = false) => {
    setError(null);
    setSuccess(null);

    // 1. Validation: Name
    if (!recipeName.trim() || !/[A-Za-zА-Яа-яЄєІіЇїҐґ]/.test(recipeName)) {
      setError("Please provide a valid recipe name (must contain letters)");
      return;
    }

    // 2. Validation: Ingredients presence
    if (ingredients.length === 0) {
      setError("Add at least one ingredient");
      return;
    }

    // 3. Validation: Ingredient weights (>0g)
    const invalidIngredient = ingredients.find(
      (ing) => ing.weight === "" || Number(ing.weight) <= 0
    );
    if (invalidIngredient) {
      setError(`Please enter a valid weight (>0g) for "${invalidIngredient.product.name}"`);
      return;
    }

    // 4. Validation: Cooked weight (must be >0g if provided)
    if (finalWeight !== "" && Number(finalWeight) <= 0) {
      setError("Cooked weight must be greater than 0g");
      return;
    }

    // 5. Validation: Duplicates
    const targetId = editingRecipeId ? editingRecipeId : null;

    const isDuplicate = products.some(
      (p) =>
        p.name.toLowerCase() === recipeName.toLowerCase().trim() &&
        p.id !== targetId,
    );
    if (isDuplicate && !asNew) {
      setError("A recipe with this name already exists");
      return;
    }

    setShowConfirm(true);
  };

  const confirmSaveRecipe = async (asNew: boolean = false) => {
    setShowConfirm(false);
    let finalName = recipeName.trim();
    if (asNew) {
      const isDuplicate = products.some(
        (p) => p.name.toLowerCase() === finalName.toLowerCase()
      );
      if (isDuplicate) {
        const escapeRegExp = (str: string) =>
          str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const escapedParent = escapeRegExp(finalName);
        const regex = new RegExp(`^${escapedParent}\\.(\\d+)$`, "i");

        let maxIndex = 0;
        products.forEach((p) => {
          const match = p.name.match(regex);
          if (match) {
            const index = parseInt(match[1], 10);
            if (index > maxIndex) {
              maxIndex = index;
            }
          }
        });

        finalName = `${finalName}.${maxIndex + 1}`;
      }
    }

    const targetId =
      editingRecipeId && !asNew ? editingRecipeId : `custom_${Date.now()}`;
    const newProduct: FoodItem = {
      id: targetId,
      name: finalName,
      category: "My Meals",
      caloriesPer100g: resultMacros.calories,
      proteinPer100g: resultMacros.protein,
      carbsPer100g: resultMacros.carbs,
      fatsPer100g: resultMacros.fats,
      rawWeight: rawWeight,
      cookedWeight:
        typeof finalWeight === "number" && finalWeight > 0
          ? finalWeight
          : rawWeight,
      ingredients: ingredients.map((ing) => ({
        foodItemId: ing.product.id,
        name: ing.product.name,
        weight: ing.weight as number,
        calories: ing.product.caloriesPer100g,
        protein: ing.product.proteinPer100g,
        carbs: ing.product.carbsPer100g,
        fats: ing.product.fatsPer100g,
      })),
    };

    setIsSaving(true);
    let savedItem = newProduct;

    try {
      if (authService.isAuthenticated()) {
        const payload = mapFoodItemToCreateRecipeDto(newProduct);
        if (editingRecipeId && !asNew && editingRecipeId.startsWith("recipe_")) {
          const numericId = editingRecipeId.replace("recipe_", "");
          const res = await recipeService.updateRecipe(numericId, payload);
          if (res.ok && res.data) {
            savedItem = mapRecipeDtoToFoodItem(res.data);
            updateProduct(editingRecipeId, savedItem);
            setSuccess(`Recipe "${finalName}" updated in cloud!`);
          } else {
            updateProduct(editingRecipeId, newProduct);
            setError(res.error || "Updated locally, but failed to sync with cloud.");
          }
        } else {
          const res = await recipeService.createRecipe(payload);
          if (res.ok && res.data) {
            savedItem = mapRecipeDtoToFoodItem(res.data);
            addProduct(savedItem);
            setSuccess(`Recipe "${finalName}" saved to cloud!`);
          } else {
            addProduct(newProduct);
            setError(res.error || "Saved locally, but failed to sync with cloud.");
          }
        }
      } else {
        if (editingRecipeId && !asNew) {
          updateProduct(editingRecipeId, newProduct);
          setSuccess(`Recipe "${finalName}" updated locally.`);
        } else {
          addProduct(newProduct);
          setSuccess(`Recipe "${finalName}" saved locally.`);
        }
      }

      if (location.state?.returnToDiary) {
        setPendingFoodLog({
          food: savedItem,
          mealType: location.state.mealType,
        });
        navigate("/diary");
        return;
      }

      setIngredients([]);
      setRecipeName("");
      setFinalWeight("");
      setEditingRecipeId(null);
    } catch (err) {
      console.error("Failed to save recipe:", err);
      if (editingRecipeId && !asNew) {
        updateProduct(editingRecipeId, newProduct);
      } else {
        addProduct(newProduct);
      }
      setError("Saved locally, network error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (!editingRecipeId) return;
    setShowDeleteConfirm(false);
    setIsSaving(true);

    const targetId = editingRecipeId;
    try {
      if (authService.isAuthenticated() && targetId.startsWith("recipe_")) {
        const numericId = targetId.replace("recipe_", "");
        const res = await recipeService.deleteRecipe(numericId);
        if (!res.ok) {
          console.warn("Backend recipe deletion error:", res.error);
        }
      }
      deleteProduct(targetId);
      setSuccess("Recipe deleted successfully.");
      handleClear();
    } catch (err) {
      console.error("Failed to delete recipe:", err);
      deleteProduct(targetId);
      setSuccess("Recipe deleted locally.");
      handleClear();
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteIngredient = () => {
    if (!ingredientToDelete) return;
    setIngredients((prev) => prev.filter((i) => i.id !== ingredientToDelete.id));
    setIngredientToDelete(null);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-[1016px] flex-col bg-transparent pb-12">
      {/* Header */}
      <div className="shrink-0 px-5 pt-[102px] md:pt-[126px] pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Recipe Builder</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-tight font-medium">
              Create custom recipe
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {editingRecipeId && (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving || isLoadingRecipe}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-destructive/10 text-destructive rounded-xl text-[10px] font-bold uppercase hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
              title="Delete this recipe"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
          {ingredients.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isSaving || isLoadingRecipe}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground rounded-xl text-[10px] font-bold uppercase hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLoadRecipe(true)}
            disabled={isSaving || isLoadingRecipe}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isLoadingRecipe ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FolderOpen className="w-4 h-4" />
            )}
            Open
          </button>
        </div>
      </div>

      <div className="flex-1 px-5 pb-8 overflow-y-auto no-scrollbar">
        {/* Name Input */}
        <div className="glass-card rounded-2xl p-4 mb-6">
          <label className="text-[10px] font-bold uppercase text-muted-foreground mb-2 block px-1 tracking-widest">
            Recipe Name
          </label>
          <input
            type="text"
            maxLength={60}
            placeholder="e.g. Baked chicken with vegetables..."
            value={recipeName}
            onKeyDown={handleRecipeNameKeyDown}
            onChange={handleRecipeNameChange}
            className="w-full bg-secondary/30 border border-white/5 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
          />
        </div>

        {/* Ingredients Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
              Ingredients (raw)
            </h3>
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-[10px] font-bold hover:scale-105 active:scale-95 transition-all"
            >
              <Plus className="w-3 h-3" />
              ADD
            </button>
          </div>

          {ingredients.length === 0 ? (
            <div 
              onClick={() => setShowSearch(true)}
              className="p-10 text-center glass-card rounded-2xl border-dashed border-white/10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/5 active:scale-[0.98] transition-all"
            >
              <Search className="w-8 h-8 text-muted-foreground/30" />
              <p className="text-xs text-muted-foreground">
                Tap here or use the "ADD" button to find ingredients
              </p>
            </div>
          ) : (
            ingredients.map((ing) => (
              <motion.div
                key={ing.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium truncate">
                    {ing.product.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase">
                    {ing.product.caloriesPer100g} kcal / 100g
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative w-20">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      placeholder="100"
                      onKeyDown={blockInvalidIntegerInput}
                      value={ing.weight === 0 ? "" : ing.weight}
                      onChange={(e) => updateWeight(ing.id, e.target.value)}
                      onBlur={() => handleIngredientBlur(ing.id)}
                      className="w-full bg-secondary/50 border border-white/5 rounded-lg px-2 py-1 text-right text-sm font-bold pr-6 outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                      g
                    </span>
                  </div>
                  <button
                    onClick={() => removeIngredient(ing.id)}
                    className="p-2 text-destructive/60 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Weights Section */}
        {ingredients.length > 0 && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card rounded-2xl p-4 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Raw weight
                </span>
                <Scale className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-xl font-bold">
                {Math.round(rawWeight)}{" "}
                <span className="text-xs font-medium text-muted-foreground">
                  g
                </span>
              </p>
            </div>
            <div className="glass-card rounded-2xl p-4 border-primary/20 bg-primary/5 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                  Cooked weight
                </span>
                <UtensilsCrossed className="w-3 h-3 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="10000"
                  onKeyDown={blockInvalidIntegerInput}
                  value={finalWeight === 0 ? "" : finalWeight}
                  placeholder={Math.round(rawWeight).toString()}
                  onChange={handleCookedWeightChange}
                  onBlur={handleCookedWeightBlur}
                  className="w-full bg-transparent text-xl font-bold text-primary outline-none placeholder:text-primary/40"
                />
                <span className="text-xs font-medium text-primary/60">g</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-[10px] font-bold text-destructive uppercase tracking-tight text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-[10px] font-bold text-emerald-500 uppercase tracking-tight text-center"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary Result */}
        <AnimatePresence>
          {ingredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-3xl p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 relative"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-16 h-16" />
              </div>

              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 uppercase tracking-tight">
                Result per 100g
                <InfoTooltip
                  title="How is it calculated?"
                  content="We take the sum of all nutrients and divide it by the final weight of the cooked meal."
                />{" "}
              </h3>

              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <p className="text-2xl font-black text-primary">
                    {Math.round(resultMacros.calories)}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">
                    kcal
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-emerald-400">
                    {resultMacros.protein}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">
                    Protein
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-400">
                    {resultMacros.fats}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">
                    Fats
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-400">
                    {resultMacros.carbs}
                  </p>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">
                    Carbs
                  </p>
                </div>
              </div>

              <div className="mt-6">
                {editingRecipeId ? (
                  <div className="flex gap-2">
                    <button
                      disabled={isSaving || isLoadingRecipe}
                      className="flex-1 bg-secondary text-foreground h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
                      onClick={() => handleSaveClick(true)}
                    >
                      <Save className="w-4 h-4" />
                      AS NEW
                    </button>
                    <button
                      disabled={isSaving || isLoadingRecipe}
                      className="flex-1 bg-primary text-primary-foreground h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all"
                      onClick={() => handleSaveClick(false)}
                    >
                      <Check className="w-4 h-4" />
                      UPDATE
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isSaving || isLoadingRecipe}
                    className="w-full bg-primary text-primary-foreground h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all"
                    onClick={() => handleSaveClick(false)}
                  >
                    <Save className="w-4 h-4" />
                    SAVE RECIPE
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {ingredients.length > 0 && (
          <div className="mt-6">
            <FoodAnalysis
              food={{
                id: "recipe",
                name: recipeName,
                category: "My Meals",
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
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
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
                <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Is this correct?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Are you sure you provided the correct cooked weight (
                  <strong>{finalWeight || Math.round(rawWeight)}g</strong>)?
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={isSaving}
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm bg-secondary text-foreground hover:bg-secondary/80 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {editingRecipeId ? (
                    <>
                      <button
                        disabled={isSaving}
                        onClick={() => confirmSaveRecipe(true)}
                        className="flex-1 py-3 rounded-xl font-bold text-xs bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        As new
                      </button>
                      <button
                        disabled={isSaving}
                        onClick={() => confirmSaveRecipe(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Update
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={isSaving}
                      onClick={() => confirmSaveRecipe(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Food Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            className="fixed inset-0 z-[100] bg-background/40 backdrop-blur-3xl flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full h-[90dvh] max-h-[90dvh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden mx-12"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <FoodSearch
                onClose={() => setShowSearch(false)}
                onSelect={(product) => addIngredient(product)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Load Recipe Modal */}
      <AnimatePresence>
        {showLoadRecipe && (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center p-0 md:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-[500px] h-[90dvh] max-h-[90dvh] md:h-[800px] glass rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <FoodSearch
                recipesOnly={true}
                onClose={() => setShowLoadRecipe(false)}
                onSelect={(product) => loadExistingRecipe(product)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recipe Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete recipe?"
        description={
          <>
            Are you sure you want to permanently delete{" "}
            <strong>"{recipeName || "this recipe"}"</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteRecipe}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Ingredient Deletion Confirmation Modal */}
      <ConfirmModal
        isOpen={!!ingredientToDelete}
        title="Remove ingredient?"
        description={
          ingredientToDelete && (
            <>
              Are you sure you want to remove the ingredient{" "}
              <strong>"{ingredientToDelete.product.name}"</strong> from the recipe?
            </>
          )
        }
        confirmText="Remove"
        variant="destructive"
        onConfirm={handleConfirmDeleteIngredient}
        onCancel={() => setIngredientToDelete(null)}
      />
    </div>
  );
}
