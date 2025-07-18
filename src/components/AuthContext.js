import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, getMe, logout as apiLogout } from '../config/api';
import { Navigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user info on mount (if token/cookie exists)
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await getMe();
        setUser(res.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(username, password);
      const res = await getMe();
      setUser(res.user);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      setUser(null);
      setLoading(false);
      return false;
    }
  };


  const logout = async () => {
    try {
      await apiLogout();
    } catch (err) {
      // ignore error
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ProtectedRoute component
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading ) return <div style={{ textAlign: 'center', marginTop: 80 }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}; 