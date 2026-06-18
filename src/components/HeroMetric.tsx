type HeroMetricProps = {
  label: string;
  value: number | string;
};

export default function HeroMetric({ label, value }: HeroMetricProps) {
  return (
    <div className="rounded-card border border-white/15 bg-white/8 px-3 py-2.5">
      <span className="text-xs font-bold text-white/60">{label}</span>
      <strong className="block text-lg font-black leading-tight text-white">
        {value}
      </strong>
    </div>
  );
}
