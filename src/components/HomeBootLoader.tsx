import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const LIGHTS = Array.from({ length: 10 }, (_, index) => index);

const HomeBootLoader = () => {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        id: index,
        left: `${7 + ((index * 37) % 86)}%`,
        top: `${10 + ((index * 29) % 76)}%`,
        delay: (index % 7) * 0.08,
        size: index % 3 === 0 ? "h-1.5 w-1.5" : "h-1 w-1",
      })),
    [],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 450 : 3000);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] isolate flex items-center justify-center overflow-hidden bg-foreground text-primary-foreground"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.035 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: "easeInOut" }}
          role="status"
          aria-label="Bihar Rural League is loading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.4),transparent_42%)]" />
          <motion.div
            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary-foreground/15 to-transparent blur-xl"
            initial={{ x: "-180%", skewX: -18 }}
            animate={reduceMotion ? undefined : { x: "430%" }}
            transition={{ duration: 1.1, ease: "easeInOut", repeat: 1, repeatDelay: 0.25 }}
          />

          <div className="absolute inset-x-0 top-0 flex justify-center gap-3 opacity-75 sm:gap-6">
            {LIGHTS.map((light) => (
              <motion.span
                key={light}
                className="h-1.5 w-5 bg-primary-foreground shadow-[0_0_18px_hsl(var(--primary-foreground))] sm:w-9"
                animate={reduceMotion ? undefined : { opacity: [0.25, 1, 0.45] }}
                transition={{ duration: 0.5, delay: light * 0.045, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </div>

          {particles.map((particle) => (
            <motion.span
              key={particle.id}
              className={`absolute rounded-full bg-cricket-gold shadow-[0_0_12px_hsl(var(--cricket-gold))] ${particle.size}`}
              style={{ left: particle.left, top: particle.top }}
              initial={{ opacity: 0, scale: 0 }}
              animate={reduceMotion ? { opacity: 0.45 } : { opacity: [0, 0.9, 0], scale: [0, 1.3, 0], y: [18, -10, -36] }}
              transition={{ duration: 1.25, delay: particle.delay, repeat: Infinity }}
            />
          ))}

          <motion.div
            className="absolute h-[min(72vw,31rem)] w-[min(72vw,31rem)] rounded-full border border-primary/50"
            initial={{ opacity: 0, scale: 0.5, rotate: -35 }}
            animate={{ opacity: 1, scale: 1, rotate: reduceMotion ? 0 : 325 }}
            transition={{ duration: reduceMotion ? 0.2 : 2.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="absolute left-1/2 top-[-3px] h-1.5 w-16 -translate-x-1/2 bg-cricket-gold shadow-[0_0_18px_hsl(var(--cricket-gold))]" />
            <span className="absolute bottom-[-3px] left-1/2 h-1.5 w-16 -translate-x-1/2 bg-primary shadow-glow" />
          </motion.div>

          <motion.div
            className="absolute h-[min(60vw,25rem)] w-[min(60vw,25rem)] rounded-full border-2 border-dashed border-primary/40"
            animate={reduceMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            <motion.div
              className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44"
              initial={{ opacity: 0, scale: 0.35 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.75, ease: [0.2, 0.9, 0.2, 1], delay: 0.15 }}
            >
              <motion.span
                className="absolute inset-0 rounded-full bg-primary/25 blur-2xl"
                animate={reduceMotion ? undefined : { scale: [0.75, 1.25, 0.85], opacity: [0.35, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
              <img src={brlLogo} alt="DBRL" className="relative h-full w-full object-contain drop-shadow-2xl" />
            </motion.div>

            <motion.p
              className="mt-5 font-display text-[10px] font-bold uppercase tracking-[0.42em] text-cricket-gold sm:text-xs"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4 }}
            >
              Bihar Rural League
            </motion.p>
            <motion.h1
              className="mt-2 font-heading text-3xl font-black uppercase tracking-normal text-primary-foreground sm:text-5xl"
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.85, duration: 0.45, ease: "easeOut" }}
            >
              The Game Begins
            </motion.h1>

            <div className="mt-8 h-1 w-52 overflow-hidden bg-primary-foreground/15 sm:w-64">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-cricket-gold to-primary"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: reduceMotion ? 0.3 : 2.35, delay: 0.3, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-primary/40 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeBootLoader;