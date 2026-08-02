import { useQuery } from '@tanstack/react-query';
import Heatmap from './Heatmap';
import './profile.css';

const Profile = () => {
  const userId = localStorage.getItem("userId");

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      const res = await fetch(`http://localhost:5000/userProfile/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user profile');
      const data = await res.json();
      return data.user;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="profile-container">
        <div className="profile-sidebar skeleton" style={{ height: '400px' }}></div>
        <div className="profile-main skeleton" style={{ height: '600px' }}></div>
      </div>
    );
  }

  if (isError || !user) {
    return <div className="profile-container">Failed to load profile.</div>;
  }

  return (
    <div className="profile-container">
      {/* Left Sidebar (User Card) */}
      <aside className="profile-sidebar">
        <div className="profile-avatar-container">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
          </svg>
        </div>
        
        <div className="profile-info-header">
          <h2 className="profile-name">{user.userName || "Developer"}</h2>
          <h3 className="profile-username">{user.email?.split('@')[0] || "user"}</h3>
        </div>
        
        <p className="profile-bio">
          {user.bio || "No bio provided."}
        </p>

        <button className="profile-follow-btn">Follow</button>
        
        <div className="profile-stats">
          <span><strong>{user.followers?.length || 0}</strong> followers</span>
          <span>·</span>
          <span><strong>0</strong> following</span>
        </div>

        <div className="profile-details">
          {user.company && (
            <div className="profile-detail-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              {user.company}
            </div>
          )}
          {user.location && (
            <div className="profile-detail-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {user.location}
            </div>
          )}
          {user.website && (
            <div className="profile-detail-item">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer">{user.website}</a>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="profile-main">
        <div className="profile-tabs">
          <div className="tab active">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Overview
          </div>
          <div className="tab">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            Repositories <span className="tab-badge">{user.repositories?.length || 0}</span>
          </div>
        </div>

        <Heatmap />
      </main>
    </div>
  )
}

export default Profile;