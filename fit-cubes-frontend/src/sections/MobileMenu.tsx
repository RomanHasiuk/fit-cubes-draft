import type React from 'react';
import logoIcon from '@/components/images/Logo.svg';
import burgerIcon from '@/components/images/Burger.svg';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

interface MobileMenuProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  setMobileMenuOpen,
  mobileMenuOpen,
}) => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-[62px] items-center justify-between border-b border-[#32363E] bg-[#0F1114]/75 backdrop-blur-md px-4">
      <img
        className="h-[46px] w-[46px] object-contain"
        src={logoIcon}
        alt="FitCubes Logo"
      />
      <div className="flex h-[46px] items-center gap-4">
        <LanguageToggle />
        <div className="flex h-[46px] w-[90px] items-center justify-evenly rounded-[20px] border border-[#4F3911] bg-[#251F13]">
          <UserAvatar onClick={() => setMobileMenuOpen(false)} />
          <button
            type="button"
            className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <img src={burgerIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};
