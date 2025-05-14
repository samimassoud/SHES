// src/pages/DoctorDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/DoctorDashboard.css';
import { appointments } from '../mocks/mockData';
import ApprovalRequestForm from '../components/approvals/ApprovalRequestForm';

function DoctorDashboard() {
  const doctorAppointments = appointments.filter(
    appt => appt.doctorId === "2001" // Replace with logged-in doctor's ID
  );

  return (
    <div className="doctor-dashboard-container">
      <h1>Welcome, Doctor</h1>
      <ApprovalRequestForm 
      userId="2001" // Doctor's ID
      onSubmit={(request) => console.log('Request:', request)}
    />
      <div className="cards-grid">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            title={`Patient: ${appt.patientName}`}
            subtitle={appt.purpose}
            date={appt.date}
            daysLeft={appt.daysLeft}
            role="doctor"
          />
        ))}
      </div>
    </div>
  );
}

export default DoctorDashboard;
