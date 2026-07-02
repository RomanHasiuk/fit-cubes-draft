// OPTION 2:
// import React, { useState, useEffect } from 'react';
import InfoTooltip from '@/components/InfoTooltip';

interface MetricInputProps {
  label: string;
  value: number | string;

  // OPTION 1: Simple onKeyDown block (ACTIVE)
  onChange: (value: number) => void;

  // OPTION 2: Controlled Input with Regex (COMMENTED OUT)
  // onChange: (value: string) => void;
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
  // ==========================================
  // OPTION 1: Simple onKeyDown block (ACTIVE)
  // Pros: Less code, simple.
  // Cons: Relies on browser's "number" input quirks.
  // ==========================================
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowDecimals = step.includes('.');
    
    // Block dot/comma if decimals are not allowed (Age, Height)
    if (!allowDecimals && ['.', ','].includes(e.key)) {
      e.preventDefault();
    }
    // Block math symbols and exponent for all metric fields
    if (['e', 'E', '-', '+'].includes(e.key)) {
      e.preventDefault();
    }
  };

  const handleChangeOpt1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    if (rawValue === '') {
      onChange(0);
    } else {
      onChange(step.includes('.') ? parseFloat(rawValue) : parseInt(rawValue, 10));
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">{label}</label>
        <InfoTooltip title={tooltipTitle} content={tooltipContent} align={align} />
      </div>
      <input
        type="number"
        step={step}
        value={value === 0 ? '' : value}
        onKeyDown={handleKeyDown}
        onChange={handleChangeOpt1}
        className="w-full h-11 bg-secondary/50 border border-white/5 rounded-xl px-2 text-center text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
      />
    </div>
  );

  /*
  // ==========================================
  // OPTION 2: Controlled Input with Regex (COMMENTED OUT)
  // Pros: 100% control, works exactly the same across all browsers/devices.
  // Cons: Requires local state to handle decimal typing properly.
  // To use this: Comment out the OPTION 1 return block above, and uncomment this block.
  // ==========================================
  
  // Local state prevents dot from disappearing during typing (e.g., "12.")
  const [inputValue, setInputValue] = useState<string>(value === 0 ? '' : value.toString());

  // Sync with parent state when it changes from outside
  useEffect(() => {
    const parsedValue = parseFloat(value.toString());
    const parsedInput = parseFloat(inputValue);
    
    if (value === '' || value === 0) {
      setInputValue('');
    } else if (!isNaN(parsedValue) && parsedValue !== parsedInput) {
      setInputValue(value.toString());
    }
  }, [value]);

  const handleChangeOpt2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const allowDecimals = step.includes('.');
    
    // Regex: allow 1 dot if decimals allowed, otherwise digits only
    const regex = allowDecimals ? /^\d*\.?\d*$/ : /^\d*$/;

    if (regex.test(rawValue)) {
      setInputValue(rawValue);
      
      if (rawValue === '' || rawValue === '.') {
        onChange(0);
      } else {
        onChange(allowDecimals ? parseFloat(rawValue) : parseInt(rawValue, 10));
      }
    }
  };

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">{label}</label>
        <InfoTooltip title={tooltipTitle} content={tooltipContent} align={align} />
      </div>
      <input
        type="text" 
        inputMode={step.includes('.') ? "decimal" : "numeric"}
        value={inputValue}
        onChange={handleChangeOpt2}
        className="w-full h-11 bg-secondary/50 border border-white/5 rounded-xl px-2 text-center text-sm font-medium focus:ring-2 focus:ring-primary/50 outline-none transition-all"
      />
    </div>
  );
  */
};

