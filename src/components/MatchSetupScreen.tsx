import {
  defaultPlayerNames,
  type PlayerNames,
} from "@/lib/matchStorage";
import type { Player } from "@/lib/scoring";

const playerOptions: Player[] = ["you", "opponent"];

type MatchSetupScreenProps = {
  firstServer: Player;
  onPlayerNameChange: (player: Player, name: string) => void;
  onPlayerNameCommit: (player: Player) => void;
  onServerChange: (player: Player) => void;
  onStartMatch: () => void;
  playerNames: PlayerNames;
};

export default function MatchSetupScreen({
  firstServer,
  onPlayerNameChange,
  onPlayerNameCommit,
  onServerChange,
  onStartMatch,
  playerNames,
}: MatchSetupScreenProps) {
  return (
    <main className="mx-auto grid min-h-dvh w-full max-w-[980px] place-items-center px-3 py-3 sm:px-5 sm:py-4">
      <section className="grid w-full gap-6 rounded-card border border-border bg-surface p-5 shadow-panel sm:p-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase text-accent">
            Match setup
          </p>
          <h1 className="mt-3 text-[clamp(2.5rem,8vw,5rem)] font-black leading-[0.9] text-foreground">
            Start the match.
          </h1>
          <p className="mt-4 max-w-[540px] text-sm leading-6 text-muted">
            Add player names, choose who serves first, then keep the tracker
            focused on every point.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {playerOptions.map((player) => (
              <label
                className="grid gap-2 text-sm font-bold text-subtle"
                key={player}
                htmlFor={`setup-name-${player}`}
              >
                {player === "you" ? "Player 1" : "Player 2"}
                <input
                  id={`setup-name-${player}`}
                  className="min-h-12 rounded-card border border-border bg-surface-strong px-4 text-base font-black text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-soft"
                  maxLength={24}
                  value={playerNames[player] ?? defaultPlayerNames[player]}
                  onBlur={() => onPlayerNameCommit(player)}
                  onChange={(event) =>
                    onPlayerNameChange(player, event.target.value)
                  }
                />
              </label>
            ))}
          </div>
        </div>

        <aside className="grid content-between gap-5 rounded-card bg-primary p-4 text-white">
          <div>
            <p className="text-xs font-extrabold uppercase text-accent-contrast">
              First server
            </p>
            <div className="mt-4 grid gap-2">
              {playerOptions.map((player) => {
                const isSelected = firstServer === player;
                const label = playerNames[player] || defaultPlayerNames[player];

                return (
                  <button
                    className={`min-h-12 rounded-card border px-4 text-left text-sm font-black transition ${
                      isSelected
                        ? "border-accent-contrast bg-accent-contrast text-primary"
                        : "border-white/15 text-white hover:bg-white/10"
                    }`}
                    type="button"
                    key={player}
                    onClick={() => onServerChange(player)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            className="min-h-12 rounded-card bg-white px-5 text-sm font-black text-primary transition hover:-translate-y-px hover:bg-accent-contrast"
            type="button"
            onClick={onStartMatch}
          >
            Start match
          </button>
        </aside>
      </section>
    </main>
  );
}
