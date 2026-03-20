import { useState, useMemo } from 'react';
import {
  SUPPLIERS, LOTS, RMAS, DEFECT_HISTORY,
  SCORECARDS, BATCH_ANALYSES, getDashboardKPIs
} from '../services/dataService';
import type { Supplier, RMA, SupplierScorecard } from '../types';

export function useSupplierData() {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);

  const suppliers = useMemo(() => SUPPLIERS, []);
  const lots = useMemo(() => LOTS, []);
  const rmas = useMemo(() => RMAS, []);
  const defectHistory = useMemo(() => DEFECT_HISTORY, []);
  const scorecards = useMemo(() => SCORECARDS, []);
  const batchAnalyses = useMemo(() => BATCH_ANALYSES, []);
  const kpis = useMemo(() => getDashboardKPIs(), []);

  const selectedSupplier = useMemo<Supplier | null>(
    () => suppliers.find(s => s.id === selectedSupplierId) ?? null,
    [suppliers, selectedSupplierId]
  );

  const selectedScorecard = useMemo<SupplierScorecard | null>(
    () => scorecards.find(s => s.supplierId === selectedSupplierId) ?? null,
    [scorecards, selectedSupplierId]
  );

  const selectedRMAs = useMemo<RMA[]>(
    () => selectedSupplierId ? rmas.filter(r => r.supplierId === selectedSupplierId) : rmas,
    [rmas, selectedSupplierId]
  );

  const defectChartData = useMemo(() => {
    const targetId = selectedSupplierId ?? 'sup-006';
    const records = defectHistory
      .filter(r => r.supplierId === targetId)
      .sort((a, b) => a.date.localeCompare(b.date));

    return records.map(r => ({
      date: r.date.slice(5), // MM-DD
      rate: parseFloat((r.defectRate * 100).toFixed(3)),
      units: r.totalUnits,
      defects: r.defectiveUnits,
    }));
  }, [defectHistory, selectedSupplierId]);

  const supplierDefectSummary = useMemo(() => {
    return suppliers.map(s => {
      const sc = scorecards.find(sc => sc.supplierId === s.id);
      return {
        name: s.code,
        fullName: s.name,
        defectRate: parseFloat(((sc?.avgDefectRate ?? 0) * 100).toFixed(3)),
        score: sc?.overallScore ?? 0,
        riskLevel: sc?.riskLevel ?? 'low',
      };
    });
  }, [suppliers, scorecards]);

  return {
    suppliers, lots, rmas, defectHistory, scorecards, batchAnalyses, kpis,
    selectedSupplierId, setSelectedSupplierId,
    selectedSupplier, selectedScorecard, selectedRMAs,
    defectChartData, supplierDefectSummary,
  };
}
