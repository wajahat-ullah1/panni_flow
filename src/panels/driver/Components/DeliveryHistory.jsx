import React, { useState } from 'react';
import './DeliveryHistory.css';

const deliveriesData = [
  {
    id: 'ORD-2447',
    customer: 'Kamran Hussain',
    quantity: '7000L',
    location: 'Saddar, Karachi',
    date: 'Jan 27, 2026',
    time: '3:45 PM',
    status: 'Delivered',
    earnings: 'Rs520',
  },
  {
    id: 'ORD-2446',
    customer: 'Sana Tariq',
    quantity: '4000L',
    location: 'Gulistan-e-Johar',
    date: 'Jan 27, 2026',
    time: '2:15 PM',
    status: 'Delivered',
    earnings: 'Rs310',
  },
  {
    id: 'ORD-2445',
    customer: 'Bilal Ahmed',
    quantity: '5500L',
    location: 'Korangi Industrial',
    date: 'Jan 27, 2026',
    time: '12:30 PM',
    status: 'Delivered',
    earnings: 'Rs420',
  },
  {
    id: 'ORD-2444',
    customer: 'Mariam Siddiqui',
    quantity: '3500L',
    location: 'Pechs Block 2',
    date: 'Jan 27, 2026',
    time: '11:00 AM',
    status: 'Cancelled',
    earnings: 'Rs0',
  },
  {
    id: 'ORD-2443',
    customer: 'Tariq Mehmood',
    quantity: '6000L',
    location: 'DHA Phase 5',
    date: 'Jan 26, 2026',
    time: '4:00 PM',
    status: 'Delivered',
    earnings: 'Rs460',
  },
  {
    id: 'ORD-2442',
    customer: 'Ayesha Khan',
    quantity: '2000L',
    location: 'North Nazimabad',
    date: 'Jan 26, 2026',
    time: '1:30 PM',
    status: 'Delivered',
    earnings: 'Rs160',
  },
];

const filterOptions = ['All Time', 'Today', 'This Week', 'This Month'];

const DeliveryHistory = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Time');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = deliveriesData.filter(
    (d) =>
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalDeliveries = deliveriesData.length;
  const thisWeek = deliveriesData.filter((d) => d.date === 'Jan 27, 2026').length;
  const successRate = Math.round(
    (deliveriesData.filter((d) => d.status === 'Delivered').length / deliveriesData.length) * 100
  );

  const handleInvoice = (id) => {
    alert(`Generating invoice for ${id}`);
  };

  return (
    <div className="dh-container">
      {/* Header */}
      <div className="dh-header">
        <h1 className="dh-title">Delivery History</h1>
        <p className="dh-subtitle">View your completed and past deliveries</p>
      </div>

      {/* Stats Cards */}
      <div className="dh-stats">
        <div className="dh-stat-card">
          <div className="dh-stat-info">
            <span className="dh-stat-label">Total Deliveries</span>
            <span className="dh-stat-value">{totalDeliveries}</span>
          </div>
          <div className="dh-stat-icon dh-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
        </div>

        <div className="dh-stat-card">
          <div className="dh-stat-info">
            <span className="dh-stat-label">This Week</span>
            <span className="dh-stat-value">{thisWeek}</span>
          </div>
          <div className="dh-stat-icon dh-icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        <div className="dh-stat-card">
          <div className="dh-stat-info">
            <span className="dh-stat-label">Success Rate</span>
            <span className="dh-stat-value">{successRate}%</span>
          </div>
          <div className="dh-stat-icon dh-icon-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M14 2v6h6M9 13h6M9 17h6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="dh-toolbar">
        <div className="dh-search-wrap">
          <svg className="dh-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2"/>
            <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            className="dh-search"
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="dh-filter-wrap">
          <button
            className="dh-filter-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="#64748b" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="#64748b" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{filter}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {dropdownOpen && (
            <div className="dh-dropdown">
              {filterOptions.map((opt) => (
                <button
                  key={opt}
                  className={`dh-dropdown-item ${filter === opt ? 'active' : ''}`}
                  onClick={() => { setFilter(opt); setDropdownOpen(false); }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="dh-table-wrap">
        <table className="dh-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Quantity</th>
              <th>Location</th>
              <th>Date &amp; Time</th>
              <th>Status</th>
              <th>Earnings</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((row) => (
                <tr key={row.id} className="dh-row">
                  <td className="dh-order-id">{row.id}</td>
                  <td className="dh-customer">{row.customer}</td>
                  <td className="dh-quantity">{row.quantity}</td>
                  <td className="dh-location">{row.location}</td>
                  <td className="dh-datetime">
                    <span>{row.date}</span>
                    <span className="dh-time">{row.time}</span>
                  </td>
                  <td>
                    <span className={`dh-badge ${row.status === 'Delivered' ? 'dh-badge-delivered' : 'dh-badge-cancelled'}`}>
                      {row.status === 'Delivered' ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                          <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="10" fill="#ef4444"/>
                          <path d="M15 9l-6 6M9 9l6 6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      )}
                      {row.status}
                    </span>
                  </td>
                  <td className={`dh-earnings ${row.status === 'Cancelled' ? 'dh-earnings-zero' : ''}`}>
                    {row.earnings}
                  </td>
                  <td>
                    <button className="dh-invoice-btn" onClick={() => handleInvoice(row.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M14 2v6h6" stroke="#3b82f6" strokeWidth="2"/>
                      </svg>
                      Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="dh-empty">No deliveries found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryHistory;
