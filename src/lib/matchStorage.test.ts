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
      playerNames: {
        you: "Marta",
        opponent: "Alex",
      },
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

  it("adds default player names to older saved sessions", () => {
    expect(
      parseMatchSession(
        JSON.stringify({
          matchScore: {
            points: { you: 1, opponent: 0 },
            games: { you: 0, opponent: 0 },
            sets: [],
          },
          history: [],
        }),
      ),
    ).toEqual({
      matchScore: {
        points: { you: 1, opponent: 0 },
        games: { you: 0, opponent: 0 },
        sets: [],
      },
      history: [],
      playerNames: {
        you: "You",
        opponent: "Opponent",
      },
    });
  });
});
