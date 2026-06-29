import React from 'react';
import InfoTooltip from '@/components/InfoTooltip';

interface MetricInputProps {
  label: string;
  value: number | string;
  onChange: (value: number) => void;
  tooltipTitle: string;
  tooltipContent: string;
  step?: string;
  unit?: string;
  align?: 'left' | 'center' | 'right';
}

export const MetricInput: React.FC<MetricInputProps> = ({
  label,
  value,
  onChange,
  tooltipTitle,
  tooltipContent,
  step = "1",
  align = 'center'
}) => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">{label}</label>
        <InfoTooltip 
          title={tooltipTitle} 
          content={tooltipContent} 
          align={align} 
        />
      </div>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(step.includes('.') ? parseFloat(e.target.value) : parseInt(e.target.value) || 0)}
        className="w-full h-11 bg-secondary/50 border border-white/5 rounded-xl px-2 text-center text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
      />
    </div>
  );
};
