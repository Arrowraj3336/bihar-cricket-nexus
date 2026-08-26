import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, PlugZap } from "lucide-react";
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
      <DialogContent className="h-[65vh] min-h-[540px] w-[92vw] max-w-none overflow-hidden border-primary/25 bg-background p-0 shadow-glow sm:w-[65vw] sm:min-w-[620px] [&>button]:right-4 [&>button]:top-4 [&>button]:z-30 [&>button]:flex [&>button]:h-10 [&>button]:w-10 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-primary/20 [&>button]:bg-background/80 [&>button]:text-foreground [&>button]:backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-accent" />
        <div className="absolute inset-0 cricket-ball-pattern opacity-60" />

        <div className="relative z-10 flex h-full flex-col">
          <DialogHeader className="px-6 pb-2 pt-7 text-center sm:px-10 sm:pt-8">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-2 flex items-center justify-center gap-2 text-primary"
            >
              <PlugZap className="h-4 w-4" />
              <span className="font-display text-xs font-bold uppercase tracking-widest">Service Notice</span>
            </motion.div>
            <DialogTitle className="font-heading text-2xl font-black uppercase text-foreground sm:text-3xl">
              Hosting Plan Expiry
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-xl font-display text-sm leading-relaxed text-muted-foreground sm:text-base">
              The website hosting plan is going to expire on <strong className="font-bold text-primary">2 September 2026</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-4">
            <motion.div
              className="absolute h-48 w-48 rounded-full bg-primary/10 blur-3xl sm:h-64 sm:w-64"
              animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.35, 0.7, 0.35] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative h-48 w-full max-w-md sm:h-56">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <motion.span
                  key={angle}
                  className="absolute left-1/2 top-[42%] h-1 w-12 origin-left bg-gradient-to-r from-primary/80 to-transparent"
                  style={{ rotate: angle }}
                  animate={{ scaleX: [0.25, 1, 0.4], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.18, ease: "easeOut" }}
                />
              ))}

              <motion.div
                className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 text-primary drop-shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
                animate={{ y: [-4, 5, -4], scale: [1, 1.04, 1] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Cloud className="h-24 w-32 fill-primary/10 stroke-[1.25] sm:h-32 sm:w-44" />
              </motion.div>

              <svg className="absolute inset-0 h-full w-full text-primary" viewBox="0 0 440 220" aria-hidden="true">
                <motion.path
                  d="M240 116 C286 128 304 160 344 158 C382 156 395 179 382 203"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="7 8"
                  animate={{ strokeDashoffset: [0, -30] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              <motion.div
                className="absolute bottom-0 right-[4%] rotate-[-12deg] text-primary sm:right-[8%]"
                animate={{ rotate: [-12, -8, -12], y: [0, -3, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlugZap className="h-14 w-14 fill-primary/10 stroke-[1.5] sm:h-16 sm:w-16" />
              </motion.div>
            </div>
          </div>

          <div className="border-t border-primary/15 bg-secondary/60 px-5 py-4 backdrop-blur-md sm:px-10 sm:py-5">
            <p className="mb-3 text-center font-display text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Time remaining
            </p>
            <div className="mx-auto grid max-w-lg grid-cols-3 gap-2 sm:gap-4">
              {countdown.map((item, index) => (
                <div key={item.label} className="relative text-center">
                  {index > 0 && <span className="absolute -left-1 top-2 font-heading text-xl text-primary/50 sm:-left-2 sm:text-2xl">:</span>}
                  <span className="block font-heading text-2xl font-black tabular-nums text-foreground sm:text-4xl">
                    {String(item.value).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[9px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-[11px]">
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