import { motion } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
  key?: string;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      id="splash-screen-container"
      className="fixed inset-0 bg-emerald-900 flex flex-col items-center justify-center text-white z-50 select-none"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="flex flex-col items-center max-w-xs text-center px-4">
        {/* Animated Islamic Geometric Pattern / Crescent Shape */}
        <motion.div
          id="splash-logo-glow"
          className="relative w-32 h-32 flex items-center justify-center mb-6 bg-emerald-800/50 rounded-full border border-amber-400/20 shadow-lg shadow-amber-500/10"
          initial={{ scale: 0.8, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Inner crescent glow */}
          <div className="absolute w-24 h-24 rounded-full border-t-4 border-r-4 border-amber-400 rotate-45 opacity-90"></div>
          {/* Star */}
          <motion.div
            id="splash-star"
            className="absolute text-amber-300 text-3xl font-bold"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            ✦
          </motion.div>
        </motion.div>

        {/* Brand Text */}
        <motion.h1
          id="splash-title"
          className="text-3xl font-serif font-bold tracking-wider text-amber-100 mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          NOOR ISLAM
        </motion.h1>

        <motion.p
          id="splash-subtitle"
          className="text-emerald-200 text-sm tracking-widest uppercase font-sans font-medium"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Your Islamic Companion
        </motion.p>

        {/* Loading Bar */}
        <div className="w-40 h-1 bg-emerald-950 rounded-full mt-8 overflow-hidden">
          <motion.div
            id="splash-loading-bar"
            className="h-full bg-amber-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 1.2, ease: "easeInOut" }}
            onAnimationComplete={() => {
              // Wait a tiny bit then trigger completion
              setTimeout(onComplete, 300);
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
