// src/pages/DoctorDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/DoctorDashboard.css';

function DoctorDashboard() {
  const appointments = [
    {
      id: 1,
      patientName: "John Doe",
      purpose: "Routine Checkup",
      date: "2024-07-06",
      daysLeft: 9,
      options: ["Mark as Completed", "Reschedule Appointment"]
    },
    {
      id: 2,
      patientName: "Sara Lee",
      purpose: "Follow-up Consultation",
      date: "2024-07-12",
      daysLeft: 15,
      options: ["Mark as Completed", "Reschedule Appointment"]
    }
  ];

  return (
    <div className="doctor-dashboard-container">
      <h1>Welcome, Doctor</h1>

      <div className="cards-grid">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            title={`Patient: ${appt.patientName}`}
            subtitle={appt.purpose}
            date={appt.date}
            daysLeft={appt.daysLeft}
            options={appt.options}
          />
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;
