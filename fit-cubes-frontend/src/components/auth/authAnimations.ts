import type { Variants, Transition } from 'framer-motion';

export const AUTH_CUBIC_BEZIER = [0.25, 0.1, 0.25, 1] as const;

export const authContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const authItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: AUTH_CUBIC_BEZIER },
  },
};

export const authLayoutTransition: Transition = {
  duration: 0.35,
  ease: AUTH_CUBIC_BEZIER,
};
