import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { login, loading } = useAuth();

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
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  if (!showForm) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f9fc',
      }}>
        <span style={{
          width: 48,
          height: 48,
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #4a90e2',
          borderRadius: '50%',
          display: 'inline-block',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <Link to="/dashboard"> Dashboard (for testing)</Link>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit" disabled={loading}>Login</button>
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </form>
      <style>{`
        .auth-container { max-width: 350px; margin: 60px auto; padding: 32px; background: #fff; border-radius: 12px; box-shadow: 0 2px 16px rgba(0,0,0,0.07); }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .auth-form input { padding: 10px 14px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 1rem; }
        .auth-form button { background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 10px 0; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 8px; }
        .auth-form button:disabled { background: #a5b4fc; cursor: not-allowed; }
        .auth-form button:hover:not(:disabled) { background: #1d4ed8; }
        .auth-container h2 { text-align: center; margin-bottom: 18px; }
      `}</style>
    </div>
  );
};

export default LoginPage; 