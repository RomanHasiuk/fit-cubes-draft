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
        'flex h-[44px] cursor-pointer touch-manipulation select-none items-center justify-center rounded-[5px] px-2.5 font-sans text-[16px] font-medium leading-[1.35] transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
        isSelected
          ? 'border-2 border-[#F59F0A] bg-[#16181D]/90 font-semibold text-[#F59F0A] shadow-sm hover:border-[#F59F0A] hover:text-[#F59F0A]'
          : 'border border-[#32363E] bg-[#16181D]/60 text-[#8E8F96] backdrop-blur-sm hover:border-white/20 hover:text-foreground',
        className
      )}
      {...props}
    >
      <span className="pointer-events-none truncate">{children}</span>
    </button>
  );
}
