interface KPICardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  trendGood?: 'up' | 'down'; // which direction is good
}

export function KPICard({ label, value, sub, accent, trend, trendLabel, trendGood }: KPICardProps) {
  const isGoodTrend = trend && trendGood && trend === trendGood;
  const isBadTrend = trend && trendGood && trend !== trendGood && trend !== 'neutral';

  return (
    <div className="kpi-card" style={accent ? { '--accent': accent } as React.CSSProperties : {}}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={accent ? { color: accent } : {}}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {trend && trendLabel && (
        <div className={`kpi-trend ${isGoodTrend ? 'good' : isBadTrend ? 'bad' : 'neutral'}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '→'} {trendLabel}
        </div>
      )}
    </div>
  );
}
