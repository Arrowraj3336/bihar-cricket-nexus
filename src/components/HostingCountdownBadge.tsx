import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Zap } from "lucide-react";
import { getHostingTimeLeft, HOSTING_EXPIRY_LABEL } from "@/lib/hosting";
import { CricketBall } from "@/components/CricketDecorations";

/** Persistent corner countdown to the hosting plan expiry. */
const HostingCountdownBadge = () => {
  const [time, setTime] = useState(getHostingTimeLeft);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => setTime(getHostingTimeLeft()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (hidden || time.expired) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 220, damping: 22 }}
      className="fixed bottom-3 left-3 z-40 sm:bottom-5 sm:left-5"
    >
      <div className="relative overflow-hidden rounded-xl border border-primary/25 bg-background/90 px-3 py-2 shadow-card backdrop-blur-md">
        {/* seam stitch top line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-accent" />
        <CricketBall className="pointer-events-none absolute -bottom-4 -right-3 h-14 w-14 text-primary opacity-[0.07]" />

        <button
          onClick={() => setHidden(true)}
          aria-label="Hide hosting countdown"
          className="absolute right-1 top-1 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>

        <div className="flex items-center gap-1.5 pr-4 text-primary">
          <Zap className="h-3 w-3" />
          <span className="font-display text-[8px] font-bold uppercase tracking-widest">Hosting expires</span>
        </div>

        <div className="mt-0.5 flex items-baseline gap-1 font-heading tabular-nums">
          <span className="text-lg font-black leading-none text-foreground sm:text-xl">{time.days}</span>
          <span className="font-display text-[9px] uppercase text-muted-foreground">d</span>
          <span className="text-lg font-black leading-none text-foreground sm:text-xl">{pad(time.hours)}</span>
          <span className="font-display text-[9px] uppercase text-muted-foreground">h</span>
          <span className="text-lg font-black leading-none text-foreground sm:text-xl">{pad(time.minutes)}</span>
          <span className="font-display text-[9px] uppercase text-muted-foreground">m</span>
          <span className="text-lg font-black leading-none text-primary sm:text-xl">{pad(time.seconds)}</span>
          <span className="font-display text-[9px] uppercase text-muted-foreground">s</span>
        </div>

        <p className="font-display text-[8px] uppercase tracking-wider text-muted-foreground">{HOSTING_EXPIRY_LABEL}</p>
      </div>
    </motion.div>
  );
};

export default HostingCountdownBadge;
