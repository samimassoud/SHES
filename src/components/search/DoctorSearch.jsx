import React, { useState } from 'react';
import Fuse from 'fuse.js';
import { doctors } from '../../mocks/mockData';
import './DoctorSearch.css';

const DoctorSearch = ({ onDoctorSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const fuse = new Fuse(doctors, {
    keys: ["name"],
    threshold: 0.3,
    includeScore: true,
  });

  const searchResults = searchTerm
    ? fuse.search(searchTerm).map((result) => result.item)
    : [];

  return (
    <div className={`search-container ${searchResults.length > 0 ? 'has-results' : ''}`}>
      <input
        type="text"
        placeholder="Search doctors..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
        className="search-bar"
      />
      {isSearchFocused && searchResults.length > 0 && (
        <div className="search-results-dropdown">
          {searchResults.map((doctor) => (
            <div
              key={doctor.id}
              className="search-result-item"
              onClick={() => {
                onDoctorSelect(doctor);
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
  );
};

export default DoctorSearch;