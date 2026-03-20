import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { SuppliersView } from './components/suppliers/SupplierList';
import { RMAView } from './components/rma/RMAView';
import { BatchView } from './components/charts/BatchView';
import { AlertsView } from './components/alerts/AlertsView';
import { ThresholdsView } from './components/alerts/ThresholdsView';
import { useSupplierData } from './hooks/useSupplierData';
import { useAlerts } from './hooks/useAlerts';
import type { View } from './types';

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const {
    suppliers, scorecards, rmas, batchAnalyses,
    kpis, supplierDefectSummary,
  } = useSupplierData();
  const { alerts, activeCounts, acknowledge, resolve } = useAlerts();

  const totalActive = activeCounts.critical + activeCounts.high + activeCounts.medium + activeCounts.low;

  return (
    <div className="app-shell">
      <Sidebar
        activeView={view}
        onViewChange={setView}
        activeAlertCount={totalActive}
        criticalCount={activeCounts.critical}
      />
      <div className="main-area">
        <Header view={view} criticalAlerts={activeCounts.critical} />
        <main className="content-area">
          {view === 'dashboard' && (
            <Dashboard
              kpis={kpis}
              supplierDefectSummary={supplierDefectSummary}
              onNavigate={(v) => setView(v)}
            />
          )}
          {view === 'suppliers' && (
            <SuppliersView suppliers={suppliers} scorecards={scorecards} />
          )}
          {view === 'rma' && (
            <RMAView rmas={rmas} />
          )}
          {view === 'batches' && (
            <BatchView batches={batchAnalyses} />
          )}
          {view === 'alerts' && (
            <AlertsView alerts={alerts} onAcknowledge={acknowledge} onResolve={resolve} />
          )}
          {view === 'thresholds' && (
            <ThresholdsView />
          )}
        </main>
      </div>
    </div>
  );
}
