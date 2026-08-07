import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface MealSectionSkeletonProps {
  itemCount?: number;
}

export const MealSectionSkeleton: React.FC<MealSectionSkeletonProps> = ({ itemCount = 2 }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden mb-4 border border-white/10">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 py-3.5 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-20 rounded-md" />
        </div>
        <Skeleton className="w-7 h-7 rounded-lg" />
      </div>

      {/* Food Entries List Skeleton */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3.5">
            <div className="flex-1 min-w-0 space-y-2 pr-4">
              <Skeleton className="h-4 w-2/5 rounded-md" />
              <Skeleton className="h-3 w-1/4 rounded-md" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-12 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total Skeleton */}
      <div className="px-4 py-2.5 bg-black/5 dark:bg-white/5 flex justify-end">
        <Skeleton className="h-3.5 w-28 rounded-md" />
      </div>
    </div>
  );
};

export default MealSectionSkeleton;
