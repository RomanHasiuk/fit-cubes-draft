import React from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

interface PageLoaderProps {
  fullScreen?: boolean;
  size?: number;
  text?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  fullScreen = true,
  size = 90,
  text = "Loading...",
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <Logo variant="spin" size={size} />
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-sm font-medium text-muted-foreground tracking-wide"
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default PageLoader;
