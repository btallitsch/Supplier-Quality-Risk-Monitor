import { format, subDays, subMonths } from 'date-fns';
import type {
  Supplier, ComponentLot, RMA, DefectRecord,
  Alert, Threshold, SupplierScorecard, BatchAnalysis
} from '../types';

// ── Suppliers ──────────────────────────────────────────────────────────────────

export const SUPPLIERS: Supplier[] = [
  { id: 'sup-001', name: 'Shenzhen Apex Electronics', code: 'SAE', country: 'China', category: 'PCB Assembly', contactEmail: 'qa@apex-sz.com', onboardedAt: '2021-03-12' },
  { id: 'sup-002', name: 'Kyushu Precision Parts', code: 'KPP', country: 'Japan', category: 'Mechanical', contactEmail: 'quality@kyushu-pp.jp', onboardedAt: '2020-07-01' },
  { id: 'sup-003', name: 'TechFlow Components', code: 'TFC', country: 'Taiwan', category: 'ICs & Chips', contactEmail: 'support@techflow.tw', onboardedAt: '2022-01-15' },
  { id: 'sup-004', name: 'MidWest Metal Works', code: 'MMW', country: 'USA', category: 'Sheet Metal', contactEmail: 'ops@mwmetal.com', onboardedAt: '2019-11-08' },
  { id: 'sup-005', name: 'Opto-Sense GmbH', code: 'OSG', country: 'Germany', category: 'Sensors', contactEmail: 'quality@optosense.de', onboardedAt: '2021-09-22' },
  { id: 'sup-006', name: 'Regal Power Systems', code: 'RPS', country: 'India', category: 'Power Supplies', contactEmail: 'qa@regalpower.in', onboardedAt: '2023-02-10' },
];

// ── Lots ──────────────────────────────────────────────────────────────────────

export const LOTS: ComponentLot[] = [
  { id: 'lot-001', supplierId: 'sup-001', partNumber: 'PCB-A42X', partName: 'Main Control PCB', lotNumber: 'SAE-2024-001', batchId: 'B-2024-Q1', receivedDate: '2024-01-10', quantity: 500, unitCost: 42.5 },
  { id: 'lot-002', supplierId: 'sup-001', partNumber: 'PCB-A42X', partName: 'Main Control PCB', lotNumber: 'SAE-2024-008', batchId: 'B-2024-Q2', receivedDate: '2024-04-15', quantity: 600, unitCost: 42.5 },
  { id: 'lot-003', supplierId: 'sup-001', partNumber: 'PCB-B10R', partName: 'Power Interface PCB', lotNumber: 'SAE-2024-012', batchId: 'B-2024-Q3', receivedDate: '2024-07-22', quantity: 400, unitCost: 28.0 },
  { id: 'lot-004', supplierId: 'sup-002', partNumber: 'BRKT-M7', partName: 'Mounting Bracket', lotNumber: 'KPP-2024-003', batchId: 'B-2024-Q1', receivedDate: '2024-01-18', quantity: 1000, unitCost: 8.75 },
  { id: 'lot-005', supplierId: 'sup-002', partNumber: 'SHAFT-S12', partName: 'Drive Shaft Assembly', lotNumber: 'KPP-2024-009', batchId: 'B-2024-Q2', receivedDate: '2024-05-03', quantity: 300, unitCost: 67.2 },
  { id: 'lot-006', supplierId: 'sup-003', partNumber: 'IC-MCU-88', partName: 'Microcontroller Unit', lotNumber: 'TFC-2024-002', batchId: 'B-2024-Q1', receivedDate: '2024-02-01', quantity: 2000, unitCost: 5.4 },
  { id: 'lot-007', supplierId: 'sup-003', partNumber: 'IC-MCU-88', partName: 'Microcontroller Unit', lotNumber: 'TFC-2024-015', batchId: 'B-2024-Q3', receivedDate: '2024-08-10', quantity: 2500, unitCost: 5.1 },
  { id: 'lot-008', supplierId: 'sup-004', partNumber: 'CHAS-001', partName: 'Main Chassis', lotNumber: 'MMW-2024-004', batchId: 'B-2024-Q1', receivedDate: '2024-01-25', quantity: 200, unitCost: 112.0 },
  { id: 'lot-009', supplierId: 'sup-005', partNumber: 'SENS-PT100', partName: 'Temp Sensor PT100', lotNumber: 'OSG-2024-006', batchId: 'B-2024-Q2', receivedDate: '2024-04-02', quantity: 1500, unitCost: 14.3 },
  { id: 'lot-010', supplierId: 'sup-006', partNumber: 'PSU-48V', partName: '48V Power Supply', lotNumber: 'RPS-2024-001', batchId: 'B-2024-Q1', receivedDate: '2024-03-08', quantity: 250, unitCost: 89.0 },
  { id: 'lot-011', supplierId: 'sup-006', partNumber: 'PSU-48V', partName: '48V Power Supply', lotNumber: 'RPS-2024-005', batchId: 'B-2024-Q2', receivedDate: '2024-06-15', quantity: 300, unitCost: 89.0 },
];

