import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProgressSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Skeleton */}
      <div className="shrink-0 px-5 pt-6 pb-2 space-y-2">
        <Skeleton className="h-7 w-32 rounded-md" />
        <Skeleton className="h-4 w-60 rounded-md" />
      </div>

      {/* Timeframe Toggle Skeleton */}
      <div className="shrink-0 px-5 pb-3">
        <div className="flex bg-secondary/50 rounded-xl p-1 gap-1">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 px-5 space-y-4 pb-10 overflow-y-auto no-scrollbar">
        {/* Daily Deficit Chart Skeleton */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* Calorie Intake Chart Skeleton */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3 w-16 rounded-md" />
            <Skeleton className="h-3 w-24 rounded-md" />
          </div>
        </div>

        {/* Expected Weight Change Chart Skeleton */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="h-4 w-44 rounded-md" />
            </div>
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>

        {/* Stats Grid Skeleton (2x2) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="w-4 h-4 rounded" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
              <Skeleton className="h-6 w-24 rounded-md mt-1" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSkeleton;
