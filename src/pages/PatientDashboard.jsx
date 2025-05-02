// src/pages/PatientDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/PatientDashboard.css';
import { appointments } from '../mocks/mockData';
function PatientDashboard() {
  const patientAppointments = appointments.filter(
    appt => appt.patientId === "1001" // Replace with logged-in patient's ID
  );

  return (
    <div className="patient-dashboard-container">
      <h1>Welcome to Your Dashboard</h1>

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
