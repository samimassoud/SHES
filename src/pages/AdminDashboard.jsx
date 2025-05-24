// src/pages/AdminDashboard.js

import React, {useState, useEffect} from 'react';
import AppointmentCard from '../components/AppointmentCard'; // Reusing again!
import '../styles/AdminDashboard.css';
import { doctors } from '../mocks/mockData';
import ApprovalRequestForm from '../components/approvals/ApprovalRequestForm';
import PerformanceScoreCard from '../components/performance/performanceScoreCard';
import { approvalRequests } from '../mocks/mockData';

function AdminDashboard() {
   const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Load pending requests
    useEffect(() => {
      const pending = approvalRequests.filter(req => req.status === 'pending');
      setPendingRequests(pending);
    }, []);
    const handleApproveRequest = async (requestId) => {
    try {
      console.log('Approving request:', requestId);
      // await api.patch(`/approvals/${requestId}`, { status: 'approved' });
      setPendingRequests(pendingRequests.filter(req => req.requestId !== requestId));
      alert('Request approved');
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };
  const handleRejectRequest = async (requestId) => {
    try {
      console.log('Rejecting request:', requestId);
      // await api.patch(`/approvals/${requestId}`, { status: 'rejected' });
      setPendingRequests(pendingRequests.filter(req => req.requestId !== requestId));
      alert('Request rejected');
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };


  return (
    <div className="admin-dashboard-container">
      <h1>Hospital Staff - Doctors</h1>

      <div className="cards-grid">
        {doctors.map((doc) => (
          <div key={doc.id} className="doctor-card">
            <AppointmentCard
              key={doc.id}
              title={doc.name}
              subtitle={doc.specialty}
              date={`Joined: ${doc.joinDate}`}
              daysLeft={"N/A"}
              role="admin"
            />
            <PerformanceScoreCard doctorId={doc.id} compactMode={true} />
          </div>
        ))}
      </div>



      <h1>Approval Requests</h1>
      
      <div className="approval-queue">
        {pendingRequests.map(request => (
          <div key={request.requestId} className="request-card">
            <h3>{request.requestType === 'absence' ? 'Absence Request' : 'Supply Order'}</h3>
            <p>Requested by: {request.requesterName}</p>
            <p>Date: {new Date(request.requestDate).toLocaleString()}</p>
            
            {request.requestType === 'absence' ? (
              <div>
                <p>Dates: {request.absenceDetails.dates.join(', ')}</p>
                <p>Reason: {request.absenceDetails.reason}</p>
              </div>
            ) : (
              <div>
                <p>Items: {request.supplyDetails.items.map(i => i.ItemName).join(', ')}</p>
                <p>Reason: {request.supplyDetails.reason}</p>
              </div>
            )}
            
            <div className="request-actions">
              <button 
                onClick={() => handleApproveRequest(request.requestId)}
                className="approve-btn"
              >
                Approve
              </button>
              <button 
                onClick={() => handleRejectRequest(request.requestId)}
                className="reject-btn"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
