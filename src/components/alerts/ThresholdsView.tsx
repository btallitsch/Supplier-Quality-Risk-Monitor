import { useState } from 'react';
import { THRESHOLDS, SUPPLIERS } from '../../services/dataService';
import type { Threshold } from '../../types';

const METRIC_LABELS: Record<Threshold['metric'], string> = {
  defect_rate: 'Defect Rate',
  rma_count: 'RMA Count (90d)',
  financial_impact: 'Financial Impact ($)',
  resolution_days: 'Resolution Days',
};

export function ThresholdsView() {
  const [thresholds, setThresholds] = useState<Threshold[]>(THRESHOLDS);

  const toggle = (id: string) => {
    setThresholds(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  return (
    <div className="thresholds-view">
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Alert Thresholds</span>
          <span className="panel-chip">Changes apply immediately</span>
        </div>

        <div className="threshold-note">
          Thresholds define when alerts are triggered. Warning levels generate high-priority alerts; critical levels generate critical alerts. Supplier-specific thresholds override global defaults.
        </div>

        <div className="threshold-table">
          <div className="threshold-table-header">
            <span>Name</span>
            <span>Metric</span>
            <span>Scope</span>
            <span>Warning</span>
            <span>Critical</span>
            <span>Enabled</span>
          </div>

          {thresholds.map(t => {
            const supplier = t.supplierId ? SUPPLIERS.find(s => s.id === t.supplierId) : null;
            const isRate = t.metric === 'defect_rate';
            const fmt = (v: number) => isRate ? `${(v * 100).toFixed(1)}%` : t.metric === 'financial_impact' ? `$${v.toLocaleString()}` : `${v}`;

            return (
              <div key={t.id} className={`threshold-row ${!t.enabled ? 'disabled' : ''}`}>
                <span className="threshold-name">{t.name}</span>
                <span className="threshold-metric">{METRIC_LABELS[t.metric]}</span>
                <span className="threshold-scope">
                  {supplier
                    ? <span style={{ color: '#64D2FF' }}>{supplier.code}</span>
                    : <span style={{ color: '#8E8E93' }}>Global</span>}
                </span>
                <span className="threshold-warn">{fmt(t.warningLevel)}</span>
                <span className="threshold-crit" style={{ color: '#FF3B30' }}>{fmt(t.criticalLevel)}</span>
                <div className="threshold-toggle" onClick={() => toggle(t.id)}>
                  <div className={`toggle-track ${t.enabled ? 'on' : 'off'}`}>
                    <div className="toggle-thumb" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="panel threshold-info-panel">
        <div className="panel-title" style={{ marginBottom: 12 }}>How Spike Detection Works</div>
        <div className="info-text">
          <p>The system continuously monitors a <strong>7-day rolling window</strong> versus a <strong>28-day baseline</strong> for each supplier. When the rolling average exceeds <strong>2.5×</strong> the baseline, a Defect Spike alert is automatically raised.</p>
          <p style={{ marginTop: 12 }}>Batch anomaly scores are computed using a Z-score method across all lots from the same supplier. Batches with anomaly scores above <strong>0.7</strong> are flagged for review.</p>
          <p style={{ marginTop: 12 }}>Recurring failures (same defect mode across &gt;1 RMA) trigger a <strong>Consecutive Failure</strong> alert and require a CAPA (Corrective and Preventive Action) to be filed before the alert can be resolved.</p>
        </div>
      </div>
    </div>
  );
}
