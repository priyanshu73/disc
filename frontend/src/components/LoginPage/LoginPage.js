import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { login, loading} = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const success = await login(form.username, form.password);
    if (success) {
      // Navigate to dashboard - the DashboardPage will handle instructor vs student routing
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  if (!showForm) {
    return (
      <div className="login-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <img src="/disc/faviconn.png" alt="GBURG CS Logo" className="logo-icon" />
            <span className="logo-text1">GBURG CS</span>
          </div>
          <h1 className="login-title">DiSC Assessment</h1>
          <p className="login-subtitle">Sign in to access the portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} className="login-button">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          
          {error && <div className="error-message">{error}</div>}
        </form>
        
        <div className="login-footer">
          <p className="footer-text">
            GBURG CS DiSC Assessment Platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 