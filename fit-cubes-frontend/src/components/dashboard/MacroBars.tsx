import type React from 'react';
import { motion } from 'framer-motion';
import { Beef, Droplets, WheatIcon } from 'lucide-react';
import { formatLargeNumber } from '@/utils/calculations';
import { useDashboardTotals } from './useDashboardTotals';

export const MacroBars: React.FC = () => {
  const { totals, profile } = useDashboardTotals();
  const macroTargets = profile.macroTargets;

  const proteinPct = Math.min(
    100,
    (totals.protein / Math.max(1, macroTargets.protein || 1)) * 100
  );
  const carbsPct = Math.min(
    100,
    (totals.carbs / Math.max(1, macroTargets.carbs || 1)) * 100
  );
  const fatsPct = Math.min(
    100,
    (totals.fats / Math.max(1, macroTargets.fats || 1)) * 100
  );

  const macros = [
    {
      id: 'protein',
      label: 'Protein',
      icon: Beef,
      current: totals.protein,
      target: macroTargets.protein,
      pct: proteinPct,
      color: 'bg-primary',
      iconColor: 'text-primary',
      delay: 0.3,
    },
    {
      id: 'carbs',
      label: 'Carbs',
      icon: WheatIcon,
      current: totals.carbs,
      target: macroTargets.carbs,
      pct: carbsPct,
      color: 'bg-blue-400',
      iconColor: 'text-blue-400',
      delay: 0.4,
    },
    {
      id: 'fats',
      label: 'Fats',
      icon: Droplets,
      current: totals.fats,
      target: macroTargets.fats,
      pct: fatsPct,
      color: 'bg-orange-400',
      iconColor: 'text-orange-400',
      delay: 0.5,
    },
  ];

  return (
    <motion.div
      className="mx-4 mt-6 space-y-3.5 lg:mx-0 lg:mt-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {macros.map((macro) => {
        const Icon = macro.icon;
        return (
          <div key={macro.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${macro.iconColor}`} />
                <span className="text-sm font-medium text-foreground">
                  {macro.label}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {formatLargeNumber(macro.current)}g /{' '}
                {formatLargeNumber(macro.target)}g
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className={`h-full ${macro.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${macro.pct}%` }}
                transition={{ duration: 0.6, delay: macro.delay }}
              />
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};
