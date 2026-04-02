import React, { useState } from 'react';
import './AssignedDeliveries.css';

const AssignedDeliveries = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Deliveries');

  const [deliveries] = useState([
    {
      id: 'ORD-2451',
      status: 'Pending',
      priority: 'High Priority',
      customer: 'Aisha Malik',
      phone: '+92 300 1234567',
      location: 'Block 7, Gulshan-e-Iqbal, Karachi',
      distance: '4.2 km',
      scheduledTime: '10:30 AM',
      amount: '5000L',
      isPriority: true,
      isInTransit: false
    },
    {
      id: 'ORD-2452',
      status: 'Pending',
      priority: null,
      customer: 'Hassan Ahmed',
      phone: '+92 321 9876543',
      location: 'DHA Phase 5, Karachi',
      distance: '6.1 km',
      scheduledTime: '11:00 AM',
      amount: '3000L',
      isPriority: false,
      isInTransit: false
    },
    {
      id: 'ORD-2453',
      status: 'Pending',
      priority: null,
      customer: 'Fatima Khan',
      phone: '+92 333 4567890',
      location: 'Clifton Block 2, Karachi',
      distance: '8.5 km',
      scheduledTime: '1:00 PM',
      amount: '8000L',
      isPriority: false,
      isInTransit: false
    },
    {
      id: 'ORD-2449',
      status: 'In Transit',
      priority: 'High Priority',
      customer: 'Ibrahim Sheikh',
      phone: '+92 345 7891234',
      location: 'North Nazimabad, Block L, Karachi',
      distance: '3.3 km',
      scheduledTime: '9:45 AM',
      amount: '6000L',
      isPriority: true,
      isInTransit: true
    },
    {
      id: 'ORD-2448',
      status: 'Pending',
      priority: null,
      customer: 'Sara Ali',
      phone: '+92 300 5551234',
      location: 'Clifton Block 2, Karachi',
      distance: '8.5 km',
      scheduledTime: '1:00 PM',
      amount: '4500L',
      isPriority: false,
      isInTransit: false
    },
    {
      id: 'ORD-2447',
      status: 'Pending',
      priority: null,
      customer: 'Ahmed Raza',
      phone: '+92 312 9998877',
      location: 'Saddar, Karachi',
      distance: '5.2 km',
      scheduledTime: '2:30 PM',
      amount: '2500L',
      isPriority: false,
      isInTransit: false
    }
  ]);

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'All Deliveries' ||
      (filterStatus === 'Pending' && delivery.status === 'Pending') ||
      (filterStatus === 'In Transit' && delivery.status === 'In Transit') ||
      (filterStatus === 'High Priority' && delivery.isPriority);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="main-content">
        <header className="page-header">
          <div className="header-content">
            <div className="page-title-section">
              <h2 className="page-title">Assigned Deliveries</h2>
              <p className="page-subtitle">Manage and track your delivery orders</p>
            </div>
          </div>
        </header>

        <div className="page-content">
          <div className="search-filter-section">
            <div className="search-bar">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-dropdown">
              <svg className="filter-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 5H18M5 10H15M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option>All Deliveries</option>
                <option>Pending</option>
                <option>In Transit</option>
                <option>High Priority</option>
              </select>
              <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="deliveries-grid">
            {filteredDeliveries.map((delivery) => (
              <div key={delivery.id} className="delivery-card-full">
                <div className="card-header">
                  <div className="order-info">
                    <span className="order-id">{delivery.id}</span>
                    <div className="status-badges">
                      <span className={`status-badge ${delivery.status === 'In Transit' ? 'in-transit' : 'pending'}`}>
                        {delivery.status}
                      </span>
                      {delivery.isPriority && (
                        <span className="priority-badge-full">High Priority</span>
                      )}
                    </div>
                  </div>
                  <div className="order-amount-container">
                    <div className="amount-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="order-amount">{delivery.amount}</span>
                  </div>
                </div>

                <div className="customer-info">
                  <h3 className="customer-name">{delivery.customer}</h3>
                  <p className="customer-phone">{delivery.phone}</p>
                </div>

                <div className="delivery-info-grid">
                  <div className="info-item">
                    <div className="info-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 14C10 14 13 11 13 8C13 7 12 3 8 3C4 3 3 7 3 8C3 11 6 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Delivery Location</span>
                      <span className="info-value">{delivery.location}</span>
                    </div>
                    <span className="distance-badge">{delivery.distance}</span>
                  </div>

                  <div className="info-item">
                    <div className="info-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="info-content">
                      <span className="info-label">Scheduled Time</span>
                      <span className="info-value">{delivery.scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  {delivery.isInTransit ? (
                    <button className="btn-delivered">Mark as Delivered</button>
                  ) : (
                    <button className="btn-start-delivery">Start Delivery</button>
                  )}
                  <button className="btn-view-details">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredDeliveries.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                  <path d="M32 20V32L40 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="empty-title">No deliveries found</h3>
              <p className="empty-description">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default AssignedDeliveries;
