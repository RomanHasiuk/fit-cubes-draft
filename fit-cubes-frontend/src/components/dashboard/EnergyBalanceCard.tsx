import type React from 'react';
import { motion } from 'framer-motion';
import { Flame, Footprints, TrendingDown } from 'lucide-react';
import { formatLargeNumber } from '@/utils/calculations';
import { useDashboardTotals } from './useDashboardTotals';

export const EnergyBalanceCard: React.FC = () => {
  const { totals, netDeficit } = useDashboardTotals();

  const isDeficit = netDeficit > 0;
  const isSurplus = netDeficit < 0;

  const deficitColor = isDeficit
    ? 'text-primary'
    : isSurplus
      ? 'text-destructive'
      : 'text-muted-foreground';

  const formattedNetDeficit = isDeficit
    ? `-${formatLargeNumber(netDeficit)} kcal`
    : isSurplus
      ? `+${formatLargeNumber(Math.abs(netDeficit))} kcal`
      : '0 kcal';

  const expectedWeightTrend =
    netDeficit > 50
      ? `Expected fat loss: ~${formatLargeNumber(netDeficit / 7.7)} g 📉`
      : netDeficit < -50
        ? `Expected fat gain: ~${formatLargeNumber(Math.abs(netDeficit / 7.7))} g 📈`
        : 'Maintaining current weight ⚖️';

  return (
    <motion.div
      className="z-10 mx-4 mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 lg:mx-0 lg:mt-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
    >
      <div className="glass-card col-span-1 rounded-2xl p-4 order-1 md:order-2 md:col-span-2">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Energy Balance
          </span>
        </div>
        <p className={`mt-1 text-2xl font-bold ${deficitColor}`}>
          {formattedNetDeficit}
        </p>
        <span className="mt-2 block text-sm font-medium text-foreground">
          {expectedWeightTrend}
        </span>
      </div>

      <div className="glass-card rounded-2xl p-4 order-2 md:order-1">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-medium text-muted-foreground">
            Eaten
          </span>
        </div>
        <p className="mt-1 text-xl font-bold text-foreground">
          {formatLargeNumber(totals.calories)}
        </p>
        <span className="text-xs text-muted-foreground">kcal</span>
      </div>

      <div className="glass-card rounded-2xl p-4 order-3 md:order-1">
        <div className="flex items-center gap-2">
          <Footprints className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Burned
          </span>
        </div>
        <p className="mt-1 text-xl font-bold text-foreground">
          {formatLargeNumber(totals.exercise)}
        </p>
        <span className="text-xs text-muted-foreground">kcal</span>
      </div>
    </motion.div>
  );
};
