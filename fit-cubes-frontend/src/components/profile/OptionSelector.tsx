import InfoTooltip from '@/components/InfoTooltip.tsx';

interface Option<T extends string = string> {
  id: T;
  label: string;
  tip: string;
}

interface OptionSelectorProps<T extends string = string> {
  label?: string;
  options: readonly Option<T>[] | ReadonlyArray<Option<T>>;
  selectedValue: T | string;
  onSelect: (id: T) => void;
  columns?: number;
}

export function OptionSelector<T extends string>({
  label,
  options,
  selectedValue,
  onSelect,
  columns = 3,
}: OptionSelectorProps<T>) {
  return (
    <div className="w-full">
      {label && (
        <label className="font-serif text-sm font-semibold text-foreground mb-2 block px-1">
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
}
