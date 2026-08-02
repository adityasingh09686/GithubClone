import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import './auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Using auth context to update current user if needed, but standard login might be an API call
  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        setCurrentUser(data.user.id);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during login. Is the backend running?");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Log in to your account to continue</p>
          </div>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="auth-button">
              <span>Sign In</span>
            </button>
          </form>
          <div className="auth-footer">
            <p>Don't have an account? <span className="auth-link" onClick={() => navigate('/signup')}>Create one</span></p>
          </div>
        </div>

        <div className="auth-illustration">
          <div className="glass-panel">
            <h3>Discover more with us</h3>
            <p>Join a community of thousands and unlock premium features.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;