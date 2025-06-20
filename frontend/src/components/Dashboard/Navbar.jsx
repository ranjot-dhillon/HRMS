import React from 'react';
import { useAuth } from '../../../context/authContext';
import './Navbar.css'; // Make sure the path is correct

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="navbar-text">
        Welcome, {user?.name || 'Admin'}
      </div>

      <button className="logout-button" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
