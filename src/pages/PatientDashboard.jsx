// src/pages/PatientDashboard.js

import React, { useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/PatientDashboard.css';
import { appointments } from '../mocks/mockData';
import DiagnosisBot from '../components/diagnosis-bot/DiagnosisBot';
import ConflictResolver from '../components/scheduling/ConflictResolver';
import FeedbackForm from '../components/feedback/FeedbackForm';
import MedicalHistorySection from '../components/patient/MedicalHistorySection';

function PatientDashboard() {
  
  const patientAppointments = appointments.filter(
    appt => appt.patientId === "1001" // Replace with logged-in patient's ID
  );

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
        {patientAppointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            title={appt.doctorName}
            subtitle={appt.specialty}
            date={appt.date}
            daysLeft={appt.daysLeft}
            role="patient"
            onClick={() => setSelectedAppointment(appt)} // Add click handler
          />
        ))}
      </div>

      {/* Conflict Resolver (for new bookings) */}
      {selectedSlot && (
        <ConflictResolver 
          selectedSlot={selectedSlot}
          onResolve={(resolution) => {
            console.log('Resolution:', resolution);
            setSelectedSlot(null);
          }}
        />
      )}

      {/* Feedback Form (for existing appointments) */}
      {selectedAppointment && (
        <div className="feedback-section">
          <FeedbackForm 
            appointmentId={selectedAppointment.id} 
            onSubmit={(feedback) => {
              console.log('Feedback:', feedback);
              setSelectedAppointment(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default PatientDashboard;
