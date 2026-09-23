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
        className="fixed inset-0 z-50 bg-black"
        onClick={() => setMenuOpen(false)}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex justify-end">
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20, scaleY: 0.96 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          tabIndex={-1}
          onBlur={handleBlur}
          className="pointer-events-auto mr-5 mt-[70px] flex w-[288px] flex-col gap-2 rounded-xl border border-[#32363E] bg-[#16181D] p-2 shadow-2xl outline-none"
        >
          <ul className="flex flex-col gap-1.5 border-b border-[#32363E] pb-2">
            <li>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex h-[42px] w-full items-center justify-center rounded-lg border border-[#32363E] text-sm font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5"
              >
                Body metrics
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex h-[42px] w-full items-center justify-center rounded-lg border border-[#32363E] text-sm font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5"
              >
                Exercise Metrics
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex h-[42px] w-full items-center justify-center rounded-lg border border-[#32363E] text-sm font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5"
              >
                Settings
              </Link>
            </li>
          </ul>

          <div className="flex justify-center py-1">
            <button
              type="button"
              onClick={handleLogout}
              className="group flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-1.5 transition-colors hover:bg-white/5"
            >
              <img
                src={logoutIcon}
                alt=""
                className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100"
              />
              <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-destructive">
                Logout
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};
