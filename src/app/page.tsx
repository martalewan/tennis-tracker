"use client";

import { useMemo, useState } from "react";
import {
  addPointToScore,
  getDisplayScore,
  getMatchStatus,
  getWinRate,
  initialPoints,
  isGameOver,
  type Player,
  type PointRecord,
} from "@/lib/scoring";

const playerLabels: Record<Player, string> = {
  you: "You",
  opponent: "Opponent",
};

const playerSubtitles: Record<Player, string> = {
  you: "Baseline pressure",
  opponent: "Return rhythm",
};

export default function Home() {
  const [points, setPoints] = useState(initialPoints);
  const [history, setHistory] = useState<PointRecord[]>([]);

  const totalPoints = history.length;
  const pointsWon = history.filter((point) => point.winner === "you").length;
  const winRate = getWinRate(pointsWon, totalPoints);
  const latestPoint = history[0];
  const gameOver = isGameOver(points);

  const matchStatus = useMemo(() => getMatchStatus(points), [points]);

  function addPoint(winner: Player) {
    if (gameOver) {
      return;
    }

    setPoints((currentPoints) => addPointToScore(currentPoints, winner));
    setHistory((currentHistory) => [
      {
        id: Date.now(),
        winner,
        note: winner === "you" ? "Point won" : "Point lost",
      },
      ...currentHistory,
    ]);
  }

  function resetGame() {
    setPoints(initialPoints);
    setHistory([]);
  }

  return (
    <main className="mx-auto grid h-screen w-[min(var(--page-width),calc(100%_-_2rem))] grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden py-4 max-[980px]:h-auto max-[980px]:min-h-screen max-[980px]:overflow-visible max-sm:w-[calc(100%_-_1.5rem)]">
      <header className="grid gap-4 overflow-hidden rounded-card border border-primary bg-primary p-4 text-white shadow-panel md:grid-cols-[minmax(0,1fr)_320px]">
        <section className="grid content-between gap-4">
          <nav className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-extrabold uppercase text-accent-contrast">
              Tennis Tracker
            </p>
            <button
              className="min-h-10 rounded-card border border-white/15 px-4 text-sm font-bold text-white transition hover:-translate-y-px hover:bg-white/10"
              type="button"
              onClick={resetGame}
            >
              Reset session
            </button>
          </nav>

          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-bold text-white/60">
              Point-by-point focus board
            </p>
            <h1 className="text-[clamp(2.5rem,6vw,5.4rem)] font-black leading-[0.9] text-white">
              Own the next point.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
              Track the game, read the pressure moments, and keep one clean cue
              visible between rallies.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Points played" value={totalPoints} />
            <Metric label="Points won" value={pointsWon} />
            <Metric label="Win rate" value={`${winRate}%`} />
          </div>
        </section>

        <CourtPreview
          leadingPlayer={
            points.you === points.opponent
              ? "Level"
              : points.you > points.opponent
                ? "You lead"
                : "Opponent leads"
          }
          status={matchStatus}
        />
      </header>

      <section
        className="grid min-h-0 grid-cols-[minmax(0,1fr)_320px] gap-4 max-[980px]:grid-cols-1"
        aria-label="Tennis match tracker"
      >
        <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-3">
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

          <div className="grid min-h-0 grid-cols-2 gap-4 max-sm:grid-cols-1">
            {(["you", "opponent"] as Player[]).map((player) => (
              <ScoreTile
                isWinner={gameOver && points[player] > points[getOpponent(player)]}
                key={player}
                label={playerLabels[player]}
                onAddPoint={() => addPoint(player)}
                score={getDisplayScore(points, player)}
                subtitle={playerSubtitles[player]}
                disabled={gameOver}
              />
            ))}
          </div>
        </div>

        <aside className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
          <section className="rounded-card border border-border bg-surface p-4 shadow-panel">
            <p className="text-xs font-extrabold uppercase text-accent">Next cue</p>
            <p className="mt-3 text-xl font-black leading-7 text-foreground">
              {latestPoint?.winner === "opponent"
                ? "Reset early. Big target. Make them play."
                : "Stay forward. Keep margin. Trust the pattern."}
            </p>
          </section>

          <section className="min-h-0 rounded-card border border-border bg-surface p-4 shadow-panel">
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
              <ol className="mt-4 grid max-h-full gap-2 overflow-y-auto pr-1">
                {history.map((point, index) => (
                  <li
                    className="grid grid-cols-[38px_minmax(0,1fr)] gap-3 rounded-card border border-border-soft bg-surface-strong p-2.5"
                    key={point.id}
                  >
                    <span className="text-sm font-black text-accent">
                      {history.length - index}
                    </span>
                    <div>
                      <strong className="block text-sm text-foreground">
                        {point.note}
                      </strong>
                      <em className="text-sm not-italic text-muted">
                        {point.winner === "you" ? "Momentum up" : "Refocus"}
                      </em>
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
        </aside>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-card border border-white/10 bg-white/8 p-3">
      <span className="text-xs font-bold text-white/55">{label}</span>
      <strong className="mt-1 block text-2xl font-black text-white">{value}</strong>
    </div>
  );
}

function ScoreTile({
  disabled,
  isWinner,
  label,
  onAddPoint,
  score,
  subtitle,
}: {
  disabled: boolean;
  isWinner: boolean;
  label: string;
  onAddPoint: () => void;
  score: string;
  subtitle: string;
}) {
  return (
    <article className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 rounded-card border border-border bg-surface p-4 shadow-panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-foreground">{label}</h3>
          <p className="mt-1 text-sm font-bold text-muted">{subtitle}</p>
        </div>
        {isWinner && (
          <span className="rounded-card bg-accent-contrast px-3 py-2 text-xs font-black uppercase text-primary">
            Game
          </span>
        )}
      </div>

      <strong className="self-center text-[clamp(4.5rem,11vw,8rem)] font-black leading-none text-foreground">
        {score}
      </strong>

      <button
        className="min-h-12 self-end rounded-card bg-primary px-5 font-black text-white transition hover:-translate-y-px hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:hover:translate-y-0"
        disabled={disabled}
        type="button"
        onClick={onAddPoint}
      >
        Add point
      </button>
    </article>
  );
}

function CourtPreview({
  leadingPlayer,
  status,
}: {
  leadingPlayer: string;
  status: string;
}) {
  return (
    <aside className="grid min-h-[240px] overflow-hidden rounded-card bg-clay p-3">
      <div className="relative grid rounded-card border-2 border-white/75 bg-court p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]">
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/65" />
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/65" />
        <div className="absolute left-[18%] top-0 h-full w-0.5 bg-white/40" />
        <div className="absolute right-[18%] top-0 h-full w-0.5 bg-white/40" />
        <div className="absolute left-[18%] top-[31%] h-0.5 w-[64%] bg-white/55" />
        <div className="absolute left-[18%] bottom-[31%] h-0.5 w-[64%] bg-white/55" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="w-fit rounded-card bg-primary/55 px-2 py-1 text-xs font-black uppercase text-white/80">
              Court momentum
            </p>
            <strong className="mt-2 block text-3xl font-black leading-none text-white">
              {leadingPlayer}
            </strong>
          </div>

          <p className="max-w-[260px] rounded-card bg-white/90 p-3 text-sm font-black leading-5 text-primary">
            {status}
          </p>
        </div>
      </div>
    </aside>
  );
}

function getOpponent(player: Player): Player {
  return player === "you" ? "opponent" : "you";
}
