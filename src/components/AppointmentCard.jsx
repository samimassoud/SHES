import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/AppointmentCard.css';

function AppointmentCard({ title, subtitle, date, daysLeft, role }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Dynamically assign options based on role
  const getOptions = () => {
    switch (role) {
      case "doctor":
        return ["Mark as Completed", "Reschedule"];
      case "patient":
        return ["Cancel Appointment", "Request Reschedule"];
      case "admin":
        return ["Require a Revision", "View Schedule"];
      case "it":
        return ["Approve", "Reject", "Request More Info"];
      default:
        return [];
    }
  };

  const options = getOptions();
  return (
    <div 
      className={`appointment-card ${expanded ? 'expanded' : ''}`}
      onClick={toggleExpand}
      role="button"
      tabIndex="0"
      aria-expanded={expanded}
      onKeyDown={(e) => e.key === 'Enter' && toggleExpand()}
    >
      <div className="appointment-card-content">
        <h3>{title}</h3>
        <p className="appointment-subtitle">{subtitle}</p>
        <p className="appointment-date">Date: {date}</p>
        {daysLeft !== "N/A" && (
          <p className="appointment-days-left">Days Left: {daysLeft}</p>
        )}
      </div>

      {expanded && (
        <div className="appointment-card-options">
          {options.map((option, index) => (
            <button
              key={index}
              className="option-button"
              onClick={(e) => e.stopPropagation()}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

AppointmentCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  daysLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(PropTypes.string),
};

export default AppointmentCard;