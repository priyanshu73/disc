import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';
import NavbarSkeleton from './NavbarSkeleton';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const firstName = user?.firstname || 'User';

  // Highlight active tab
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  // Show skeleton while loading
  if (loading) {
    return <NavbarSkeleton />;
  }

  return (
    <nav className="navbar navbar-cool">
      <div className="navbar-left">
        {user?.is_instructor ? (
          <>
            <Link to="/" className={`navbar-link${isActive('/instructor') ? ' active' : ''}`}>Dashboard</Link>
            {/* Add more instructor-specific links here if needed */}
          </>
        ) : (
          <>
            <Link to="/dashboard" className={`navbar-link${isActive('/dashboard') ? ' active' : ''}`}>Dashboard</Link>
            <Link to="/assessment" className={`navbar-link${isActive('/assessment') ? ' active' : ''}`}>Assessment</Link>
          </>
        )}
      </div>
      <div className="navbar-right">
        <span className="navbar-username">{firstName}</span>
        <div className="profile-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className="profile-icon" role="img" aria-label="profile">👤</span>
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/settings'); }}>
                <FontAwesomeIcon icon={faGear} style={{ marginRight: 8 }} /> Settings
              </button>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} style={{ marginRight: 8 }} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .navbar.navbar-cool {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 40px;
          background: #fff;
          box-shadow: 0 2px 12px rgba(80,112,255,0.07);
          border-bottom: 1.5px solid #e0e7ff;
        }
        .navbar-link {
          margin-right: 28px;
          text-decoration: none;
          color: #2563eb;
          font-weight: 600;
          font-size: 1.13rem;
          padding: 7px 14px;
          border-radius: 7px;
          transition: background 0.18s, color 0.18s;
        }
        .navbar-link.active, .navbar-link:hover {
          background: #e0e7ff;
          color: #1e293b;
        }
        .navbar-link:last-child {
          margin-right: 0;
        }
        .navbar-right {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .navbar-username {
          font-weight: 600;
          color: #22223b;
          font-size: 1.08rem;
          margin-right: 8px;
        }
        .profile-icon {
          font-size: 1.5rem;
          cursor: pointer;
          margin-left: 2px;
        }
        .profile-dropdown {
          position: relative;
          display: inline-block;
        }
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 2.2rem;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          box-shadow: 0 8px 32px rgba(80,112,255,0.13);
          min-width: 150px;
          z-index: 10;
          padding: 8px 0 6px 0;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 10px 18px;
          background: none;
          border: none;
          text-align: left;
          color: #2563eb;
          font-size: 1rem;
          cursor: pointer;
          gap: 8px;
          text-decoration: none;
          border-radius: 6px;
          transition: background 0.15s;
        }
        .dropdown-item.logout-btn {
          color: #e11d48;
        }
        .dropdown-item:hover {
          background: #f1f5f9;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 