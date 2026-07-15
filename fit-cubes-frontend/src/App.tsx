import { useEffect, useState } from "react";
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

const TABS = [
  { path: "/", label: "Home", icon: LayoutDashboard },
  { path: "/diary", label: "Diary", icon: BookOpen },
  { path: "/kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { path: "/progress", label: "Progress", icon: TrendingUp },
  { path: "/profile", label: "Profile", icon: User },
];

function App() {
  const isOnboarded = useStore(state => state.isOnboarded);
  const theme = useStore(state => state.theme);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useDataLoader();

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);

  const minSwipeDistance = 75;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (touchStartX === null || touchStartY === null || touchEndX === null || touchEndY === null) return;
    
    // Check if any modal is open to prevent switching tabs accidentally
    const hasModal = !!document.querySelector('.z-\\[100\\], .z-\\[110\\]');
    if (hasModal) return;

    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
    const isSignificant = Math.abs(distanceX) > minSwipeDistance;

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
    // Defer state update to next tick to avoid synchronous setState during render
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
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

  if (!mounted) return null;

  if (showOnboarding) {
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
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
                  <motion.div
                    className="min-h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Dashboard />
                  </motion.div>
                }
              />
              <Route
                path="/diary"
                element={
                  <motion.div
                    className="min-h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Diary />
                  </motion.div>
                }
              />
              <Route
                path="/kitchen"
                element={
                  <motion.div
                    className="min-h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <RecipeBuilder />
                  </motion.div>
                }
              />
              <Route
                path="/progress"
                element={
                  <motion.div
                    className="min-h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProgressScreen />
                  </motion.div>
                }
              />
              <Route
                path="/profile"
                element={
                  <motion.div
                    className="min-h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProfileScreen />
                  </motion.div>
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
