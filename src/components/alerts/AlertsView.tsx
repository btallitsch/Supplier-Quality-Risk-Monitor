import type { Alert } from '../../types';
import { getRiskColor, getRiskBg } from '../../utils/riskCalculations';
import { getAlertTypeLabel, getStatusLabel } from '../../utils/alertUtils';
import { SUPPLIERS } from '../../services/dataService';
import { formatDistanceToNow } from 'date-fns';

interface AlertsViewProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export function AlertsView({ alerts, onAcknowledge, onResolve }: AlertsViewProps) {
  const active = alerts.filter(a => a.status === 'active');
  const acked = alerts.filter(a => a.status === 'acknowledged');
  const resolved = alerts.filter(a => a.status === 'resolved');

  const AlertCard = ({ alert }: { alert: Alert }) => {
    const supplier = SUPPLIERS.find(s => s.id === alert.supplierId);
    const color = getRiskColor(alert.riskLevel);
    const bg = getRiskBg(alert.riskLevel);
    const age = formatDistanceToNow(new Date(alert.triggeredAt), { addSuffix: true });

    return (
      <div className="alert-card" style={{ borderColor: color, background: alert.status === 'active' ? bg : 'transparent' }}>
        <div className="alert-card-top">
          <div className="alert-meta-left">
            <span className="alert-type-chip" style={{ color, borderColor: color }}>
              {getAlertTypeLabel(alert.type)}
            </span>
            <span className="alert-supplier">{supplier?.name} · {supplier?.code}</span>
          </div>
          <div className="alert-meta-right">
            <span className="alert-status" style={{ color, borderColor: color }}>{getStatusLabel(alert.status)}</span>
            <span className="alert-age">{age}</span>
          </div>
        </div>

        <div className="alert-message" style={{ color: alert.status === 'active' ? '#F2F2F7' : '#8E8E93' }}>
          {alert.message}
        </div>

        <div className="alert-metrics">
          <div className="alert-metric">
            <span className="alert-metric-key">Metric</span>
            <span className="alert-metric-val">{alert.metric}</span>
          </div>
          <div className="alert-metric">
            <span className="alert-metric-key">Threshold</span>
            <span className="alert-metric-val">{typeof alert.threshold === 'number' && alert.threshold < 1 ? `${(alert.threshold * 100).toFixed(1)}%` : alert.threshold}</span>
          </div>
          <div className="alert-metric">
            <span className="alert-metric-key">Actual</span>
            <span className="alert-metric-val" style={{ color }}>
              {typeof alert.actualValue === 'number' && alert.actualValue < 1 ? `${(alert.actualValue * 100).toFixed(1)}%` : alert.actualValue}
            </span>
          </div>
          <div className="alert-metric">
            <span className="alert-metric-key">Risk</span>
            <span className="alert-metric-val" style={{ color }}>{alert.riskLevel.toUpperCase()}</span>
          </div>
        </div>

        {alert.status !== 'resolved' && (
          <div className="alert-actions">
            {alert.status === 'active' && (
              <button className="btn-secondary" onClick={() => onAcknowledge(alert.id)}>Acknowledge</button>
            )}
            <button className="btn-primary" onClick={() => onResolve(alert.id)}>Mark Resolved</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="alerts-view">
      {active.length > 0 && (
        <section className="alert-section">
          <div className="alert-section-header">
            <div className="section-dot critical" />
            <span>Active Alerts ({active.length})</span>
          </div>
          {active.map(a => <AlertCard key={a.id} alert={a} />)}
        </section>
      )}

      {acked.length > 0 && (
        <section className="alert-section">
          <div className="alert-section-header muted">
            <div className="section-dot high" />
            <span>Acknowledged ({acked.length})</span>
          </div>
          {acked.map(a => <AlertCard key={a.id} alert={a} />)}
        </section>
      )}

      {resolved.length > 0 && (
        <section className="alert-section">
          <div className="alert-section-header muted">
            <div className="section-dot low" />
            <span>Resolved ({resolved.length})</span>
          </div>
          {resolved.map(a => <AlertCard key={a.id} alert={a} />)}
        </section>
      )}
    </div>
  );
}
