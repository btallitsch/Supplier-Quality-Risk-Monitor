import { useState, useMemo } from 'react';
import { ALERTS } from '../services/dataService';
import { sortAlertsByPriority, countActiveAlerts } from '../utils/alertUtils';
import type { Alert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS);

  const sorted = useMemo(() => sortAlertsByPriority(alerts), [alerts]);
  const activeCounts = useMemo(() => countActiveAlerts(alerts), [alerts]);

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'acknowledged', acknowledgedAt: new Date().toISOString() } : a
    ));
  };

  const resolve = (id: string) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? { ...a, status: 'resolved' } : a
    ));
  };

  return { alerts: sorted, activeCounts, acknowledge, resolve };
}
