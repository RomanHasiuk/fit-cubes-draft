import type React from 'react';
import { motion } from 'framer-motion';
import { formatLargeNumber } from '@/utils/calculations';
import { useDashboardTotals } from './useDashboardTotals';

export const CalorieRing: React.FC = () => {
  const { totals, tdee, remaining, ringOffset } = useDashboardTotals();

  const totalBudget = tdee + totals.exercise;
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
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            className="text-border/80"
            strokeWidth="10"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="440"
            initial={{ strokeDashoffset: 440 }}
            animate={{ strokeDashoffset: ringOffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">
            {formatLargeNumber(displayRemaining)}
          </span>
          <span className="mt-1 text-center text-xs text-muted-foreground">
            Remaining
          </span>
          <span className="mt-1 text-sm font-medium text-primary">
            of {formatLargeNumber(totalBudget)} kcal
          </span>
        </div>
      </div>
    </motion.div>
  );
};
