import { getSetsWon, type Score } from "@/lib/scoring";
import CourtPreview from "./CourtPreview";
import HeroMetric from "./HeroMetric";
import SetSummary from "./SetSummary";

type TrackerHeroProps = {
  games: Score;
  hasHistory: boolean;
  points: Score;
  pointsWon: number;
  sets: Score[];
  matchStatus: string;
  onReset: () => void;
  onUndo: () => void;
};

export default function TrackerHero({
  games,
  hasHistory,
  points,
  pointsWon,
  sets,
  matchStatus,
  onReset,
  onUndo,
}: TrackerHeroProps) {
  const setsWon = getSetsWon(sets);
  const leadingPlayer =
    points.you === points.opponent
      ? "Level"
      : points.you > points.opponent
        ? "You lead"
        : "Opponent leads";

  return (
    <header className="grid gap-4 rounded-card border border-primary bg-primary p-4 text-white shadow-panel sm:p-5 lg:h-[43dvh] lg:min-h-[330px] lg:max-h-[360px] lg:grid-cols-[minmax(0,1fr)_300px] lg:overflow-hidden">
      <section className="flex min-h-0 flex-col justify-between gap-3">
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-extrabold uppercase text-accent-contrast">
            Tennis Tracker
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              className="min-h-10 rounded-card border border-white/15 px-4 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0 disabled:hover:bg-transparent"
              type="button"
              onClick={onUndo}
              disabled={!hasHistory}
            >
              Undo point
            </button>
            <button
              className="min-h-10 rounded-card border border-white/15 px-4 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-white/10"
              type="button"
              onClick={onReset}
            >
              Reset session
            </button>
          </div>
        </nav>

        <div className="max-w-3xl">
          <p className="mb-2 text-sm font-bold text-white/60">
            Point-by-point focus board
          </p>
          <h1 className="max-w-[760px] text-[clamp(2.35rem,7vw,4rem)] font-black leading-[0.92] text-white">
            Own the next point.
          </h1>
          <p className="mt-2 max-w-[540px] text-sm leading-6 text-white/70">
            Track the game, read the pressure moments, and keep one clean cue
            visible between rallies.
          </p>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-3">
          <HeroMetric
            label="Current game"
            value={`${games.you}-${games.opponent}`}
          />
          <HeroMetric
            label="Sets won"
            value={`${setsWon.you}-${setsWon.opponent}`}
          />
          <HeroMetric label="Points won" value={pointsWon} />
        </div>
        <p className="text-xs font-bold text-white/60">
          Set scores: <SetSummary sets={sets} />
        </p>
      </section>

      <CourtPreview leadingPlayer={leadingPlayer} status={matchStatus} />
    </header>
  );
}
