// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('-dashboard');

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        SHES
      </div>
      <ul className="navbar-links">
        {isDashboard ? (
          <li>
            <Link to="/" className="logout-link">Log Out</Link>
          </li>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;