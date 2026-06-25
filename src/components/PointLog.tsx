import type { Player, PointRecord } from "@/lib/scoring";
import type { PlayerNames } from "@/lib/matchStorage";

type PointLogProps = {
  history: PointRecord[];
  onDeletePoint: (pointId: number) => void;
  onUpdatePointWinner: (pointId: number, winner: Player) => void;
  playerNames: PlayerNames;
};

export default function PointLog({
  history,
  onDeletePoint,
  onUpdatePointWinner,
  playerNames,
}: PointLogProps) {
  return (
    <section className="flex min-h-[220px] flex-col rounded-card border border-border bg-surface p-4 shadow-panel lg:min-h-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">
            Point Log
          </p>
          <h2 className="text-2xl font-black text-foreground">Rallies</h2>
        </div>
        <span className="rounded-card bg-primary-soft px-3 py-2 text-sm font-black text-primary">
          {history.length}
        </span>
      </div>

      {history.length > 0 ? (
        <ol className="mt-4 grid min-h-0 flex-1 gap-2 overflow-y-auto pr-1">
          {history.map((point, index) => (
            <li
              className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 rounded-card border border-border-soft bg-surface-strong p-2.5"
              key={point.id}
            >
              <span className="text-sm font-black text-accent">
                {history.length - index}
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-sm text-foreground">
                  {point.note}
                </strong>
                <em className="text-sm not-italic text-muted">
                  {point.winner === "you" ? "Momentum up" : "Refocus"}
                </em>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
                  {(["you", "opponent"] as Player[]).map((player) => {
                    const isSelected = point.winner === player;

                    return (
                      <button
                        className={`min-h-8 rounded-card border px-2 text-xs font-black transition ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-border bg-surface text-muted hover:border-primary hover:text-primary"
                        }`}
                        type="button"
                        key={player}
                        onClick={() => onUpdatePointWinner(point.id, player)}
                        aria-pressed={isSelected}
                      >
                        {playerNames[player]}
                      </button>
                    );
                  })}
                  <button
                    className="min-h-8 rounded-card border border-border bg-surface px-2 text-xs font-black text-accent transition hover:border-accent hover:bg-accent-soft"
                    type="button"
                    onClick={() => onDeletePoint(point.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-5 leading-6 text-muted">
          Add the first point to start building your match story.
        </p>
      )}
    </section>
  );
}
