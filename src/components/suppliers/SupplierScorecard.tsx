import type { Supplier, SupplierScorecard } from '../../types';
import { getRiskColor, getRiskBg, getScoreColor, getScoreLabel, formatDefectRate, formatCurrency, getTrendIcon, getTrendColor } from '../../utils/riskCalculations';

interface ScorecardProps {
  supplier: Supplier;
  scorecard: SupplierScorecard;
}

function GaugeArc({ score, color }: { score: number; color: string }) {
  const r = 42;
  const cx = 56;
  const cy = 56;
  const startAngle = -210;
  const endAngle = 30;
  const totalDeg = endAngle - startAngle; // 240
  const fillDeg = (score / 100) * totalDeg;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const arcPath = (angle: number) => {
    const rad = toRad(angle);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const s = arcPath(startAngle);
  const eAngle = startAngle + fillDeg;
  const e = arcPath(eAngle);
  const large = fillDeg > 180 ? 1 : 0;
  const trackE = arcPath(endAngle);
  const tLarge = totalDeg > 180 ? 1 : 0;

  return (
    <svg width={112} height={80} viewBox="0 0 112 80">
      <path d={`M${s.x},${s.y} A${r},${r} 0 ${tLarge},1 ${trackE.x},${trackE.y}`} fill="none" stroke="#2C2C2E" strokeWidth={8} strokeLinecap="round" />
      {score > 0 && <path d={`M${s.x},${s.y} A${r},${r} 0 ${large},1 ${e.x},${e.y}`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" />}
      <text x={cx} y={cy + 8} textAnchor="middle" fill={color} fontSize={18} fontWeight={700} fontFamily="JetBrains Mono">{score}</text>
    </svg>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = getScoreColor(value);
  return (
    <div className="score-bar-row">
      <span className="score-bar-label">{label}</span>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="score-bar-val" style={{ color }}>{value}</span>
    </div>
  );
}

export function SupplierScorecardCard({ supplier, scorecard }: ScorecardProps) {
  const color = getRiskColor(scorecard.riskLevel);
  const bg = getRiskBg(scorecard.riskLevel);

  return (
    <div className="scorecard-card" style={{ borderColor: color }}>
      <div className="scorecard-header" style={{ background: bg }}>
        <div className="scorecard-header-left">
          <div className="scorecard-code">{supplier.code}</div>
          <div className="scorecard-name">{supplier.name}</div>
          <div className="scorecard-meta">{supplier.category} · {supplier.country}</div>
        </div>
        <div className="scorecard-gauge">
          <GaugeArc score={scorecard.overallScore} color={color} />
          <div className="gauge-label" style={{ color }}>{getScoreLabel(scorecard.overallScore)}</div>
        </div>
      </div>

      <div className="scorecard-body">
        <div className="scorecard-scores">
          <ScoreBar label="Quality" value={scorecard.qualityScore} />
          <ScoreBar label="Response" value={scorecard.responseScore} />
          <ScoreBar label="Volume" value={scorecard.volumeScore} />
        </div>

        <div className="scorecard-stats">
          <div className="stat-cell">
            <div className="stat-val">{scorecard.totalRMAs}</div>
            <div className="stat-key">Total RMAs</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val" style={{ color: scorecard.openRMAs > 0 ? '#FF9500' : '#30D158' }}>{scorecard.openRMAs}</div>
            <div className="stat-key">Open RMAs</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{formatDefectRate(scorecard.avgDefectRate)}</div>
            <div className="stat-key">Defect Rate</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val" style={{ color: getTrendColor(scorecard.defectRateTrend) }}>
              {getTrendIcon(scorecard.defectRateTrend)} {scorecard.defectRateTrend}
            </div>
            <div className="stat-key">DR Trend</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{scorecard.avgResolutionDays}d</div>
            <div className="stat-key">Avg Resolution</div>
          </div>
          <div className="stat-cell">
            <div className="stat-val">{formatCurrency(scorecard.totalFinancialImpact)}</div>
            <div className="stat-key">Financial Impact</div>
          </div>
        </div>

        <div className={`scorecard-risk-badge risk-${scorecard.riskLevel}`} style={{ background: bg, borderColor: color, color }}>
          ⚑ {scorecard.riskLevel.toUpperCase()} RISK
        </div>
      </div>
    </div>
  );
}
