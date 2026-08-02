import './dashboard.css';

const DashboardWidget = ({ title, value, icon, trend, isPositive }) => {
  return (
    <div className="widget-card">
      <div className="widget-header">
        <span>{title}</span>
        <div className="widget-icon" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {icon}
        </div>
      </div>
      <h3 className="widget-value">{value}</h3>
      {trend && (
        <div className={`widget-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            {isPositive ? (
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            ) : (
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            )}
          </svg>
          {trend}
        </div>
      )}
    </div>
  );
};

export default DashboardWidget;
