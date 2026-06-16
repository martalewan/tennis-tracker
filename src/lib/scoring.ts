export type Player = "you" | "opponent";

export type Score = Record<Player, number>;

export type PointRecord = {
  id: number;
  winner: Player;
  note: string;
};

export const pointLabels = ["0", "15", "30", "40", "Game"] as const;

export const initialPoints: Score = {
  you: 0,
  opponent: 0,
};

export function isGameOver(points: Score) {
  return points.you === 4 || points.opponent === 4;
}

export function addPointToScore(points: Score, winner: Player): Score {
  if (isGameOver(points)) {
    return points;
  }

  return {
    ...points,
    [winner]: Math.min(points[winner] + 1, 4),
  };
}

export function getMatchStatus(points: Score) {
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
}

export function getWinRate(pointsWon: number, totalPoints: number) {
  return totalPoints > 0 ? Math.round((pointsWon / totalPoints) * 100) : 0;
}
