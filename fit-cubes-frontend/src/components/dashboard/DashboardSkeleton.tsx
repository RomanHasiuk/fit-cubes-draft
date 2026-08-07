import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="shrink-0 px-5 pt-6 pb-2 space-y-2">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="h-8 w-56 rounded-md mt-1" />
      </div>

      {/* Scrollable Content Skeleton */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-6 space-y-6">
        {/* Calorie Ring Skeleton */}
        <div className="flex flex-col items-center mt-4">
          <div className="relative w-56 h-56 flex items-center justify-center">
            {/* Outer circular ring */}
            <div className="w-56 h-56 rounded-full border-[10px] border-primary/10 dark:border-white/10 flex items-center justify-center p-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Macros Progress Lines Skeleton */}
        <div className="space-y-4 pt-2">
          {/* Protein */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Carbs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Fats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>

        {/* Stats Cards (2 Columns) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="h-7 w-20 rounded-md mt-1" />
            <Skeleton className="h-3 w-8 rounded-md" />
          </div>
          <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="h-7 w-20 rounded-md mt-1" />
            <Skeleton className="h-3 w-8 rounded-md" />
          </div>
        </div>

        {/* Deficit / Energy Balance Card */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-3.5 w-28 rounded-md" />
          </div>
          <Skeleton className="h-8 w-36 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
