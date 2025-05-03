import React, { useState } from 'react';

const BotMessage = ({ message, onBookAppointment }) => {
  const [showReasoning, setShowReasoning] = useState(false);

  return (
    <div className={`message ${message.sender}`}>
      <div className="message-text">{message.text}</div>
      
      {message.isDiagnosis && (
        <div className="diagnosis-footer">
          <button 
            className="reasoning-btn"
            onClick={() => setShowReasoning(!showReasoning)}
          >
            {showReasoning ? "Hide Reasoning" : "How I Diagnosed This"}
          </button>
          
          {showReasoning && message.reasoning.length > 0 && (
            <div className="reasoning">
              <h4>Diagnostic Path:</h4>
              <ul>
                {message.reasoning.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="recommendation">
            <strong>Important:</strong> This is not a substitute for professional 
            medical advice. Please see a doctor.
          </div>

          <button 
            className="book-btn"
            onClick={() => onBookAppointment(message.specialty)}
          >
            Book Appointment with {message.specialty} Specialist
          </button>
        </div>
      )}
    </div>
  );
};

export default BotMessage;