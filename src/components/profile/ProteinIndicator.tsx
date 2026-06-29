import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Target } from 'lucide-react';

interface ProteinIndicatorProps {
  protein: number;
  weight: number;
}

export const ProteinIndicator: React.FC<ProteinIndicatorProps> = ({ protein, weight }) => {
  const ratio = protein / (weight || 1);
  const ratioStr = (Math.round(ratio * 10) / 10).toFixed(1);

  if (ratio < 1.2) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-4 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs rounded-xl p-3 flex items-start gap-2"
      >
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Too little protein!</strong> ({ratioStr} g/kg).
          The minimum amount to maintain health and muscle is 1.2 g per 1 kg of body weight.
        </p>
      </motion.div>
    );
  } else if (ratio > 2.5) {
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        className="mt-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl p-3 flex items-start gap-2"
      >
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          <strong>Too much protein!</strong> ({ratioStr} g/kg).
          Consuming more than 2.5 g/kg provides no additional benefits and may overload the kidneys.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-xl p-3 flex items-start gap-2"
    >
      <Target className="w-4 h-4 shrink-0 mt-0.5" />
      <p>
        <strong>Optimal!</strong> ({ratioStr} g/kg).
        Ideal protein range to reach your goals.
      </p>
    </motion.div>
  );
};
