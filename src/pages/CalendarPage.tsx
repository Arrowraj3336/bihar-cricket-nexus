import { SEASON_FIXTURES, SEASON_NAME, type Fixture } from "@/lib/season-fixtures";
import { CalendarDays, MapPin, Trophy } from "lucide-react";
import { CricketBall } from "@/components/CricketDecorations";

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00+05:30").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });

const rounds = Array.from(new Set(SEASON_FIXTURES.map((f) => f.round))).sort((a, b) => a - b);

const MatchRow = ({ f }: { f: Fixture }) => (
  <div className="relative overflow-hidden rounded-xl border border-primary/15 bg-card p-4 shadow-card">
    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-accent" />
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2 font-display text-[10px] uppercase tracking-widest text-muted-foreground">
        <CalendarDays className="h-3 w-3 text-primary" />
        {formatDate(f.date)} · {f.time}
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 font-display text-[9px] font-bold uppercase tracking-widest ${
          f.status === "completed"
            ? "bg-primary/10 text-primary"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {f.status}
      </span>
    </div>

    <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <span className="text-right font-heading text-sm font-bold text-foreground sm:text-base">{f.home}</span>
      <span className="rounded-full border border-primary/25 px-2 py-0.5 font-display text-[10px] font-black text-primary">VS</span>
      <span className="font-heading text-sm font-bold text-foreground sm:text-base">{f.away}</span>
    </div>

    {f.result ? (
      <div className="mt-3 rounded-lg bg-secondary/60 p-2.5 text-center">
        <p className="font-display text-xs text-foreground">
          {f.result.homeScore} — {f.result.awayScore}
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 font-display text-[11px] font-bold text-primary">
          <Trophy className="h-3 w-3" /> {f.result.winner} won by {f.result.margin}
        </p>
        <p className="font-display text-[10px] uppercase tracking-wider text-muted-foreground">
          POTM: {f.result.playerOfMatch}
        </p>
      </div>
    ) : (
      <p className="mt-3 text-center font-display text-[10px] uppercase tracking-widest text-muted-foreground">
        Result awaited
      </p>
    )}

    <p className="mt-2 flex items-center justify-center gap-1 font-display text-[10px] text-muted-foreground">
      <MapPin className="h-3 w-3" /> {f.venue}
    </p>
  </div>
);

const CalendarPage = () => (
  <div className="relative min-h-screen bg-background">
    <CricketBall className="pointer-events-none absolute right-6 top-24 h-40 w-40 text-primary opacity-[0.05]" />
    <div className="container relative z-10 py-14">
      <header className="text-center">
        <p className="font-display text-[10px] uppercase tracking-[0.3em] text-primary">{SEASON_NAME}</p>
        <h1 className="mt-2 font-heading text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
          Season <span className="text-gradient-primary">Calendar</span>
        </h1>
        <div className="mx-auto mt-3 h-[3px] w-28 rounded-full bg-gradient-accent" />
        <p className="mt-3 font-display text-sm text-muted-foreground">
          All {SEASON_FIXTURES.length} fixtures across {rounds.length} rounds, in date order.
        </p>
      </header>

      <div className="mt-10 space-y-10">
        {rounds.map((round) => {
          const matches = SEASON_FIXTURES.filter((f) => f.round === round).sort((a, b) =>
            a.date.localeCompare(b.date) || a.time.localeCompare(b.time)
          );
          return (
            <section key={round}>
              <h2 className="mb-4 flex items-center gap-3 font-heading text-lg font-black uppercase tracking-wide text-foreground">
                <span className="rounded-md bg-gradient-accent px-2.5 py-1 font-display text-[11px] text-primary-foreground">
                  Round {round}
                </span>
                <span className="h-px flex-1 bg-border" />
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((f) => (
                  <MatchRow key={f.id} f={f} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  </div>
);

export default CalendarPage;
