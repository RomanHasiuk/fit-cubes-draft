import type React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import { authService } from '@/services/authService';
import { ComingSoonModal, type ComingSoonFeature } from '@/components/ui/ComingSoonModal';
import logoutIcon from '@/components/images/Logout.svg';

interface MobileMenuSelectionProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export const MobileMenuSelection: React.FC<MobileMenuSelectionProps> = ({
  setMobileMenuOpen,
}) => {
  const { pathname } = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeFeature, setActiveFeature] = useState<ComingSoonFeature | null>(null);

  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (activeFeature) return;
    const nextFocusedElement = event.relatedTarget as Node | null;
    if (!event.currentTarget.contains(nextFocusedElement)) {
      setMobileMenuOpen(false);
    }
  };

  const handleOpenFeature = (feature: ComingSoonFeature) => {
    setActiveFeature(feature);
  };

  const handleCloseFeature = () => {
    setActiveFeature(null);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await authService.logout();
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
        onClick={() => {
          if (!activeFeature) setMobileMenuOpen(false);
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-50 flex items-start justify-center">
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -20, scaleY: 0.96 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          tabIndex={-1}
          onBlur={handleBlur}
          className="pointer-events-auto mt-[70px] flex w-[288px] flex-col gap-2 rounded-[5px] border border-[#32363E] bg-[#16181D]/80 backdrop-blur-md p-2.5 shadow-2xl outline-none"
        >
          <ul className="flex flex-col gap-1.5 border-b border-[#32363E] pb-2">
            <li>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-[40px] w-full items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  pathname === '/'
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-[#32363E] text-white hover:border-primary/50 hover:bg-white/5'
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/diary"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-[40px] w-full items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  pathname === '/diary'
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-[#32363E] text-white hover:border-primary/50 hover:bg-white/5'
                }`}
              >
                Diary
              </Link>
            </li>
            <li>
              <Link
                to="/kitchen"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-[40px] w-full items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  pathname === '/kitchen'
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-[#32363E] text-white hover:border-primary/50 hover:bg-white/5'
                }`}
              >
                Kitchen
              </Link>
            </li>
          </ul>

          <ul className="flex flex-col gap-1.5 border-b border-[#32363E] pb-2">
            <li>
              <button
                type="button"
                onClick={() => handleOpenFeature('body')}
                className="flex h-[40px] w-full items-center justify-between px-3.5 rounded-lg border border-[#32363E] text-sm font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5 cursor-pointer"
              >
                <span>Body Metrics</span>
                <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-[3px]">
                  Soon
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleOpenFeature('exercise')}
                className="flex h-[40px] w-full items-center justify-between px-3.5 rounded-lg border border-[#32363E] text-sm font-medium text-white transition-all hover:border-primary/50 hover:bg-white/5 cursor-pointer"
              >
                <span>Exercise Metrics</span>
                <span className="text-[10px] uppercase font-sans font-semibold tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-[3px]">
                  Soon
                </span>
              </button>
            </li>
            <li>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-[40px] w-full items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                  pathname === '/profile'
                    ? 'border-primary bg-primary/10 font-semibold text-primary'
                    : 'border-[#32363E] text-white hover:border-primary/50 hover:bg-white/5'
                }`}
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

      <ComingSoonModal
        isOpen={Boolean(activeFeature)}
        feature={activeFeature}
        onClose={handleCloseFeature}
      />
    </>
  );
};
