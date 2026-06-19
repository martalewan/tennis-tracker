import type { Score } from "@/lib/scoring";

type SetSummaryProps = {
  sets: Score[];
};

export default function SetSummary({ sets }: SetSummaryProps) {
  if (sets.length === 0) {
    return <span>No completed sets</span>;
  }

  return (
    <span>
      {sets
        .map((set) => `${set.you}-${set.opponent}`)
        .join(", ")}
    </span>
  );
}
