import React, { useState, useEffect } from 'react';
import { medicalHistory, doctors } from '../../mocks/mockData';
import './MedicalHistorySection.css';

function MedicalHistorySection({ patientId }) {
  /*
  if (viewMode === 'doctor') {
  // Verify the doctor has current appointments with this patient
  const hasValidAccess = props.validateAccess && props.validateAccess();
  if (!hasValidAccess) {
    return <div className="access-denied">Access to medical history not authorized</div>;
  }
}
  */
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRecord, setExpandedRecord] = useState(null);

  // Load and filter records
  useEffect(() => {
    let filtered = medicalHistory.filter(record => 
      record.PatientID === patientId
    );

    if (filter !== 'all') {
      filtered = filtered.filter(record => record.RecordType === filter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(record =>
        record.Diagnosis.toLowerCase().includes(term) ||
        record.Prescription.toLowerCase().includes(term) ||
        record.Notes?.toLowerCase().includes(term)
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.Date) - new Date(a.Date));
    
    setRecords(filtered);
  }, [patientId, filter, searchTerm]);

  const getDoctorName = (doctorId) => {
    return doctors.find(d => d.id === doctorId)?.name || 'Unknown Doctor';
  };

  const toggleExpandRecord = (recordId) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  return (
    <div className="medical-history">
      <div className="history-header">
        <h2>Medical History</h2>
        <div className="controls">
          <div className="filter-group">
            <label>Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Records</option>
              <option value="diagnosis">Diagnoses</option>
              <option value="treatment">Treatments</option>
              <option value="procedure">Procedures</option>
              <option value="vaccination">Vaccinations</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {records.length === 0 ? (
        <p className="no-records">No medical records found</p>
      ) : (
        <div className="timeline">
          {records.map((record) => (
            <div 
              key={record.RecordID} 
              className={`timeline-item ${expandedRecord === record.RecordID ? 'expanded' : ''}`}
            >
              <div 
                className="timeline-header"
                onClick={() => toggleExpandRecord(record.RecordID)}
              >
                <div className="timeline-date">
                  {new Date(record.Date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="timeline-title">
                  <h4>{record.Diagnosis || 'Medical Record'}</h4>
                  <span className="doctor-name">
                    {getDoctorName(record.DoctorID)}
                  </span>
                </div>
                <div className="timeline-arrow">
                  {expandedRecord === record.RecordID ? '▼' : '▶'}
                </div>
              </div>
              
              {expandedRecord === record.RecordID && (
                <div className="timeline-details">
                  <div className="detail-row">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value">{record.RecordType || 'General'}</span>
                  </div>
                  {record.Prescription && (
                    <div className="detail-row">
                      <span className="detail-label">Prescription:</span>
                      <span className="detail-value">{record.Prescription}</span>
                    </div>
                  )}
                  {record.Notes && (
                    <div className="detail-row">
                      <span className="detail-label">Notes:</span>
                      <p className="detail-value notes">{record.Notes}</p>
                    </div>
                  )}
                  {record.Attachments && (
                    <div className="attachments">
                      <span className="detail-label">Attachments:</span>
                      <div className="attachment-list">
                        {record.Attachments.map((file, index) => (
                          <a 
                            key={index} 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="attachment-item"
                          >
                            {file.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicalHistorySection;