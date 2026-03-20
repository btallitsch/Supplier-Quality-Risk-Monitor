import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import type { BatchAnalysis } from '../../types';
import { SUPPLIERS } from '../../services/dataService';
import { formatDefectRate } from '../../utils/riskCalculations';

interface BatchViewProps {
  batches: BatchAnalysis[];
}

export function BatchView({ batches }: BatchViewProps) {
  const chartData = batches.map(b => {
    const sup = SUPPLIERS.find(s => s.id === b.supplierId);
    return {
      label: `${sup?.code} ${b.batchId}`,
      supplier: sup?.name ?? '',
      defectRate: parseFloat((b.defectRate * 100).toFixed(3)),
      anomalyScore: parseFloat((b.anomalyScore * 100).toFixed(1)),
      isAnomaly: b.isAnomaly,
      batchId: b.batchId,
      partNumbers: b.partNumbers.join(', '),
    };
  });

  const anomalies = batches.filter(b => b.isAnomaly);

  return (
    <div className="batch-view">
      <div className="batch-summary-bar">
        <div className="rma-stat">
          <span className="rma-stat-val" style={{ color: '#FF9500' }}>{anomalies.length}</span>
          <span className="rma-stat-key">Anomalous Batches</span>
        </div>
        <div className="rma-stat">
          <span className="rma-stat-val">{batches.length}</span>
          <span className="rma-stat-key">Total Batches</span>
        </div>
        <div className="rma-stat">
          <span className="rma-stat-val" style={{ color: '#FF3B30' }}>
            {formatDefectRate(Math.max(...batches.map(b => b.defectRate)))}
          </span>
          <span className="rma-stat-key">Worst Batch Rate</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Defect Rate by Batch</span>
          <span className="panel-chip">Anomalies highlighted</span>
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barSize={32} margin={{ top: 8, right: 16, left: -10, bottom: 40 }}>
              <XAxis dataKey="label" tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'JetBrains Mono' }} angle={-35} textAnchor="end" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip
                formatter={(v: any, name: any) => [`${v}${name === 'defectRate' ? '%' : ''}`, name === 'defectRate' ? 'Defect Rate' : 'Anomaly Score']}
                contentStyle={{ background: '#1C1C1E', border: '1px solid #3A3A3C', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 12 }}
                labelStyle={{ color: '#8E8E93' }}
              />
              <ReferenceLine y={3} stroke="#FFD60A" strokeDasharray="3 3" strokeWidth={1} />
              <ReferenceLine y={6} stroke="#FF3B30" strokeDasharray="3 3" strokeWidth={1} />
              <Bar dataKey="defectRate" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.isAnomaly ? '#FF9500' : '#64D2FF'} fillOpacity={entry.isAnomaly ? 0.9 : 0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Batch Detail</span>
          <span className="panel-chip">⚠ = anomaly detected</span>
        </div>
        <div className="batch-table">
          <div className="batch-table-header">
            <span>Batch ID</span>
            <span>Supplier</span>
            <span>Parts</span>
            <span>Defect Rate</span>
            <span>Anomaly Score</span>
            <span>Date Range</span>
            <span>Flag</span>
          </div>
          {batches.map((b, i) => {
            const sup = SUPPLIERS.find(s => s.id === b.supplierId);
            return (
              <div key={i} className={`batch-row ${b.isAnomaly ? 'anomaly' : ''}`}>
                <span className="mono">{b.batchId}</span>
                <span>{sup?.code}</span>
                <span className="mono">{b.partNumbers.join(', ')}</span>
                <span style={{ color: b.defectRate > 0.06 ? '#FF3B30' : b.defectRate > 0.03 ? '#FFD60A' : '#30D158' }} className="mono">
                  {formatDefectRate(b.defectRate)}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="anomaly-bar-track">
                    <div className="anomaly-bar-fill" style={{ width: `${b.anomalyScore * 100}%`, background: b.anomalyScore > 0.7 ? '#FF3B30' : b.anomalyScore > 0.4 ? '#FF9500' : '#30D158' }} />
                  </div>
                  <span className="mono" style={{ fontSize: 11 }}>{(b.anomalyScore * 100).toFixed(0)}%</span>
                </div>
                <span className="mono" style={{ fontSize: 11 }}>{b.dateRange.start} – {b.dateRange.end.slice(5)}</span>
                <span>{b.isAnomaly ? <span style={{ color: '#FF9500' }}>⚠ ANOMALY</span> : <span style={{ color: '#30D158' }}>✓ OK</span>}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
