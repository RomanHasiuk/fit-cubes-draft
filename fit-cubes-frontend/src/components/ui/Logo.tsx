import { motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils.ts";

export type LogoVariant = "static" | "draw" | "spin" | "pulse";

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
  size?: number;
  pulse?: boolean;
}

export function Logo({
  className = "",
  variant = "static",
  size = 134,
  pulse = false,
}: LogoProps) {
  const isDraw = variant === "draw";
  const isSpin = variant === "spin";

  const CYCLE_DURATION = 3.6;

  const innerSpinAnim = {
    pathLength: [0, 1, 1, 1, 0],
    rotate: [0, 360, 360, 360, 720],
  };
  const innerSpinTrans: Transition = {
    duration: CYCLE_DURATION,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.3, 0.82, 0.92, 1],
  };

  const middleSpinAnim = {
    pathLength: [0, 0, 1, 1, 0],
    rotate: [0, 0, 360, 360, 720],
  };
  const middleSpinTrans: Transition = {
    duration: CYCLE_DURATION,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.22, 0.54, 0.86, 1],
  };

  const outerSpinAnim = {
    pathLength: [0, 0, 1, 1, 0],
    rotate: [0, 0, 360, 360, 720],
  };
  const outerSpinTrans: Transition = {
    duration: CYCLE_DURATION,
    repeat: Infinity,
    ease: "easeInOut",
    times: [0, 0.44, 0.76, 0.9, 1],
  };

  const outerDrawAnim = { pathLength: 1.02, rotate: 0, opacity: 1 };
  const outerDrawInit = { pathLength: 0, rotate: -180, opacity: 0 };
  const outerDrawTrans: Transition = {
    delay: 1.0,
    duration: 3.0,
    ease: "easeInOut",
  };

  const middleDrawAnim = { pathLength: 1.02, rotate: 0, opacity: 1 };
  const middleDrawInit = { pathLength: 0, rotate: 180, opacity: 0 };
  const middleDrawTrans: Transition = {
    delay: 0.5,
    duration: 3.5,
    ease: "easeInOut",
  };

  const innerDrawAnim = { pathLength: 1.02, rotate: 0, opacity: 1 };
  const innerDrawInit = { pathLength: 0, rotate: -180, opacity: 0 };
  const innerDrawTrans: Transition = {
    delay: 0,
    duration: 4.0,
    ease: "easeInOut",
  };

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 134 134"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={pulse || variant === "pulse" ? "w-full h-full" : className}
    >
      {/* Outer Circle */}
      <motion.circle
        cx="67"
        cy="67"
        r="63"
        stroke="#F59F0A"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transformOrigin: "67px 67px" }}
        initial={
          isDraw
            ? outerDrawInit
            : isSpin
              ? { pathLength: 0, rotate: 0 }
              : { pathLength: 1, rotate: 0 }
        }
        animate={
          isDraw
            ? outerDrawAnim
            : isSpin
              ? outerSpinAnim
              : { pathLength: 1, rotate: 0 }
        }
        transition={
          isDraw ? outerDrawTrans : isSpin ? outerSpinTrans : undefined
        }
      />

      {/* Middle Circle */}
      <motion.circle
        cx="67"
        cy="67"
        r="41"
        stroke="#F59F0A"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transformOrigin: "67px 67px" }}
        initial={
          isDraw
            ? middleDrawInit
            : isSpin
              ? { pathLength: 0, rotate: 0 }
              : { pathLength: 1, rotate: 0 }
        }
        animate={
          isDraw
            ? middleDrawAnim
            : isSpin
              ? middleSpinAnim
              : { pathLength: 1, rotate: 0 }
        }
        transition={
          isDraw ? middleDrawTrans : isSpin ? middleSpinTrans : undefined
        }
      />

      {/* Inner (Center) Circle */}
      <motion.circle
        cx="67"
        cy="67"
        r="20.5"
        stroke="#F59F0A"
        strokeWidth="8"
        strokeLinecap="round"
        style={{ transformOrigin: "67px 67px" }}
        initial={
          isDraw
            ? innerDrawInit
            : isSpin
              ? { pathLength: 0, rotate: 0 }
              : { pathLength: 1, rotate: 0 }
        }
        animate={
          isDraw
            ? innerDrawAnim
            : isSpin
              ? innerSpinAnim
              : { pathLength: 1, rotate: 0 }
        }
        transition={
          isDraw ? innerDrawTrans : isSpin ? innerSpinTrans : undefined
        }
      />
    </svg>
  );

  // Pulse mode wrapper
  if (variant === "pulse" || pulse) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0px 0px 0px rgba(245, 159, 10, 0))",
            "drop-shadow(0px 0px 10px rgba(245, 159, 10, 0.6))",
            "drop-shadow(0px 0px 0px rgba(245, 159, 10, 0))",
          ],
        }}
        transition={{
          duration: 2,
          repeat: 2,
          ease: "easeInOut",
          delay: isDraw ? 4.0 : 0,
        }}
        className={cn("inline-flex items-center justify-center", className)}
      >
        {svgContent}
      </motion.div>
    );
  }

  return svgContent;
}

export default Logo;
