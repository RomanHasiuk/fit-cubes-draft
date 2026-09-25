import React from 'react';
import { UtensilsCrossed, Trash2, FolderOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeHeaderProps {
  editingRecipeId: string | null;
  hasIngredients: boolean;
  isSaving: boolean;
  isLoadingRecipe: boolean;
  onDeleteClick: () => void;
  onClear: () => void;
  onOpenLoad: () => void;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  editingRecipeId,
  hasIngredients,
  isSaving,
  isLoadingRecipe,
  onDeleteClick,
  onClear,
  onOpenLoad,
}) => {
  return (
    <div className="shrink-0 px-4 md:px-8 pt-[102px] md:pt-[126px] pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#32363E]/60">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[5px] border border-[#4F3911] bg-[#251F13] text-[#F59F0A]">
          <UtensilsCrossed className="h-5 w-5" />
        </div>
        <div>
          <h1 className="heading-h2 text-foreground">
            {editingRecipeId ? 'Edit Recipe' : 'Recipe Builder'}
          </h1>
          <p className="font-sans text-[13px] text-[#8E8F96]">
            Calculate cooked dish yield and nutritional density per 100g
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {editingRecipeId && (
          <button
            type="button"
            onClick={onDeleteClick}
            disabled={isSaving || isLoadingRecipe}
            className="flex h-9 items-center gap-1.5 rounded-[5px] border border-red-500/20 bg-red-500/10 px-3 font-sans text-[12px] font-semibold text-red-400 transition-all hover:bg-red-500/20 active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Delete this recipe"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        )}

        {hasIngredients && (
          <button
            type="button"
            onClick={onClear}
            disabled={isSaving || isLoadingRecipe}
            className="flex h-9 items-center gap-1.5 rounded-[5px] border border-[#32363E] bg-[#16181D]/60 px-3 font-sans text-[12px] font-semibold text-[#8E8F96] transition-all hover:border-white/20 hover:text-foreground active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenLoad}
          disabled={isSaving || isLoadingRecipe}
          className="h-9 px-3.5 text-[13px]"
        >
          {isLoadingRecipe ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FolderOpen className="h-4 w-4" />
          )}
          Open Recipe
        </Button>
      </div>
    </div>
  );
};
