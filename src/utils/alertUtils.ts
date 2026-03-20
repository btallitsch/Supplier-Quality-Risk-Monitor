import type { Alert, RiskLevel } from '../types';

export function getAlertIcon(type: Alert['type']): string {
  switch (type) {
    case 'defect_spike': return '⚡';
    case 'threshold_exceeded': return '🔴';
    case 'consecutive_failures': return '🔁';
    case 'rma_surge': return '📦';
  }
}

export function getAlertTypeLabel(type: Alert['type']): string {
  switch (type) {
    case 'defect_spike': return 'Defect Spike';
    case 'threshold_exceeded': return 'Threshold Exceeded';
    case 'consecutive_failures': return 'Recurring Failure';
    case 'rma_surge': return 'RMA Surge';
  }
}

export function getStatusLabel(status: Alert['status']): string {
  switch (status) {
    case 'active': return 'ACTIVE';
    case 'acknowledged': return 'ACK\'D';
    case 'resolved': return 'RESOLVED';
  }
}

export function sortAlertsByPriority(alerts: Alert[]): Alert[] {
  const priorityOrder: Record<RiskLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const statusOrder: Record<Alert['status'], number> = { active: 0, acknowledged: 1, resolved: 2 };
  return [...alerts].sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status];
    return priorityOrder[a.riskLevel] - priorityOrder[b.riskLevel];
  });
}

export function countActiveAlerts(alerts: Alert[]): Record<RiskLevel, number> {
  const counts: Record<RiskLevel, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  alerts.filter(a => a.status === 'active').forEach(a => { counts[a.riskLevel]++; });
  return counts;
}
