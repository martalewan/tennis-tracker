"use client";

import { useMemo, useState } from "react";
import {
  getFinalScore,
  getMatchSummaryText,
} from "@/lib/matchSummary";
import type { Player, Score } from "@/lib/scoring";
import type { PlayerNames } from "@/lib/matchStorage";

type MatchCompleteCardProps = {
  historyLength: number;
  onNewMatch: () => void;
  playerNames: PlayerNames;
  pointsWon: number;
  sets: Score[];
  winner: Player;
};

export default function MatchCompleteCard({
  historyLength,
  onNewMatch,
  playerNames,
  pointsWon,
  sets,
  winner,
}: MatchCompleteCardProps) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const finalScore = getFinalScore(sets);
  const opponentPointsWon = historyLength - pointsWon;
  const summaryText = useMemo(
    () =>
      getMatchSummaryText({
        historyLength,
        playerNames,
        pointsWon,
        sets,
        winner,
      }),
    [historyLength, playerNames, pointsWon, sets, winner],
  );

  async function shareSummary() {
    setShareStatus(null);

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Tennis Tracker match summary",
          text: summaryText,
        });
        setShareStatus("Shared.");
        return;
      }

      await navigator.clipboard.writeText(summaryText);
      setShareStatus("Copied summary.");
    } catch {
      setShareStatus("Could not share. Try copying manually.");
    }
  }

  return (
    <section className="grid min-h-0 gap-4 rounded-card border border-border bg-surface p-5 shadow-panel sm:p-6 lg:grid-rows-[auto_minmax(0,1fr)_auto]">
      <div>
        <p className="text-xs font-extrabold uppercase text-accent">
          Match complete
        </p>
        <h2 className="mt-2 text-[clamp(2.35rem,7vw,4.5rem)] font-black leading-[0.9] text-foreground">
          {playerNames[winner]} wins.
        </h2>
      </div>

      <div className="grid content-center gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-card bg-primary-soft p-4">
            <p className="text-xs font-black uppercase text-primary/70">
              Final score
            </p>
            <strong className="mt-2 block text-2xl font-black text-primary">
              {finalScore}
            </strong>
          </div>
          <div className="rounded-card bg-surface-strong p-4">
            <p className="text-xs font-black uppercase text-muted">
              {playerNames.you}
            </p>
            <strong className="mt-2 block text-2xl font-black text-foreground">
              {pointsWon} pts
            </strong>
          </div>
          <div className="rounded-card bg-surface-strong p-4">
            <p className="text-xs font-black uppercase text-muted">
              {playerNames.opponent}
            </p>
            <strong className="mt-2 block text-2xl font-black text-foreground">
              {opponentPointsWon} pts
            </strong>
          </div>
        </div>

        <div className="rounded-card border border-border bg-background p-4">
          <p className="text-xs font-black uppercase text-muted">
            Share card
          </p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm font-bold leading-6 text-foreground">
            {summaryText}
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="min-h-12 rounded-card bg-primary px-5 text-sm font-black text-white transition hover:-translate-y-px hover:bg-primary-hover"
          type="button"
          onClick={shareSummary}
        >
          Share summary
        </button>
        <button
          className="min-h-12 rounded-card border border-border px-5 text-sm font-black text-foreground transition hover:-translate-y-px hover:bg-background"
          type="button"
          onClick={onNewMatch}
        >
          Start new match
        </button>
        {shareStatus && (
          <p className="text-sm font-bold text-muted" aria-live="polite">
            {shareStatus}
          </p>
        )}
      </div>
    </section>
  );
}
