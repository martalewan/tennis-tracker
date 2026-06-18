import type { PointRecord } from "@/lib/scoring";

type NextCueCardProps = {
  latestPoint: PointRecord | undefined;
};

export default function NextCueCard({ latestPoint }: NextCueCardProps) {
  return (
    <section className="rounded-card border border-border bg-surface p-4 shadow-panel">
      <p className="text-xs font-extrabold uppercase text-accent">Next cue</p>
      <p className="mt-3 text-xl font-black leading-7 text-foreground">
        {latestPoint?.winner === "opponent"
          ? "Reset early. Big target. Make them play."
          : "Stay forward. Keep margin. Trust the pattern."}
      </p>
    </section>
  );
}
