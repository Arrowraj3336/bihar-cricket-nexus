import { useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { CricketBall, CricketStumps } from "./CricketDecorations";
import { Trophy, ChevronLeft, ChevronRight } from "lucide-react";

import logoLions from "@/assets/logos/darbhanga-lions.png";
import logoWarriors from "@/assets/logos/darbhanga-warriors.png";
import logoRoyals from "@/assets/logos/darbhanga-royals.png";
import logoTigers from "@/assets/logos/darbhanga-tigers.png";
import logoPanthers from "@/assets/logos/darbhanga-panthers.png";
import logoStrikers from "@/assets/logos/darbhanga-strikers.png";
import logoKings from "@/assets/logos/darbhanga-kings.png";
import logoChallengers from "@/assets/logos/darbhanga-challengers.png";
import logoFalcons from "@/assets/logos/darbhanga-falcons.png";
import logoHurricanes from "@/assets/logos/darbhanga-hurricanes.png";
import logoBlasters from "@/assets/logos/darbhanga-blasters.png";
import logoSuperXI from "@/assets/logos/darbhanga-super-xi.png";
import logoThunder from "@/assets/logos/darbhanga-thunder.png";
import logoGladiators from "@/assets/logos/darbhanga-gladiators.png";
import logoSuperGiants from "@/assets/logos/darbhanga-super-giants.png";
import logoMavericks from "@/assets/logos/darbhanga-mavericks.png";

const teams = [
  { name: "Darbhanga Lions", abbr: "DL", color: "hsl(265 60% 50%)", logo: logoLions, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Warriors", abbr: "DW", color: "hsl(25 100% 55%)", logo: logoWarriors, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Royals", abbr: "DR", color: "hsl(140 60% 40%)", logo: logoRoyals, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Tigers", abbr: "DT", color: "hsl(0 75% 50%)", logo: logoTigers, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Panthers", abbr: "DP", color: "hsl(200 80% 50%)", logo: logoPanthers, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Strikers", abbr: "DS", color: "hsl(45 100% 50%)", logo: logoStrikers, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Kings", abbr: "DK", color: "hsl(280 70% 45%)", logo: logoKings, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Challengers", abbr: "DC", color: "hsl(340 70% 50%)", logo: logoChallengers, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Falcons", abbr: "DF", color: "hsl(180 60% 45%)", logo: logoFalcons, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Hurricanes", abbr: "DH", color: "hsl(15 80% 50%)", logo: logoHurricanes, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Blasters", abbr: "DB", color: "hsl(50 90% 45%)", logo: logoBlasters, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Super XI", abbr: "DX", color: "hsl(120 50% 45%)", logo: logoSuperXI, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Thunder", abbr: "DTH", color: "hsl(210 70% 55%)", logo: logoThunder, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Gladiators", abbr: "DG", color: "hsl(300 50% 45%)", logo: logoGladiators, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Super Giants", abbr: "DSG", color: "hsl(30 70% 50%)", logo: logoSuperGiants, played: 0, won: 0, lost: 0, pts: 0 },
  { name: "Darbhanga Mavericks", abbr: "DM", color: "hsl(350 60% 50%)", logo: logoMavericks, played: 0, won: 0, lost: 0, pts: 0 },
];

const TEAMS_PER_PAGE = 4;
const totalPages = Math.ceil(teams.length / TEAMS_PER_PAGE);

const swipeConfidenceThreshold = 8000;
const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

const TeamBadge = ({ team, size = "card" }: { team: typeof teams[0]; size?: "card" | "table" }) => {
  if (team.logo) {
    const sizeClass = size === "card" ? "w-14 h-14 md:w-16 md:h-16" : "w-7 h-7";
    return <img src={team.logo} alt={team.name} className={`${sizeClass} object-contain rounded-lg`} />;
  }
  if (size === "table") {
    return (
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0"
        style={{ backgroundColor: team.color + "25", color: team.color }}
      >
        {team.abbr}
      </div>
    );
  }
  return (
    <div
      className="w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center font-heading font-bold text-base md:text-lg border-2 transition-transform group-hover:scale-110"
      style={{ borderColor: team.color, color: team.color, backgroundColor: team.color + "18" }}
    >
      {team.abbr}
    </div>
  );
};

const TeamsSection = () => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (dir: number) => {
    setDirection(dir);
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  const currentTeams = teams.slice(page * TEAMS_PER_PAGE, page * TEAMS_PER_PAGE + TEAMS_PER_PAGE);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <section id="teams" className="py-16 md:py-24 bg-background cricket-ball-pattern relative overflow-hidden">
      <CricketStumps className="absolute -right-4 top-20 w-16 h-24 text-primary hidden md:block" />
      <CricketBall className="absolute -left-6 bottom-32 w-16 h-16 text-accent opacity-30 hidden md:block" />

      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-3">
            <Trophy size={14} className="text-accent" />
            <span className="text-xs font-display font-semibold text-accent uppercase tracking-wider">Season Standings</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-2">
            Teams & <span className="text-gradient-primary">Points Table</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">All 16 teams competing for glory</p>
        </motion.div>

        {/* 2x2 Swipeable Team Grid */}
        <div className="mb-8 relative">
          <button
            onClick={() => paginate(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-secondary/80 backdrop-blur border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors -ml-1 md:hidden"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => paginate(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-secondary/80 backdrop-blur border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors -mr-1 md:hidden"
          >
            <ChevronRight size={16} />
          </button>

          <div className="overflow-hidden px-6 md:px-0">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.8}
                onDragEnd={handleDragEnd}
                className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 cursor-grab active:cursor-grabbing"
              >
                {currentTeams.map((team) => (
                  <div
                    key={team.abbr}
                    className="relative bg-gradient-card rounded-2xl p-4 md:p-5 border border-border hover:border-primary/40 transition-all duration-300 shadow-card group"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <TeamBadge team={team} size="card" />
                      <span className="font-heading text-xs md:text-sm font-semibold text-center leading-tight">
                        {team.name}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > page ? 1 : -1); setPage(i); }}
                className={`h-2 rounded-full transition-all ${i === page ? "bg-accent w-6" : "bg-border w-2"}`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
          <p className="text-center text-muted-foreground text-[10px] mt-2 md:hidden">← Swipe to see all teams →</p>
        </div>

        {/* Points Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-card rounded-2xl border border-border shadow-card overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Trophy size={16} className="text-accent" />
            <h3 className="font-heading text-sm md:text-base font-bold uppercase tracking-wider">Points Table</h3>
          </div>

          <div className="overflow-x-auto overflow-y-auto max-h-[500px] md:max-h-[600px] scrollbar-modern">
            <table className="w-full text-sm min-w-[400px]">
              <thead className="sticky top-0 z-10">
                <tr className="bg-secondary/90 backdrop-blur-sm border-b border-border">
                  <th className="text-left px-3 py-3 font-display font-semibold text-xs text-muted-foreground w-8">#</th>
                  <th className="text-left px-3 py-3 font-display font-semibold text-xs text-muted-foreground">Team</th>
                  <th className="px-2 py-3 font-display font-semibold text-xs text-muted-foreground text-center">P</th>
                  <th className="px-2 py-3 font-display font-semibold text-xs text-muted-foreground text-center">W</th>
                  <th className="px-2 py-3 font-display font-semibold text-xs text-muted-foreground text-center">L</th>
                  <th className="px-2 py-3 font-display font-semibold text-xs text-muted-foreground text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, i) => (
                  <tr
                    key={team.abbr}
                    className={`border-b border-border/40 hover:bg-primary/5 transition-colors ${i < 4 ? "bg-primary/[0.03]" : ""}`}
                  >
                    <td className="px-3 py-3">
                      <span className={`font-heading text-sm font-bold ${i < 4 ? "text-accent" : "text-muted-foreground"}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <TeamBadge team={team} size="table" />
                        <span className="font-medium text-xs whitespace-nowrap">{team.name}</span>
                      </div>
                    </td>
                    <td className="text-center px-2 py-3 text-xs text-muted-foreground">{team.played}</td>
                    <td className="text-center px-2 py-3 text-xs font-semibold text-cricket-green">{team.won}</td>
                    <td className="text-center px-2 py-3 text-xs font-semibold text-cricket-red">{team.lost}</td>
                    <td className="text-center px-2 py-3">
                      <span className="font-heading font-bold text-accent text-sm bg-accent/10 px-2 py-0.5 rounded-md">
                        {team.pts}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-2.5 border-t border-border flex items-center gap-2 text-[10px] text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span className="font-display">Top 4 qualify for playoffs</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamsSection;
