import type { Player, PointRecord } from "@/lib/scoring";
import type { PlayerNames } from "@/lib/matchStorage";
import InstallAppPrompt from "./InstallAppPrompt";
import NextCueCard from "./NextCueCard";
import PointLog from "./PointLog";

type TrackerSidebarProps = {
  history: PointRecord[];
  latestPoint: PointRecord | undefined;
  onDeletePoint: (pointId: number) => void;
  onUpdatePointWinner: (pointId: number, winner: Player) => void;
  playerNames: PlayerNames;
};

export default function TrackerSidebar({
  history,
  latestPoint,
  onDeletePoint,
  onUpdatePointWinner,
  playerNames,
}: TrackerSidebarProps) {
  return (
    <aside className="grid gap-4 lg:min-h-0 lg:grid-rows-[auto_auto_minmax(0,1fr)]">
      <InstallAppPrompt />
      <NextCueCard latestPoint={latestPoint} />
      <PointLog
        history={history}
        onDeletePoint={onDeletePoint}
        onUpdatePointWinner={onUpdatePointWinner}
        playerNames={playerNames}
      />
    </aside>
  );
}
