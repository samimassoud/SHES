// src/pages/AdminDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard'; // Reusing again!
import '../styles/AdminDashboard.css';
import { doctors } from '../mocks/mockData';
function AdminDashboard() {
  

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
            role="admin"
          />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
