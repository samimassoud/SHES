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
        <button className="close-button" onClick={onClose}>×</button>

        <form className="modal-form">
          {/* Read-only Fields */}
          <div className="form-group">
            <label>Doctor ID</label>
            <input
              value={editedDoctor.id}
              readOnly
              className="read-only-field"
            />
          </div>

          <div className="form-group">
            <label>Join Date</label>
            <input
              value={new Date(editedDoctor.joinDate).toLocaleDateString()}
              readOnly
              className="read-only-field"
            />
          </div>

          {/* Editable Fields */}
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

          <div className="form-group">
            <label htmlFor="rating">Rating (1-5)</label>
            <input
              id="rating"
              type="number"
              name="rating"
              min="1"
              max="5"
              step="0.1"
              value={editedDoctor.rating}
              onChange={handleChange}
            />
          </div>

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