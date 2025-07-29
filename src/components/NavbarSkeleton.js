import React from 'react';
import './NavbarSkeleton.css';

const NavbarSkeleton = () => {
  return (
    <nav className="navbar navbar-cool">
      <div className="navbar-left">
        <div className="navbar-link-skeleton"></div>
        <div className="navbar-link-skeleton"></div>
      </div>
      <div className="navbar-right">
        <div className="navbar-username-skeleton"></div>
        <div className="profile-icon-skeleton"></div>
      </div>
    </nav>
  );
};

export default NavbarSkeleton; 