import type React from 'react';
import { motion } from 'framer-motion';
import { formatLargeNumber } from '@/utils/calculations';
import { useDashboardTotals } from './useDashboardTotals';

export const CalorieRing: React.FC = () => {
  const {
    totalBudget,
    remaining,
    isOverLimit,
    surplus,
    ringOffset,
    surplusRingOffset,
  } = useDashboardTotals();

  const displayRemaining = remaining > 0 ? remaining : 0;

  return (
    <motion.div
      className="mt-4 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative h-[288px] w-[288px] md:h-[314px] md:w-[314px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          {/* Base track */}
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            className="text-[#32363E]/60"
            strokeWidth="10"
          />

          {/* Gold Progress Ring (0% - 100%) */}
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="#F59F0A"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="440"
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: ringOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Red Over-limit Surplus Ring */}
          {isOverLimit && (
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#BB051A"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="440"
              initial={{ strokeDashoffset: 440 }}
              animate={{ strokeDashoffset: surplusRingOffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isOverLimit ? (
            <>
              <span className="font-serif text-4xl md:text-5xl font-bold text-[#BB051A]">
                +{formatLargeNumber(surplus)}
              </span>
              <span className="mt-1 text-center font-sans text-xs font-semibold tracking-wider text-[#BB051A] uppercase">
                Over Limit
              </span>
              <span className="mt-1 text-center font-sans text-sm font-medium text-[#8E8F96]">
                Goal: {formatLargeNumber(totalBudget)} kcal
              </span>
            </>
          ) : (
            <>
              <span className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                {formatLargeNumber(displayRemaining)}
              </span>
              <span className="mt-1 text-center font-sans text-xs text-muted-foreground">
                Remaining
              </span>
              <span className="mt-1 text-center font-sans text-sm font-medium text-[#F59F0A]">
                of {formatLargeNumber(totalBudget)} kcal
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};
