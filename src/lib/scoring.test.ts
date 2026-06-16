import { describe, expect, it } from "vitest";
import {
  addPointToScore,
  getMatchStatus,
  getWinRate,
  initialPoints,
  isGameOver,
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
    const finishedScore = { you: 4, opponent: 2 };

    expect(addPointToScore(finishedScore, "opponent")).toBe(finishedScore);
  });

  it("detects finished games", () => {
    expect(isGameOver({ you: 4, opponent: 1 })).toBe(true);
    expect(isGameOver({ you: 2, opponent: 4 })).toBe(true);
    expect(isGameOver({ you: 3, opponent: 3 })).toBe(false);
  });

  it("returns helpful match status text", () => {
    expect(getMatchStatus(initialPoints)).toBe(
      "Level score. Build the point patiently.",
    );
    expect(getMatchStatus({ you: 3, opponent: 3 })).toBe(
      "Deuce pressure. Play one clean point.",
    );
    expect(getMatchStatus({ you: 4, opponent: 2 })).toBe(
      "You held the game. Reset to track the next one.",
    );
  });

  it("calculates a rounded win rate", () => {
    expect(getWinRate(0, 0)).toBe(0);
    expect(getWinRate(2, 3)).toBe(67);
    expect(getWinRate(3, 4)).toBe(75);
  });
});
