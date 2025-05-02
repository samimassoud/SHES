// src/components/DoctorProfileModal.jsx
import React, { useState } from "react";
import '../styles/ITDashboard.css';

function DoctorProfileModal({ doctor, onClose }) {
  const [editedDoctor, setEditedDoctor] = useState({ ...doctor });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDoctor({ ...editedDoctor, [name]: value });
  };

  const handleSave = () => {
    // Send updated data to backend (or update mockData)
    console.log("Saved:", editedDoctor);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="doctor-profile-modal">
        <h2>Edit Doctor Profile</h2>
        
        <form className="modal-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={editedDoctor.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <input
              id="specialty"
              type="text"
              name="specialty"
              value={editedDoctor.specialty}
              onChange={handleChange}
            />
          </div>

          {/* Add more fields as needed */}

          <div className="modal-actions">
            <button type="button" className="close-button" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DoctorProfileModal;