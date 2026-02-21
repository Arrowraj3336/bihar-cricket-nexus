import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Zap, Shield, Timer } from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "./CricketDecorations";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { teamLogoMap } from "@/lib/team-logos";

const TARGET_DATE = new Date("2026-02-26T00:00:00+05:30").getTime();

const UpcomingMatches = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [matches, setMatches] = useState<any[]>([]);

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

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("upcoming_matches").select("*").order("match_date", { ascending: true });
      if (data) setMatches(data);
    };
    load();
  }, []);

  const blocks = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <section id="matches" className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      <CricketBat className="absolute top-10 -left-6 w-10 h-32 text-accent opacity-[0.08] -rotate-12" />
      <CricketBall className="absolute bottom-20 -right-8 w-20 h-20 text-primary opacity-[0.08]" />
      <CricketStumps className="absolute top-1/3 -right-8 w-14 h-24 text-primary opacity-[0.06] hidden md:block" />

      <div className="container">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-3">
            <Zap size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">Live Schedule</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">
            Upcoming <span className="text-gradient-gold">Events</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">Don't miss the action</p>
        </motion.div>

        <div className="flex flex-col gap-6 max-w-2xl mx-auto">
          {/* Selection Trials Card */}
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group">
            <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-card shadow-card hover:shadow-glow transition-shadow duration-500">
              <div className="h-1.5 w-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary" />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,hsl(var(--background)/0.3)_20px,hsl(var(--background)/0.3)_22px)]" />
              </div>

              <CricketBall className="absolute -right-4 -bottom-4 w-20 h-20 text-primary opacity-[0.06]" />
              <CricketBat className="absolute -left-2 top-6 w-5 h-16 text-accent opacity-[0.07] rotate-[30deg]" />
              <CricketStumps className="absolute right-6 -top-1 w-7 h-10 text-accent opacity-[0.06]" />

              <div className="p-5 md:p-8 relative z-10">
                <div className="flex items-center justify-center mb-5">
                  <span className="bg-gradient-accent text-primary-foreground text-xs md:text-sm font-display font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-glow inline-flex items-center gap-2">
                    <Shield size={14} />
                    Selection Trials
                  </span>
                </div>

                <h3 className="font-heading text-xl md:text-2xl font-bold text-center mb-4">
                  Bihar Rural League <span className="text-accent">Selection Trials</span>
                </h3>

                <div className="mb-5">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <Timer size={13} className="text-accent" />
                    <span className="text-[10px] font-display font-semibold text-accent uppercase tracking-wider">Countdown to Trials</span>
                  </div>
                  <div className="flex justify-center gap-2 sm:gap-3">
                    {blocks.map((block, i) => (
                      <motion.div key={block.label} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                        className="w-14 h-16 sm:w-16 sm:h-[72px] bg-secondary/80 border border-border rounded-xl flex flex-col items-center justify-center">
                        <span className="font-heading text-lg sm:text-xl font-black text-gradient-primary leading-none">{String(block.value).padStart(2, "0")}</span>
                        <span className="font-display text-[8px] sm:text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">{block.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
                  <span className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-xl border border-border/50 text-xs md:text-sm">
                    <Calendar size={14} className="text-accent" /> 26 Feb, 2026
                  </span>
                  <span className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-xl border border-border/50 text-xs md:text-sm">
                    <Clock size={14} className="text-accent" /> 11:00 AM
                  </span>
                  <span className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-xl border border-border/50 text-xs md:text-sm">
                    <MapPin size={14} className="text-accent" /> Nagendrajha Stadium
                  </span>
                </div>
              </div>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
            </div>
          </motion.div>

        {/* Dynamic matches from DB */}
          {matches.map((match, i) => (
            <motion.div key={match.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-gradient-card shadow-card hover:shadow-glow transition-shadow duration-500">
                <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />

                <CricketBall className="absolute -right-4 -bottom-4 w-16 h-16 text-primary opacity-[0.05]" />
                <CricketStumps className="absolute right-4 -top-1 w-6 h-8 text-accent opacity-[0.05]" />

                <div className="p-5 md:p-7 relative z-10">
                  <div className="flex items-center justify-center mb-4">
                    <span className="bg-gradient-accent text-primary-foreground text-[10px] md:text-xs font-display font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-glow inline-flex items-center gap-1.5">
                      <Shield size={12} />
                      Match {i + 1}
                    </span>
                  </div>

                  {/* Team vs Team with logos */}
                  <div className="flex items-center justify-center gap-3 sm:gap-5 mb-5">
                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      {teamLogoMap[match.team1] ? (
                        <img src={teamLogoMap[match.team1]} alt={match.team1} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-xl" />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Shield size={20} className="text-primary" />
                        </div>
                      )}
                      <span className="font-heading text-xs sm:text-sm font-bold text-center leading-tight truncate w-full">{match.team1}</span>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      <span className="font-heading text-xl sm:text-2xl md:text-3xl font-black text-gradient-gold">VS</span>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                      {teamLogoMap[match.team2] ? (
                        <img src={teamLogoMap[match.team2]} alt={match.team2} className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain rounded-xl" />
                      ) : (
                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          <Shield size={20} className="text-primary" />
                        </div>
                      )}
                      <span className="font-heading text-xs sm:text-sm font-bold text-center leading-tight truncate w-full">{match.team2}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    <span className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-xl border border-border/50 text-xs md:text-sm">
                      <Calendar size={14} className="text-accent" /> {match.match_date}
                    </span>
                    <span className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-xl border border-border/50 text-xs md:text-sm">
                      <Clock size={14} className="text-accent" /> {match.match_time}
                    </span>
                    <span className="flex items-center gap-2 bg-secondary/80 backdrop-blur px-3 py-2 rounded-xl border border-border/50 text-xs md:text-sm">
                      <MapPin size={14} className="text-accent" /> {match.location}
                    </span>
                  </div>
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UpcomingMatches;
