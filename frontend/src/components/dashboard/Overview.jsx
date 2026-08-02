import DashboardWidget from './DashboardWidget';
import './dashboard.css';

const Overview = () => {
  return (
    <>
      <div className="welcome-section">
        <h1>Welcome back, Developer!</h1>
        <p>Here's what's happening in your workspace today.</p>
      </div>

      <div className="widgets-grid">
        <DashboardWidget 
          title="Total Repositories" 
          value="12" 
          trend="+2 this week"
          isPositive={true}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-primary)" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          }
        />
        <DashboardWidget 
          title="Open Issues" 
          value="5" 
          trend="-3 since yesterday"
          isPositive={true}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-danger)" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          }
        />
        <DashboardWidget 
          title="Pull Requests" 
          value="3" 
          trend="Requires review"
          isPositive={false}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-warning)" strokeWidth="2">
              <circle cx="18" cy="18" r="3"></circle>
              <circle cx="6" cy="6" r="3"></circle>
              <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
              <line x1="6" y1="9" x2="6" y2="21"></line>
            </svg>
          }
        />
        <DashboardWidget 
          title="Active Users" 
          value="124" 
          trend="+12% growth"
          isPositive={true}
          icon={
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent-success)" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />
      </div>
    </>
  );
};

export default Overview;
