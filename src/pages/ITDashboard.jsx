// src/pages/ITDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard'; // Reusing AppointmentCard smartly
import '../styles/ITDashboard.css';

function ITDashboard() {
  const signupRequests = [
    {
      id: 1,
      nationalID: "12345678901234",
      email: "john.doe@example.com",
      requestDate: "2024-06-01"
    },
    {
      id: 2,
      nationalID: "56789012345678",
      email: "sara.lee@example.com",
      requestDate: "2024-06-03"
    }
  ];

  return (
    <div className="it-dashboard-container">
      <h1>Signup Requests</h1>

      <div className="cards-grid">
        {signupRequests.map((req) => (
          <AppointmentCard
            key={req.id}
            title={`National ID: ${req.nationalID}`}
            subtitle={`Email: ${req.email}`}
            date={`Requested On: ${req.requestDate}`}
            daysLeft={"N/A"}
            options={["Approve", "Reject"]}
          />
        ))}
      </div>
    </div>
  );
}

export default ITDashboard;
