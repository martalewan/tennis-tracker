import {
  initialMatchScore,
  type MatchScore,
  type Player,
  type PointRecord,
  type Score,
} from "./scoring";

export const MATCH_SESSION_STORAGE_KEY = "tennis-tracker:match-session";

export type MatchSession = {
  matchScore: MatchScore;
  history: PointRecord[];
};

export const initialMatchSession: MatchSession = {
  matchScore: initialMatchScore,
  history: [],
};

export function serializeMatchSession(session: MatchSession) {
  return JSON.stringify(session);
}

export function parseMatchSession(value: string | null): MatchSession {
  if (!value) {
    return initialMatchSession;
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (isMatchSession(parsed)) {
      return parsed;
    }
  } catch {
    return initialMatchSession;
  }

  return initialMatchSession;
}

function isMatchSession(value: unknown): value is MatchSession {
  if (!isObject(value)) {
    return false;
  }

  return isMatchScore(value.matchScore) && isPointHistory(value.history);
}

function isMatchScore(value: unknown): value is MatchScore {
  if (!isObject(value)) {
    return false;
  }

  return (
    isScore(value.points)
    && isScore(value.games)
    && Array.isArray(value.sets)
    && value.sets.every(isScore)
  );
}

function isScore(value: unknown): value is Score {
  if (!isObject(value)) {
    return false;
  }

  return isScoreValue(value.you) && isScoreValue(value.opponent);
}

function isPointHistory(value: unknown): value is PointRecord[] {
  return Array.isArray(value) && value.every(isPointRecord);
}

function isPointRecord(value: unknown): value is PointRecord {
  if (!isObject(value)) {
    return false;
  }

  return (
    isScoreValue(value.id)
    && isPlayer(value.winner)
    && typeof value.note === "string"
  );
}

function isPlayer(value: unknown): value is Player {
  return value === "you" || value === "opponent";
}

function isScoreValue(value: unknown) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
