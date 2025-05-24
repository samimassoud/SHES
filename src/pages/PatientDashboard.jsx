// src/pages/PatientDashboard.js

import React, { useState, useEffect } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/PatientDashboard.css';
import { appointments as patientAppointments } from '../mocks/mockData';
import DiagnosisBot from '../components/diagnosis-bot/DiagnosisBot';
import ConflictResolver from '../components/scheduling/ConflictResolver';
import FeedbackForm from '../components/feedback/FeedbackForm';
import MedicalHistorySection from '../components/patient/MedicalHistorySection';

function PatientDashboard() {
  
  const [conflicts, setConflicts] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [completedAppointments, setCompletedAppointments] = useState([]);

  // Mock conflict detection - replace with real data
  // useEffect(() => {
  //   const mockConflicts = appointments.filter(
  //     appt => appt.patientId === "1001" && 
  //     appt.status === 'conflict'
  //   );
  //   setConflicts(mockConflicts);
  // }, []);
  useEffect(() => {
  const completed = patientAppointments.filter(
    appt => appt.patientId === "1001" && 
    appt.status === 'completed'
  );
  setCompletedAppointments(completed);
  }, []);

  const handleFeedbackSubmit = async (feedbackData) => {
  try {
    // In a real app, this would be an API call
    console.log('Submitting feedback:', feedbackData);
    
    // Update mock data or state as needed
    setSelectedAppointment(null);
    alert('Thank you for your feedback!');
  } catch (error) {
    console.error('Feedback submission failed:', error);
  }
};

  const handleConflictResolution = (resolution) => {
    console.log('Handling resolution:', resolution);
    // Update backend + local state
    setConflicts(conflicts.filter(c => c.id !== resolution.originalAppointment.id));
  };

  const handleBookAppointment = (specialty) => {
    // Logic to filter doctors by specialty
    console.log(`Booking with ${specialty} specialist`);
  };

  const [selectedSlot, setSelectedSlot] = useState(null);

  return (
    <div className="patient-dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <DiagnosisBot onBookAppointment={handleBookAppointment} />
      <MedicalHistorySection patientId="1001" /> 
      <div className="cards-grid">
        {patientAppointments.map((appt) => {
          const hasConflict = conflicts.some(c => c.doctorId === appt.doctorId);
          return (
          <AppointmentCard
            key={appt.id}
            title={appt.doctorName}
            subtitle={appt.specialty}
            date={appt.date}
            daysLeft={appt.daysLeft}
            role="patient"
            onClick={() => {
                if (hasConflict) {
                  setSelectedAppointment(appt);
                }
              }}
          />
            );
        })}
      </div>

      {/* Conflict Resolver (for new bookings) */}
      {selectedAppointment 
      && conflicts.some(c => c.doctorId === selectedAppointment.doctorId) 
       && (
        <ConflictResolver 
          appointment={selectedAppointment}
          onResolve={handleConflictResolution}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* Feedback Form (for existing appointments) */}
      {selectedAppointment && 
        completedAppointments.some(appt => appt.id === selectedAppointment.id) && (
        <div className="feedback-section">
          <FeedbackForm 
            appointmentId={selectedAppointment.id} 
            onSubmit={handleFeedbackSubmit}
          />
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
