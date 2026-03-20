import type { View } from '../../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (v: View) => void;
  activeAlertCount: number;
  criticalCount: number;
}

interface NavItem {
  id: View;
  label: string;
  icon: string;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '▣' },
  { id: 'suppliers', label: 'Suppliers', icon: '◈' },
  { id: 'rma', label: 'RMA Tracker', icon: '↺' },
  { id: 'batches', label: 'Batch Analysis', icon: '⊞' },
  { id: 'alerts', label: 'Alerts', icon: '⚑' },
  { id: 'thresholds', label: 'Thresholds', icon: '⊟' },
];

export function Sidebar({ activeView, onViewChange, activeAlertCount, criticalCount }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-icon">◉</span>
        <div>
          <div className="brand-name">SQRM</div>
          <div className="brand-sub">Supplier Quality Risk Monitor</div>
        </div>
      </div>

      <div className="sidebar-status">
        <div className="status-dot critical" />
        <span>{criticalCount} critical supplier{criticalCount !== 1 ? 's' : ''}</span>
      </div>

      <nav className="sidebar-nav">
        {NAV.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.id === 'alerts' && activeAlertCount > 0 && (
              <span className="nav-badge">{activeAlertCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-line">v2.4.1 · PROD</div>
        <div className="footer-line muted">Last sync: just now</div>
      </div>
    </aside>
  );
}
