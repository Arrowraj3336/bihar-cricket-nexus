import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlugZap } from "lucide-react";
import UnpluggedPlugAnimation from "@/components/UnpluggedPlugAnimation";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";
import { getHostingTimeLeft, HOSTING_EXPIRY_LABEL } from "@/lib/hosting";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const HostingExpiryPopup = () => {
  const [open, setOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(getHostingTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getHostingTimeLeft()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[65dvh] max-h-[calc(100dvh-2rem)] w-[65vw] max-w-[calc(100vw-2rem)] overflow-hidden border-primary/25 bg-background p-0 shadow-glow lg:h-[62dvh] lg:w-[52vw] [&>button]:right-3 [&>button]:top-3 [&>button]:z-30 [&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-primary/20 [&>button]:bg-background/90 [&>button]:text-foreground [&>button]:shadow-card [&>button]:backdrop-blur-md">
        <div className="relative flex h-full min-h-0 flex-col">
          {/* Cricket ambience */}
          <div className="pointer-events-none absolute inset-0 cricket-ball-pattern opacity-[0.25]" />
          <CricketStumps className="pointer-events-none absolute -left-4 bottom-16 h-28 w-16 text-primary opacity-[0.06]" />
          <CricketBat className="pointer-events-none absolute -right-2 top-24 h-28 w-8 rotate-[18deg] text-primary opacity-[0.06]" />

          {/* Stadium scoreboard strip */}
          <div className="relative z-10 flex shrink-0 items-center justify-between gap-2 border-b border-primary/15 bg-secondary/70 px-3 py-1.5 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-1.5 text-primary">
              <PlugZap className="h-3.5 w-3.5" />
              <span className="font-display text-[8px] font-bold uppercase tracking-[0.2em] sm:text-[10px]">
                Service Notice
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <CricketBall className="h-3 w-3 animate-spin-slow text-primary opacity-60" />
              <span className="font-display text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px]">
                Final Over
              </span>
            </div>
          </div>

          {/* Animated unplugged power visual */}
          <div className="relative z-10 min-h-0 flex-[1.1] overflow-hidden border-b border-primary/15 bg-gradient-to-b from-secondary/40 to-background px-2 py-1">
            <UnpluggedPlugAnimation />
          </div>

          <DialogHeader className="relative z-10 shrink-0 px-4 pb-2 pt-3 text-center sm:px-7">
            <DialogTitle className="font-heading text-2xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Hosting Plan <span className="text-gradient-primary">Expiry</span>
            </DialogTitle>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              className="mx-auto mt-1.5 h-[3px] w-24 rounded-full bg-gradient-accent sm:w-32"
            />
            <DialogDescription className="mx-auto mt-2 max-w-md font-display text-[11px] leading-relaxed text-muted-foreground sm:text-sm">
              Our hosting plan ends on{" "}
              <strong className="font-bold text-primary">{HOSTING_EXPIRY_LABEL}</strong>. Renew before
              the last ball to keep the league online.
            </DialogDescription>
          </DialogHeader>

          {/* Countdown — scoreboard tiles */}
          <div className="relative z-10 shrink-0 border-t border-primary/15 bg-secondary/70 px-3 py-2.5 backdrop-blur-md sm:px-7 sm:py-3">
            <p className="mb-1.5 text-center font-display text-[8px] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:text-[9px]">
              Overs Remaining
            </p>
            <div className="mx-auto grid max-w-lg grid-cols-4 gap-1.5 sm:gap-3">
              {countdown.map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-lg border border-primary/20 bg-background/80 py-1.5 text-center shadow-card"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-accent" />
                  <span className="block font-heading text-base font-black leading-none tabular-nums text-foreground sm:text-2xl">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[7px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[9px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HostingExpiryPopup;
