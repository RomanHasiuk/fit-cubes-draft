import React, { useState } from 'react';
import { Search, X, ChevronDown, Check, ArrowDown } from 'lucide-react';
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
          {query && (
            <button
              type="button"
              onClick={onClearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8E8F96] hover:text-[#F5F6FA]"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Filters & Sorting Control Panel */}
      <div className="shrink-0 px-2.5 pb-3 flex items-center justify-between gap-2.5 border-b border-[#32363E]/40 relative z-20">
        {/* Category Dropdown Toggle */}
        <div className="relative flex-1">
          <button
            type="button"
            onClick={() => {
              setShowCategoryMenu(!showCategoryMenu);
              setShowSortMenu(false);
            }}
            className="w-full flex items-center justify-between bg-[#16181D]/60 border border-[#32363E] px-3 py-2.5 rounded-[5px] text-xs font-medium text-[#F5F6FA] hover:border-white/20 transition-colors"
          >
            <span className="truncate mr-2">{selectedCategory}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-[#8E8F96] transition-transform ${
                showCategoryMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Category Dropdown List */}
          <AnimatePresence>
            {showCategoryMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-48 max-h-64 overflow-y-auto custom-scrollbar rounded-[5px] border border-[#32363E] bg-[#16181D]/95 backdrop-blur-md shadow-2xl py-1.5"
              >
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat);
                      setShowCategoryMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      selectedCategory === cat
                        ? 'text-[#F59F0A] font-semibold'
                        : 'text-[#B6B6BC]'
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && <Check className="w-3.5 h-3.5" />}
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
            className="w-full flex items-center justify-between bg-[#16181D]/60 border border-[#32363E] px-3 py-2.5 rounded-[5px] text-xs font-medium text-[#F5F6FA] hover:border-white/20 transition-colors"
          >
            <span className="truncate mr-2">{activeSortLabel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 shrink-0 text-[#8E8F96] transition-transform ${
                showSortMenu ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Sort Dropdown List */}
          <AnimatePresence>
            {showSortMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 w-48 rounded-[5px] border border-[#32363E] bg-[#16181D]/95 backdrop-blur-md shadow-2xl py-1.5"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      onSelectSort(opt.key);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                      sortBy === opt.key
                        ? 'text-[#F59F0A] font-semibold'
                        : 'text-[#B6B6BC]'
                    }`}
                  >
                    {opt.label}
                    {sortBy === opt.key && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Direction Toggle */}
        {sortBy !== 'usage' && (
          <button
            type="button"
            onClick={onToggleSortDirection}
            className="shrink-0 w-8 h-8 flex items-center justify-center bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-colors"
          >
            <ArrowDown
              className={`w-4 h-4 transition-transform duration-300 ${
                sortDirection === 'desc' ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>

      {/* Dropdown Backdrop Overlay */}
      {(showCategoryMenu || showSortMenu) && (
        <div
          className="absolute inset-0 z-10"
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
