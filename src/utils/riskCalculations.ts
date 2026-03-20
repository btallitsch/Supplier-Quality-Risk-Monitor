import type { DefectRecord, RiskLevel, SupplierScorecard } from '../types';

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'critical': return '#FF3B30';
    case 'high': return '#FF9500';
    case 'medium': return '#FFD60A';
    case 'low': return '#30D158';
  }
}

export function getRiskBg(level: RiskLevel): string {
  switch (level) {
    case 'critical': return 'rgba(255,59,48,0.12)';
    case 'high': return 'rgba(255,149,0,0.12)';
    case 'medium': return 'rgba(255,214,10,0.12)';
    case 'low': return 'rgba(48,209,88,0.12)';
  }
}

export function detectDefectSpike(records: DefectRecord[], supplierId: string, windowDays = 7, spikeMultiplier = 2.5): boolean {
  const supplierRecords = records
    .filter(r => r.supplierId === supplierId)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (supplierRecords.length < windowDays * 2) return false;

  const recent = supplierRecords.slice(-windowDays);
  const baseline = supplierRecords.slice(-windowDays * 4, -windowDays);

  const recentAvg = recent.reduce((s, r) => s + r.defectRate, 0) / recent.length;
  const baselineAvg = baseline.reduce((s, r) => s + r.defectRate, 0) / baseline.length;

  return baselineAvg > 0 && recentAvg > baselineAvg * spikeMultiplier;
}

export function calcRollingAverage(records: DefectRecord[], supplierId: string, days = 7): number {
  const supplierRecords = records
    .filter(r => r.supplierId === supplierId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, days);

  if (supplierRecords.length === 0) return 0;
  return supplierRecords.reduce((s, r) => s + r.defectRate, 0) / supplierRecords.length;
}

export function calcAnomalyScore(defectRate: number, baseline: number): number {
  if (baseline === 0) return defectRate > 0 ? 1 : 0;
  const ratio = defectRate / baseline;
  return Math.min(1, (ratio - 1) / 3);
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Fair';
  if (score >= 40) return 'Poor';
  return 'Critical';
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#30D158';
  if (score >= 70) return '#64D2FF';
  if (score >= 55) return '#FFD60A';
  if (score >= 40) return '#FF9500';
  return '#FF3B30';
}

export function formatDefectRate(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
}

export function getTrendIcon(trend: SupplierScorecard['defectRateTrend']): string {
  switch (trend) {
    case 'improving': return '↓';
    case 'worsening': return '↑';
    case 'stable': return '→';
  }
}

export function getTrendColor(trend: SupplierScorecard['defectRateTrend']): string {
  switch (trend) {
    case 'improving': return '#30D158';
    case 'worsening': return '#FF3B30';
    case 'stable': return '#8E8E93';
  }
}

export function getDefectRateTrend(records: DefectRecord[], supplierId: string): SupplierScorecard['defectRateTrend'] {
  const filtered = records.filter(r => r.supplierId === supplierId).sort((a,b) => a.date.localeCompare(b.date));
  if (filtered.length < 14) return 'stable';
  const firstHalf = filtered.slice(0, Math.floor(filtered.length / 2));
  const secondHalf = filtered.slice(Math.floor(filtered.length / 2));
  const firstAvg = firstHalf.reduce((s,r) => s + r.defectRate, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((s,r) => s + r.defectRate, 0) / secondHalf.length;
  if (secondAvg < firstAvg * 0.9) return 'improving';
  if (secondAvg > firstAvg * 1.1) return 'worsening';
  return 'stable';
}
