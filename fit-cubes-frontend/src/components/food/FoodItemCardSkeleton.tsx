import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface FoodItemCardSkeletonProps {
  count?: number;
  variant?: 'food' | 'exercise';
}

export const FoodItemCardSkeleton: React.FC<FoodItemCardSkeletonProps> = ({
  count = 5,
  variant = 'food',
}) => {
  const isExercise = variant === 'exercise';

  return (
    <div className="space-y-2 py-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full flex items-center justify-between py-3.5 px-3 border-b border-border/40 rounded-xl bg-secondary/30"
        >
          {/* Left Round Icon (only for Exercise) */}
          {isExercise && (
            <Skeleton className="w-10 h-10 rounded-full shrink-0 mr-3" />
          )}

          {/* Middle Info Block */}
          <div className="flex-1 min-w-0 space-y-2 pr-4">
            <Skeleton className="h-4 w-1/3 rounded-md" />
            <Skeleton className="h-3.5 w-2/5 rounded-md" />
            {!isExercise && <Skeleton className="h-3 w-1/4 rounded-md" />}
          </div>

          {/* Right Block: Chevron arrow for Exercise, Calories + Heart for Food */}
          {isExercise ? (
            <Skeleton className="w-4 h-4 rounded-md shrink-0" />
          ) : (
            <div className="flex items-center gap-3 shrink-0">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="w-8 h-8 rounded-lg" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FoodItemCardSkeleton;
