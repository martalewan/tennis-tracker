type ScoreTileProps = {
  games: number;
  label: string;
  onAddPoint: () => void;
  score: string;
  subtitle: string;
};

export default function ScoreTile({
  games,
  label,
  onAddPoint,
  score,
  subtitle,
}: ScoreTileProps) {
  return (
    <article className="grid min-h-[320px] grid-rows-[auto_minmax(0,1fr)_auto] gap-3 rounded-card border border-border bg-surface p-4 shadow-panel sm:min-h-[360px] lg:min-h-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-foreground">{label}</h3>
          <p className="mt-1 text-sm font-bold text-muted">{subtitle}</p>
        </div>
        <span className="rounded-card bg-primary-soft px-3 py-2 text-xs font-black uppercase text-primary">
          {games} games
        </span>
      </div>

      <strong className="self-center text-[clamp(4rem,16vw,7.2rem)] font-black leading-none text-foreground">
        {score}
      </strong>

      <button
        className="min-h-12 self-end rounded-card bg-primary px-5 font-black text-white transition hover:-translate-y-px hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-muted disabled:hover:translate-y-0"
        type="button"
        onClick={onAddPoint}
      >
        Add point
      </button>
    </article>
  );
}
