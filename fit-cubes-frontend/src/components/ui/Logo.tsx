import { motion, type Transition } from 'framer-motion';

export type LogoVariant = 'static' | 'draw' | 'spin' | 'pulse';

interface LogoProps {
  className?: string;
  variant?: LogoVariant;
  size?: number;
  pulse?: boolean;
}

export function Logo({ className = '', variant = 'static', size = 134, pulse = false }: LogoProps) {
  const isDraw = variant === 'draw';
  const isSpin = variant === 'spin';
  
  // Animation configs for the outer circle
  const outerAnim = isDraw ? { pathLength: 1.02, rotate: 0, opacity: 1 } : isSpin ? { rotate: 360 } : { pathLength: 1, rotate: 0, opacity: 1 };
  const outerInit = isDraw ? { pathLength: 0, rotate: -180, opacity: 0 } : { pathLength: 1, rotate: 0, opacity: 1 };
  const outerTrans: Transition = isDraw 
    ? { delay: 1.0, duration: 3.0, ease: "easeInOut" }
    : isSpin
      ? { duration: 15, repeat: Infinity, ease: "linear" }
      : {};

  // Animation configs for the middle circle
  const middleAnim = isDraw ? { pathLength: 1.02, rotate: 0, opacity: 1 } : isSpin ? { rotate: -360 } : { pathLength: 1, rotate: 0, opacity: 1 };
  const middleInit = isDraw ? { pathLength: 0, rotate: 180, opacity: 0 } : { pathLength: 1, rotate: 0, opacity: 1 };
  const middleTrans: Transition = isDraw 
    ? { delay: 0.5, duration: 3.5, ease: "easeInOut" }
    : isSpin
      ? { duration: 12, repeat: Infinity, ease: "linear" }
      : {};

  // Animation configs for the inner circle
  const innerAnim = isDraw ? { pathLength: 1.02, rotate: 0, opacity: 1 } : isSpin ? { rotate: 360 } : { pathLength: 1, rotate: 0, opacity: 1 };
  const innerInit = isDraw ? { pathLength: 0, rotate: -180, opacity: 0 } : { pathLength: 1, rotate: 0, opacity: 1 };
  const innerTrans: Transition = isDraw 
    ? { delay: 0, duration: 4.0, ease: "easeInOut" }
    : isSpin
      ? { duration: 8, repeat: Infinity, ease: "linear" }
      : {};

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="-4 -4 142 142"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer */}
      <motion.circle
        cx="67" cy="67" r="63"
        stroke="#F59F0A" strokeWidth="8"
        strokeLinecap="round"
        style={{ transformOrigin: 'center' }}
        initial={outerInit}
        animate={outerAnim}
        transition={outerTrans}
      />
      {/* Middle */}
      <motion.circle
        cx="67" cy="67" r="41"
        stroke="#F59F0A" strokeWidth="8"
        strokeLinecap="round"
        style={{ transformOrigin: 'center' }}
        initial={middleInit}
        animate={middleAnim}
        transition={middleTrans}
      />
      {/* Inner */}
      <motion.circle
        cx="67.5" cy="66.5" r="20.5"
        stroke="#F59F0A" strokeWidth="8"
        strokeLinecap="round"
        style={{ transformOrigin: 'center' }}
        initial={innerInit}
        animate={innerAnim}
        transition={innerTrans}
      />
    </svg>
  );

  // Calculate pulse delay: if we are drawing, wait for it to finish (4 seconds) before pulsing
  const pulseDelay = isDraw ? 4.0 : 0;

  // For pulse mode, we wrap the static logo in a breathing animation container
  if (variant === 'pulse' || pulse) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          filter: [
            "drop-shadow(0px 0px 0px rgba(245, 159, 10, 0))",
            "drop-shadow(0px 0px 10px rgba(245, 159, 10, 0.6))",
            "drop-shadow(0px 0px 0px rgba(245, 159, 10, 0))"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: pulseDelay }}
        className="inline-flex items-center justify-center"
      >
        {svgContent}
      </motion.div>
    );
  }

  return svgContent;
}
