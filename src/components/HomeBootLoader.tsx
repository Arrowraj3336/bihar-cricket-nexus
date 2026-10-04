import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import brlLogo from "@/assets/logos/brl-logo-new.png";

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
          transition={{ duration: reduceMotion ? 0.15 : 0.35, ease: "easeOut" }}
          role="status"
          aria-label="Bihar Rural League is loading"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,hsl(var(--primary)/0.16),transparent_34%)]" />

          <div className="relative flex w-full max-w-lg flex-col items-center px-6">
            <div className="relative h-64 w-full max-w-sm sm:h-72">
              <div className="absolute inset-x-8 bottom-9 h-px bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent" />

              <motion.div
                className="absolute bottom-10 left-1/2 z-10 h-40 w-9 origin-bottom"
                initial={{ x: -112, y: -32, rotate: 34, opacity: 0 }}
                animate={
                  reduceMotion
                    ? { x: -42, y: 0, rotate: -12, opacity: 1 }
                    : {
                        x: [-112, -112, -42, -22],
                        y: [-32, -32, 0, 8],
                        rotate: [34, 34, -12, -24],
                        opacity: [0, 1, 1, 0.35],
                      }
                }
                transition={{ duration: 2.05, times: [0, 0.32, 0.48, 1], ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mx-auto h-10 w-3 rounded-t-sm bg-muted-foreground" />
                <div className="h-28 w-9 rounded-sm border border-primary-foreground/20 bg-gradient-to-r from-secondary via-primary-foreground to-secondary shadow-card" />
                <div className="mx-auto h-2 w-7 rounded-b-full bg-secondary" />
              </motion.div>

              <div className="absolute bottom-10 left-1/2 ml-12 flex h-28 -translate-x-1/2 items-end gap-3">
                {[0, 1, 2].map((stump) => (
                  <motion.div
                    key={stump}
                    className="h-24 w-1.5 origin-bottom rounded-full bg-primary-foreground shadow-[0_0_12px_hsl(var(--primary-foreground)/0.24)]"
                    animate={
                      reduceMotion
                        ? undefined
                        : stump === 1
                          ? { rotate: [0, 0, 0, 8], x: [0, 0, 0, 4] }
                          : { rotate: [0, 0, 0, stump === 0 ? -3 : 3] }
                    }
                    transition={{ duration: 2.3, times: [0, 0.63, 0.67, 1], ease: "easeOut" }}
                  />
                ))}

                <motion.div
                  className="absolute left-0 top-2 h-1 w-8 origin-right rounded-full bg-cricket-gold"
                  animate={reduceMotion ? undefined : { x: [0, 0, -22], y: [0, 0, -34], rotate: [0, 0, -32], opacity: [1, 1, 0] }}
                  transition={{ duration: 2.3, times: [0, 0.64, 1], ease: "easeOut" }}
                />
                <motion.div
                  className="absolute right-0 top-2 h-1 w-8 origin-left rounded-full bg-cricket-gold"
                  animate={reduceMotion ? undefined : { x: [0, 0, 26], y: [0, 0, -30], rotate: [0, 0, 38], opacity: [1, 1, 0] }}
                  transition={{ duration: 2.3, times: [0, 0.64, 1], ease: "easeOut" }}
                />
              </div>

              <motion.div
                className="absolute left-1/2 top-1/2 z-20 h-7 w-7 overflow-hidden rounded-full border border-primary-foreground/20 bg-primary shadow-[0_0_24px_hsl(var(--primary)/0.7)]"
                initial={{ x: -210, y: -112, scale: 0.55, opacity: 0 }}
                animate={
                  reduceMotion
                    ? { x: 22, y: 17, scale: 1, opacity: 1 }
                    : {
                        x: [-210, -158, -32, 17, 48],
                        y: [-112, -78, -4, 22, 24],
                        scale: [0.55, 0.72, 1, 1.08, 1],
                        opacity: [0, 1, 1, 1, 0],
                        rotate: [0, 120, 330, 470, 620],
                      }
                }
                transition={{ duration: 2.05, times: [0, 0.18, 0.46, 0.62, 1], ease: [0.25, 0.8, 0.25, 1] }}
              >
                <span className="absolute left-1/2 top-[-18%] h-[136%] w-px -translate-x-1/2 rotate-[24deg] bg-primary-foreground/75" />
                <span className="absolute left-[38%] top-0 h-full w-px rotate-[24deg] border-l border-dashed border-primary-foreground/55" />
              </motion.div>

              <motion.div
                className="absolute bottom-[7.1rem] left-[calc(50%+3.4rem)] h-16 w-16 -translate-x-1/2 rounded-full bg-primary-foreground blur-2xl"
                initial={{ opacity: 0, scale: 0.25 }}
                animate={reduceMotion ? undefined : { opacity: [0, 0, 0.75, 0], scale: [0.25, 0.25, 1.25, 2] }}
                transition={{ duration: 2.15, times: [0, 0.6, 0.64, 1] }}
              />
            </div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0.05 : 1.75, duration: 0.45, ease: "easeOut" }}
            >
              <img src={brlLogo} alt="DBRL" className="h-14 w-28 object-contain brightness-0 invert sm:h-16 sm:w-32" />
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px w-8 bg-primary" />
                <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-primary-foreground/60 sm:text-xs">
                  Bihar Rural League
                </p>
                <span className="h-px w-8 bg-primary" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HomeBootLoader;