import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { SupplierScorecardCard } from './SupplierScorecard';
import type { Supplier, SupplierScorecard } from '../../types';
import { DEFECT_HISTORY } from '../../services/dataService';

interface SuppliersViewProps {
  suppliers: Supplier[];
  scorecards: SupplierScorecard[];
}

export function SuppliersView({ suppliers, scorecards }: SuppliersViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const chartData = selectedId
    ? DEFECT_HISTORY
        .filter(r => r.supplierId === selectedId)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(r => ({ date: r.date.slice(5), rate: parseFloat((r.defectRate * 100).toFixed(3)) }))
    : [];

  const paired = suppliers.map(s => ({
    supplier: s,
    scorecard: scorecards.find(sc => sc.supplierId === s.id)!,
  })).sort((a, b) => a.scorecard.overallScore - b.scorecard.overallScore);

  return (
    <div className="suppliers-view">
      {selectedId && (
        <div className="panel supplier-chart-panel">
          <div className="panel-header">
            <span className="panel-title">Defect Rate History — {suppliers.find(s => s.id === selectedId)?.name}</span>
            <button className="panel-link" onClick={() => setSelectedId(null)}>Close ✕</button>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 16, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={13} />
                <YAxis tick={{ fill: '#8E8E93', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v: any) => [`${v}%`, 'Defect Rate']} contentStyle={{ background: '#1C1C1E', border: '1px solid #3A3A3C', borderRadius: 6, fontFamily: 'JetBrains Mono', fontSize: 12 }} labelStyle={{ color: '#8E8E93' }} />
                <ReferenceLine y={3} stroke="#FFD60A" strokeDasharray="3 3" strokeWidth={1} />
                <ReferenceLine y={6} stroke="#FF3B30" strokeDasharray="3 3" strokeWidth={1} />
                <Line type="monotone" dataKey="rate" stroke="#F5A623" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="scorecard-grid">
        {paired.map(({ supplier, scorecard }) => (
          <div key={supplier.id} onClick={() => setSelectedId(supplier.id === selectedId ? null : supplier.id)} style={{ cursor: 'pointer' }}>
            <SupplierScorecardCard supplier={supplier} scorecard={scorecard} />
          </div>
        ))}
      </div>
    </div>
  );
}
