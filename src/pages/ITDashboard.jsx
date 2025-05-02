// src/pages/ITDashboard.js

import React from 'react';
import AppointmentCard from '../components/AppointmentCard'; // Reusing AppointmentCard smartly
import '../styles/ITDashboard.css';
import Fuse from "fuse.js";
import {doctors} from "../mocks/mockData";
import { signupRequests } from '../mocks/mockData';
import DoctorProfileModal from '../components/DoctorProfileModal';
import { useState } from 'react'; 
function ITDashboard() {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Fuzzy search setup
  const fuse = new Fuse(doctors, {
    keys: ["name"],
    threshold: 0.3, // Sensitivity (lower = stricter)
    includeScore: true,
  });

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : [];

  return (
    <div className="it-dashboard-container">
      <h1>Doctor Management</h1>

      {/* Search Bar */}
      {/* <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}> */}
      <div className={`search-container ${searchResults.length > 0 ? 'has-results' : ''}`}>
        <input
          type="text"
          placeholder="Search "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
          className="search-bar"
        />
      {/* Search Results */}
      {isSearchFocused && searchResults.length > 0 && (
          <div className="search-results-dropdown">
            {searchResults.map((doctor) => (
              <div
                key={doctor.id}
                className="search-result-item"
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setIsSearchFocused(false);
                }}
              >
                <div className="doctor-name">{doctor.name}</div>
                <div className="doctor-specialty">{doctor.specialty}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Profile Modal */}
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
