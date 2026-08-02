import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import './auth.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
        setCurrentUser(data.user.id);
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during signup. Is the backend running?");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper reverse">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Create Account</h2>
            <p className="auth-subtitle">Join us and start your journey</p>
          </div>
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="John Doe"
                required 
              />
            </div>
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
              <span>Sign Up</span>
            </button>
          </form>
          <div className="auth-footer">
            <p>Already have an account? <span className="auth-link" onClick={() => navigate('/auth')}>Sign in</span></p>
          </div>
        </div>

        <div className="auth-illustration signup-bg">
          <div className="glass-panel">
            <h3>Empower Your Work</h3>
            <p>Access cutting-edge tools designed for modern professionals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;