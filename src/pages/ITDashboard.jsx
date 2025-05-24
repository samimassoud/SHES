import React, { useState } from 'react';
import AppointmentCard from '../components/AppointmentCard';
import '../styles/ITDashboard.css';
import { signupRequests } from '../mocks/mockData';
import DoctorProfileModal from '../components/DoctorProfileModal';
import DoctorSearch from '../components/search/DoctorSearch';
import PerformanceScoreCard from '../components/performance/performanceScoreCard';

// Inventory Components
import InventoryAlertBanner from '../components/inventory/InventoryAlertBanner';
import InventoryTracker from '../components/inventory/InventoryTracker';
import SmartPlanGenerator from '../components/inventory/SmartPlanGenerator';
import EventCalendar from '../components/inventory/EventCalendar';

function ITDashboard() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState('doctors'); // Initialize active tab

  return (
    <div className="it-dashboard-container">
      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'doctors' ? 'active' : ''}
          onClick={() => setActiveTab('doctors')}
        >
          Doctor Management
        </button>
        <button 
          className={activeTab === 'signup-requests' ? 'active' : ''}
          onClick={() => setActiveTab('signup-requests')}
        >
          Signup Requests
        </button>
        <button 
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'doctors' && (
          <>
            <h1>Doctor Management</h1>
            <DoctorSearch onDoctorSelect={setSelectedDoctor} />
            {selectedDoctor && (
              <>
              <DoctorProfileModal
                doctor={selectedDoctor}
                onClose={() => setSelectedDoctor(null)}
              />
              <PerformanceScoreCard
               doctorId={selectedDoctor.id}
               onClose={() => setSelectedDoctor(null)}
                />
              </>
            )}
          </>
        )}

        {activeTab === 'signup-requests' && (
          <>
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
          </>
        )}

        {activeTab === 'inventory' && (
          <div className="inventory-management">
            <h1>Inventory Management</h1>
            
            {/* Real-time alerts at the top */}
            <InventoryAlertBanner />
            
            {/* Main inventory grid */}
            <div className="inventory-grid">
              {/* Left column - Events and Planning */}
              <div className="inventory-sidebar">
                <EventCalendar />
                <SmartPlanGenerator />
              </div>
              
              {/* Right column - Main inventory table */}
              <div className="inventory-main">
                <InventoryTracker />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ITDashboard;