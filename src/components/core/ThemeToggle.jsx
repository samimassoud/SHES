import React from 'react';
import { useTheme } from '../../context/ThemeContext'; // Change this line
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme(); // Change this line

  return (
    <div className="theme-toggle">
      <label className="switch">
        <input 
          type="checkbox" 
          checked={theme === 'dark'} 
          onChange={toggleTheme} 
        />
        <span className="slider round"></span>
      </label>
      <span>{theme === 'light' ? '🌙' : '☀️'}</span>
    </div>
  );
}

export default ThemeToggle;