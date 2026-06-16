"use client";

import { useMemo, useState } from "react";

type Player = "you" | "opponent";

type PointRecord = {
  id: number;
  winner: Player;
  note: string;
};

const pointLabels = ["0", "15", "30", "40", "Game"];

const initialPoints = {
  you: 0,
  opponent: 0,
};

export default function Home() {
  const [points, setPoints] = useState(initialPoints);
  const [history, setHistory] = useState<PointRecord[]>([]);

  const totalPoints = history.length;
  const pointsWon = history.filter((point) => point.winner === "you").length;
  const winRate = totalPoints > 0 ? Math.round((pointsWon / totalPoints) * 100) : 0;

  const latestPoint = history[0];

  const matchStatus = useMemo(() => {
    if (points.you === 4) {
      return "You held the game. Reset to track the next one.";
    }

    if (points.opponent === 4) {
      return "Opponent took the game. Reset and fight for the next one.";
    }

    if (points.you === 3 && points.opponent === 3) {
      return "Deuce pressure. Play one clean point.";
    }

    if (points.you > points.opponent) {
      return "You are ahead. Keep the pattern steady.";
    }

    if (points.opponent > points.you) {
      return "Down in the game. Pick a high-percentage target.";
    }

    return "Level score. Build the point patiently.";
  }, [points]);

  function addPoint(winner: Player) {
    setPoints((currentPoints) => {
      if (currentPoints.you === 4 || currentPoints.opponent === 4) {
        return currentPoints;
      }

      return {
        ...currentPoints,
        [winner]: Math.min(currentPoints[winner] + 1, 4),
      };
    });

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
    <main className="mx-auto w-[min(var(--page-width),calc(100%_-_2rem))] py-12 max-sm:w-[calc(100%_-_1.5rem)] max-sm:py-8">
      <section className="mb-9 grid max-w-[760px] gap-3.5">
        <p className="text-xs font-extrabold uppercase text-accent">Tennis Tracker</p>
        <h1 className="max-w-[860px] text-[clamp(2.35rem,6vw,5rem)] leading-[0.98] text-foreground">
          Track every game with a calmer scoreboard.
        </h1>
        <p className="max-w-[620px] text-[1.08rem] leading-7 text-subtle">
          Log points, watch momentum, and keep your next tactical cue visible
          between rallies.
        </p>
      </section>

      <section
        className="grid grid-cols-[minmax(0,1fr)_340px] items-stretch gap-[18px] max-[860px]:grid-cols-1"
        aria-label="Tennis match tracker"
      >
        <div className="rounded-card border border-border bg-surface p-6 shadow-panel">
          <div className="mb-6 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <div>
              <p className="text-xs font-extrabold uppercase text-accent">Current Game</p>
              <h2 className="text-[1.45rem] text-foreground">Singles score</h2>
            </div>

            <button
              className="min-h-10 rounded-card bg-primary-soft px-4 font-extrabold text-primary transition hover:-translate-y-px"
              type="button"
              onClick={resetGame}
            >
              Reset
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3.5 max-sm:grid-cols-1">
            <article className="grid min-h-55 gap-[18px] rounded-card border border-border-soft bg-surface-strong p-5">
              <span className="text-sm font-bold text-muted">You</span>
              <strong className="text-[clamp(4rem,10vw,7rem)] leading-[0.9] text-foreground">
                {pointLabels[points.you]}
              </strong>
              <button
                className="min-h-12 self-end rounded-card bg-primary font-extrabold text-white transition hover:-translate-y-px hover:bg-primary-hover"
                type="button"
                onClick={() => addPoint("you")}
              >
                Add point
              </button>
            </article>

            <article className="grid min-h-55 gap-[18px] rounded-card border border-border-soft bg-surface-strong p-5">
              <span className="text-sm font-bold text-muted">Opponent</span>
              <strong className="text-[clamp(4rem,10vw,7rem)] leading-[0.9] text-foreground">
                {pointLabels[points.opponent]}
              </strong>
              <button
                className="min-h-12 self-end rounded-card bg-primary font-extrabold text-white transition hover:-translate-y-px hover:bg-primary-hover"
                type="button"
                onClick={() => addPoint("opponent")}
              >
                Add point
              </button>
            </article>
          </div>

          <p className="mt-[18px] rounded-card bg-accent-soft p-4 font-bold leading-6 text-primary">
            {matchStatus}
          </p>
        </div>

        <aside className="grid content-start gap-5 rounded-card border border-border bg-surface p-6 shadow-panel">
          <p className="text-xs font-extrabold uppercase text-accent">Session Stats</p>

          <div className="grid gap-3">
            <div className="flex min-h-16 items-center justify-between rounded-card border border-border-soft bg-surface-strong px-4">
              <span className="text-sm font-bold text-muted">Points played</span>
              <strong className="text-2xl text-foreground">{totalPoints}</strong>
            </div>
            <div className="flex min-h-16 items-center justify-between rounded-card border border-border-soft bg-surface-strong px-4">
              <span className="text-sm font-bold text-muted">Points won</span>
              <strong className="text-2xl text-foreground">{pointsWon}</strong>
            </div>
            <div className="flex min-h-16 items-center justify-between rounded-card border border-border-soft bg-surface-strong px-4">
              <span className="text-sm font-bold text-muted">Win rate</span>
              <strong className="text-2xl text-foreground">{winRate}%</strong>
            </div>
          </div>

          <div className="grid gap-2 rounded-card bg-primary p-4 text-white">
            <span className="text-sm font-bold text-accent-contrast">Next cue</span>
            <p className="leading-6">
              {latestPoint?.winner === "opponent"
                ? "Reset your feet early and choose a bigger target."
                : "Stay aggressive, but give yourself margin over the net."}
            </p>
          </div>
        </aside>
      </section>

      <section className="mt-[18px] grid gap-[18px] rounded-card border border-border bg-surface p-6 shadow-panel">
        <div>
          <p className="text-xs font-extrabold uppercase text-accent">Point Log</p>
          <h2 className="text-[1.45rem] text-foreground">Recent rallies</h2>
        </div>

        {history.length > 0 ? (
          <ol className="grid gap-2.5">
            {history.slice(0, 6).map((point, index) => (
              <li
                className="grid min-h-14 grid-cols-[52px_minmax(0,1fr)_auto] items-center gap-3.5 rounded-card border border-border-soft bg-surface-strong px-4 max-sm:grid-cols-1 max-sm:gap-1 max-sm:p-3.5"
                key={point.id}
              >
                <span className="text-sm font-bold text-muted">
                  #{history.length - index}
                </span>
                <strong className="text-foreground">{point.note}</strong>
                <em className="text-sm not-italic font-extrabold text-accent">
                  {point.winner === "you" ? "Momentum up" : "Refocus"}
                </em>
              </li>
            ))}
          </ol>
        ) : (
          <p className="leading-6 text-muted">
            Add the first point to start building your match story.
          </p>
        )}
      </section>
    </main>
  );
}
