import { useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from 'react-router';
import { useStore } from '@/store/useStore.ts';
import Dashboard from '@/sections/Dashboard.tsx';
import Diary from '@/sections/Diary.tsx';
import ProfileScreen from '@/sections/ProfileScreen.tsx';
import RecipeBuilder from '@/sections/RecipeBuilder.tsx';
import Onboarding from '@/sections/Onboarding.tsx';
import { useDataLoader } from '@/hooks/useDataLoader.ts';
import { PageTransition } from '@/components/layout/PageTransition.tsx';
import { PageLoader } from '@/components/ui/PageLoader.tsx';
import { MobileMenu } from './sections/MobileMenu';
import { MobileMenuSelection } from './sections/MobileMenuSelection.tsx';
import { Menu } from './sections/Menu';
import { MenuSelection } from './sections/MenuSelection.tsx';

const SWIPE_ROUTES = [
  '/',
  '/diary',
  '/kitchen',
] as const;

const MIN_SWIPE_DISTANCE = 75;

interface TouchCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

function App() {
  const isOnboarded = useStore((state) => state.isOnboarded);
  const theme = useStore((state) => state.theme);
  const openModalCount = useStore((state) => state.openModalCount);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const navigate = useNavigate();
  const location = useLocation();

  useDataLoader();

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const touchCoords = useRef<TouchCoordinates | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    // Ignore swipe gesture if touching interactive controls to prevent iOS Safari click suppression
    const target = e.target as HTMLElement | null;
    if (
      target?.closest(
        'button, a, input, select, textarea, [role="button"], [data-slot="button"]'
      )
    ) {
      touchCoords.current = null;
      return;
    }

    const touch = e.targetTouches[0];
    touchCoords.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      endX: touch.clientX,
      endY: touch.clientY,
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchCoords.current) {
      touchCoords.current.endX = e.targetTouches[0].clientX;
      touchCoords.current.endY = e.targetTouches[0].clientY;
    }
  };

  const onTouchEnd = () => {
    if (!touchCoords.current) return;
    const { startX, startY, endX, endY } = touchCoords.current;
    touchCoords.current = null;

    // Block swipe navigation when any modal is open (declarative state from Zustand)
    if (openModalCount > 0) return;

    const distanceX = startX - endX;
    const distanceY = startY - endY;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isSignificant = Math.abs(distanceX) > MIN_SWIPE_DISTANCE;

    if (isHorizontalSwipe && isSignificant) {
      const currentIndex = SWIPE_ROUTES.findIndex(
        (path) => path === location.pathname
      );
      if (currentIndex !== -1) {
        if (distanceX > 0 && currentIndex < SWIPE_ROUTES.length - 1) {
          navigate(SWIPE_ROUTES[currentIndex + 1]);
        } else if (distanceX < 0 && currentIndex > 0) {
          navigate(SWIPE_ROUTES[currentIndex - 1]);
        }
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setShowOnboarding(!isOnboarded);
  }, [isOnboarded]);

  useEffect(() => {
    // Apply theme on mount
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  if (!mounted) {
    return <PageLoader text="Loading FitCubes..." />;
  }

  if (showOnboarding) {
    return (
      <Onboarding
        onComplete={() => {
          setShowOnboarding(false);
          navigate('/');
        }}
      />
    );
  }

  return (
    <>
      {isMobileView ? (
        <MobileMenu
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      ) : (
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      )}
      <div className="relative flex min-h-[100dvh] w-full flex-col items-center bg-black font-sans transition-colors duration-500 selection:bg-amber-600/30">
        {/* App Shell */}
        <div className="relative isolate flex h-[100dvh] w-full flex-col shadow-2xl">
          {/* Main Content Area - Scrollable */}
          <main
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="no-scrollbar pt-safe relative h-full overflow-y-auto"
          >
            <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/img/welcome-bg5-c.webp')] bg-cover bg-top bg-no-repeat opacity-20" />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route
                  path="/"
                  element={
                    <PageTransition>
                      <Dashboard />
                    </PageTransition>
                  }
                />
                <Route
                  path="/diary"
                  element={
                    <PageTransition>
                      <Diary />
                    </PageTransition>
                  }
                />
                <Route
                  path="/kitchen"
                  element={
                    <PageTransition>
                      <RecipeBuilder />
                    </PageTransition>
                  }
                />
                <Route
                  path="/progress"
                  element={<Navigate to="/" replace />}
                />
                <Route
                  path="/profile"
                  element={
                    <PageTransition>
                      <ProfileScreen />
                    </PageTransition>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </div>
      {mobileMenuOpen && (
        <MobileMenuSelection setMobileMenuOpen={setMobileMenuOpen} />
      )}
      {menuOpen && <MenuSelection setMenuOpen={setMenuOpen} />}
    </>
  );
}

export default App;
