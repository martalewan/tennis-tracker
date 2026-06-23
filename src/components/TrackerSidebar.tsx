import type { PointRecord } from "@/lib/scoring";
import InstallAppPrompt from "./InstallAppPrompt";
import NextCueCard from "./NextCueCard";
import PointLog from "./PointLog";

type TrackerSidebarProps = {
  history: PointRecord[];
  latestPoint: PointRecord | undefined;
};

export default function TrackerSidebar({
  history,
  latestPoint,
}: TrackerSidebarProps) {
  return (
    <aside className="grid gap-4 lg:min-h-0 lg:grid-rows-[auto_auto_minmax(0,1fr)]">
      <InstallAppPrompt />
      <NextCueCard latestPoint={latestPoint} />
      <PointLog history={history} />
    </aside>
  );
}
