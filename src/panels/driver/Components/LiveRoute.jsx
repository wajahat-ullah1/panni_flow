import React, { useState } from 'react';
import './LiveRoute.css';

const LiveRoute = () => {
  const [currentDelivery] = useState({
    id: 'ORD-2448',
    customer: 'Zainab Ali',
    location: 'Malir Cantt, Karachi',
    eta: '12 mins',
    distance: '2.1 km',
    status: 'Current Delivery'
  });

  const [todaysRoute] = useState([
    {
      id: 1,
      customer: 'Zainab Ali',
      location: 'Malir Cantt',
      time: '9:15 AM',
      amount: '4500L',
      status: 'In Transit'
    },
    {
      id: 2,
      customer: 'Aisha Malik',
      location: 'Gulshan-e-Iqbal',
      time: '10:30 AM',
      amount: '5000L',
      status: 'Pending'
    },
    {
      id: 3,
      customer: 'Hassan Ahmed',
      location: 'DHA Phase 5',
      time: '11:00 AM',
      amount: '3000L',
      status: 'Pending'
    }
  ]);

  const handleNavigate = () => {
    // This would open Google Maps or navigation app
    const destination = encodeURIComponent(currentDelivery.location);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank');
  };

  const handleCall = () => {
    // This would initiate a phone call
    console.log('Calling customer...');
  };

  const handleMarkArrived = () => {
    console.log('Marking delivery as arrived...');
  };

  const handleReportEmergency = () => {
    console.log('Reporting emergency...');
  };

  return (
    <div className="main-content">
        <header className="page-header">
          <h2 className="page-title">Live Route Tracking</h2>
          <p className="page-subtitle">Navigate to your delivery destinations</p>
        </header>

        <div className="live-route-content">
          {/* Current Delivery Card */}
          <div className="current-delivery-card">
            <div className="delivery-badge">
              <span>{currentDelivery.status}</span>
            </div>
            
            <div className="delivery-info-header">
              <div className="delivery-main-info">
                <h3 className="customer-name-large">{currentDelivery.customer}</h3>
                <p className="order-id">{currentDelivery.id}</p>
                
                <div className="delivery-meta">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeWidth="1.5" fill="none"/>
                      <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="white" strokeWidth="1.5" fill="none"/>
                      <path d="M8 14C10 14 13 11 13 8C13 7 12 3 8 3C4 3 3 7 3 8C3 11 6 14 8 14Z" stroke="white" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span>{currentDelivery.location}</span>
                  </div>
                  
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="white" strokeWidth="1.5"/>
                      <path d="M8 4V8L11 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>ETA: {currentDelivery.eta}</span>
                  </div>
                </div>
              </div>
              
              <div className="delivery-icon">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="2" y="6" width="20" height="17" rx="2" stroke="white" strokeWidth="2"/>
                  <path d="M22 11H27L31 15V23H22V11Z" stroke="white" strokeWidth="2"/>
                  <circle cx="8" cy="26" r="3" stroke="white" strokeWidth="2"/>
                  <circle cx="25" cy="26" r="3" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
            </div>

            <div className="distance-info">
              <span className="distance-label">Distance:</span>
              <span className="distance-value">{currentDelivery.distance}</span>
            </div>

            <div className="action-buttons">
              <button className="btn-navigate" onClick={handleNavigate}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3L17 8V17H13V12H7V17H3V8L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Navigate
              </button>
              
              <button className="btn-call" onClick={handleCall}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M18 13.5V16.5C18 17.0523 17.5523 17.5 17 17.5H15.5C8.59644 17.5 3 11.9036 3 5V3.5C3 2.94772 3.44772 2.5 4 2.5H7L8.5 6.5L6.5 7.5C7.5 9.5 9.5 11.5 11.5 12.5L12.5 10.5L16.5 12L18 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Estimated Arrival Info */}
          <div className="arrival-info-card">
            <div className="arrival-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3L17 8V17H13V12H7V17H3V8L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="arrival-text">
              <p className="arrival-label">Estimated Arrival</p>
              <p className="arrival-time">{currentDelivery.eta}</p>
            </div>
            <div className="arrival-distance">
              <p className="distance-label-small">Distance</p>
              <p className="distance-value-small">{currentDelivery.distance}</p>
            </div>
          </div>

          {/* Interactive Map Placeholder */}
          <div className="map-container">
            <div className="map-placeholder">
              <div className="map-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="#00A6FB"/>
                  <path d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z" stroke="white" strokeWidth="2"/>
                  <path d="M24 20C25.6569 20 27 21.3431 27 23C27 24.6569 25.6569 26 24 26C22.3431 26 21 24.6569 21 23C21 21.3431 22.3431 20 24 20Z" stroke="white" strokeWidth="2"/>
                  <path d="M24 32C26 32 29 29 29 26C29 25 28 21 24 21C20 21 19 25 19 26C19 29 22 32 24 32Z" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="map-title">Interactive Map View</h3>
              <p className="map-description">Real-time route navigation with Google Maps</p>
            </div>
          </div>

          {/* Today's Route Section */}
          <div className="todays-route-section">
            <h3 className="section-title">Today's Route</h3>
            
            <div className="route-list">
              {todaysRoute.map((delivery) => (
                <div key={delivery.id} className={`route-item ${delivery.status === 'In Transit' ? 'active' : ''}`}>
                  <div className="route-number">
                    <span>{delivery.id}</span>
                  </div>
                  
                  <div className="route-details">
                    <div className="route-header">
                      <h4 className="route-customer">{delivery.customer}</h4>
                      {delivery.status === 'In Transit' && (
                        <span className="transit-badge">In Transit</span>
                      )}
                    </div>
                    <p className="route-location">{delivery.location} • {delivery.time}</p>
                  </div>
                  
                  <div className="route-amount">
                    <span>{delivery.amount}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="route-actions">
              <button className="btn-mark-arrived" onClick={handleMarkArrived}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2"/>
                  <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Mark Arrived
              </button>
              
              <button className="btn-report-emergency" onClick={handleReportEmergency}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Report Emergency
              </button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default LiveRoute;