// ── RMAs ──────────────────────────────────────────────────────────────────────

export const RMAS: RMA[] = [
  { id: 'rma-001', rmaNumber: 'RMA-2024-0041', supplierId: 'sup-001', lotId: 'lot-001', partNumber: 'PCB-A42X', defectType: 'Solder Bridge', defectDescription: 'Solder bridges on U12 causing short circuits during thermal cycling.', quantityReturned: 18, dateOpened: '2024-01-22', dateClosed: '2024-02-14', status: 'resolved', rootCause: 'Paste stencil aperture mis-alignment at wave solder station', financialImpact: 3420 },
  { id: 'rma-002', rmaNumber: 'RMA-2024-0067', supplierId: 'sup-001', lotId: 'lot-002', partNumber: 'PCB-A42X', defectType: 'Missing Component', defectDescription: 'R44 resistor absent from 23 boards; discovered at ICT stage.', quantityReturned: 23, dateOpened: '2024-05-03', dateClosed: '2024-05-28', status: 'resolved', rootCause: 'Pick-and-place feeder jam undetected by AOI', financialImpact: 5865 },
  { id: 'rma-003', rmaNumber: 'RMA-2024-0089', supplierId: 'sup-001', lotId: 'lot-003', partNumber: 'PCB-B10R', defectType: 'Delamination', defectDescription: 'PCB delamination visible under UV; boards fail dielectric strength test.', quantityReturned: 41, dateOpened: '2024-08-01', dateClosed: null, status: 'escalated', rootCause: null, financialImpact: 9840 },
  { id: 'rma-004', rmaNumber: 'RMA-2024-0022', supplierId: 'sup-002', lotId: 'lot-004', partNumber: 'BRKT-M7', defectType: 'Dimensional OOT', defectDescription: 'Hole diameter 0.3mm undersized; assembly interference with mating part.', quantityReturned: 55, dateOpened: '2024-02-10', dateClosed: '2024-03-02', status: 'resolved', rootCause: 'CNC tool wear not flagged by SPC system', financialImpact: 2337.5 },
  { id: 'rma-005', rmaNumber: 'RMA-2024-0078', supplierId: 'sup-003', lotId: 'lot-007', partNumber: 'IC-MCU-88', defectType: 'ESD Damage', defectDescription: 'Latent ESD damage — units fail gate oxide integrity test after burn-in.', quantityReturned: 87, dateOpened: '2024-08-18', dateClosed: null, status: 'in_review', rootCause: null, financialImpact: 15660 },
  { id: 'rma-006', rmaNumber: 'RMA-2024-0031', supplierId: 'sup-004', lotId: 'lot-008', partNumber: 'CHAS-001', defectType: 'Surface Finish', defectDescription: 'Powdercoat adhesion failure; peeling after salt-spray test.', quantityReturned: 12, dateOpened: '2024-03-15', dateClosed: '2024-04-01', status: 'resolved', rootCause: 'Phosphate pre-treatment bath contamination', financialImpact: 4032 },
  { id: 'rma-007', rmaNumber: 'RMA-2024-0055', supplierId: 'sup-005', lotId: 'lot-009', partNumber: 'SENS-PT100', defectType: 'Calibration Drift', defectDescription: 'Sensor offset >0.5°C at 100°C reference; exceeds spec of ±0.15°C.', quantityReturned: 34, dateOpened: '2024-06-10', dateClosed: '2024-07-05', status: 'resolved', rootCause: 'Reference resistor batch with +0.3% tolerance drift', financialImpact: 1462 },
  { id: 'rma-008', rmaNumber: 'RMA-2024-0071', supplierId: 'sup-006', lotId: 'lot-010', partNumber: 'PSU-48V', defectType: 'Voltage Ripple', defectDescription: 'Output ripple 120mVpp vs spec 50mVpp. Units trip OCP under full load.', quantityReturned: 19, dateOpened: '2024-07-08', dateClosed: '2024-07-30', status: 'resolved', rootCause: 'Electrolytic capacitor substitution without ECN approval', financialImpact: 5367 },
  { id: 'rma-009', rmaNumber: 'RMA-2024-0091', supplierId: 'sup-006', lotId: 'lot-011', partNumber: 'PSU-48V', defectType: 'Voltage Ripple', defectDescription: 'Same ripple failure mode recurrence on new lot — CAPA not fully implemented.', quantityReturned: 27, dateOpened: '2024-09-02', dateClosed: null, status: 'open', rootCause: null, financialImpact: 7668 },
  { id: 'rma-010', rmaNumber: 'RMA-2024-0044', supplierId: 'sup-002', lotId: 'lot-005', partNumber: 'SHAFT-S12', defectType: 'Surface Hardness', defectDescription: 'Rockwell hardness 42 HRC vs required 52–58 HRC. Heat treatment inadequate.', quantityReturned: 8, dateOpened: '2024-05-20', dateClosed: '2024-06-18', status: 'resolved', rootCause: 'Furnace calibration drift — thermocouple replacement overdue', financialImpact: 3225.6 },
];

