import {
  defaultPlayerNames,
  type PlayerNames,
} from "@/lib/matchStorage";
import { getDisplayScore, type Player, type Score } from "@/lib/scoring";
import ScoreTile from "./ScoreTile";

const playerSubtitles: Record<Player, string> = {
  you: "Baseline pressure",
  opponent: "Return rhythm",
};

type ScoreboardProps = {
  games: Score;
  matchStatus: string;
  onAddPoint: (player: Player) => void;
  onPlayerNameChange: (player: Player, name: string) => void;
  onPlayerNameCommit: (player: Player) => void;
  playerNames: PlayerNames;
  points: Score;
  server: Player;
  sets: Score[];
};

export default function Scoreboard({
  games,
  matchStatus,
  onAddPoint,
  onPlayerNameChange,
  onPlayerNameCommit,
  playerNames,
  points,
  server,
  sets,
}: ScoreboardProps) {
  return (
    <div className="grid gap-3 lg:min-h-0 lg:grid-rows-[auto_minmax(0,1fr)]">
      <div className="flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Current Game
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <h2 className="text-2xl font-black text-foreground">Scoreboard</h2>
            <span className="rounded-card bg-primary-soft px-3 py-1.5 text-sm font-black text-primary">
              Set {sets.length + 1}: {games.you}-{games.opponent}
            </span>
          </div>
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
            label={playerNames[player] ?? defaultPlayerNames[player]}
            onChangeLabel={(name) => onPlayerNameChange(player, name)}
            onCommitLabel={() => onPlayerNameCommit(player)}
            onAddPoint={() => onAddPoint(player)}
            playerId={player}
            score={getDisplayScore(points, player)}
            isServing={server === player}
            subtitle={playerSubtitles[player]}
          />
        ))}
      </div>
    </div>
  );
}
