import { useAuth } from "../../authContext";
import { useNavigate } from "react-router-dom";
import './dashboard.css';

const Header = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      setCurrentUser(null);
      navigate("/auth");
  };

  return (
    <header className="dashboard-header">
      <div className="header-search">
        <input type="text" placeholder="Search across your workspace..." />
      </div>
      <div className="header-actions">
        <div className="user-profile">
          <div className="avatar">JD</div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
