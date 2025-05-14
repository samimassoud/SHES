import React, { useState } from 'react';
import { appointments } from '../../mocks/mockData';
import './ConflictResolver.css';

function ConflictResolver({ selectedSlot, onResolve }) {
  const [resolution, setResolution] = useState('reschedule');
  
  // Simulate conflict detection
  const conflictingAppointments = appointments.filter(appt => 
    appt.date === selectedSlot.date && 
    appt.status === 'upcoming'
  );

  const handleSubmit = () => {
    onResolve({
      originalSlot: selectedSlot,
      resolution,
      newSlot: resolution === 'reschedule' ? findNextAvailableSlot() : null
    });
  };

  const findNextAvailableSlot = () => {
    // Mock logic - in reality, call backend
    return { date: '2024-07-10', time: '10:00' };
  };

  if (conflictingAppointments.length === 0) return null;

  return (
    <div className="conflict-modal">
      <h3>Schedule Conflict Detected</h3>
      <p>There are {conflictingAppointments.length} appointments at this time.</p>
      
      <div className="resolution-options">
        <label>
          <input 
            type="radio" 
            value="reschedule" 
            checked={resolution === 'reschedule'}
            onChange={() => setResolution('reschedule')}
          />
          Reschedule to next available slot
        </label>
        <label>
          <input 
            type="radio" 
            value="override" 
            checked={resolution === 'override'}
            onChange={() => setResolution('override')}
          />
          Keep anyway (override)
        </label>
      </div>

      <button onClick={handleSubmit}>Confirm</button>
    </div>
  );
}

export default ConflictResolver;