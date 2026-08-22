import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function AuthInput({
  type = 'text',
  value,
  onChange,
  placeholder,
  className,
  error,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <input
        type={effectiveType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full h-[46px] px-3.5 bg-[#16191E]/80 backdrop-blur-sm border border-white/10 rounded-[10px]',
          'text-white text-sm placeholder-white/40',
          'focus:outline-none focus:border-[#F59F0A] focus:ring-1 focus:ring-[#F59F0A] transition-all',
          'touch-manipulation',
          isPassword && 'pr-11',
          error && 'border-red-500/50 focus:border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={handleTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-white transition-colors focus:outline-none cursor-pointer select-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 pointer-events-none" />
          ) : (
            <Eye className="w-4 h-4 pointer-events-none" />
          )}
        </button>
      )}

      {error && (
        <span className="block mt-1 text-xs text-red-400 font-medium">
          {error}
        </span>
      )}
    </div>
  );
}
