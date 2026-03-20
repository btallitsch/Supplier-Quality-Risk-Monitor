export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';
export type RMAStatus = 'open' | 'in_review' | 'resolved' | 'escalated';

export interface Supplier {
  id: string;
  name: string;
  code: string;
  country: string;
  category: string;
  contactEmail: string;
  onboardedAt: string;
}

export interface ComponentLot {
  id: string;
  supplierId: string;
  partNumber: string;
  partName: string;
  lotNumber: string;
  batchId: string;
  receivedDate: string;
  quantity: number;
  unitCost: number;
}

export interface RMA {
  id: string;
  rmaNumber: string;
  supplierId: string;
  lotId: string;
  partNumber: string;
  defectType: string;
  defectDescription: string;
  quantityReturned: number;
  dateOpened: string;
  dateClosed: string | null;
  status: RMAStatus;
  rootCause: string | null;
  financialImpact: number;
}

export interface DefectRecord {
  date: string;
  supplierId: string;
  lotId: string;
  batchId: string;
  totalUnits: number;
  defectiveUnits: number;
  defectRate: number;
}

export interface Alert {
  id: string;
  supplierId: string;
  type: 'defect_spike' | 'threshold_exceeded' | 'consecutive_failures' | 'rma_surge';
  message: string;
  riskLevel: RiskLevel;
  status: AlertStatus;
  triggeredAt: string;
  acknowledgedAt: string | null;
  threshold: number;
  actualValue: number;
  metric: string;
}

export interface SupplierScorecard {
  supplierId: string;
  overallScore: number;
  qualityScore: number;
  responseScore: number;
  volumeScore: number;
  riskLevel: RiskLevel;
  totalRMAs: number;
  openRMAs: number;
  avgDefectRate: number;
  defectRateTrend: 'improving' | 'stable' | 'worsening';
  avgResolutionDays: number;
  totalFinancialImpact: number;
  lastUpdated: string;
}

export interface BatchAnalysis {
  batchId: string;
  supplierId: string;
  lotIds: string[];
  partNumbers: string[];
  defectRate: number;
  isAnomaly: boolean;
  anomalyScore: number;
  dateRange: { start: string; end: string };
}

export interface Threshold {
  id: string;
  name: string;
  metric: 'defect_rate' | 'rma_count' | 'financial_impact' | 'resolution_days';
  supplierId: string | null; // null = global
  warningLevel: number;
  criticalLevel: number;
  enabled: boolean;
}

export interface DashboardKPIs {
  totalSuppliers: number;
  activeAlerts: number;
  avgDefectRate: number;
  openRMAs: number;
  totalFinancialImpact: number;
  criticalSuppliers: number;
  defectRateChange: number;
  resolvedThisMonth: number;
}

export type View = 'dashboard' | 'suppliers' | 'rma' | 'alerts' | 'batches' | 'thresholds';
