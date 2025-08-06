import React from 'react';
import './NavbarSkeleton.css';

const NavbarSkeleton = () => {
  return (
    <nav className="navbar navbar-cool">
      <div className="navbar-logo">
        <div className="logo-skeleton"></div>
      </div>
      <div className="navbar-center">
        <div className="navbar-link-skeleton"></div>
        <div className="navbar-link-skeleton"></div>
      </div>
      <div className="navbar-right">
        <div className="profile-section-skeleton"></div>
      </div>
    </nav>
  );
};

export default NavbarSkeleton; 