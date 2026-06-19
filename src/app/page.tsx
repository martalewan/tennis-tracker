"use client";

import { useMemo } from "react";
import Scoreboard from "@/components/Scoreboard";
import TrackerHero from "@/components/TrackerHero";
import TrackerSidebar from "@/components/TrackerSidebar";
import useStoredMatchSession from "@/hooks/useStoredMatchSession";
import { defaultPlayerNames } from "@/lib/matchStorage";
import {
  addPointToMatchScore,
  getMatchScoreFromHistory,
  getMatchStatus,
  type Player,
} from "@/lib/scoring";

export default function Home() {
  const {
    history,
    matchScore,
    playerNames,
    resetSession,
    setHistory,
    setMatchScore,
    setPlayerNames,
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

  function undoLastPoint() {
    const nextHistory = history.slice(1);

    setHistory(nextHistory);
    setMatchScore(getMatchScoreFromHistory(nextHistory));
  }

  function updatePlayerName(player: Player, name: string) {
    setPlayerNames((currentNames) => ({
      ...currentNames,
      [player]: name,
    }));
  }

  function commitPlayerName(player: Player) {
    setPlayerNames((currentNames) => ({
      ...currentNames,
      [player]: currentNames[player].trim() || defaultPlayerNames[player],
    }));
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[1220px] flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:h-dvh lg:overflow-hidden">
      <TrackerHero
        games={games}
        hasHistory={history.length > 0}
        matchStatus={matchStatus}
        onUndo={undoLastPoint}
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
          onPlayerNameChange={updatePlayerName}
          onPlayerNameCommit={commitPlayerName}
          playerNames={playerNames}
          points={points}
          sets={sets}
        />
        <TrackerSidebar history={history} latestPoint={latestPoint} />
      </section>
    </main>
  );
}
