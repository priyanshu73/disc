import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './components/LoginPage';
import AssessmentPage from './components/AssessmentPage';
import ResultsPage from './components/ResultsPage';
import DashboardPage from './components/DashboardPage';
import SettingsPage from './components/SettingsPage';
import StudentResultsPage from './components/StudentResultsPage';
import { AuthProvider, ProtectedRoute } from './components/AuthContext';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login' 

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
        <Route path="/results/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        
        {/* Instructor routes */}
        <Route path="/instructor/student/:studentId" element={<ProtectedRoute><StudentResultsPage /></ProtectedRoute>} />
        <Route path="/instructor/student/:studentId/result/:id" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

const AppWithRouter = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWithRouter;
