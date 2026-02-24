import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer } from "lucide-react";

const TARGET_DATE = new Date("2026-02-21T00:00:00+05:30").getTime();

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(TARGET_DATE - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  const blocks: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <section className="py-10 md:py-14 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.04] to-background" />
      
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-4">
            <Timer size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">
              Selection Trials Start
            </span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
            The Countdown is <span className="text-gradient-primary">ON</span>
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mb-8">
            21st February 2026 • Nagendrajha Stadium, Darbhanga
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
            {blocks.map((block, i) => (
              <motion.div
                key={block.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                {/* Glow behind */}
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-accent/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative w-[72px] h-[88px] sm:w-20 sm:h-24 md:w-28 md:h-32 bg-gradient-card rounded-xl sm:rounded-2xl border border-border flex flex-col items-center justify-center shadow-card overflow-hidden">
                  {/* Top shine */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                  
                  <span className="font-heading text-2xl sm:text-3xl md:text-5xl font-black text-gradient-primary leading-none">
                    {String(block.value).padStart(2, "0")}
                  </span>
                  <span className="font-display text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest mt-1">
                    {block.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Separator dots between blocks - decorative */}
          <div className="flex justify-center mt-4 gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-accent/40" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CountdownTimer;
