"use client";

import { useMemo } from "react";
import MatchSetupScreen from "@/components/MatchSetupScreen";
import Scoreboard from "@/components/Scoreboard";
import TrackerHero from "@/components/TrackerHero";
import TrackerSidebar from "@/components/TrackerSidebar";
import useStoredMatchSession from "@/hooks/useStoredMatchSession";
import { defaultPlayerNames } from "@/lib/matchStorage";
import {
  addPointToMatchScore,
  getMatchScoreFromHistory,
  getMatchStatus,
  initialMatchScore,
  type Player,
  type Score,
} from "@/lib/scoring";

function getOpponent(player: Player) {
  return player === "you" ? "opponent" : "you";
}

function didGameFinish(previousGames: Score, nextGames: Score) {
  return (
    nextGames.you !== previousGames.you
    || nextGames.opponent !== previousGames.opponent
    || ((previousGames.you > 0 || previousGames.opponent > 0)
      && nextGames.you === 0
      && nextGames.opponent === 0)
  );
}

export default function Home() {
  const {
    history,
    matchSetup,
    matchScore,
    playerNames,
    resetSession,
    setHistory,
    setMatchSetup,
    setMatchScore,
    setPlayerNames,
  } = useStoredMatchSession();

  const { games, points, sets } = matchScore;
  const pointsWon = history.filter((point) => point.winner === "you").length;
  const latestPoint = history[0];

  const matchStatus = useMemo(() => getMatchStatus(points), [points]);

  function addPoint(winner: Player) {
    const nextScore = addPointToMatchScore(matchScore, winner);

    setMatchScore(nextScore);
    if (didGameFinish(matchScore.games, nextScore.games)) {
      setMatchSetup((currentSetup) => ({
        ...currentSetup,
        currentServer: getOpponent(currentSetup.currentServer),
      }));
    }
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
    const nextScore = getMatchScoreFromHistory(nextHistory);

    setHistory(nextHistory);
    setMatchScore(nextScore);
    setMatchSetup((currentSetup) => ({
      ...currentSetup,
      currentServer:
        (nextScore.games.you + nextScore.games.opponent) % 2 === 0
          ? currentSetup.firstServer
          : getOpponent(currentSetup.firstServer),
    }));
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

  function updateFirstServer(player: Player) {
    setMatchSetup((currentSetup) => ({
      ...currentSetup,
      currentServer: player,
      firstServer: player,
    }));
  }

  function startMatch() {
    setMatchScore(initialMatchScore);
    setHistory([]);
    setMatchSetup((currentSetup) => ({
      ...currentSetup,
      currentServer: currentSetup.firstServer,
      isMatchStarted: true,
    }));
  }

  if (!matchSetup.isMatchStarted) {
    return (
      <MatchSetupScreen
        firstServer={matchSetup.firstServer}
        onPlayerNameChange={updatePlayerName}
        onPlayerNameCommit={commitPlayerName}
        onServerChange={updateFirstServer}
        onStartMatch={startMatch}
        playerNames={playerNames}
      />
    );
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
          server={matchSetup.currentServer}
          sets={sets}
        />
        <TrackerSidebar history={history} latestPoint={latestPoint} />
      </section>
    </main>
  );
}
