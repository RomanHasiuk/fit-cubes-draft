import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SelectButton({
  isSelected,
  children,
  className,
  type = 'button',
  ...props
}: SelectButtonProps) {
  return (
    <button
      type={type}
      aria-pressed={isSelected}
      className={cn(
        "h-[44px] px-2.5 rounded-[5px] flex items-center justify-center font-sans font-medium text-[16px] leading-[1.35] transition-all cursor-pointer touch-manipulation select-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        isSelected
          ? "bg-[#16181D]/90 border-2 border-[#F59F0A] text-[#F59F0A] font-semibold shadow-sm hover:border-[#F59F0A] hover:text-[#F59F0A]"
          : "bg-[#16181D]/60 backdrop-blur-sm border border-[#32363E] text-[#8E8F96] hover:text-foreground hover:border-white/20",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none truncate">{children}</span>
    </button>
  );
}
