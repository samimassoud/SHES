// src/components/AppointmentCard.js

import React, { useState } from 'react';
import '../styles/AppointmentCard.css';

function AppointmentCard({ title, subtitle, date, daysLeft, options = [] }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="card-container" onClick={toggleExpand}>
      <div className="card-content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <p>Date: {date}</p>
        <p>Days Left: {daysLeft}</p>
      </div>

      {expanded && (
        <div className="card-options">
          {options.map((option, index) => (
            <button key={index} className="option-button">{option}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
