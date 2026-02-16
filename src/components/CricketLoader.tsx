import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const CricketLoader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[hsl(260_30%_6%/0.98)] backdrop-blur-[60px]"
        >
          {/* Spinning stumps ring */}
          <div className="relative flex items-center justify-center">
            {/* Outer rotating ring */}
            <motion.div
              className="absolute w-32 h-32 rounded-full border-2 border-dashed border-primary/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner rotating ring (opposite direction) */}
            <motion.div
              className="absolute w-24 h-24 rounded-full border border-accent/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Cricket ball orbiting */}
            <motion.div
              className="absolute w-32 h-32"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent shadow-[0_0_12px_hsl(35_100%_55%/0.6)]" />
            </motion.div>

            {/* Logo in center */}
            <motion.img
              src={brlLogo}
              alt="BRL"
              className="w-16 h-16 object-contain drop-shadow-[0_0_30px_hsl(265_60%_50%/0.5)]"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Text */}
          <motion.p
            className="mt-8 text-xs font-display font-semibold tracking-[0.4em] uppercase text-muted-foreground"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Bihar Rural League
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CricketLoader;
