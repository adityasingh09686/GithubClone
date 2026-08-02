import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import './dashboard.css';

const Repositories = () => {
  const userId = localStorage.getItem("userId");

  const { data: repos, isLoading, isError } = useQuery({
    queryKey: ['userRepos', userId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/repo/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch repositories');
      const data = await res.json();
      return data.repositories || data || [];
    },
    enabled: !!userId,
  });

  return (
    <div className="dashboard-content-area">
      <div className="content-header">
        <h2>Repositories</h2>
        <button className="primary-btn">New Repository</button>
      </div>

      <div className="repositories-list">
        {isLoading && <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>}
        
        {isError && <div>Failed to load repositories.</div>}
        
        {repos?.length === 0 && (
          <div className="empty-state">
            <h3>No repositories found</h3>
            <p>You don't have any repositories yet. Create one to get started!</p>
          </div>
        )}

        {repos && repos.length > 0 && repos.map(repo => (
          <div key={repo._id || repo.repoId} className="repo-card">
            <div className="repo-card-header">
              <h3><Link to={`/repo/${repo._id}`}>{repo.repoName}</Link></h3>
              <span className="repo-visibility-badge">{repo.visibility || 'Public'}</span>
            </div>
            <p className="repo-card-desc">{repo.description || "No description provided."}</p>
            <div className="repo-card-footer">
              <span className="repo-language">
                <span className="lang-color" style={{ backgroundColor: '#f1e05a' }}></span> JavaScript
              </span>
              <span>Updated {new Date(repo.updatedAt || repo.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Repositories;