// ── Defect History (90 days) ──────────────────────────────────────────────────

function generateDefectHistory(): DefectRecord[] {
  const records: DefectRecord[] = [];
  const today = new Date();
  const supplierBaselines: Record<string, number> = {
    'sup-001': 0.038, 'sup-002': 0.015, 'sup-003': 0.022,
    'sup-004': 0.018, 'sup-005': 0.009, 'sup-006': 0.055,
  };
  const lots = ['lot-001','lot-002','lot-003','lot-004','lot-005','lot-006','lot-007','lot-008','lot-009','lot-010','lot-011'];
  const lotToSupplier: Record<string,string> = {};
  LOTS.forEach(l => { lotToSupplier[l.id] = l.supplierId; });

  for (let i = 89; i >= 0; i--) {
    const date = format(subDays(today, i), 'yyyy-MM-dd');
    Object.keys(supplierBaselines).forEach(supId => {
      const base = supplierBaselines[supId];
      // Simulate a spike for sup-006 around day 20–30
      const isSpike = supId === 'sup-006' && i >= 20 && i <= 30;
      const noiseMultiplier = isSpike ? 3.2 : (0.6 + Math.random() * 0.8);
      const defectRate = Math.min(0.25, Math.max(0, base * noiseMultiplier + (Math.random() - 0.5) * 0.005));
      const lot = lots.filter(l => lotToSupplier[l] === supId)[0] || 'lot-001';
      const totalUnits = Math.floor(50 + Math.random() * 150);
      const defectiveUnits = Math.round(totalUnits * defectRate);
      records.push({
        date,
        supplierId: supId,
        lotId: lot,
        batchId: `B-2024-${Math.floor(i / 30) === 0 ? 'Q3' : Math.floor(i / 30) === 1 ? 'Q2' : 'Q1'}`,
        totalUnits,
        defectiveUnits,
        defectRate,
      });
    });
  }
  return records;
}

export const DEFECT_HISTORY: DefectRecord[] = generateDefectHistory();

// ── Alerts ────────────────────────────────────────────────────────────────────

