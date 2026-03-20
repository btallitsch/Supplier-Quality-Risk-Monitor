import { useState } from 'react';
import type { RMA, RMAStatus } from '../../types';
import { formatCurrency } from '../../utils/riskCalculations';
import { SUPPLIERS, LOTS } from '../../services/dataService';

interface RMAViewProps {
  rmas: RMA[];
}

const STATUS_COLOR: Record<RMAStatus, string> = {
  open: '#FF9500',
  in_review: '#64D2FF',
  resolved: '#30D158',
  escalated: '#FF3B30',
};

const STATUS_LABEL: Record<RMAStatus, string> = {
  open: 'OPEN',
  in_review: 'IN REVIEW',
  resolved: 'RESOLVED',
  escalated: 'ESCALATED',
};

export function RMAView({ rmas }: RMAViewProps) {
  const [filter, setFilter] = useState<RMAStatus | 'all'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = filter === 'all' ? rmas : rmas.filter(r => r.status === filter);
  const sorted = [...filtered].sort((a, b) => b.dateOpened.localeCompare(a.dateOpened));

  const totalExposure = filtered.reduce((s, r) => s + r.financialImpact, 0);
  const openCount = rmas.filter(r => r.status === 'open' || r.status === 'in_review' || r.status === 'escalated').length;

  return (
    <div className="rma-view">
      <div className="rma-summary-bar">
        <div className="rma-stat"><span className="rma-stat-val" style={{ color: '#FF3B30' }}>{openCount}</span><span className="rma-stat-key">Open / Active</span></div>
        <div className="rma-stat"><span className="rma-stat-val">{rmas.length}</span><span className="rma-stat-key">Total RMAs</span></div>
        <div className="rma-stat"><span className="rma-stat-val" style={{ color: '#FF9500' }}>{formatCurrency(totalExposure)}</span><span className="rma-stat-key">Financial Exposure ({filter === 'all' ? 'all' : filter})</span></div>
      </div>

      <div className="rma-filters">
        {(['all', 'open', 'in_review', 'escalated', 'resolved'] as const).map(s => (
          <button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'all' ? 'All' : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="rma-table">
        <div className="rma-table-header">
          <span>RMA #</span>
          <span>Supplier</span>
          <span>Part</span>
          <span>Defect Type</span>
          <span>Qty</span>
          <span>Opened</span>
          <span>Impact</span>
          <span>Status</span>
        </div>

        {sorted.map(rma => {
          const supplier = SUPPLIERS.find(s => s.id === rma.supplierId);
          const lot = LOTS.find(l => l.id === rma.lotId);
          const isExpanded = expanded === rma.id;

          return (
            <div key={rma.id} className="rma-row-wrap">
              <div className={`rma-row ${isExpanded ? 'expanded' : ''}`} onClick={() => setExpanded(isExpanded ? null : rma.id)}>
                <span className="rma-num">{rma.rmaNumber}</span>
                <span className="rma-supplier">{supplier?.code}</span>
                <span className="rma-part">{rma.partNumber}</span>
                <span className="rma-defect">{rma.defectType}</span>
                <span className="rma-qty">{rma.quantityReturned}</span>
                <span className="rma-date">{rma.dateOpened}</span>
                <span className="rma-impact" style={{ color: rma.financialImpact > 10000 ? '#FF3B30' : rma.financialImpact > 5000 ? '#FF9500' : '#8E8E93' }}>
                  {formatCurrency(rma.financialImpact)}
                </span>
                <span className="rma-status" style={{ color: STATUS_COLOR[rma.status], borderColor: STATUS_COLOR[rma.status] }}>
                  {STATUS_LABEL[rma.status]}
                </span>
              </div>

              {isExpanded && (
                <div className="rma-detail">
                  <div className="detail-grid">
                    <div className="detail-field">
                      <div className="detail-key">Lot / Batch</div>
                      <div className="detail-val">{lot?.lotNumber} · {lot?.batchId}</div>
                    </div>
                    <div className="detail-field">
                      <div className="detail-key">Supplier</div>
                      <div className="detail-val">{supplier?.name}</div>
                    </div>
                    <div className="detail-field">
                      <div className="detail-key">Closed</div>
                      <div className="detail-val">{rma.dateClosed ?? '—'}</div>
                    </div>
                    <div className="detail-field">
                      <div className="detail-key">Root Cause</div>
                      <div className="detail-val">{rma.rootCause ?? 'Under investigation'}</div>
                    </div>
                  </div>
                  <div className="detail-desc">
                    <div className="detail-key">Description</div>
                    <div className="detail-val">{rma.defectDescription}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
