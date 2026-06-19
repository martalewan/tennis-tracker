import { describe, expect, it } from "vitest";
import {
  initialMatchSession,
  parseMatchSession,
  serializeMatchSession,
  type MatchSession,
} from "./matchStorage";

describe("match storage helpers", () => {
  it("round-trips a saved match session", () => {
    const session: MatchSession = {
      matchScore: {
        points: { you: 2, opponent: 1 },
        games: { you: 4, opponent: 3 },
        sets: [{ you: 6, opponent: 4 }],
      },
      history: [
        {
          id: 1,
          winner: "you",
          note: "Point won",
        },
      ],
    };

    expect(parseMatchSession(serializeMatchSession(session))).toEqual(session);
  });

  it("falls back to a fresh session for missing or invalid storage", () => {
    expect(parseMatchSession(null)).toEqual(initialMatchSession);
    expect(parseMatchSession("not json")).toEqual(initialMatchSession);
    expect(parseMatchSession(JSON.stringify({ matchScore: null }))).toEqual(
      initialMatchSession,
    );
  });
});
