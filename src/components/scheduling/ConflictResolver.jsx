import React, { useState, useEffect } from 'react';
import { appointments, doctors, approvalRequests } from '../../mocks/mockData';
import './ConflictResolver.css';

function ConflictResolver({ appointment, onResolve }) {
  const [conflictType, setConflictType] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Detect conflict type on mount
  useEffect(() => {
    detectConflict();
  }, []);

  const detectConflict = () => {
    // Check for hard conflict (doctor absence)
    const doctorAbsence = approvalRequests.find(
      req => req.Type === 'absence' && 
      req.DoctorID === appointment.doctorId &&
      req.Status === 'approved' &&
      req.Dates.includes(appointment.date)
    );

    if (doctorAbsence) {
      setConflictType('hard');
      findAlternativeSlots(appointment.doctorId);
      return;
    }

    // Check for soft conflict (cancelled/postponed)
    const originalAppointment = appointments.find(
      appt => appt.id === appointment.originalId
    );
    
    if (originalAppointment?.status === 'cancelled' || 
        originalAppointment?.status === 'postponed') {
      setConflictType('soft');
      return;
    }
  };

  const findAlternativeSlots = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    const sameSpecialtyDoctors = doctors.filter(
      d => d.specialty === doctor.specialty && d.id !== doctorId
    );

    // Sort by rating (performance)
    sameSpecialtyDoctors.sort((a, b) => b.rating - a.rating);

    // Mock available slots - in reality would query backend
    const slots = sameSpecialtyDoctors.map(doctor => ({
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: appointment.date, // Same date
      time: appointment.time, // Same time
      type: 'same-time'
    }));

    // Add slots with same doctor at different times
    slots.push({
      doctorId: appointment.doctorId,
      doctorName: doctor.name,
      date: getNextAvailableDate(appointment.date),
      time: '10:00', // Example
      type: 'same-doctor'
    });

    setAvailableSlots(slots);
  };

  const getNextAvailableDate = (currentDate) => {
    // Simple mock - would query doctor's calendar in reality
    const date = new Date(currentDate);
    date.setDate(date.getDate() + 2);
    return date.toISOString().split('T')[0];
  };

  const handleReschedule = () => {
    onResolve({
      originalAppointment: appointment,
      newSlot: selectedSlot,
      resolutionType: conflictType
    });
  };

  if (!conflictType) return null;

  return (
    <div className="conflict-modal">
      <h3>
        {conflictType === 'hard' 
          ? 'Doctor Unavailable' 
          : 'Appointment Slot Available'}
      </h3>

      {conflictType === 'hard' ? (
        <>
          <p>Your doctor is unavailable on {appointment.date}. Choose an alternative:</p>
          
          <div className="slot-options">
            {availableSlots.map((slot, index) => (
              <div 
                key={index} 
                className={`slot-option ${selectedSlot?.doctorId === slot.doctorId && selectedSlot?.date === slot.date ? 'selected' : ''}`}
                onClick={() => setSelectedSlot(slot)}
              >
                <div className="slot-details">
                  <strong>Dr. {slot.doctorName}</strong>
                  <span>{slot.date} at {slot.time}</span>
                </div>
                <div className="slot-type">
                  {slot.type === 'same-time' 
                    ? 'Same time, different doctor' 
                    : 'Same doctor, different time'}
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={handleReschedule}
            disabled={!selectedSlot}
          >
            Confirm Reschedule
          </button>
        </>
      ) : (
        <>
          <p>An earlier slot with your doctor has become available!</p>
          <p>Would you like to move your appointment?</p>
          
          <div className="soft-conflict-actions">
            <button onClick={() => onResolve({
              originalAppointment: appointment,
              resolutionType: 'keep-current'
            })}>
              Keep Current Appointment
            </button>
            <button onClick={() => onResolve({
              originalAppointment: appointment,
              resolutionType: 'take-new-slot'
            })}>
              Take Earlier Slot
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ConflictResolver;

/*
Key improvements made:

Hard Conflict Resolution:

Automatically detects when a doctor has approved absence

Offers two types of alternatives:

Same time slot with different doctor (sorted by rating)

Same doctor at different time

Visual distinction between options

Soft Conflict Resolution:

Detects cancelled/postponed appointments

Simple binary choice for patients to take earlier slot or keep current

Will later integrate with the notification system for PatientDashboard

UI/UX Improvements:

Clear visual distinction between conflict types

Better slot selection interface

Responsive button states

Clean information hierarchy

Data Structure:

Works with your existing mock data structure

Prepares for backend integration with clear resolution types
*/
