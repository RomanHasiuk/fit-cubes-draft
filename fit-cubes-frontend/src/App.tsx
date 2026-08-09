import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookOpen, TrendingUp, User, UtensilsCrossed } from "lucide-react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router";
import { useStore } from "@/store/useStore.ts";
import Dashboard from "@/sections/Dashboard.tsx";
import Diary from "@/sections/Diary.tsx";
import ProgressScreen from "@/sections/ProgressScreen.tsx";
import ProfileScreen from "@/sections/ProfileScreen.tsx";
import RecipeBuilder from "@/sections/RecipeBuilder.tsx";
import Onboarding from "@/sections/Onboarding.tsx";
import { useDataLoader } from "@/hooks/useDataLoader.ts";
import { PageTransition } from "@/components/layout/PageTransition.tsx";
import { PageLoader } from "@/components/ui/PageLoader.tsx";
import { apiClient } from "@/services/apiClient.ts";

const TABS = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/diary", label: "Diary", icon: BookOpen },
  { path: "/kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/profile", label: "Profile", icon: User },
];

const MIN_SWIPE_DISTANCE = 75;

interface TouchCoordinates {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

function App() {
  const isOnboarded = useStore(state => state.isOnboarded);
  const theme = useStore(state => state.theme);
  const openModalCount = useStore(state => state.openModalCount);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useDataLoader();

  const touchCoords = useRef<TouchCoordinates | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
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
      const currentIndex = TABS.findIndex((tab) => tab.path === location.pathname);
      if (currentIndex !== -1) {
        if (distanceX > 0 && currentIndex < TABS.length - 1) {
          navigate(TABS[currentIndex + 1].path);
        } else if (distanceX < 0 && currentIndex > 0) {
          navigate(TABS[currentIndex - 1].path);
        }
      }
    }
  };

  useEffect(() => {
    apiClient.checkBackendHealth();

    const timer = setTimeout(() => {
      setMounted(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply theme on mount
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  if (!mounted) {
    return <PageLoader text="Loading FitCubes..." />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={() => {
      setShowOnboarding(false);
      navigate('/');
    }} />;
  }

  return (
    <div className="min-h-[100dvh] w-full bg-transparent transition-colors duration-500 flex flex-col items-center font-sans selection:bg-amber-600/30 relative">
      {/* App Shell */}
      <div className="w-full max-w-[600px] h-[100dvh] flex flex-col glass border-0 md:border-x border-white/20 dark:border-white/10 relative isolate shadow-2xl">
        {/* Main Content Area - Scrollable */}
        <main
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="h-full overflow-y-auto no-scrollbar relative pt-safe pb-[72px]"
        >
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
                element={
                  <PageTransition>
                    <ProgressScreen />
                  </PageTransition>
                }
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

        {/* Bottom Navigation - Floating at bottom */}
        <nav className="absolute bottom-0 left-0 right-0 h-[72px] bg-background/50 backdrop-blur-[2px] border-t border-white/10 z-50 pb-safe transition-all duration-500">
          <div className="flex items-center justify-around h-full px-2 max-w-lg mx-auto">
            {TABS.map((tab) => {
              const isActive = location.pathname === tab.path || 
                              (tab.path !== '/' && location.pathname.startsWith(tab.path));
              
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center justify-center gap-1 w-16 h-full relative"
                >
                  <tab.icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span
                    className={`text-[10px] transition-colors ${
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <motion.div
                      className="absolute -top-px inset-x-0 mx-auto w-12 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(142,71,45,0.5)]"
                      layoutId="activeTab"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default App;
