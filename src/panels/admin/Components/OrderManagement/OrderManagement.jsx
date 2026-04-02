import React, { useState } from 'react';
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  Eye,
  MapPin,
  Calendar,
  Clock,
} from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import './OrderManagement.css';

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Order statistics
  const orderStats = [
    {
      count: 8,
      label: 'Total Orders',
      color: '#757575',
      bgColor: '#F5F5F5',
    },
    {
      count: 2,
      label: 'Pending',
      color: '#FF9800',
      bgColor: '#FFF8E1',
    },
    {
      count: 3,
      label: 'In-Transit',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      count: 3,
      label: 'Delivered',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
  ];

  // Orders data
  const orders = [
    {
      id: 'ORD-2456',
      customer: 'ABC Industries',
      location: 'Industrial Zone A',
      quantity: '5000L',
      amount: '$450',
      date: '2024-11-25',
      time: '10:30 AM',
      status: 'In-Transit',
      statusColor: '#2196F3',
    },
    {
      id: 'ORD-2457',
      customer: 'Green Valley Resort',
      location: 'Valley Road, Sector 12',
      quantity: '8000L',
      amount: '$720',
      date: '2024-11-25',
      time: '09:15 AM',
      status: 'Delivered',
      statusColor: '#4CAF50',
    },
    {
      id: 'ORD-2458',
      customer: 'Sunrise Apartments',
      location: 'Sunrise Complex, Block C',
      quantity: '3000L',
      amount: '$270',
      date: '2024-11-25',
      time: '11:00 AM',
      status: 'Pending',
      statusColor: '#FF9800',
    },
    {
      id: 'ORD-2459',
      customer: 'Tech Park Plaza',
      location: 'Tech Park, Building 5',
      quantity: '6000L',
      amount: '$540',
      date: '2024-11-25',
      time: '08:45 AM',
      status: 'In-Transit',
      statusColor: '#2196F3',
    },
    {
      id: 'ORD-2460',
      customer: 'Oceanview Hotel',
      location: 'Beach Road, Plot 22',
      quantity: '10000L',
      amount: '$900',
      date: '2024-11-24',
      time: '02:30 PM',
      status: 'Delivered',
      statusColor: '#4CAF50',
    },
  ];

  const statusOptions = [
    'All Status',
    'Pending',
    'In-Transit',
    'Delivered',
    'Cancelled',
  ];

  const handleExportData = () => {
    console.log('Exporting data...');
    // Add export logic here
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All Status' || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="order-management">
      {/* Header */}
      <div className="order-header">
        <div>
          <h1 className="header-title">Order Management</h1>
          <p className="header-subtitle">Track and manage all water delivery orders</p>
        </div>
        <button className="export-button" onClick={handleExportData}>
          <Download size={18} />
          <span>Export Data</span>
        </button>
      </div>

      <div className="order-content">
        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by order ID, customer, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <button
              className="filter-button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter size={18} />
              <span>{selectedStatus}</span>
              <ChevronDown size={18} />
            </button>

            {/* Status Dropdown */}
            {showStatusDropdown && (
              <div className="status-dropdown">
                {statusOptions.map((status, index) => (
                  <button
                    key={index}
                    className={`dropdown-item ${
                      selectedStatus === status ? 'active' : ''
                    }`}
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <span>{status}</span>
                    {selectedStatus === status && (
                      <span className="checkmark">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="stats-container">
          {orderStats.map((stat, index) => (
            <div
              key={index}
              className="stat-card"
              style={{ backgroundColor: stat.bgColor }}
            >
              <h2 className="stat-count" style={{ color: stat.color }}>
                {stat.count}
              </h2>
              <p className="stat-label" style={{ color: stat.color }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Amount</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>
                    <td>{order.customer}</td>
                    <td>
                      <div className="location-cell">
                        <MapPin size={14} />
                        <span>{order.location}</span>
                      </div>
                    </td>
                    <td>{order.quantity}</td>
                    <td className="amount-cell">{order.amount}</td>
                    <td>
                      <div className="date-cell">
                        <div className="date-row">
                          <Calendar size={14} />
                          <span>{order.date}</span>
                        </div>
                        <div className="time-row">
                          <Clock size={12} />
                          <span>{order.time}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{
                          backgroundColor: `${order.statusColor}20`,
                          color: order.statusColor,
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-button"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    <div className="empty-content">
                      <p className="empty-text">No orders found</p>
                      <p className="empty-subtext">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowOrderDetail(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
