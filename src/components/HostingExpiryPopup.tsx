import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PlugZap } from "lucide-react";
import noConnectionVideo from "@/assets/no-connection.webm.asset.json";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const EXPIRY_DATE = new Date("2026-09-02T00:00:00+05:30").getTime();

const getTimeLeft = () => {
  const remaining = Math.max(EXPIRY_DATE - Date.now(), 0);
  return {
    hours: Math.floor(remaining / 3_600_000),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
  };
};

const HostingExpiryPopup = () => {
  const [open, setOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => setTimeLeft(getTimeLeft()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = [
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-[65dvh] max-h-[calc(100dvh-2rem)] w-[65vw] max-w-[calc(100vw-2rem)] overflow-hidden border-primary/20 bg-background p-0 shadow-glow lg:h-[50dvh] lg:w-[50vw] [&>button]:right-3 [&>button]:top-3 [&>button]:z-30 [&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-primary/20 [&>button]:bg-background/90 [&>button]:text-foreground [&>button]:shadow-card [&>button]:backdrop-blur-md">
        <div className="relative flex h-full min-h-0 flex-col">
          <div className="relative min-h-0 flex-[1.2] overflow-hidden border-b border-primary/15 bg-muted">
            <video
              className="h-full w-full object-contain"
              src={noConnectionVideo.url}
              autoPlay
              loop
              muted
              playsInline
              aria-label="Animated disconnected power adapter"
            />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-background/80 to-transparent" />
          </div>

          <DialogHeader className="shrink-0 px-4 pb-3 pt-3 text-center sm:px-7 sm:pb-4">
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-1 flex items-center justify-center gap-1.5 text-primary"
            >
              <PlugZap className="h-3.5 w-3.5" />
              <span className="font-display text-[9px] font-bold uppercase tracking-widest sm:text-[10px]">Important service notice</span>
            </motion.div>
            <DialogTitle className="font-heading text-lg font-black uppercase leading-tight text-foreground sm:text-2xl">
              Hosting Plan Expiry
            </DialogTitle>
            <DialogDescription className="mx-auto mt-1.5 max-w-2xl font-display text-[10px] leading-relaxed text-muted-foreground sm:text-xs lg:text-sm">
              Our website hosting plan will expire on <strong className="font-bold text-primary">2 September 2026</strong>. To keep the Bihar Rural League website available without interruption, the service must be renewed before the countdown ends. Thank you for your attention and continued support.
            </DialogDescription>
          </DialogHeader>

          <div className="shrink-0 border-t border-primary/15 bg-secondary/70 px-3 py-2.5 backdrop-blur-md sm:px-7 sm:py-3">
            <p className="mb-1.5 text-center font-display text-[8px] font-bold uppercase tracking-widest text-muted-foreground sm:text-[9px]">
              Time remaining
            </p>
            <div className="mx-auto grid max-w-lg grid-cols-3 gap-1 sm:gap-3">
              {countdown.map((item, index) => (
                <div key={item.label} className="relative text-center">
                  {index > 0 && <span className="absolute -left-0.5 top-0 font-heading text-base text-primary/50 sm:-left-1 sm:text-xl">:</span>}
                  <span className="block font-heading text-lg font-black leading-none tabular-nums text-foreground sm:text-2xl">
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