import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightFromBracket, faBars, faTimes, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../AuthContext';
import NavbarSkeleton from './NavbarSkeleton';
import './Navbar.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const firstName = user?.firstname || 'User';

  // Highlight active tab
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setDropdownOpen(false);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Show skeleton while loading
  if (loading) {
    return <NavbarSkeleton />;
  }

  // Don't render navbar if no user is logged in
  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-cool">
      {/* Logo Section */}
      <div className="navbar-logo">
        <Link to="/" className="logo-link">
          <div className="logo-container">
            <img src="/faviconn.png" alt="GBURG CS DiSC Logo" className="logo-icon" />
            <span className="logo-text">GBURG CS DiSC</span>
          </div>
        </Link>
      </div>

      {/* Desktop Navigation - Centered */}
      <div className="navbar-center">
        {user?.is_instructor ? (
          <>
            <Link to="/" className={`navbar-link${isActive('/instructor') ? ' active' : ''}`}>Dashboard</Link>
            <Link to="/students" className={`navbar-link${isActive('/students') ? ' active' : ''}`}>Students</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={`navbar-link${isActive('/dashboard') ? ' active' : ''}`}>Dashboard</Link>
            <Link to="/assessment" className={`navbar-link${isActive('/assessment') ? ' active' : ''}`}>Assessment</Link>
          </>
        )}
      </div>
      
      {/* Desktop Profile Section */}
      <div className="navbar-right">
        <div className="profile-section">
          <span className="navbar-username">{firstName}</span>
          <div className="profile-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className="profile-avatar">
              <FontAwesomeIcon icon={faUser} style={{color: "#ffffff"}} />
            </div>
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
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="mobile-menu-toggle" onClick={handleMobileMenuToggle}>
        <FontAwesomeIcon 
          icon={mobileMenuOpen ? faTimes : faBars} 
          className="hamburger-icon"
        />
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-username">{firstName}</span>
        </div>
        <div className="mobile-nav-links">
                     {user?.is_instructor ? (
             <>
               <Link 
                 to="/" 
                 className={`mobile-nav-link${isActive('/instructor') ? ' active' : ''}`}
                 onClick={handleNavLinkClick}
               >
                 Dashboard
               </Link>
               <Link 
                 to="/students" 
                 className={`mobile-nav-link${isActive('/students') ? ' active' : ''}`}
                 onClick={handleNavLinkClick}
               >
                 Students
               </Link>
             </>
          ) : (
            <>
              <Link 
                to="/dashboard" 
                className={`mobile-nav-link${isActive('/dashboard') ? ' active' : ''}`}
                onClick={handleNavLinkClick}
              >
                Dashboard
              </Link>
              <Link 
                to="/assessment" 
                className={`mobile-nav-link${isActive('/assessment') ? ' active' : ''}`}
                onClick={handleNavLinkClick}
              >
                Assessment
              </Link>
            </>
          )}
        </div>
        <div className="mobile-menu-footer">
          <button className="mobile-menu-btn" onClick={() => { setMobileMenuOpen(false); navigate('/settings'); }}>
            <FontAwesomeIcon icon={faGear} /> Settings
          </button>
          <button className="mobile-menu-btn logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={handleMobileMenuToggle} />}
    </nav>
  );
};

export default Navbar; 