import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shield, Users, Zap, Target, Crosshair, Trophy, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getRosterBySlug, PlayerRole } from "@/lib/team-rosters";
import { teamLogoMap } from "@/lib/team-logos";
import { CricketBall, CricketBat, CricketStumps } from "@/components/CricketDecorations";
import TransparentLogoImage from "@/components/TransparentLogoImage";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const colorMap: Record<string, string> = {
  "Darbhanga Lions": "hsl(265 60% 50%)",
  "Darbhanga Warriors": "hsl(25 100% 55%)",
  "Darbhanga Royals": "hsl(140 60% 40%)",
  "Darbhanga Tigers": "hsl(0 75% 50%)",
  "Darbhanga Panthers": "hsl(200 80% 50%)",
  "Darbhanga Strikers": "hsl(45 100% 50%)",
  "Darbhanga Kings": "hsl(280 70% 45%)",
  "Darbhanga Challengers": "hsl(340 70% 50%)",
  "Darbhanga Falcons": "hsl(180 60% 45%)",
  "Darbhanga Hurricanes": "hsl(15 80% 50%)",
  "Darbhanga Blasters": "hsl(50 90% 45%)",
  "Darbhanga Super XI": "hsl(120 50% 45%)",
};

const roleIcon = (role: PlayerRole) => {
  switch (role) {
    case "Fast Bowler": return <Zap size={14} className="text-destructive" />;
    case "Spin Bowler": return <Target size={14} className="text-accent" />;
    case "Wicket Keeper": return <Shield size={14} className="text-cricket-green" />;
    case "Batsman": return <Crosshair size={14} className="text-cricket-gold" />;
    default: return <Users size={14} className="text-muted-foreground" />;
  }
};

const roleBadgeClass = (role: PlayerRole) => {
  switch (role) {
    case "Fast Bowler": return "bg-destructive/10 text-destructive border-destructive/20";
    case "Spin Bowler": return "bg-accent/10 text-accent border-accent/20";
    case "Wicket Keeper": return "bg-cricket-green/10 text-cricket-green border-cricket-green/20";
    case "Batsman": return "bg-cricket-gold/10 text-cricket-gold border-cricket-gold/20";
    default: return "bg-muted text-muted-foreground border-border";
  }
};

/* Floating cricket balls easter egg */
const FloatingBalls = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.08, 0.04, 0.08, 0],
          y: [0, -80, -160],
          x: [0, (i % 2 === 0 ? 20 : -20), (i % 2 === 0 ? -10 : 10)],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          delay: i * 3,
          ease: "easeInOut",
        }}
        style={{ left: `${10 + i * 15}%`, top: `${60 + (i % 3) * 15}%` }}
      >
        <CricketBall className="w-6 h-6 md:w-8 md:h-8 text-primary" />
      </motion.div>
    ))}
  </div>
);

