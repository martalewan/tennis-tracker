"use client";

import { useMemo } from "react";
import Scoreboard from "@/components/Scoreboard";
import TrackerHero from "@/components/TrackerHero";
import TrackerSidebar from "@/components/TrackerSidebar";
import useStoredMatchSession from "@/hooks/useStoredMatchSession";
import {
  addPointToMatchScore,
  getMatchStatus,
  type Player,
} from "@/lib/scoring";

export default function Home() {
  const {
    history,
    matchScore,
    resetSession,
    setHistory,
    setMatchScore,
  } = useStoredMatchSession();

  const { games, points, sets } = matchScore;
  const pointsWon = history.filter((point) => point.winner === "you").length;
  const latestPoint = history[0];

  const matchStatus = useMemo(() => getMatchStatus(points), [points]);

  function addPoint(winner: Player) {
    setMatchScore((currentScore) => addPointToMatchScore(currentScore, winner));
    setHistory((currentHistory) => [
      {
        id: Date.now(),
        winner,
        note: winner === "you" ? "Point won" : "Point lost",
      },
      ...currentHistory,
    ]);
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1220px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:h-dvh lg:overflow-hidden">
      <TrackerHero
        games={games}
        matchStatus={matchStatus}
        onReset={resetSession}
        points={points}
        pointsWon={pointsWon}
        sets={sets}
      />

      <section
        className="grid flex-1 gap-4 lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_320px]"
        aria-label="Tennis match tracker"
      >
        <Scoreboard
          games={games}
          matchStatus={matchStatus}
          onAddPoint={addPoint}
          points={points}
          sets={sets}
        />
        <TrackerSidebar history={history} latestPoint={latestPoint} />
      </section>
    </main>
  );
}
