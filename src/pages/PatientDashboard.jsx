// src/pages/PatientDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/PatientDashboard.css';

function PatientDashboard() {
  // Soft dummy appointments list for now
  const appointments = [
    {
      id: 1,
      doctorName: "Dr. Emily Rose",
      specialty: "Dermatologist",
      date: "2024-07-05",
      daysLeft: 8,
      options: ["Request Cancel", "Request Reschedule"]
    },
    {
      id: 2,
      doctorName: "Dr. Adam Blake",
      specialty: "Cardiologist",
      date: "2024-07-10",
      daysLeft: 13,
      options: ["Request Cancel", "Request Reschedule"]
    }
  ];

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
            options={appt.options}
          />
        ))}
      </div>
    </div>
  );
}

export default PatientDashboard;
