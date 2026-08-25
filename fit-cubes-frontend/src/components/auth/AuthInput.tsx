import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hasError?: boolean;
}

export function AuthInput({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  className,
  error,
  hasError,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const isInvalid = Boolean(hasError || error);
  const hasValue = Boolean(value !== undefined && value !== null && String(value).length > 0);
  const showFloatingLabel = Boolean(label && (isFocused || hasValue));

  return (
    <div className="w-full flex flex-col">
      <div className="relative w-full">
        {/* Floating Tooltip Badge on top border */}
        {showFloatingLabel && (
           <span
            className={cn(
              'absolute -top-3 left-3 z-10 px-2 py-0.5 rounded-[5px] text-[12px] font-medium leading-[1.35] text-[#D8D8E2] select-none pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-95',
              'bg-[#16191E] border border-white/20 shadow-sm'
            )}
          >
            {label}
          </span>
        )}

        <input
          type={effectiveType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={showFloatingLabel ? '' : placeholder}
          className={cn(
            'w-full h-[44px] px-3.5 bg-black/5 dark:bg-[#16191E]/80 backdrop-blur-sm border rounded-[5px]',
            'text-white placeholder:text-white/40',
            'focus:outline-none transition-all touch-manipulation',
            isInvalid
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
              : 'border-white/10 focus:border-white/50 focus:ring-0',
            isPassword && 'pr-11',
            className
          )}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none cursor-pointer select-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 pointer-events-none" />
            ) : (
              <Eye className="w-4 h-4 pointer-events-none" />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 font-medium pl-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
