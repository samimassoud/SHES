// src/components/Navbar.jsx
import React from 'react';
import {useContext} from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import { AuthContext } from '../context/AuthContext';
import { doctors } from '../mocks/mockData';
import ThemeToggle from './core/ThemeToggle';

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname.includes('-dashboard');
  const isDoctorDashboard = location.pathname.includes('doctor-dashboard');
  const { user, logout } = useContext(AuthContext);
  // Get doctor's info if logged in as doctor
  const doctor = isDoctorDashboard && user 
    ? doctors.find(doc => doc.id === user.id) 
    : null;
  const doctorRating = doctor ? doctor.rating : 0;

  const handleLogout = () => {
    logout();
    // Navigation will be handled by the link
  };
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        SHES
      </div>
      <div className="navbar-controls"> {/* New wrapper div */}
        <ThemeToggle /> {/* Add ThemeToggle */}
        <LanguageSwitcher /> {/* Add LanguageSwitcher */}

      <ul className="navbar-links">
        {isDashboard ? (
          <>
            {isDoctorDashboard && doctor && (
              <li className="star-rating-container">
                <div className="star-rating">
                  <div className="star-rating-fill" style={{ width: `${(doctorRating / 5) * 100}%` }}></div>
                  <div className="star-icon">★</div>
                </div>
                <span className="rating-text">{doctorRating.toFixed(1)}</span>
              </li>
            )}
            <li>
              {/* <Link to="/" className="logout-button " onClick={handleLogout}>Log Out</Link> */}
              <button onClick={handleLogout} className="logout-button">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </>
        )}
      </ul>
      </div>
    </nav>
  );
}

export default Navbar;