/* Pitch lines background */
const PitchLines = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
    {/* Pitch rectangle */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 md:w-32 h-[80%] border-2 border-foreground rounded-sm" />
    {/* Crease lines */}
    <div className="absolute left-1/2 top-[15%] -translate-x-1/2 w-28 md:w-44 h-px bg-foreground" />
    <div className="absolute left-1/2 bottom-[15%] -translate-x-1/2 w-28 md:w-44 h-px bg-foreground" />
    {/* Center circle */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 md:w-64 h-40 md:h-64 border border-foreground rounded-full" />
  </div>
);

const TeamDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const roster = getRosterBySlug(slug || "");
  const [stats, setStats] = useState({ played: 0, won: 0, lost: 0, pts: 0 });
  const [matches, setMatches] = useState<{ id: string; team1: string; team2: string; match_date: string; match_time: string; location: string }[]>([]);

  useEffect(() => {
    if (!roster) return;
    const loadStats = async () => {
      const { data } = await supabase.from("points_table").select("*").eq("team_name", roster.teamName).single();
      if (data) setStats({ played: data.played, won: data.won, lost: data.lost, pts: data.points });
    };
    const loadMatches = async () => {
      const { data } = await supabase.from("upcoming_matches").select("*")
        .or(`team1.eq.${roster.teamName},team2.eq.${roster.teamName}`)
        .order("match_date", { ascending: true }).limit(5);
      if (data) setMatches(data);
    };
    loadStats();
    loadMatches();
  }, [roster]);

  if (!roster) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold mb-4">Team Not Found</h1>
            <Link to="/#teams" className="text-primary underline">← Back to Teams</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const teamColor = colorMap[roster.teamName] || "hsl(0 0% 50%)";
  const logo = teamLogoMap[roster.teamName] || "";
  const batsmen = roster.players.filter(p => p.role === "Batsman");
  const fastBowlers = roster.players.filter(p => p.role === "Fast Bowler");
  const spinBowlers = roster.players.filter(p => p.role === "Spin Bowler");
  const keepers = roster.players.filter(p => p.role === "Wicket Keeper");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-20 pb-14 md:pt-28 md:pb-20 overflow-hidden">
        {/* Multi-layer background */}
        <div className="absolute inset-0 cricket-ball-pattern opacity-30" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${teamColor}08 0%, transparent 40%, ${teamColor}05 70%, transparent 100%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 80% 20%, ${teamColor}0A 0%, transparent 60%)` }} />

        {/* Cricket decorations */}
        <CricketStumps className="absolute -right-4 top-20 w-20 h-32 text-primary opacity-10" />
        <CricketBall className="absolute -left-8 bottom-10 w-20 h-20 text-accent opacity-10" />
        <CricketBat className="absolute right-[15%] bottom-0 w-10 h-32 text-primary opacity-[0.06] rotate-[-20deg]" />
        <CricketBall className="absolute right-20 top-10 w-10 h-10 text-accent opacity-5" />
        <CricketBall className="absolute left-[30%] top-[15%] w-6 h-6 text-primary opacity-[0.04]" />

        <FloatingBalls />

        <div className="container relative z-10">
          <Link to="/#teams" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-sm font-medium group">
            <motion.span whileHover={{ x: -4 }} className="inline-flex"><ArrowLeft size={16} /></motion.span>
            Back to Teams
          </Link>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Big Team Logo with glowing effect */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: "spring" }}
              className="relative w-40 h-40 md:w-52 md:h-52 shrink-0">
              {/* Animated glow ring */}
              <motion.div
                className="absolute inset-[-12px] rounded-full opacity-20 blur-2xl"
                style={{ backgroundColor: teamColor }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Outer ring */}
              <div className="absolute inset-[-4px] rounded-full border-2 opacity-10" style={{ borderColor: teamColor }} />

              {logo ? (
                <TransparentLogoImage src={logo} alt={roster.teamName} className="w-full h-full object-contain relative z-10 drop-shadow-lg" />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center font-heading text-4xl font-bold border-4"
                  style={{ borderColor: teamColor, color: teamColor, backgroundColor: teamColor + "15" }}>
                  {roster.teamCode}
                </div>
              )}
            </motion.div>

            {/* Team Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center md:text-left flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border"
                style={{ borderColor: teamColor + "30", color: teamColor, backgroundColor: teamColor + "10" }}>
                <Shield size={12} /> Team {roster.teamCode}
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold mb-2">{roster.teamName}</h1>
              <p className="text-muted-foreground text-sm md:text-base italic max-w-md">"{roster.tagline}"</p>

              {/* Quick Stats with animated counters */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                {[
                  { label: "Played", value: stats.played, icon: <Trophy size={12} /> },
                  { label: "Won", value: stats.won, className: "text-cricket-green", icon: <Star size={12} /> },
                  { label: "Lost", value: stats.lost, className: "text-destructive" },
                  { label: "Points", value: stats.pts, className: "text-accent", icon: <Zap size={12} /> },
                ].map((s, i) => (
                  <motion.div key={s.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="bg-secondary/60 border border-border rounded-xl px-4 py-2.5 text-center min-w-[75px] hover:shadow-card transition-shadow"
                  >
                    <div className={`font-heading text-2xl font-bold ${s.className || ""}`}>{s.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-display flex items-center justify-center gap-1">
                      {s.icon} {s.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Squad Section — Scoreboard Style */}
      <section className="py-10 md:py-16 relative overflow-hidden">
        <PitchLines />
        <CricketStumps className="absolute -left-6 top-20 w-12 h-20 text-primary opacity-5 rotate-12" />
        <CricketBat className="absolute -right-4 bottom-20 w-8 h-28 text-accent opacity-[0.04] -rotate-12" />

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            {/* Section header with cricket flair */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 rounded-full bg-primary" />
                <Users size={20} className="text-accent" />
                <h2 className="font-heading text-2xl md:text-3xl font-bold">Squad Roster</h2>
              </div>
              <div className="hidden md:flex items-center gap-2 ml-4">
                <CricketBall className="w-4 h-4 text-primary opacity-30" />
                <CricketBall className="w-3 h-3 text-primary opacity-20" />
                <CricketBall className="w-2 h-2 text-primary opacity-10" />
              </div>
              <span className="ml-auto text-sm text-muted-foreground font-display bg-secondary/60 px-3 py-1 rounded-full border border-border">
                {roster.players.length} Players
              </span>
            </div>

            {/* Scoreboard-style table */}
            <div className="bg-gradient-card rounded-2xl border border-border shadow-card overflow-hidden">
              {/* Scoreboard header with red accent */}
              <div className="h-1 w-full bg-gradient-accent" />

              {/* Header row */}
              <div className="grid grid-cols-[40px_1fr_auto] md:grid-cols-[50px_1fr_140px_100px] items-center px-3 md:px-5 py-3 border-b border-border bg-secondary/80">
                <span className="font-display text-xs font-bold text-muted-foreground">#</span>
                <span className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider">Player</span>
                <span className="hidden md:block font-display text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">Role</span>
                <span className="font-display text-xs font-bold text-muted-foreground uppercase tracking-wider text-right md:text-center">Type</span>
              </div>

              {/* Player rows */}
              <AnimatePresence>
                {roster.players.map((player, i) => (
                  <motion.div
                    key={player.number}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ backgroundColor: "hsl(var(--primary) / 0.04)" }}
                    className={`grid grid-cols-[40px_1fr_auto] md:grid-cols-[50px_1fr_140px_100px] items-center px-3 md:px-5 py-3.5 border-b border-border/40 transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-secondary/20"}`}
                  >
                    {/* Jersey number */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-heading font-bold shadow-sm"
                      style={{ backgroundColor: teamColor + "15", color: teamColor, border: `1px solid ${teamColor}20` }}
                    >
                      {player.number}
                    </motion.div>

                    {/* Name */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm md:text-base">{player.name}</span>
                    </div>

                    {/* Role icon (desktop) */}
                    <div className="hidden md:flex items-center justify-center gap-2">
                      {roleIcon(player.role)}
                      <span className="text-xs text-muted-foreground">{player.role}</span>
                    </div>

                    {/* Role badge */}
                    <div className="flex justify-end md:justify-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-semibold border ${roleBadgeClass(player.role)}`}>
                        <span className="md:hidden">{roleIcon(player.role)}</span>
                        <span className="hidden md:inline">{player.role.split(" ")[0]}</span>
                        <span className="md:hidden">{player.role === "Wicket Keeper" ? "WK" : player.role === "Fast Bowler" ? "FAST" : player.role === "Spin Bowler" ? "SPIN" : "BAT"}</span>
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Footer with squad composition */}
              <div className="px-4 py-3 border-t border-border bg-secondary/40 flex flex-wrap gap-4 text-[10px] md:text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Crosshair size={12} className="text-cricket-gold" /> {batsmen.length} Batsmen</span>
                <span className="flex items-center gap-1.5"><Zap size={12} className="text-destructive" /> {fastBowlers.length} Fast</span>
                <span className="flex items-center gap-1.5"><Target size={12} className="text-accent" /> {spinBowlers.length} Spin</span>
                <span className="flex items-center gap-1.5"><Shield size={12} className="text-cricket-green" /> {keepers.length} WK</span>
                <span className="ml-auto flex items-center gap-1.5 opacity-50">
                  <CricketBall className="w-3 h-3 text-primary" /> BRL 2025
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Matches */}
      {matches.length > 0 && (
        <section className="py-10 md:py-16 bg-secondary/30 relative overflow-hidden">
          <CricketBall className="absolute right-10 bottom-10 w-16 h-16 text-accent opacity-5" />
          <CricketStumps className="absolute -left-8 top-[50%] w-16 h-24 text-primary opacity-[0.04] -rotate-6" />
          <CricketBat className="absolute right-[5%] top-10 w-8 h-28 text-accent opacity-[0.03] rotate-[15deg]" />

          <div className="container relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 rounded-full bg-accent" />
              <Crosshair size={20} className="text-accent" />
              <h2 className="font-heading text-2xl md:text-3xl font-bold">Match Schedule</h2>
            </div>

            <div className="grid gap-3">
              {matches.map((m, i) => {
                const opponent = m.team1 === roster.teamName ? m.team2 : m.team1;
                const opponentLogo = teamLogoMap[opponent] || "";
                return (
                  <motion.div key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ scale: 1.01, borderColor: teamColor + "40" }}
                    className="bg-gradient-card rounded-xl border border-border p-4 flex items-center gap-4 transition-all shadow-sm hover:shadow-card"
                  >
                    <div className="text-center shrink-0 w-16">
                      <div className="font-heading text-lg font-bold text-foreground">{new Date(m.match_date).toLocaleDateString("en-IN", { day: "numeric" })}</div>
                      <div className="text-[10px] uppercase text-muted-foreground font-display">{new Date(m.match_date).toLocaleDateString("en-IN", { month: "short" })}</div>
                    </div>
                    <div className="h-10 w-px bg-border" />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="font-medium text-sm text-muted-foreground">vs</span>
                      {opponentLogo && <TransparentLogoImage src={opponentLogo} alt={opponent} className="w-8 h-8 object-contain shrink-0" />}
                      <span className="font-heading text-sm font-semibold truncate">{opponent}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-medium text-foreground">{m.match_time}</div>
                      <div className="text-[10px] text-muted-foreground">{m.location}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Cricket easter egg footer section */}
      <section className="py-6 relative overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 text-muted-foreground/30"
          >
            <CricketBall className="w-4 h-4" />
            <CricketStumps className="w-4 h-6" />
            <CricketBat className="w-3 h-8" />
            <span className="text-[10px] uppercase tracking-widest font-display">Spirit of Cricket</span>
            <CricketBat className="w-3 h-8 -scale-x-100" />
            <CricketStumps className="w-4 h-6" />
            <CricketBall className="w-4 h-4" />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TeamDetail;
