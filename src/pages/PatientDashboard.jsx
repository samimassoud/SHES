// src/pages/PatientDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/PatientDashboard.css';
import { appointments } from '../mocks/mockData';
import DiagnosisBot from '../components/diagnosis-bot/DiagnosisBot';

function PatientDashboard() {
  const patientAppointments = appointments.filter(
    appt => appt.patientId === "1001" // Replace with logged-in patient's ID
  );

  const handleBookAppointment = (specialty) => {
    // Logic to filter doctors by specialty
    console.log(`Booking with ${specialty} specialist`);
  };

  return (
    <div className="patient-dashboard-container">
      <h1>Welcome to Your Dashboard</h1>
      <DiagnosisBot onBookAppointment={handleBookAppointment} />
      <div className="cards-grid">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            title={appt.doctorName}
            subtitle={appt.specialty}
            date={appt.date}
            daysLeft={appt.daysLeft}
            role="patient"
          />
        ))}
      </div>
    </div>
  );
}

export default PatientDashboard;
