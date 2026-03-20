import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { KPICard } from './KPICard';
import type { DashboardKPIs } from '../../types';
import { formatCurrency, formatDefectRate, getRiskColor } from '../../utils/riskCalculations';
import { SCORECARDS, SUPPLIERS } from '../../services/dataService';

interface DashboardProps {
  kpis: DashboardKPIs;
  supplierDefectSummary: Array<{ name: string; fullName: string; defectRate: number; score: number; riskLevel: any }>;
  onNavigate: (view: 'suppliers' | 'alerts' | 'rma') => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="tooltip-label">{payload[0]?.payload?.fullName}</div>
      <div className="tooltip-row"><span>Defect Rate</span><span>{payload[0]?.value?.toFixed(3)}%</span></div>
      <div className="tooltip-row"><span>Score</span><span>{payload[0]?.payload?.score}</span></div>
    </div>
  );
};

export function Dashboard({ kpis, supplierDefectSummary, onNavigate }: DashboardProps) {
  const topRisk = [...SCORECARDS]
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 4);

  return (
    <div className="dashboard">
      {/* KPI Row */}
      <div className="kpi-grid">
        <KPICard label="Active Alerts" value={kpis.activeAlerts} accent="#FF3B30" sub="Require attention" trend="up" trendLabel="2 new today" trendGood="down" />
        <KPICard label="Open RMAs" value={kpis.openRMAs} accent="#FF9500" sub="Pending resolution" trend="neutral" trendLabel="stable" trendGood="down" />
        <KPICard label="Avg Defect Rate" value={formatDefectRate(kpis.avgDefectRate)} sub="Across all suppliers" trend="down" trendLabel="0.4% vs last month" trendGood="down" />
        <KPICard label="Financial Exposure" value={formatCurrency(kpis.totalFinancialImpact)} accent="#FF9500" sub="Total RMA impact YTD" trend="up" trendLabel="+$7.6k this week" trendGood="down" />
        <KPICard label="Critical Suppliers" value={kpis.criticalSuppliers} accent="#FF3B30" sub="Score below 40" />
        <KPICard label="Resolved This Month" value={kpis.resolvedThisMonth} accent="#30D158" sub="RMAs closed" trend="up" trendLabel="ahead of avg" trendGood="up" />
      </div>

      <div className="dashboard-panels">
        {/* Defect Rate by Supplier Chart */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Defect Rate by Supplier</span>
            <span className="panel-chip">Avg across all lots</span>
          </div>
          <div className="chart-wrap" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierDefectSummary} barSize={28} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#8E8E93', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <ReferenceLine y={3} stroke="#FFD60A" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'WARN 3%', position: 'insideTopRight', fill: '#FFD60A', fontSize: 10 }} />
                <ReferenceLine y={6} stroke="#FF3B30" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'CRIT 6%', position: 'insideTopRight', fill: '#FF3B30', fontSize: 10 }} />
                <Bar dataKey="defectRate" radius={[3, 3, 0, 0]}>
                  {supplierDefectSummary.map((entry, i) => (
                    <Cell key={i} fill={getRiskColor(entry.riskLevel)} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Risk Suppliers */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Top Risk Suppliers</span>
            <button className="panel-link" onClick={() => onNavigate('suppliers')}>View all →</button>
          </div>
          <div className="risk-list">
            {topRisk.map((sc) => {
              const sup = SUPPLIERS.find(s => s.id === sc.supplierId);
              const color = getRiskColor(sc.riskLevel);
              return (
                <div key={sc.supplierId} className="risk-row">
                  <div className="risk-row-left">
                    <div className="risk-indicator" style={{ background: color }} />
                    <div>
                      <div className="risk-name">{sup?.name}</div>
                      <div className="risk-meta">{sup?.category} · {sup?.country}</div>
                    </div>
                  </div>
                  <div className="risk-row-right">
                    <div className="risk-score" style={{ color }}>{sc.overallScore}</div>
                    <div className="risk-score-label">/ 100</div>
                  </div>
                  <div className="score-bar-track">
                    <div className="score-bar-fill" style={{ width: `${sc.overallScore}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Alerts Strip */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Recent Alerts</span>
          <button className="panel-link" onClick={() => onNavigate('alerts')}>Manage →</button>
        </div>
        <div className="alert-strip">
          {[
            { level: 'critical', msg: 'Regal Power Systems — defect rate 3× rolling average', time: '8d ago' },
            { level: 'high', msg: 'Shenzhen Apex — 3rd quality event in 90 days', time: '3d ago' },
            { level: 'critical', msg: 'PSU-48V ripple defect recurrence — CAPA ineffective', time: '2d ago' },
            { level: 'high', msg: 'IC-MCU-88 ESD damage — 87 units, $15,660 exposure', time: '12d ago' },
          ].map((a, i) => (
            <div key={i} className={`alert-strip-item level-${a.level}`}>
              <span className="strip-dot" />
              <span className="strip-msg">{a.msg}</span>
              <span className="strip-time">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
