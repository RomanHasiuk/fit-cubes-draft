import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { useModalOpen } from '@/hooks/useModalOpen';
import type { FoodItem } from '@/types';
import FoodSearch from './FoodSearch';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ModalDrawer } from '@/components/ui/ModalDrawer';
import { Input } from '@/components/ui/input';
import { sanitizePositiveInt, sanitizeNameInput } from '@/utils/inputHandlers';
import { generateSafeId } from '@/utils/calculations';
import { recipeService } from '@/services/recipeService';
import { authService } from '@/services/authService';
import { mapFoodItemToCreateRecipeDto, mapRecipeDtoToFoodItem } from '@/utils/apiMappers';
import { RecipeHeader } from '@/components/recipe/RecipeHeader';
import {
  RecipeIngredientsList,
  type RecipeIngredient,
} from '@/components/recipe/RecipeIngredientsList';
import { RecipeWeightSection } from '@/components/recipe/RecipeWeightSection';
import { RecipeNutritionSummary } from '@/components/recipe/RecipeNutritionSummary';

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
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [finalWeight, setFinalWeight] = useState<number | ''>('');
  const [recipeName, setRecipeName] = useState('');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoadRecipe, setShowLoadRecipe] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] = useState<RecipeIngredient | null>(null);

  const saveAsNewRef = useRef<boolean>(false);

  useModalOpen(showSearch);
  useModalOpen(showLoadRecipe);
  useModalOpen(showConfirm);
  useModalOpen(showDeleteConfirm);
  useModalOpen(!!ingredientToDelete);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadExistingRecipe = useCallback(
    async (recipeFood: FoodItem) => {
      let targetRecipe = recipeFood;

      if (
        (!targetRecipe.ingredients || targetRecipe.ingredients.length === 0) &&
        targetRecipe.id.startsWith('recipe_')
      ) {
        setIsLoadingRecipe(true);
        const numericId = targetRecipe.id.replace('recipe_', '');
        try {
          const res = await recipeService.getRecipeById(numericId);
          if (res.ok && res.data) {
            targetRecipe = mapRecipeDtoToFoodItem(res.data);
            updateProduct(recipeFood.id, targetRecipe);
          } else {
            setError(res.error || 'Failed to load recipe details from cloud.');
            setIsLoadingRecipe(false);
            return;
          }
        } catch (err) {
          console.error('Failed to load recipe from backend:', err);
          setError('Network error while loading recipe details.');
          setIsLoadingRecipe(false);
          return;
        } finally {
          setIsLoadingRecipe(false);
        }
      }

      if (!targetRecipe.ingredients || targetRecipe.ingredients.length === 0) {
        setError('This recipe has no ingredients and cannot be edited.');
        return;
      }

      const loadIngredients: RecipeIngredient[] = targetRecipe.ingredients.map((ing) => {
        const originalProduct = products.find((p) => p.id === ing.foodItemId);

        return {
          id: generateSafeId('ing'),
          product: originalProduct || {
            id: ing.foodItemId,
            name: ing.name,
            category: 'My Recipes',
            caloriesPer100g: ing.calories,
            proteinPer100g: ing.protein,
            carbsPer100g: ing.carbs,
            fatsPer100g: ing.fats,
          },
          weight: ing.weight,
        };
      });

      setIngredients(loadIngredients);
      setRecipeName(targetRecipe.name);
      setFinalWeight(targetRecipe.cookedWeight || '');
      setEditingRecipeId(targetRecipe.id);
      setShowLoadRecipe(false);
      setSuccess(`Recipe "${targetRecipe.name}" loaded for editing.`);
    },
    [products, updateProduct]
  );

  useEffect(() => {
    if (editingRecipe) {
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
    setRecipeName('');
    setFinalWeight('');
    setEditingRecipeId(null);
    setError(null);
    setSuccess(null);

    if (location.state?.returnToDiary) {
      navigate('/diary');
    }
  };

  const addIngredient = (product: FoodItem) => {
    const newIngredient: RecipeIngredient = {
      id: generateSafeId('ing'),
      product,
      weight: 100,
    };
    setIngredients((prev) => [...prev, newIngredient]);
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
      prev.map((i) => (i.id === id ? { ...i, weight: newWeight } : i))
    );
  };

  const handleCookedWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFinalWeight(sanitizePositiveInt(e.target.value));
  };

  const handleRecipeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipeName(sanitizeNameInput(e.target.value));
  };

  const handleIngredientBlur = (id: string) => {
    setIngredients((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const val = Number(i.weight);
          return { ...i, weight: !i.weight || val <= 0 ? 100 : val };
        }
        return i;
      })
    );
  };

  const handleCookedWeightBlur = () => {
    if (finalWeight !== '' && Number(finalWeight) <= 0) {
      setFinalWeight('');
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
      { calories: 0, protein: 0, fats: 0, carbs: 0, weight: 0 }
    );
  }, [ingredients]);

  const rawWeight = totals.weight;

  const resultMacros = useMemo(() => {
    const weightToUse =
      typeof finalWeight === 'number' && finalWeight > 0
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

    if (!recipeName.trim() || !/[A-Za-zА-Яа-яЄєІіЇїҐґ]/.test(recipeName)) {
      setError('Please provide a valid recipe name (must contain letters)');
      return;
    }

    if (ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    const invalidIngredient = ingredients.find(
      (ing) => !ing.weight || Number(ing.weight) <= 0
    );
    if (invalidIngredient) {
      setError(`Ingredient "${invalidIngredient.product.name}" must have a weight greater than 0g`);
      return;
    }

    saveAsNewRef.current = asNew;

    // Prompt confirmation if cooked weight was not specified
    if (finalWeight === '') {
      setShowConfirm(true);
    } else {
      confirmSaveRecipe(asNew);
    }
  };

  const confirmSaveRecipe = async (asNew: boolean) => {
    setShowConfirm(false);
    setError(null);
    setSuccess(null);

    const finalName = recipeName.trim();
    const newProduct: FoodItem = {
      id:
        editingRecipeId && !asNew
          ? editingRecipeId
          : generateSafeId('recipe'),
      name: finalName,
      category: 'My Recipes',
      caloriesPer100g: resultMacros.calories,
      proteinPer100g: resultMacros.protein,
      fatsPer100g: resultMacros.fats,
      carbsPer100g: resultMacros.carbs,
      rawWeight: rawWeight,
      cookedWeight:
        typeof finalWeight === 'number' && finalWeight > 0
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
        if (editingRecipeId && !asNew && editingRecipeId.startsWith('recipe_')) {
          const numericId = editingRecipeId.replace('recipe_', '');
          const res = await recipeService.updateRecipe(numericId, payload);
          if (res.ok && res.data) {
            savedItem = mapRecipeDtoToFoodItem(res.data);
            updateProduct(editingRecipeId, savedItem);
            setSuccess(`Recipe "${finalName}" synced with cloud!`);
          } else {
            updateProduct(editingRecipeId, newProduct);
            setError(res.error || 'Updated locally, cloud sync failed.');
          }
        } else {
          const res = await recipeService.createRecipe(payload);
          if (res.ok && res.data) {
            savedItem = mapRecipeDtoToFoodItem(res.data);
            addProduct(savedItem);
            setSuccess(`Recipe "${finalName}" saved to cloud!`);
          } else {
            addProduct(newProduct);
            setError(res.error || 'Saved locally, cloud sync failed.');
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
        navigate('/diary');
        return;
      }

      setIngredients([]);
      setRecipeName('');
      setFinalWeight('');
      setEditingRecipeId(null);
    } catch (err) {
      console.error('Failed to save recipe:', err);
      if (editingRecipeId && !asNew) {
        updateProduct(editingRecipeId, newProduct);
      } else {
        addProduct(newProduct);
      }
      setError('Saved locally, network error occurred.');
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
      if (authService.isAuthenticated() && targetId.startsWith('recipe_')) {
        const numericId = targetId.replace('recipe_', '');
        const res = await recipeService.deleteRecipe(numericId);
        if (!res.ok) {
          console.warn('Backend recipe deletion error:', res.error);
        }
      }
      deleteProduct(targetId);
      setSuccess('Recipe deleted successfully.');
      handleClear();
    } catch (err) {
      console.error('Failed to delete recipe:', err);
      deleteProduct(targetId);
      setSuccess('Recipe deleted locally.');
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
    <div className="mx-auto flex h-full w-full max-w-[1016px] flex-col relative px-4 md:px-8 pb-16">
      {/* Header with actions */}
      <RecipeHeader
        editingRecipeId={editingRecipeId}
        hasIngredients={ingredients.length > 0}
        isSaving={isSaving}
        isLoadingRecipe={isLoadingRecipe}
        onDeleteClick={() => setShowDeleteConfirm(true)}
        onClear={handleClear}
        onOpenLoad={() => setShowLoadRecipe(true)}
      />

      {/* Main Form Content */}
      <div className="rounded-[5px] border border-[#32363E] bg-[#0F1114]/80 backdrop-blur-md p-5 md:p-8 shadow-2xl space-y-6 mt-4">
        {/* Toast Feedbacks */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-[5px] border border-red-500/20 bg-red-500/10 p-3 text-center font-sans text-[13px] font-semibold text-red-400"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="rounded-[5px] border border-emerald-500/20 bg-emerald-500/10 p-3 text-center font-sans text-[13px] font-semibold text-emerald-400"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. Recipe Name */}
        <div className="flex flex-col gap-1.5">
          <Input
            label="Recipe Name"
            type="text"
            maxLength={60}
            placeholder="e.g. Baked chicken breast with sweet potato"
            value={recipeName}
            onChange={handleRecipeNameChange}
          />
        </div>

        {/* 2. Ingredients List */}
        <RecipeIngredientsList
          ingredients={ingredients}
          onAddClick={() => setShowSearch(true)}
          onUpdateWeight={updateWeight}
          onBlurWeight={handleIngredientBlur}
          onRemoveIngredient={removeIngredient}
        />

        {/* 3. Raw & Cooked Weights */}
        {ingredients.length > 0 && (
          <RecipeWeightSection
            rawWeight={rawWeight}
            finalWeight={finalWeight}
            onCookedWeightChange={handleCookedWeightChange}
            onCookedWeightBlur={handleCookedWeightBlur}
          />
        )}

        {/* 4. Nutritional Yield Summary */}
        {ingredients.length > 0 && (
          <RecipeNutritionSummary
            resultMacros={resultMacros}
            recipeName={recipeName}
            editingRecipeId={editingRecipeId}
            isSaving={isSaving}
            isLoadingRecipe={isLoadingRecipe}
            onSaveClick={handleSaveClick}
          />
        )}
      </div>

      {/* Food Search Drawer */}
      <ModalDrawer
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      >
        <FoodSearch
          onClose={() => setShowSearch(false)}
          onSelect={(product) => addIngredient(product)}
        />
      </ModalDrawer>

      {/* Load Recipe Drawer */}
      <ModalDrawer
        isOpen={showLoadRecipe}
        onClose={() => setShowLoadRecipe(false)}
      >
        <FoodSearch
          recipesOnly={true}
          onClose={() => setShowLoadRecipe(false)}
          onSelect={(product) => loadExistingRecipe(product)}
        />
      </ModalDrawer>

      {/* Confirm Weight Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Confirm Cooked Mass"
        description={
          <>
            Finished cooked weight is currently set to{' '}
            <strong>{finalWeight || Math.round(rawWeight)}g</strong>. Is this correct?
          </>
        }
        confirmText={editingRecipeId ? 'Update' : 'Save'}
        cancelText="Adjust"
        variant="primary"
        onConfirm={() => confirmSaveRecipe(saveAsNewRef.current)}
        onCancel={() => setShowConfirm(false)}
      />

      {/* Delete Recipe Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete recipe?"
        description={
          <>
            Are you sure you want to permanently delete{' '}
            <strong>"{recipeName || 'this recipe'}"</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDeleteRecipe}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      {/* Remove Ingredient Modal */}
      <ConfirmModal
        isOpen={!!ingredientToDelete}
        title="Remove ingredient?"
        description={
          ingredientToDelete && (
            <>
              Are you sure you want to remove{' '}
              <strong>"{ingredientToDelete.product.name}"</strong> from this recipe?
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
