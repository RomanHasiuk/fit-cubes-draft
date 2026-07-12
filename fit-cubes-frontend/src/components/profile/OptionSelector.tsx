import React from 'react';
import InfoTooltip from '@/components/InfoTooltip.tsx';

interface Option {
  id: string;
  label: string;
  tip: string;
}

interface OptionSelectorProps {
  label?: string;
  options: Option[];
  selectedValue: string;
  onSelect: (id: any) => void;
  columns?: number;
}

export const OptionSelector: React.FC<OptionSelectorProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  columns = 3
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 block px-1">
          {label}
        </label>
      )}
      <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {options.map((opt, idx) => {
          // Calculate tooltip alignment based on position in grid
          let align: 'left' | 'center' | 'right' = 'center';
          if (idx === 0) align = 'left';
          if (idx === options.length - 1) align = 'right';
          
          return (
            <div key={opt.id} className="relative">
              <div className="absolute -top-1 -right-1 z-10">
                <InfoTooltip title={opt.label} content={opt.tip} align={align} />
              </div>
              <button
                onClick={() => onSelect(opt.id)}
                className={`w-full py-2 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all border border-transparent ${
                  selectedValue === opt.id 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'bg-secondary/50 text-muted-foreground border-white/5 hover:bg-secondary/80'
                }`}
              >
                {opt.label.toUpperCase()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
