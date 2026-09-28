import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { ComingSoonModal } from '@/components/ui/ComingSoonModal';

interface LanguageToggleProps {
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 cursor-pointer p-1 transition-opacity hover:opacity-80 ${className}`}
        aria-label="Change language"
      >
        <Globe className="h-5 w-5 text-[#B6B6BC]" strokeWidth={1.5} />
        <span className="text-[16px] font-medium leading-none text-[#B6B6BC]">
          EN
        </span>
      </button>

      <ComingSoonModal
        isOpen={isOpen}
        feature="language"
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default LanguageToggle;
