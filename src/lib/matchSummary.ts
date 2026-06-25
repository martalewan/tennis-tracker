import type { PlayerNames } from "./matchStorage";
import type { Player, Score } from "./scoring";

type MatchSummaryParams = {
  historyLength: number;
  playerNames: PlayerNames;
  pointsWon: number;
  sets: Score[];
  winner: Player;
};

export function getFinalScore(sets: Score[]) {
  return sets.map((set) => `${set.you}-${set.opponent}`).join(", ");
}

export function getMatchSummaryText({
  historyLength,
  playerNames,
  pointsWon,
  sets,
  winner,
}: MatchSummaryParams) {
  const opponentPointsWon = historyLength - pointsWon;
  const finalScore = getFinalScore(sets);

  return [
    "Tennis Tracker match summary",
    `${playerNames[winner]} defeated ${playerNames[getOpponent(winner)]}`,
    `Final score: ${finalScore}`,
    `Points: ${playerNames.you} ${pointsWon}, ${playerNames.opponent} ${opponentPointsWon}`,
  ].join("\n");
}

function getOpponent(player: Player) {
  return player === "you" ? "opponent" : "you";
}
