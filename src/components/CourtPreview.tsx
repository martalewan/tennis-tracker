type CourtPreviewProps = {
  leadingPlayer: string;
  status: string;
};

export default function CourtPreview({
  leadingPlayer,
  status,
}: CourtPreviewProps) {
  return (
    <aside className="grid min-h-[260px] overflow-hidden rounded-card bg-clay p-3 lg:min-h-0">
      <div className="relative grid min-h-0 rounded-card border-2 border-white/75 bg-court p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]">
        <div className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-white/65" />
        <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/65" />
        <div className="absolute left-[18%] top-0 h-full w-0.5 bg-white/40" />
        <div className="absolute right-[18%] top-0 h-full w-0.5 bg-white/40" />
        <div className="absolute left-[18%] top-[31%] h-0.5 w-[64%] bg-white/55" />
        <div className="absolute left-[18%] bottom-[31%] h-0.5 w-[64%] bg-white/55" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          <div>
            <p className="w-fit rounded-card bg-primary/55 px-2 py-1 text-xs font-black uppercase text-white/80">
              Court momentum
            </p>
            <strong className="mt-2 block text-3xl font-black leading-none text-white">
              {leadingPlayer}
            </strong>
          </div>

          <p className="max-w-[245px] rounded-card bg-white/90 p-3 text-sm font-black leading-5 text-primary">
            {status}
          </p>
        </div>
      </div>
    </aside>
  );
}
