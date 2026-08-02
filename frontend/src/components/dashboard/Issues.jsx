import './dashboard.css';

const Issues = () => {
  return (
    <div className="dashboard-content-area">
      <div className="content-header">
        <h2>Issues</h2>
        <button className="primary-btn">New Issue</button>
      </div>

      <div className="empty-state">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>No issues found</h3>
        <p>There are no issues assigned to you yet.</p>
      </div>
    </div>
  );
};

export default Issues;
