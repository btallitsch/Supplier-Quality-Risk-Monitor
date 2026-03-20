import { format } from 'date-fns';
import type { View } from '../../types';

interface HeaderProps {
  view: View;
  criticalAlerts: number;
}

const VIEW_TITLES: Record<View, { title: string; sub: string }> = {
  dashboard: { title: 'Operations Overview', sub: 'Real-time supplier quality intelligence' },
  suppliers: { title: 'Supplier Directory', sub: 'Scorecards · Performance · Risk profiles' },
  rma: { title: 'RMA Tracker', sub: 'Return Material Authorizations · Defect linkage' },
  batches: { title: 'Batch Analysis', sub: 'Lot-level anomaly detection · Manufacturing batches' },
  alerts: { title: 'Alert Center', sub: 'Threshold violations · Spike detection · Escalations' },
  thresholds: { title: 'Threshold Config', sub: 'Warning & critical limits by supplier and metric' },
};

export function Header({ view, criticalAlerts }: HeaderProps) {
  const { title, sub } = VIEW_TITLES[view];
  const now = format(new Date(), 'EEE dd MMM yyyy · HH:mm');

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        <p className="header-sub">{sub}</p>
      </div>
      <div className="header-right">
        {criticalAlerts > 0 && (
          <div className="header-alert-chip">
            <span className="pulse-dot" />
            {criticalAlerts} CRITICAL ACTIVE
          </div>
        )}
        <div className="header-time">{now}</div>
      </div>
    </header>
  );
}
