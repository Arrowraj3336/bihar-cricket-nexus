import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import brlLogo from "@/assets/logos/brl-logo-new.png";

const DELIVERY_EASE = [0.45, 0, 0.55, 1] as const;

const HomeBootLoader = () => {
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), reduceMotion ? 500 : 3000);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] isolate flex items-center justify-center overflow-hidden bg-foreground text-primary-foreground"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.32, ease: "easeOut" }}
          role="status"
          aria-label="Bihar Rural League is loading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,hsl(var(--primary-foreground)/0.09),transparent_42%)]" />
          <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(180deg,hsl(var(--primary)/0.08),transparent)]" />

          <div className="relative flex w-full max-w-xl flex-col items-center px-5">
            <div className="relative h-72 w-full max-w-md sm:h-80">
              <div className="absolute inset-x-4 bottom-8 h-24 origin-bottom -skew-x-6 bg-[linear-gradient(90deg,transparent,hsl(var(--primary-foreground)/0.04)_16%,hsl(var(--primary-foreground)/0.08)_50%,hsl(var(--primary-foreground)/0.04)_84%,transparent)] [clip-path:polygon(29%_0,71%_0,100%_100%,0_100%)]" />
              <div className="absolute inset-x-8 bottom-8 h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
              <div className="absolute bottom-8 left-1/2 h-1.5 w-32 -translate-x-1/2 rounded-full bg-foreground/80 blur-md" />

              {/* A restrained, missed defensive stroke gives the delivery context. */}
              <motion.div
                className="absolute bottom-10 left-1/2 z-10 h-36 w-8 origin-[50%_15%]"
                initial={{ x: -100, y: 6, rotate: 27, opacity: 0 }}
                animate={
                  reduceMotion
                    ? { x: -76, y: 4, rotate: 8, opacity: 0.5 }
                    : {
                        x: [-100, -100, -76, -72],
                        y: [6, 6, 4, 8],
                        rotate: [27, 27, 8, 3],
                        opacity: [0, 0.48, 0.58, 0],
                      }
                }
                transition={{ duration: 2.25, times: [0, 0.24, 0.55, 1], ease: DELIVERY_EASE }}
              >
                <div className="mx-auto h-9 w-2.5 rounded-t-full bg-muted-foreground" />
                <div className="h-24 w-8 rounded-b-lg rounded-t-sm border border-primary-foreground/10 bg-gradient-to-r from-muted-foreground via-primary-foreground/80 to-muted-foreground shadow-card" />
                <div className="mx-auto h-1.5 w-6 rounded-b-full bg-muted-foreground" />
              </motion.div>

              <motion.div
                className="absolute bottom-10 left-1/2 ml-10 flex h-28 -translate-x-1/2 items-end gap-2.5"
                animate={reduceMotion ? undefined : { x: [0, 0, 1.5, -0.75, 0] }}
                transition={{ duration: 2.35, times: [0, 0.58, 0.64, 0.72, 1], ease: "easeOut" }}
              >
                {[0, 1, 2].map((stump) => (
                  <div
                    key={stump}
                    className="h-24 w-1.5 rounded-t-full bg-gradient-to-r from-secondary via-primary-foreground to-muted-foreground shadow-[0_6px_12px_hsl(var(--foreground)/0.45)]"
                  />
                ))}

                <motion.div
                  className="absolute left-0 top-1 h-1 w-6 origin-right rounded-full bg-cricket-gold shadow-card"
                  animate={reduceMotion ? undefined : { x: [0, 0, -13, -24], y: [0, 0, -30, 2], rotate: [0, 0, -85, -175], opacity: [1, 1, 1, 0] }}
                  transition={{ duration: 2.35, times: [0, 0.58, 0.72, 1], ease: DELIVERY_EASE }}
                />
                <motion.div
                  className="absolute right-0 top-1 h-1 w-6 origin-left rounded-full bg-cricket-gold shadow-card"
                  animate={reduceMotion ? undefined : { x: [0, 0, 15, 26], y: [0, 0, -34, 0], rotate: [0, 0, 95, 190], opacity: [1, 1, 1, 0] }}
                  transition={{ duration: 2.35, times: [0, 0.59, 0.74, 1], ease: DELIVERY_EASE }}
                />
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-1/2 z-20 h-6 w-6 overflow-hidden rounded-full border border-primary-foreground/20 bg-primary shadow-[inset_-4px_-5px_7px_hsl(var(--foreground)/0.65),inset_3px_3px_5px_hsl(var(--primary-foreground)/0.2),0_7px_14px_hsl(var(--foreground)/0.55)]"
                initial={{ x: -210, y: -82, scale: 0.62, opacity: 0, rotate: 0 }}
                animate={
                  reduceMotion
                    ? { x: 26, y: 28, scale: 1, opacity: 1 }
                    : {
                        x: [-210, -150, -64, -16, 24, 56],
                        y: [-82, -62, -27, 34, 28, 35],
                        scale: [0.62, 0.74, 0.9, 1, 1.04, 1.08],
                        opacity: [0, 1, 1, 1, 1, 0],
                        rotate: [0, 90, 220, 360, 470, 590],
                      }
                }
                transition={{ duration: 2.35, times: [0, 0.14, 0.35, 0.5, 0.59, 1], ease: DELIVERY_EASE }}
              >
                <span className="absolute left-1/2 top-[-18%] h-[136%] w-px -translate-x-1/2 rotate-[28deg] bg-primary-foreground/70" />
                <span className="absolute left-[39%] top-0 h-full w-px rotate-[28deg] border-l border-dashed border-primary-foreground/45" />
              </motion.div>

              <motion.div
                className="absolute bottom-[6.9rem] left-[calc(50%+2.5rem)] h-10 w-10 -translate-x-1/2 rounded-full bg-primary-foreground blur-2xl"
                initial={{ opacity: 0, scale: 0.25 }}
                animate={reduceMotion ? undefined : { opacity: [0, 0, 0.28, 0], scale: [0.25, 0.25, 1, 1.7] }}
                transition={{ duration: 2.35, times: [0, 0.57, 0.6, 1], ease: "easeOut" }}
              />
            </div>

            <motion.div
              className="-mt-2 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0.05 : 1.9, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <img src={brlLogo} alt="DBRL" className="h-16 w-32 object-contain brightness-0 invert sm:h-20 sm:w-40" />
              <div className="mt-3 flex items-center gap-3">
                <span className="h-px w-7 bg-primary" />
                <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-primary-foreground/65 sm:text-xs">
                  Bihar Rural League
                </p>
                <span className="h-px w-7 bg-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeBootLoader;