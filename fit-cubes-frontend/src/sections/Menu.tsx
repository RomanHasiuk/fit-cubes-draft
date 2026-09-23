import { Link, useLocation } from 'react-router';
import { Globe } from 'lucide-react';
import fitCubeLogo from '@/components/images/FitCubeLogo.svg';
import burgerIcon from '@/components/images/Burger.svg';

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/diary', label: 'Diary' },
  { to: '/kitchen', label: 'Kitchen' },
] as const;

export const Menu: React.FC<MenuProps> = ({ setMenuOpen, menuOpen }) => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-[62px] border-b border-[#32363E] bg-[#0F1114]/75 backdrop-blur-md">
      <div className="mx-auto flex h-full w-[95%] max-w-6xl items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-[46px] w-[108px] object-contain"
            src={fitCubeLogo}
            alt="FitCube Logo"
          />
        </Link>

        <ul className="flex h-[46px] items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.to;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`relative block text-[16px] font-medium leading-[1.35] transition-colors ${
                    isActive
                      ? 'text-[#F5F6FA] after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:bg-[#F5F6FA]'
                      : 'text-[#F5F6FA]/70 hover:text-[#F5F6FA]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex h-[46px] items-center gap-5">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer p-1 transition-opacity hover:opacity-80"
            aria-label="Change language"
          >
            <Globe className="h-5 w-5 text-[#B6B6BC]" strokeWidth={1.5} />
            <span className="text-[16px] font-medium leading-none text-[#B6B6BC]">
              EN
            </span>
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
