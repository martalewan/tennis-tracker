import { describe, expect, it } from "vitest";
import { getFinalScore, getMatchSummaryText } from "./matchSummary";

describe("match summary helpers", () => {
  it("formats completed set scores", () => {
    expect(
      getFinalScore([
        { you: 6, opponent: 4 },
        { you: 3, opponent: 6 },
        { you: 6, opponent: 2 },
      ]),
    ).toBe("6-4, 3-6, 6-2");
  });

  it("builds shareable match summary text", () => {
    expect(
      getMatchSummaryText({
        historyLength: 120,
        playerNames: {
          you: "Marta",
          opponent: "Iga",
        },
        pointsWon: 66,
        sets: [
          { you: 6, opponent: 4 },
          { you: 6, opponent: 2 },
        ],
        winner: "you",
      }),
    ).toBe(
      [
        "Tennis Tracker match summary",
        "Marta defeated Iga",
        "Final score: 6-4, 6-2",
        "Points: Marta 66, Iga 54",
      ].join("\n"),
    );
  });
});
