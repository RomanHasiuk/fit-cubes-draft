import type React from 'react';
import { Link } from 'react-router';
import fitCubeLogo from '@/components/images/FitCubeLogo.svg';
import languageIcon from '@/components/images/Language.svg';
import burgerIcon from '@/components/images/Burger.svg';

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const Menu: React.FC<MenuProps> = ({ setMenuOpen, menuOpen }) => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-[62px] border-b border-white/5 bg-black">
      <div className="mx-auto flex h-full w-[95%] max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-[46px] w-[108px] object-contain"
            src={fitCubeLogo}
            alt="FitCube Logo"
          />
        </Link>

        <ul className="flex h-[46px] items-center gap-7">
          <li>
            <Link
              to="/"
              className="block h-[62px] text-sm font-medium leading-[62px] text-white transition-colors hover:text-primary"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/diary"
              className="block h-[62px] text-sm font-medium leading-[62px] text-white transition-colors hover:text-primary"
            >
              Diary
            </Link>
          </li>
          <li>
            <Link
              to="/kitchen"
              className="block h-[62px] text-sm font-medium leading-[62px] text-white transition-colors hover:text-primary"
            >
              Kitchen
            </Link>
          </li>
          <li>
            <Link
              to="/progress"
              className="block h-[62px] text-sm font-medium leading-[62px] text-white transition-colors hover:text-primary"
            >
              Progress
            </Link>
          </li>
        </ul>

        <div className="flex h-[46px] w-[178px] items-center justify-between">
          <button
            type="button"
            className="cursor-pointer p-1 transition-opacity hover:opacity-80"
            aria-label="Change language"
          >
            <img src={languageIcon} alt="" className="h-5 w-5" />
          </button>

          <div className="flex h-[46px] w-[90px] items-center justify-evenly rounded-[20px] border border-[#4F3911] bg-[#251F13]">
            <div className="h-[34px] w-[34px] rounded-full bg-white" />
            <button
              type="button"
              className="flex h-[24px] w-[24px] cursor-pointer items-center justify-center"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img src={burgerIcon} alt="" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
