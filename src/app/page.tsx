"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

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
    <main className={styles.page}>
      <section className={styles.header}>
        <p className={styles.eyebrow}>Tennis Tracker</p>
        <h1>Track every game with a calmer scoreboard.</h1>
        <p className={styles.subtitle}>
          Log points, watch momentum, and keep your next tactical cue visible
          between rallies.
        </p>
      </section>

      <section className={styles.dashboard} aria-label="Tennis match tracker">
        <div className={styles.scorePanel}>
          <div className={styles.scoreHeader}>
            <div>
              <p className={styles.panelLabel}>Current Game</p>
              <h2>Singles score</h2>
            </div>

            <button className={styles.secondaryButton} type="button" onClick={resetGame}>
              Reset
            </button>
          </div>

          <div className={styles.scoreGrid}>
            <article className={styles.scoreCard}>
              <span>You</span>
              <strong>{pointLabels[points.you]}</strong>
              <button type="button" onClick={() => addPoint("you")}>
                Add point
              </button>
            </article>

            <article className={styles.scoreCard}>
              <span>Opponent</span>
              <strong>{pointLabels[points.opponent]}</strong>
              <button type="button" onClick={() => addPoint("opponent")}>
                Add point
              </button>
            </article>
          </div>

          <p className={styles.matchStatus}>{matchStatus}</p>
        </div>

        <aside className={styles.statsPanel}>
          <p className={styles.panelLabel}>Session Stats</p>

          <div className={styles.statList}>
            <div>
              <span>Points played</span>
              <strong>{totalPoints}</strong>
            </div>
            <div>
              <span>Points won</span>
              <strong>{pointsWon}</strong>
            </div>
            <div>
              <span>Win rate</span>
              <strong>{winRate}%</strong>
            </div>
          </div>

          <div className={styles.coachNote}>
            <span>Next cue</span>
            <p>
              {latestPoint?.winner === "opponent"
                ? "Reset your feet early and choose a bigger target."
                : "Stay aggressive, but give yourself margin over the net."}
            </p>
          </div>
        </aside>
      </section>

      <section className={styles.historySection}>
        <div>
          <p className={styles.panelLabel}>Point Log</p>
          <h2>Recent rallies</h2>
        </div>

        {history.length > 0 ? (
          <ol className={styles.historyList}>
            {history.slice(0, 6).map((point, index) => (
              <li key={point.id}>
                <span>#{history.length - index}</span>
                <strong>{point.note}</strong>
                <em>{point.winner === "you" ? "Momentum up" : "Refocus"}</em>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.emptyState}>
            Add the first point to start building your match story.
          </p>
        )}
      </section>
    </main>
  );
}
