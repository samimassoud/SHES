import React, { useState } from 'react';
import './ApprovalRequestForm.css';

function ApprovalRequestForm({ userId, onSubmit }) {
  const [requestType, setRequestType] = useState('absence');
  const [dates, setDates] = useState([]);
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ userId, requestType, dates, reason });
    setDates([]);
    setReason('');
  };

  return (
    <form className="approval-form" onSubmit={handleSubmit}>
      <h3>Submit Request</h3>
      <div className="form-group">
        <label>Request Type:</label>
        <select 
          value={requestType} 
          onChange={(e) => setRequestType(e.target.value)}
        >
          <option value="absence">Absence Request</option>
          <option value="supply">Supply Order</option>
        </select>
      </div>

      <div className="form-group">
        <label>Dates:</label>
        <input 
          type="date" 
          onChange={(e) => setDates([...dates, e.target.value])} 
        />
        {dates.map((date, i) => (
          <span key={i} className="date-tag">
            {new Date(date).toLocaleDateString()}
          </span>
        ))}
      </div>

      <div className="form-group">
        <label>Reason:</label>
        <textarea 
          value={reason} 
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <button type="submit">Submit for Approval</button>
    </form>
  );
}

export default ApprovalRequestForm;