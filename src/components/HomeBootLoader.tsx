import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import cricketBall from "@/assets/home-opener/cricket-ball.png";
import redMist from "@/assets/home-opener/red-mist.jpg";
import { hasPlayedHomeOpener, markHomeOpenerPlayed } from "@/lib/home-opener";

const DURATION = 3;
const steps = Array.from({ length: 61 }, (_, index) => index / 60);
// Constant forward velocity: apparent size increases with inverse distance,
// rather than an arbitrary zoom easing. The last frames reach the camera.
const approachScale = steps.map((time) => 0.11 / (1 - time * 0.994));

const HomeBootLoader = ({ replay = false, onComplete }: { replay?: boolean; onComplete?: () => void }) => {
  const [visible, setVisible] = useState(() => replay || !hasPlayedHomeOpener());
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;
    const images = [cricketBall, redMist].map((source) => {
      const image = new Image();
      image.src = source;
      return image;
    });
    let active = true;
    Promise.all(images.map((image) => image.decode().catch(() => undefined))).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible || !ready) return;
    markHomeOpenerPlayed();
    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, reduceMotion ? 350 : DURATION * 1000);
    return () => window.clearTimeout(timer);
  }, [visible, ready, reduceMotion, onComplete]);

  if (!visible) return null;

  return (
    <div className="home-ball-opener fixed inset-0 z-[100] isolate overflow-hidden" role="status" aria-label="Bihar Rural League is loading">
      <motion.div
        className="home-ball-backdrop absolute inset-0"
        initial={{ opacity: 1 }}
        animate={ready ? { opacity: 0 } : undefined}
        transition={{ delay: reduceMotion ? 0 : 1.85, duration: reduceMotion ? 0.35 : 0.5 }}
      />
      {ready && !reduceMotion && (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.img
              src={cricketBall}
              alt=""
              width={1024}
              height={1024}
              draggable={false}
              className="home-delivery-ball h-48 w-48 object-contain sm:h-56 sm:w-56"
              initial={{ scale: 0.11, opacity: 0, rotate: -12 }}
              animate={{ scale: approachScale, rotate: [-12, 8], opacity: [0, 1, 1, 0] }}
              transition={{
                scale: { duration: 1.78, times: steps, ease: "linear" },
                rotate: { duration: 1.78, ease: "linear" },
                opacity: { duration: 1.86, times: [0, 0.07, 0.95, 1], ease: "linear" },
              }}
            />
          </div>
          <motion.div
            className="home-impact-mist absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ delay: 1.65, duration: 1.35, times: [0, 0.16, 0.35, 1], ease: "easeInOut" }}
          >
            <motion.img
              src={redMist}
              alt=""
              width={1536}
              height={1024}
              className="home-mist-texture absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 0.22, opacity: 0 }}
              animate={{ scale: [0.22, 1.08, 1.3], opacity: [0, 1, 1] }}
              transition={{ delay: 1.65, duration: 1.3, times: [0, 0.23, 1], ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.img
              src={redMist}
              alt=""
              width={1536}
              height={1024}
              className="home-mist-wisps absolute inset-0 h-full w-full object-cover"
              initial={{ scale: 1.15, rotate: 180, opacity: 0 }}
              animate={{ scale: 1.6, rotate: 185, opacity: [0, 0.45, 0] }}
              transition={{ delay: 1.72, duration: 1.28, ease: "easeOut" }}
            />
          </motion.div>
        </>
      )}
    </div>
  );
};

export default HomeBootLoader;
