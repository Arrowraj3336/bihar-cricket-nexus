import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tv, ChevronLeft, ChevronRight } from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "./CricketDecorations";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const ScoreboardNews = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("scoreboard_updates")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setUpdates(data);
    };
    load();
  }, []);

  // Auto-cycle every 4 seconds
  useEffect(() => {
    if (updates.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((p) => (p + 1) % updates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [updates.length]);

  const goNext = useCallback(() => setCurrent((p) => (p + 1) % updates.length), [updates.length]);
  const goPrev = useCallback(() => setCurrent((p) => (p - 1 + updates.length) % updates.length), [updates.length]);

  if (updates.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      <CricketBall className="absolute -top-6 right-8 w-24 h-24 text-primary opacity-[0.04]" />
      <CricketStumps className="absolute bottom-4 left-4 w-10 h-16 text-accent opacity-[0.05]" />

      <div className="container relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <Tv size={14} className="text-primary" />
            <span className="text-xs font-display font-semibold text-primary uppercase tracking-wider">
              League Updates
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Score<span className="text-gradient-gold">board</span>
          </h2>
        </motion.div>

        {/* Scoreboard Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Outer frame */}
          <div className="rounded-2xl border-2 border-border/80 overflow-hidden shadow-card bg-card">
            {/* Top bar - LED style */}
            <div className="bg-gradient-accent px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cricket-gold animate-pulse" />
                <span className="font-heading text-[11px] font-bold text-primary-foreground uppercase tracking-widest">
                  BRL Live
                </span>
              </div>
              <div className="flex items-center gap-1 text-primary-foreground/60 text-[10px] font-display">
                <span>{current + 1}</span>
                <span>/</span>
                <span>{updates.length}</span>
              </div>
            </div>

            {/* Scoreboard display area */}
            <div className="relative bg-secondary/60 min-h-[120px] md:min-h-[140px] flex items-center justify-center px-6 md:px-12 py-8">
              {/* Scan lines effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 2px, hsl(var(--foreground)) 3px)",
                }}
              />

              {/* Corner rivets */}
              {[
                "top-2 left-2",
                "top-2 right-2",
                "bottom-2 left-2",
                "bottom-2 right-2",
              ].map((pos) => (
                <div
                  key={pos}
                  className={`absolute ${pos} w-2 h-2 rounded-full bg-border`}
                />
              ))}

              {/* Navigation arrows */}
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 border border-border/60 flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={14} className="text-foreground" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-background/80 border border-border/60 flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={14} className="text-foreground" />
              </button>

              {/* News content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center max-w-lg"
                >
                  <p className="font-heading text-base md:text-xl font-bold leading-snug text-foreground">
                    {updates[current].message}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-display mt-3">
                    {format(new Date(updates[current].created_at), "dd MMM yyyy • hh:mm a")}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom bar - progress dots */}
            <div className="bg-gradient-to-t from-secondary to-card border-t border-border/30 px-4 py-2 flex items-center justify-center gap-1.5">
              {updates.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-primary w-4"
                      : "bg-border hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to update ${i + 1}`}
                />
              ))}
            </div>

            {/* Bottom accent strip */}
            <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ScoreboardNews;
