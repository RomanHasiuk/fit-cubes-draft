import React, { useState } from 'react';
import { Search, X, ChevronDown, Check, ArrowDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SORT_OPTIONS, type SortKey, type SortDirection } from '@/hooks/useFoodFilter';

interface FoodFilterBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onClearQuery: () => void;
  selectedCategory: string;
  uniqueCategories: string[];
  onSelectCategory: (category: string) => void;
  sortBy: SortKey;
  sortDirection: SortDirection;
  onSelectSort: (sortKey: SortKey) => void;
  onToggleSortDirection: () => void;
  isLoading?: boolean;
}

export const FoodFilterBar: React.FC<FoodFilterBarProps> = ({
  query,
  onQueryChange,
  onClearQuery,
  selectedCategory,
  uniqueCategories,
  onSelectCategory,
  sortBy,
  sortDirection,
  onSelectSort,
  onToggleSortDirection,
  isLoading = false,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.key === sortBy)?.label || 'Most Used';

  return (
    <>
      {/* Search Input */}
      <div className="shrink-0 px-2.5 pb-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8F96]" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Enter food name..."
            className="w-full h-11 pl-10 pr-10 bg-[#16181D]/60 border border-[#32363E] rounded-[5px] text-sm text-[#F5F6FA] placeholder:text-[#8E8F96] outline-none focus:border-[#F59F0A] transition-colors"
          />
          {isLoading ? (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F59F0A] animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={onClearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E8F96] hover:text-[#F5F6FA]"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : null}
        </div>
      </div>

      {/* Filters & Sorting Control Panel */}
      <div className="shrink-0 px-2.5 pb-3 flex items-center justify-between gap-2.5 border-b border-[#32363E]/40 relative z-40">
        {/* Category Dropdown Toggle */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowSortMenu(false);
            }}
            className="w-full flex items-center justify-between bg-[#16181D]/60 border border-[#32363E] px-3 py-2.5 rounded-[5px] text-xs font-medium text-[#F5F6FA] hover:border-white/20 transition-colors cursor-pointer"
          >
            <span className="truncate mr-2">{selectedCategory}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-[#8E8F96] transition-transform duration-200 ${
                showCategoryMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Category Dropdown List */}
          <AnimatePresence>
            {showCategoryMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-1.5 z-50 w-full min-w-[210px] max-h-60 overflow-y-auto dropdown-scrollbar bg-[#16181D]/95 backdrop-blur-md rounded-[8px] border border-[#32363E] shadow-2xl py-1.5"
              >
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'text-[#F59F0A] font-semibold'
                        : 'text-[#B6B6BC]'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown Toggle */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setShowSortMenu(!showSortMenu);
              setShowCategoryMenu(false);
            }}
            className="w-full flex items-center justify-between bg-[#16181D]/60 border border-[#32363E] px-3 py-2.5 rounded-[5px] text-xs font-medium text-[#F5F6FA] hover:border-white/20 transition-colors cursor-pointer"
          >
            <span className="truncate mr-2">{activeSortLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-[#8E8F96] transition-transform duration-200 ${
                showSortMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Sort Dropdown List */}
          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-1.5 z-50 w-full min-w-[210px] max-h-60 overflow-y-auto dropdown-scrollbar bg-[#16181D]/95 backdrop-blur-md rounded-[8px] border border-[#32363E] shadow-2xl py-1.5"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onSelectSort(opt.key);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                      sortBy === opt.key
                        ? 'text-[#F59F0A] font-semibold'
                        : 'text-[#B6B6BC]'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {sortBy === opt.key && <Check className="w-3.5 h-3.5 shrink-0 ml-2" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Direction Toggle - persistent slot to prevent layout shifts */}
        <button
          type="button"
          disabled={sortBy === 'usage'}
          onClick={onToggleSortDirection}
          title={sortBy === 'usage' ? 'Popularity is sorted automatically' : 'Toggle sort direction'}
          className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-[5px] border border-[#32363E] transition-all ${
            sortBy === 'usage'
              ? 'opacity-25 cursor-not-allowed bg-[#16181D]/20 text-[#8E8F96]'
              : 'bg-[#16181D]/60 hover:border-white/20 text-[#F5F6FA] cursor-pointer active:scale-95'
          }`}
        >
          <ArrowDown
            className={`w-4 h-4 transition-transform duration-300 ${
              sortDirection === 'desc' ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown Backdrop Overlay */}
      {(showCategoryMenu || showSortMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowCategoryMenu(false);
            setShowSortMenu(false);
          }}
        />
      )}
    </>
  );
};

export default FoodFilterBar;
