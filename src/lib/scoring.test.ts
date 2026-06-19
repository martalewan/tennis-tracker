import { describe, expect, it } from "vitest";
import {
  addPointToMatchScore,
  addPointToScore,
  getDisplayScore,
  getGameWinner,
  getMatchStatus,
  getSetsWon,
  getSetWinner,
  getWinRate,
  initialMatchScore,
  initialPoints,
  isGameOver,
  isSetOver,
} from "./scoring";

describe("scoring helpers", () => {
  it("adds a point to the selected player", () => {
    expect(addPointToScore(initialPoints, "you")).toEqual({
      you: 1,
      opponent: 0,
    });

    expect(addPointToScore({ you: 2, opponent: 1 }, "opponent")).toEqual({
      you: 2,
      opponent: 2,
    });
  });

  it("does not change the score after the game is over", () => {
    const finishedScore = { you: 5, opponent: 3 };

    expect(addPointToScore(finishedScore, "opponent")).toBe(finishedScore);
  });

  it("detects finished games", () => {
    expect(isGameOver({ you: 4, opponent: 2 })).toBe(true);
    expect(isGameOver({ you: 3, opponent: 5 })).toBe(true);
    expect(isGameOver({ you: 3, opponent: 3 })).toBe(false);
    expect(isGameOver({ you: 4, opponent: 3 })).toBe(false);
  });

  it("returns the game winner after a completed game", () => {
    expect(getGameWinner({ you: 4, opponent: 2 })).toBe("you");
    expect(getGameWinner({ you: 3, opponent: 5 })).toBe("opponent");
    expect(getGameWinner({ you: 4, opponent: 3 })).toBeUndefined();
  });

  it("increments games and resets points when a game ends", () => {
    expect(addPointToMatchScore(initialMatchScore, "you")).toEqual({
      points: { you: 1, opponent: 0 },
      games: { you: 0, opponent: 0 },
      sets: [],
    });

    expect(
      addPointToMatchScore(
        {
          points: { you: 3, opponent: 1 },
          games: { you: 2, opponent: 1 },
          sets: [],
        },
        "you",
      ),
    ).toEqual({
      points: { you: 0, opponent: 0 },
      games: { you: 3, opponent: 1 },
      sets: [],
    });
  });

  it("detects finished sets", () => {
    expect(isSetOver({ you: 6, opponent: 4 })).toBe(true);
    expect(isSetOver({ you: 6, opponent: 5 })).toBe(false);
    expect(isSetOver({ you: 7, opponent: 5 })).toBe(true);
    expect(getSetWinner({ you: 6, opponent: 4 })).toBe("you");
    expect(getSetWinner({ you: 5, opponent: 7 })).toBe("opponent");
    expect(getSetWinner({ you: 6, opponent: 5 })).toBeUndefined();
  });

  it("stores completed sets and resets games", () => {
    expect(
      addPointToMatchScore(
        {
          points: { you: 3, opponent: 0 },
          games: { you: 5, opponent: 4 },
          sets: [{ you: 6, opponent: 3 }],
        },
        "you",
      ),
    ).toEqual({
      points: { you: 0, opponent: 0 },
      games: { you: 0, opponent: 0 },
      sets: [
        { you: 6, opponent: 3 },
        { you: 6, opponent: 4 },
      ],
    });
  });

  it("counts sets won from completed set scores", () => {
    expect(getSetsWon([])).toEqual({ you: 0, opponent: 0 });
    expect(getSetsWon([{ you: 0, opponent: 6 }])).toEqual({
      you: 0,
      opponent: 1,
    });
    expect(
      getSetsWon([
        { you: 6, opponent: 4 },
        { you: 5, opponent: 7 },
        { you: 6, opponent: 3 },
      ]),
    ).toEqual({
      you: 2,
      opponent: 1,
    });
  });

  it("formats regular, deuce, advantage, and game scores", () => {
    expect(getDisplayScore({ you: 2, opponent: 1 }, "you")).toBe("30");
    expect(getDisplayScore({ you: 3, opponent: 3 }, "you")).toBe("40");
    expect(getDisplayScore({ you: 4, opponent: 3 }, "you")).toBe("Ad");
    expect(getDisplayScore({ you: 4, opponent: 3 }, "opponent")).toBe("40");
    expect(getDisplayScore({ you: 5, opponent: 3 }, "you")).toBe("Game");
    expect(getDisplayScore({ you: 5, opponent: 3 }, "opponent")).toBe("-");
  });

  it("returns helpful match status text", () => {
    expect(getMatchStatus(initialPoints)).toBe(
      "Level score. Build the point patiently.",
    );
    expect(getMatchStatus({ you: 3, opponent: 3 })).toBe(
      "Deuce pressure. Play one clean point.",
    );
    expect(getMatchStatus({ you: 4, opponent: 3 })).toBe(
      "Advantage you. Commit to the first ball.",
    );
    expect(getMatchStatus({ you: 5, opponent: 3 })).toBe(
      "You held the game. Reset to track the next one.",
    );
  });

  it("calculates a rounded win rate", () => {
    expect(getWinRate(0, 0)).toBe(0);
    expect(getWinRate(2, 3)).toBe(67);
    expect(getWinRate(3, 4)).toBe(75);
  });
});
