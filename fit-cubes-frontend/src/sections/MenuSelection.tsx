import type React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { useEffect, useRef } from 'react';
import { authService } from '@/services/authService';
import { useStore } from '@/store/useStore';
import logoutIcon from '@/components/images/Logout.svg';

interface MenuSelectionProps {
  setMenuOpen: (open: boolean) => void;
}

export const MenuSelection: React.FC<MenuSelectionProps> = ({
  setMenuOpen,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextFocusedElement = event.relatedTarget as Node | null;
    if (!event.currentTarget.contains(nextFocusedElement)) {
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    useStore.setState({ isOnboarded: false });
    setMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs"
        onClick={() => setMenuOpen(false)}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-end">
        <div className="mx-auto flex w-[95%] max-w-6xl justify-end">
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            tabIndex={-1}
            onBlur={handleBlur}
            className="pointer-events-auto mt-[68px] flex w-[230px] flex-col gap-2 rounded-[5px] border border-[#32363E] bg-[#16181D]/80 backdrop-blur-md p-2.5 shadow-2xl outline-none"
          >
            <ul className="flex flex-col gap-1.5 border-b border-[#32363E]/60 pb-2">
              <li>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-[42px] w-full items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/40 font-serif text-[15px] font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5"
                >
                  Body metrics
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-[42px] w-full items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/40 font-serif text-[15px] font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5"
                >
                  Exercise Metrics
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-[42px] w-full items-center justify-center rounded-[5px] border border-[#32363E] bg-[#16181D]/40 font-serif text-[15px] font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5"
                >
                  Settings
                </Link>
              </li>
            </ul>

            <div className="flex justify-center pt-0.5">
              <button
                type="button"
                onClick={handleLogout}
                className="group flex h-[38px] w-full cursor-pointer items-center justify-center gap-2 rounded-[5px] transition-colors hover:bg-white/5"
              >
                <img
                  src={logoutIcon}
                  alt=""
                  className="h-4 w-4 opacity-75 transition-opacity group-hover:opacity-100"
                />
                <span className="font-serif text-[15px] font-medium text-[#B6B6BC] transition-colors group-hover:text-destructive">
                  Log out
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};
