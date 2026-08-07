import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Skeleton */}
      <div className="shrink-0 px-5 pt-6 pb-2 flex items-start justify-between">
        <div className="space-y-2 flex-1 mr-4">
          <Skeleton className="h-7 w-40 rounded-md" />
          <Skeleton className="h-4 w-52 rounded-md" />
        </div>
        <Skeleton className="w-28 h-9 rounded-xl shrink-0" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 px-5 space-y-6 pb-8">
        {/* BMR/TDEE Card Skeleton */}
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <div className="space-y-3 pt-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        </div>

        {/* Body Metrics Section Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-md px-1" />
          <div className="glass-card rounded-2xl p-4 border border-white/10 space-y-4">
            <div className="flex gap-3">
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 flex-1 rounded-xl" />
              <Skeleton className="h-14 flex-1 rounded-xl" />
            </div>
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-20 rounded-md" />
                <Skeleton className="h-4 w-8 rounded-md" />
              </div>
              <Skeleton className="h-3 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Manual Macros Adjustment Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-44 rounded-md px-1" />
          <div className="glass-card rounded-2xl p-4 border border-white/10 grid grid-cols-3 gap-3">
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>

        {/* Exercise Constants List Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 rounded-md px-1" />
          <div className="glass-card rounded-2xl divide-y divide-white/5 border border-white/10 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                  </div>
                </div>
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
