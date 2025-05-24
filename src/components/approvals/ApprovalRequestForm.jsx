import React, { useState, useEffect } from 'react';
import { doctors, warehouseItems } from '../../mocks/mockData';
import './ApprovalRequestForm.css';

function ApprovalRequestForm({ userId, userRole, onSubmit }) {
  const [requestType, setRequestType] = useState('absence');
  const [dates, setDates] = useState([]);
  const [reason, setReason] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [supplyItems, setSupplyItems] = useState([]);
  const [suggestedItems, setSuggestedItems] = useState([]);

  // Load suggested supply items when type changes
  useEffect(() => {
    if (requestType === 'supply') {
      const criticalItems = warehouseItems.filter(
        item => item.QuantityInStock < item.ReorderThreshold
      );
      setSuggestedItems(criticalItems.slice(0, 3));
    }
  }, [requestType]);

  const handleDateAdd = (date) => {
    if (!dates.includes(date)) {
      setDates([...dates, date]);
    }
  };

  const handleSupplyItemAdd = (item) => {
    if (!supplyItems.some(i => i.ItemID === item.ItemID)) {
      setSupplyItems([...supplyItems, {
        ...item,
        RequestedQty: Math.ceil(item.AverageMonthlyUsage / 2) // Default to half monthly usage
      }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const requestData = {
      requestType,
      requesterId: userId,
      requestDate: new Date().toISOString(),
      requesterName: userRole === 'doctor' 
      ? doctors.find(d => d.id === userId)?.name
      : 'IT Department',
      status: 'pending'
    };

    if (requestType === 'absence') {
      requestData.absenceDetails = {
        doctorId: selectedDoctor || userId,
        dates,
        reason
      };
    } else {
      requestData.supplyDetails = {
        items: supplyItems,
        reason
      };
    }

    onSubmit(requestData);
    resetForm();
  };

  const resetForm = () => {
    setDates([]);
    setReason('');
    setSupplyItems([]);
  };

  return (
    <div className="approval-form-container">
      <h2>New Approval Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Request Type</label>
          <div className="type-toggle">
            <button
              type="button"
              className={requestType === 'absence' ? 'active' : ''}
              onClick={() => setRequestType('absence')}
            >
              Absence Request
            </button>
            <button
              type="button"
              className={requestType === 'supply' ? 'active' : ''}
              onClick={() => setRequestType('supply')}
            >
              Supply Order
            </button>
          </div>
        </div>

        {requestType === 'absence' ? (
          <>
            <div className="form-group">
              <label>Doctor</label>
              {userRole === 'doctor' ? (
                <input 
                  type="text" 
                  value={doctors.find(d => d.id === userId)?.name || 'You'} 
                  disabled 
                />
              ) : (
                <select
                  value={selectedDoctor || ''}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.specialty})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="form-group">
              <label>Absence Dates</label>
              <input
                type="date"
                onChange={(e) => handleDateAdd(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="date-tags">
                {dates.map((date, i) => (
                  <span key={i} className="date-tag">
                    {new Date(date).toLocaleDateString()}
                    <button 
                      type="button" 
                      onClick={() => setDates(dates.filter(d => d !== date))}
                      className="tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Supplies Needed</label>
              {supplyItems.length > 0 && (
                <div className="supply-items">
                  {supplyItems.map((item, i) => (
                    <div key={i} className="supply-item">
                      <span>{item.ItemName}</span>
                      <input
                        type="number"
                        min="1"
                        max={item.AverageMonthlyUsage * 2}
                        value={item.RequestedQty}
                        onChange={(e) => {
                          const newItems = [...supplyItems];
                          newItems[i].RequestedQty = parseInt(e.target.value) || 0;
                          setSupplyItems(newItems);
                        }}
                      />
                      <span>{item.Unit}</span>
                      <button
                        type="button"
                        onClick={() => setSupplyItems(supplyItems.filter((_, idx) => idx !== i))}
                        className="item-remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="suggested-items">
                <p>Suggested Items (Low Stock):</p>
                {suggestedItems.map(item => (
                  <button
                    key={item.ItemID}
                    type="button"
                    onClick={() => handleSupplyItemAdd(item)}
                    className="suggested-item"
                  >
                    {item.ItemName} (Current: {item.QuantityInStock}/{item.ReorderThreshold})
                  </button>
                ))}
              </div>

              <select
                onChange={(e) => {
                  const item = warehouseItems.find(i => i.ItemID == e.target.value);
                  if (item) handleSupplyItemAdd(item);
                }}
              >
                <option value="">Select Additional Item</option>
                {warehouseItems.map(item => (
                  <option key={item.ItemID} value={item.ItemID}>
                    {item.ItemName} ({item.Category})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Reason/Notes</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            minLength={10}
          />
        </div>

        <button 
          type="submit" 
          disabled={
            (requestType === 'absence' && dates.length === 0) ||
            (requestType === 'supply' && supplyItems.length === 0)
          }
          className="submit-btn"
        >
          Submit for Approval
        </button>
      </form>
    </div>
  );
}

export default ApprovalRequestForm;