export const ALERTS: Alert[] = [
  { id: 'alrt-001', supplierId: 'sup-006', type: 'defect_spike', message: 'Defect rate for Regal Power Systems exceeded 3× rolling average. Lot RPS-2024-005 flagged.', riskLevel: 'critical', status: 'active', triggeredAt: subDays(new Date(), 8).toISOString(), acknowledgedAt: null, threshold: 0.06, actualValue: 0.162, metric: 'Defect Rate' },
  { id: 'alrt-002', supplierId: 'sup-001', type: 'threshold_exceeded', message: 'PCB-B10R delamination RMA escalated. 3rd quality event in 90 days for SAE.', riskLevel: 'high', status: 'active', triggeredAt: subDays(new Date(), 3).toISOString(), acknowledgedAt: null, threshold: 2, actualValue: 3, metric: 'RMA Count (90d)' },
  { id: 'alrt-003', supplierId: 'sup-003', type: 'rma_surge', message: 'IC-MCU-88 ESD failure: 87 units in review. Financial exposure $15,660.', riskLevel: 'high', status: 'acknowledged', triggeredAt: subDays(new Date(), 12).toISOString(), acknowledgedAt: subDays(new Date(), 11).toISOString(), threshold: 50, actualValue: 87, metric: 'Units in RMA' },
  { id: 'alrt-004', supplierId: 'sup-006', type: 'consecutive_failures', message: 'PSU-48V ripple defect recurrence detected. CAPA from RMA-0071 not effective.', riskLevel: 'critical', status: 'active', triggeredAt: subDays(new Date(), 2).toISOString(), acknowledgedAt: null, threshold: 1, actualValue: 2, metric: 'Recurrence Count' },
  { id: 'alrt-005', supplierId: 'sup-002', type: 'threshold_exceeded', message: 'Shaft hardness deviation: heat treatment process escape. Resolution >28 days.', riskLevel: 'medium', status: 'resolved', triggeredAt: subDays(new Date(), 40).toISOString(), acknowledgedAt: subDays(new Date(), 39).toISOString(), threshold: 28, actualValue: 29, metric: 'Resolution Days' },
];

// ── Thresholds ────────────────────────────────────────────────────────────────

export const THRESHOLDS: Threshold[] = [
  { id: 'thr-001', name: 'Global Defect Rate Warning', metric: 'defect_rate', supplierId: null, warningLevel: 0.03, criticalLevel: 0.06, enabled: true },
  { id: 'thr-002', name: 'Global RMA Count (90d)', metric: 'rma_count', supplierId: null, warningLevel: 2, criticalLevel: 5, enabled: true },
  { id: 'thr-003', name: 'Financial Impact per Event', metric: 'financial_impact', supplierId: null, warningLevel: 5000, criticalLevel: 10000, enabled: true },
  { id: 'thr-004', name: 'Resolution Days', metric: 'resolution_days', supplierId: null, warningLevel: 21, criticalLevel: 45, enabled: true },
  { id: 'thr-005', name: 'Regal Power — Defect Rate', metric: 'defect_rate', supplierId: 'sup-006', warningLevel: 0.04, criticalLevel: 0.08, enabled: true },
  { id: 'thr-006', name: 'Shenzhen Apex — RMA Count', metric: 'rma_count', supplierId: 'sup-001', warningLevel: 1, criticalLevel: 3, enabled: true },
];

// ── Scorecards ────────────────────────────────────────────────────────────────

export const SCORECARDS: SupplierScorecard[] = [
  { supplierId: 'sup-001', overallScore: 61, qualityScore: 58, responseScore: 72, volumeScore: 80, riskLevel: 'high', totalRMAs: 3, openRMAs: 1, avgDefectRate: 0.038, defectRateTrend: 'worsening', avgResolutionDays: 23, totalFinancialImpact: 19125, lastUpdated: format(new Date(), 'yyyy-MM-dd') },
  { supplierId: 'sup-002', overallScore: 82, qualityScore: 85, responseScore: 88, volumeScore: 75, riskLevel: 'low', totalRMAs: 2, openRMAs: 0, avgDefectRate: 0.015, defectRateTrend: 'stable', avgResolutionDays: 26, totalFinancialImpact: 5563, lastUpdated: format(new Date(), 'yyyy-MM-dd') },
  { supplierId: 'sup-003', overallScore: 69, qualityScore: 65, responseScore: 74, volumeScore: 90, riskLevel: 'high', totalRMAs: 1, openRMAs: 1, avgDefectRate: 0.022, defectRateTrend: 'stable', avgResolutionDays: 0, totalFinancialImpact: 15660, lastUpdated: format(new Date(), 'yyyy-MM-dd') },
  { supplierId: 'sup-004', overallScore: 87, qualityScore: 88, responseScore: 92, volumeScore: 78, riskLevel: 'low', totalRMAs: 1, openRMAs: 0, avgDefectRate: 0.018, defectRateTrend: 'improving', avgResolutionDays: 17, totalFinancialImpact: 4032, lastUpdated: format(new Date(), 'yyyy-MM-dd') },
  { supplierId: 'sup-005', overallScore: 91, qualityScore: 93, responseScore: 95, volumeScore: 82, riskLevel: 'low', totalRMAs: 1, openRMAs: 0, avgDefectRate: 0.009, defectRateTrend: 'improving', avgResolutionDays: 25, totalFinancialImpact: 1462, lastUpdated: format(new Date(), 'yyyy-MM-dd') },
  { supplierId: 'sup-006', overallScore: 34, qualityScore: 28, responseScore: 48, volumeScore: 55, riskLevel: 'critical', totalRMAs: 2, openRMAs: 2, avgDefectRate: 0.055, defectRateTrend: 'worsening', avgResolutionDays: 22, totalFinancialImpact: 13035, lastUpdated: format(new Date(), 'yyyy-MM-dd') },
];

