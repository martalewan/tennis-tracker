"use client";

import { useMemo } from "react";
import MatchCompleteCard from "@/components/MatchCompleteCard";
import MatchSetupScreen from "@/components/MatchSetupScreen";
import Scoreboard from "@/components/Scoreboard";
import TrackerHero from "@/components/TrackerHero";
import TrackerSidebar from "@/components/TrackerSidebar";
import useStoredMatchSession from "@/hooks/useStoredMatchSession";
import { defaultPlayerNames } from "@/lib/matchStorage";
import {
  addPointToMatchScore,
  getMatchWinner,
  getMatchScoreFromHistory,
  getMatchStatus,
  getTotalGamesPlayed,
  initialMatchScore,
  type MatchScore,
  type Player,
  type PointRecord,
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

function getServerFromScore(matchScore: MatchScore, firstServer: Player) {
  return getTotalGamesPlayed(matchScore) % 2 === 0
    ? firstServer
    : getOpponent(firstServer);
}

function getPointNote(winner: Player) {
  return winner === "you" ? "Point won" : "Point lost";
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
  const matchWinner = getMatchWinner(sets);

  const matchStatus = useMemo(() => {
    if (matchWinner) {
      return `${playerNames[matchWinner]} closed the match.`;
    }

    return getMatchStatus(points);
  }, [matchWinner, playerNames, points]);

  function addPoint(winner: Player) {
    if (matchWinner) {
      return;
    }

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
        note: getPointNote(winner),
      },
      ...currentHistory,
    ]);
  }

  function applyHistoryChange(nextHistory: PointRecord[]) {
    const nextScore = getMatchScoreFromHistory(nextHistory);

    setHistory(nextHistory);
    setMatchScore(nextScore);
    setMatchSetup((currentSetup) => ({
      ...currentSetup,
      currentServer: getServerFromScore(nextScore, currentSetup.firstServer),
    }));
  }

  function undoLastPoint() {
    applyHistoryChange(history.slice(1));
  }

  function updatePointWinner(pointId: number, winner: Player) {
    applyHistoryChange(
      history.map((point) =>
        point.id === pointId
          ? {
              ...point,
              note: getPointNote(winner),
              winner,
            }
          : point,
      ),
    );
  }

  function deletePoint(pointId: number) {
    applyHistoryChange(history.filter((point) => point.id !== pointId));
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
        {matchWinner ? (
          <MatchCompleteCard
            historyLength={history.length}
            onNewMatch={resetSession}
            playerNames={playerNames}
            pointsWon={pointsWon}
            sets={sets}
            winner={matchWinner}
          />
        ) : (
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
        )}
        <TrackerSidebar
          history={history}
          latestPoint={latestPoint}
          onDeletePoint={deletePoint}
          onUpdatePointWinner={updatePointWinner}
          playerNames={playerNames}
        />
      </section>
    </main>
  );
}
