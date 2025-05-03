// src/pages/ITDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard'; // Reusing AppointmentCard smartly
import '../styles/ITDashboard.css';
import { signupRequests } from '../mocks/mockData';
import DoctorProfileModal from '../components/DoctorProfileModal';
import DoctorSearch from '../components/search/DoctorSearch';
import { useState } from 'react'; 
function ITDashboard() {

  // const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  // const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Fuzzy search setup
  // const fuse = new Fuse(doctors, {
  //   keys: ["name"],
  //   threshold: 0.3, // Sensitivity (lower = stricter)
  //   includeScore: true,
  // });

  // const searchResults = searchTerm
  //   ? fuse.search(searchTerm).map((result) => result.item)
  //   : [];

  return (
    <div className="it-dashboard-container">
      <h1>Doctor Management</h1>

<DoctorSearch onDoctorSelect={setSelectedDoctor} />

{selectedDoctor && (
  <DoctorProfileModal
    doctor={selectedDoctor}
    onClose={() => setSelectedDoctor(null)}
  />
)}

      <h1>Signup Requests</h1>

      <div className="cards-grid">
        {signupRequests.map((req) => (
          <AppointmentCard
            key={req.id}
            title={`National ID: ${req.nationalID}`}
            subtitle={`Email: ${req.email}`}
            date={`Requested On: ${req.requestDate}`}
            daysLeft={"N/A"}
            role="it"
          />
        ))}
      </div>
    </div>
  );
}

export default ITDashboard;
