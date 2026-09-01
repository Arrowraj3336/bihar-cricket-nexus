import { TEAM_NAMES } from "./teams-list";

export type Fixture = {
  id: string;
  round: number;
  date: string; // ISO date
  time: string;
  venue: string;
  home: string;
  away: string;
  status: "completed" | "upcoming";
  result?: {
    homeScore: string;
    awayScore: string;
    winner: string;
    margin: string;
    playerOfMatch: string;
  };
};

export const SEASON_NAME = "BRL 2026";
export const SEASON_START = new Date("2026-03-15T00:00:00+05:30");
const VENUE = "Nagendrajha Stadium, Darbhanga";

/**
 * Round-robin schedule (circle method) for the 12 league teams.
 * 11 rounds x 6 matches = 66 league fixtures.
 */
function buildSchedule(): Fixture[] {
  const teams: string[] = [...TEAM_NAMES];
  const n = teams.length;
  const rounds = n - 1;
  const half = n / 2;
  const rotation = teams.slice(1);
  const fixtures: Fixture[] = [];

  for (let r = 0; r < rounds; r++) {
    const order = [teams[0], ...rotation];
    for (let i = 0; i < half; i++) {
      const a = order[i];
      const b = order[n - 1 - i];
      const home = (r + i) % 2 === 0 ? a : b;
      const away = home === a ? b : a;

      const date = new Date(SEASON_START);
      date.setDate(date.getDate() + r * 3 + Math.floor(i / 2));
      const time = i % 2 === 0 ? "10:00 AM" : "2:30 PM";

      fixtures.push({
        id: `r${r + 1}-m${i + 1}`,
        round: r + 1,
        date: date.toISOString().slice(0, 10),
        time,
        venue: VENUE,
        home,
        away,
        status: "upcoming",
      });
    }
    rotation.unshift(rotation.pop() as string);
  }

  return fixtures;
}

export const SEASON_FIXTURES: Fixture[] = buildSchedule();

export const getTeamFixtures = (teamName: string) =>
  SEASON_FIXTURES.filter((f) => f.home === teamName || f.away === teamName).sort(
    (a, b) => a.date.localeCompare(b.date)
  );

export const getTeamResults = (teamName: string) =>
  getTeamFixtures(teamName).filter((f) => f.status === "completed" && f.result);

export type TeamRecord = {
  played: number;
  won: number;
  lost: number;
  points: number;
};

/** Standings derived from completed results only. */
export const getTeamRecord = (teamName: string): TeamRecord => {
  const results = getTeamResults(teamName);
  const won = results.filter((f) => f.result?.winner === teamName).length;
  return {
    played: results.length,
    won,
    lost: results.length - won,
    points: won * 2,
  };
};
