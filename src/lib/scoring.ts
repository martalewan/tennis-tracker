export type Player = "you" | "opponent";

export type Score = Record<Player, number>;

export type PointRecord = {
  id: number;
  winner: Player;
  note: string;
};

export const pointLabels = ["0", "15", "30", "40"] as const;

export const initialPoints: Score = {
  you: 0,
  opponent: 0,
};

export function isGameOver(points: Score) {
  return Math.max(points.you, points.opponent) >= 4
    && Math.abs(points.you - points.opponent) >= 2;
}

export function addPointToScore(points: Score, winner: Player): Score {
  if (isGameOver(points)) {
    return points;
  }

  return {
    ...points,
    [winner]: points[winner] + 1,
  };
}

export function getDisplayScore(points: Score, player: Player) {
  if (isGameOver(points)) {
    return points[player] > points[getOpponent(player)] ? "Game" : "-";
  }

  if (points.you >= 3 && points.opponent >= 3) {
    if (points.you === points.opponent) {
      return "40";
    }

    return points[player] > points[getOpponent(player)] ? "Ad" : "40";
  }

  return pointLabels[points[player]];
}

export function getMatchStatus(points: Score) {
  if (isGameOver(points) && points.you > points.opponent) {
    return "You held the game. Reset to track the next one.";
  }

  if (isGameOver(points) && points.opponent > points.you) {
    return "Opponent took the game. Reset and fight for the next one.";
  }

  if (points.you >= 3 && points.opponent >= 3 && points.you === points.opponent) {
    return "Deuce pressure. Play one clean point.";
  }

  if (points.you >= 3 && points.opponent >= 3 && Math.abs(points.you - points.opponent) === 1) {
    return points.you > points.opponent
      ? "Advantage you. Commit to the first ball."
      : "Break point feeling. Breathe and make the return play.";
  }

  if (points.you > points.opponent) {
    return "You are ahead. Keep the pattern steady.";
  }

  if (points.opponent > points.you) {
    return "Down in the game. Pick a high-percentage target.";
  }

  return "Level score. Build the point patiently.";
}

export function getWinRate(pointsWon: number, totalPoints: number) {
  return totalPoints > 0 ? Math.round((pointsWon / totalPoints) * 100) : 0;
}

function getOpponent(player: Player) {
  return player === "you" ? "opponent" : "you";
}
