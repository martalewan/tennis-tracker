import { getDisplayScore, type Player, type Score } from "@/lib/scoring";
import ScoreTile from "./ScoreTile";

const playerLabels: Record<Player, string> = {
  you: "You",
  opponent: "Opponent",
};

const playerSubtitles: Record<Player, string> = {
  you: "Baseline pressure",
  opponent: "Return rhythm",
};

type ScoreboardProps = {
  games: Score;
  matchStatus: string;
  onAddPoint: (player: Player) => void;
  points: Score;
};

export default function Scoreboard({
  games,
  matchStatus,
  onAddPoint,
  points,
}: ScoreboardProps) {
  return (
    <div className="grid gap-3 lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Current Game
          </p>
          <h2 className="text-2xl font-black text-foreground">Scoreboard</h2>
        </div>
        <p className="max-w-[440px] rounded-card bg-accent-soft px-4 py-2 text-sm font-bold leading-5 text-primary">
          {matchStatus}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:min-h-0">
        {(["you", "opponent"] as Player[]).map((player) => (
          <ScoreTile
            games={games[player]}
            key={player}
            label={playerLabels[player]}
            onAddPoint={() => onAddPoint(player)}
            score={getDisplayScore(points, player)}
            subtitle={playerSubtitles[player]}
          />
        ))}
      </div>
    </div>
  );
}
