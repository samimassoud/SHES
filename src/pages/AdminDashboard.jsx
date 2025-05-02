// src/pages/AdminDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard'; // Reusing again!
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const doctors = [
    {
      id: 1,
      name: "Dr. Emily Rose",
      specialty: "Dermatologist",
      joinDate: "2022-03-01"
    },
    {
      id: 2,
      name: "Dr. Adam Blake",
      specialty: "Cardiologist",
      joinDate: "2021-08-15"
    }
  ];

  return (
    <div className="admin-dashboard-container">
      <h1>Hospital Staff - Doctors</h1>

      <div className="cards-grid">
        {doctors.map((doc) => (
          <AppointmentCard
            key={doc.id}
            title={doc.name}
            subtitle={doc.specialty}
            date={`Joined: ${doc.joinDate}`}
            daysLeft={"N/A"}
            options={["Suspend Doctor"]}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
