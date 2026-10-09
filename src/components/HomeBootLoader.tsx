import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import OpenerCricketBall from "@/components/OpenerCricketBall";
import redMist from "@/assets/home-opener/red-mist.jpg";
import { hasPlayedHomeOpener, markHomeOpenerPlayed } from "@/lib/home-opener";


const HomeBootLoader = ({ replay = false, onComplete }: { replay?: boolean; onComplete?: () => void }) => {
  const [visible, setVisible] = useState(() => replay || !hasPlayedHomeOpener());
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!visible) return;
    const images = [redMist].map((source) => {
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
    if (!reduceMotion) return;
    const timer = window.setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, 350);
    return () => window.clearTimeout(timer);
  }, [visible, ready, reduceMotion, onComplete]);

  if (!visible) return null;

  return (
    <div className={`home-ball-opener fixed inset-0 z-[100] isolate overflow-hidden ${ready ? "opener-running" : ""} ${reduceMotion ? "opener-reduced" : ""}`} role="status" aria-label="Bihar Rural League is loading" onAnimationEnd={(event) => {
      if (event.animationName !== "opener-curtain") return;
      setVisible(false);
      onComplete?.();
    }}>
      <div className="home-ball-backdrop absolute inset-0" />
      {ready && !reduceMotion && (
        <>
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="home-delivery-ball h-40 w-40 sm:h-48 sm:w-48"><OpenerCricketBall /></div>
          </div>
          <div className="home-fog-position absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <div className="home-impact-mist">
              <img src={redMist} alt="" width={1536} height={1024} draggable={false} className="h-full w-full object-cover" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeBootLoader;
