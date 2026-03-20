# SQRM — Supplier Quality Risk Monitor

A production-grade React + TypeScript application for tracking supplier defect rates, managing Return Material Authorizations (RMAs), detecting quality spikes, and scoring supplier performance. Built for hardware companies managing multiple vendors.

> **Core insight:** Many product failures aren't design issues — they're supply chain variability. SQRM surfaces that variability before it becomes a customer problem.

---

## Features

### Dashboard
The operations overview screen provides a real-time snapshot of your entire supply chain quality posture.

- **6 KPI cards** showing Active Alerts, Open RMAs, Average Defect Rate, Financial Exposure (YTD), Critical Suppliers, and RMAs Resolved This Month — each with trend indicators
- **Defect Rate bar chart** across all suppliers with color-coded bars (green/orange/red by risk level) and dashed warning (3%) and critical (6%) reference lines
- **Top Risk Suppliers panel** with a ranked list, color-coded score bars, and one-click navigation to the full supplier view
- **Live Alert Strip** showing the four most recent alerts with severity dots and timestamps

---

### Suppliers — Scorecards & Defect History
A full scorecard view for every supplier in your network, ranked by risk.

- **SVG gauge arcs** render each supplier's overall score (0–100) with a color that shifts from green → amber → red as risk increases
- **Sub-scores** for Quality, Response Time, and Volume — each rendered as a labeled progress bar
- **Stat grid** per supplier: Total RMAs, Open RMAs, Average Defect Rate, Defect Rate Trend (improving / stable / worsening), Average Resolution Days, Total Financial Impact
- **Risk badge** (LOW / MEDIUM / HIGH / CRITICAL) derived from the composite score
- **Click any scorecard** to reveal a 90-day defect rate line chart for that supplier, with the same warning and critical reference lines as the dashboard

---

### RMA Tracker
A filterable, expandable table linking every Return Material Authorization to the supplier, lot, and defect that caused it.

- **Summary bar** showing Open/Active count, total RMAs, and financial exposure for the current filter
- **Filter tabs** by status: All · Open · In Review · Escalated · Resolved
- **Table columns:** RMA number, supplier code, part number, defect type, quantity returned, date opened, financial impact (color-coded by severity), and status badge
- **Expandable rows** — click any row to reveal: lot number, batch ID, supplier full name, date closed, root cause (or "Under investigation"), and the full defect description
- **Financial impact coloring**: grey under $5k, orange $5k–$10k, red above $10k

---

### Batch Analysis
Lot-level and batch-level anomaly detection to identify whether a quality problem is isolated to a specific production run.

- **Summary bar** showing anomalous batch count, total batch count, and the worst-performing batch defect rate
- **Bar chart** with all batches plotted by defect rate — anomalous batches render in amber, normal batches in blue — with warning and critical reference lines
- **Anomaly score bars** in the detail table: a scored 0–100% bar per batch showing how far the batch deviates from the supplier's baseline
- **Full detail table** with batch ID, supplier code, part numbers, defect rate (color-coded), anomaly score, date range, and an OK / ANOMALY flag
- Anomaly scores above **70%** are flagged for review; above **87%** are considered high-confidence anomalies

---

### Alert Center
A prioritized feed of all system alerts, organized by status and severity.

- **Three sections**: Active (highest priority, shown first) → Acknowledged → Resolved
- **Alert cards** show: alert type chip (Defect Spike / Threshold Exceeded / Recurring Failure / RMA Surge), supplier name, risk level badge, time-ago label (e.g. "8 days ago"), the full alert message, and a metrics row with Metric / Threshold / Actual Value / Risk Level
- **One-click Acknowledge** moves an active alert to the acknowledged state and records the timestamp
- **One-click Mark Resolved** closes the alert
- Alert types supported:
  - `defect_spike` — rolling average has exceeded 2.5× the 28-day baseline
  - `threshold_exceeded` — a configured metric limit has been breached
  - `consecutive_failures` — the same defect mode has recurred across multiple RMAs (CAPA required)
  - `rma_surge` — unit volume in open RMAs has exceeded the configured threshold

---

### Thresholds Configuration
Configure exactly when alerts fire — globally or per-supplier.

- **Live toggle switches** enable or disable each threshold rule without a page reload
- **Two levels per rule**: Warning (generates a high-priority alert) and Critical (generates a critical alert)
- **Scope**: rules can be set globally (apply to all suppliers) or scoped to a specific supplier code
- **Metric types**: Defect Rate (%), RMA Count (90-day window), Financial Impact ($), Resolution Days
- **Spike detection explainer** panel documents the rolling-window algorithm and anomaly scoring methodology used by the system

---

## Architecture

Strict separation of concerns across five layers:

```
src/
├── types/              Shared TypeScript interfaces (Supplier, RMA, Alert, Scorecard, etc.)
├── services/           Data layer — mock data and KPI aggregation (swap for real API calls)
├── utils/              Pure functions — risk scoring, spike detection, formatting, alert sorting
├── hooks/              React hooks — useSupplierData, useAlerts (state + derived data)
└── components/
    ├── layout/         Sidebar, Header
    ├── dashboard/      Dashboard, KPICard
    ├── suppliers/      SupplierList, SupplierScorecard
    ├── rma/            RMAView
    ├── charts/         BatchView
    └── alerts/         AlertsView, ThresholdsView
```

**Key dependencies:** React 18 · TypeScript · Vite · Recharts · date-fns · Lucide React

**Design system:** Industrial dark theme — Barlow Condensed display font, JetBrains Mono for data, amber/red/green risk palette on a near-black base.

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type-check
npx tsc --noEmit

# Production build
npm run build
```

The dev server runs at `http://localhost:5173` by default.

---

## Connecting Real Data

All mock data lives in `src/services/dataService.ts`. To connect a real backend:

1. Replace the exported constants (`SUPPLIERS`, `RMAS`, `DEFECT_HISTORY`, etc.) with async fetch calls to your API
2. Update the hooks in `src/hooks/` to handle loading and error states
3. The `utils/` layer requires no changes — all calculation logic is pure and data-source agnostic

---

## SaaS Potential

SQRM is designed to be sold to any hardware company managing multiple component vendors. The core value proposition:

- **Defect attribution** — link field failures back to the exact supplier lot and batch
- **Early warning** — detect statistical anomalies in incoming inspection data before products ship
- **Supplier accountability** — scorecards create a factual, auditable basis for supplier reviews and contract negotiations
- **Financial visibility** — real-time RMA cost tracking makes supply chain quality risk tangible to finance and operations leadership

---

## License

MIT
