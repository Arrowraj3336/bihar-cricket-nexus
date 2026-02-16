import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { Trophy, Target, Star, Flame } from "lucide-react";
import { CricketBall, CricketBat, CricketStumps } from "./CricketDecorations";
import playerImage from "@/assets/player-vector.png";

type Category = "orange" | "purple" | "mvp";

const categories: { key: Category; label: string; icon: typeof Trophy; color: string; bgColor: string }[] = [
  { key: "orange", label: "Orange Cap", icon: Trophy, color: "text-cricket-orange", bgColor: "bg-cricket-orange" },
  { key: "purple", label: "Purple Cap", icon: Target, color: "text-cricket-purple", bgColor: "bg-cricket-purple" },
  { key: "mvp", label: "Most Valuable", icon: Star, color: "text-cricket-gold", bgColor: "bg-cricket-gold" },
];

const performers = {
  orange: {
    name: "Rajesh Kumar",
    team: "Darbhanga Lions",
    stat: 487,
    statLabel: "Runs",
    details: [
      { label: "M", value: "10" },
      { label: "HS", value: "89*" },
      { label: "Avg", value: "54.11" },
      { label: "4/6's", value: "52/18" },
      { label: "SR", value: "148.3" },
    ],
  },
  purple: {
    name: "Mohammad Arif",
    team: "Darbhanga Tigers",
    stat: 18,
    statLabel: "Wickets",
    details: [
      { label: "M", value: "10" },
      { label: "Best", value: "4/22" },
      { label: "Avg", value: "14.2" },
      { label: "Econ", value: "6.8" },
      { label: "5W", value: "1" },
    ],
  },
  mvp: {
    name: "Rajesh Kumar",
    team: "Darbhanga Lions",
    stat: 820,
    statLabel: "Points",
    details: [
      { label: "M", value: "10" },
      { label: "Runs", value: "487" },
      { label: "Wkts", value: "5" },
      { label: "Ct", value: "8" },
      { label: "MoM", value: "4" },
    ],
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const TopPerformers = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const active = categories[activeIdx];
  const player = performers[active.key];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setActiveIdx((i) => (i + newDirection + categories.length) % categories.length);
  };

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <section id="performers" className="py-16 md:py-24 bg-background relative overflow-hidden">
      <CricketBall className="absolute -top-10 right-1/4 w-48 h-48 text-primary hidden md:block" />
      <CricketBall className="absolute bottom-0 left-10 w-32 h-32 text-accent" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-3">
            <Flame size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">Star Players</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold">
            Top <span className="text-gradient-gold">Performers</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-2">
            <CricketBat className="w-4 h-12 text-accent opacity-30" />
            <p className="text-muted-foreground text-sm md:text-base">The best of this season</p>
            <CricketBall className="w-5 h-5 text-primary opacity-30" />
          </div>
        </motion.div>

        {/* Swipeable card */}
        <div className="relative touch-pan-y">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={active.key}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              className="bg-gradient-card rounded-2xl border border-border shadow-card overflow-hidden cursor-grab active:cursor-grabbing"
            >
              <div className="flex flex-col md:flex-row">
                {/* Player image — transparent background */}
                <div className="relative w-full md:w-2/5 flex items-end justify-center p-6 pt-10 md:p-8 min-h-[280px] md:min-h-[380px]">
                  {/* Decorative rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[280px] md:h-[280px]">
                    <div className="absolute inset-0 rounded-full border-2 border-cricket-orange/20 animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-4 rounded-full border-2 border-cricket-purple/20 animate-[spin_15s_linear_infinite_reverse]" />
                    <div className="absolute inset-8 rounded-full border border-cricket-gold/15" />
                  </div>
                  <img
                    src={playerImage}
                    alt={player.name}
                    className="relative z-10 h-[220px] md:h-[320px] object-contain drop-shadow-2xl mix-blend-normal"
                    style={{ background: "transparent" }}
                  />
                </div>

                {/* Stats side */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                  {/* Category badge */}
                  <div className="inline-flex items-center gap-2 bg-secondary rounded-lg px-4 py-2 w-fit mb-4">
                    <active.icon size={16} className={active.color} />
                    <span className="font-heading text-sm font-semibold uppercase tracking-wider">{active.label}</span>
                  </div>

                  {/* Rank + Name */}
                  <div className="flex items-end gap-3 mb-1">
                    <span className="font-heading text-6xl md:text-8xl font-bold text-foreground/20 leading-none">1</span>
                    <div>
                      <p className="text-muted-foreground text-sm">{player.team}</p>
                      <h3 className="font-heading text-2xl md:text-4xl font-bold leading-tight">{player.name}</h3>
                    </div>
                  </div>

                  {/* Main stat */}
                  <div className="flex items-baseline gap-2 mt-3 mb-6">
                    <span className={`font-heading text-4xl md:text-5xl font-bold ${active.color}`}>{player.stat}</span>
                    <span className="text-muted-foreground text-base">{player.statLabel}</span>
                  </div>

                  {/* Stats table */}
                  <div className="border border-border/50 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-5 text-center">
                      {player.details.map((d, i) => (
                        <div key={i} className="border-b border-r border-border/50 px-2 py-2 last:border-r-0">
                          <span className="text-xs text-muted-foreground font-display font-semibold">{d.label}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-5 text-center">
                      {player.details.map((d, i) => (
                        <div key={i} className="border-r border-border/50 px-2 py-2 last:border-r-0">
                          <span className="text-sm font-display font-bold">{d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-accent text-primary-foreground font-heading font-semibold text-sm tracking-wider uppercase shadow-glow hover:opacity-90 transition-opacity">
                    Full Leaderboard
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Swipe hint + Category dots */}
        <p className="text-center text-muted-foreground text-xs mt-3 md:hidden">← Swipe to switch categories →</p>
        <div className="flex justify-center gap-2 mt-3">
          {categories.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => { setDirection(i > activeIdx ? 1 : -1); setActiveIdx(i); }}
              className={`h-2.5 rounded-full transition-all ${
                i === activeIdx ? `${cat.bgColor} w-8` : "bg-border w-2.5"
              }`}
              aria-label={cat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopPerformers;