// ── Batch Analysis ────────────────────────────────────────────────────────────

export const BATCH_ANALYSES: BatchAnalysis[] = [
  { batchId: 'B-2024-Q1', supplierId: 'sup-001', lotIds: ['lot-001'], partNumbers: ['PCB-A42X'], defectRate: 0.036, isAnomaly: false, anomalyScore: 0.4, dateRange: { start: '2024-01-01', end: '2024-03-31' } },
  { batchId: 'B-2024-Q2', supplierId: 'sup-001', lotIds: ['lot-002'], partNumbers: ['PCB-A42X'], defectRate: 0.038, isAnomaly: false, anomalyScore: 0.48, dateRange: { start: '2024-04-01', end: '2024-06-30' } },
  { batchId: 'B-2024-Q3', supplierId: 'sup-001', lotIds: ['lot-003'], partNumbers: ['PCB-B10R'], defectRate: 0.103, isAnomaly: true, anomalyScore: 0.91, dateRange: { start: '2024-07-01', end: '2024-09-30' } },
  { batchId: 'B-2024-Q1', supplierId: 'sup-006', lotIds: ['lot-010'], partNumbers: ['PSU-48V'], defectRate: 0.076, isAnomaly: true, anomalyScore: 0.78, dateRange: { start: '2024-01-01', end: '2024-03-31' } },
  { batchId: 'B-2024-Q2', supplierId: 'sup-006', lotIds: ['lot-011'], partNumbers: ['PSU-48V'], defectRate: 0.09, isAnomaly: true, anomalyScore: 0.87, dateRange: { start: '2024-04-01', end: '2024-06-30' } },
  { batchId: 'B-2024-Q3', supplierId: 'sup-003', lotIds: ['lot-007'], partNumbers: ['IC-MCU-88'], defectRate: 0.035, isAnomaly: true, anomalyScore: 0.72, dateRange: { start: '2024-07-01', end: '2024-09-30' } },
];

// ── KPIs ──────────────────────────────────────────────────────────────────────

export function getDashboardKPIs() {
  const activeAlerts = ALERTS.filter(a => a.status === 'active').length;
  const openRMAs = RMAS.filter(r => r.status === 'open' || r.status === 'in_review' || r.status === 'escalated').length;
  const totalFinancialImpact = RMAS.reduce((sum, r) => sum + r.financialImpact, 0);
  const avgDefectRate = SCORECARDS.reduce((sum, s) => sum + s.avgDefectRate, 0) / SCORECARDS.length;
  const criticalSuppliers = SCORECARDS.filter(s => s.riskLevel === 'critical').length;
  const resolvedThisMonth = RMAS.filter(r => r.status === 'resolved' && r.dateClosed && r.dateClosed >= format(subMonths(new Date(), 1), 'yyyy-MM-dd')).length;
  return {
    totalSuppliers: SUPPLIERS.length, activeAlerts, avgDefectRate,
    openRMAs, totalFinancialImpact, criticalSuppliers,
    defectRateChange: -0.004, resolvedThisMonth,
  };
}
