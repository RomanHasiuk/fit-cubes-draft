import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-[1016px] flex-col pb-12">
      {/* Header Skeleton */}
      <div className="shrink-0 space-y-2 px-5 pb-2 pt-[102px] md:pt-[126px]">
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="mt-1 h-8 w-56 rounded-md" />
      </div>

      {/* Scrollable Content Skeleton */}
      <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-5 pb-6">
        {/* Calorie Ring Skeleton */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative flex h-56 w-56 items-center justify-center">
            {/* Outer circular ring */}
            <div className="flex h-56 w-56 items-center justify-center rounded-full border-[10px] border-primary/10 p-4 dark:border-white/10">
              <div className="flex flex-col items-center justify-center space-y-2">
                <Skeleton className="h-10 w-28 rounded-lg" />
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="mt-1 h-4 w-24 rounded-md" />
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
                <Skeleton className="h-4 w-4 rounded" />
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
                <Skeleton className="h-4 w-4 rounded" />
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
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        </div>

        {/* Stats Cards (2 Columns) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="glass-card space-y-2 rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="mt-1 h-7 w-20 rounded-md" />
            <Skeleton className="h-3 w-8 rounded-md" />
          </div>
          <div className="glass-card space-y-2 rounded-2xl border border-white/10 p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-14 rounded-md" />
            </div>
            <Skeleton className="mt-1 h-7 w-20 rounded-md" />
            <Skeleton className="h-3 w-8 rounded-md" />
          </div>
        </div>

        {/* Deficit / Energy Balance Card */}
        <div className="glass-card space-y-3 rounded-2xl border border-white/10 p-5">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
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
