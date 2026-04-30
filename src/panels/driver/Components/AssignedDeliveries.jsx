import React, { useState, useEffect, useCallback } from 'react';
import './AssignedDeliveries.css';
import driverApi from '../../../shared/api/driverApi';
import { getDriverId } from '../../../shared/api/driverStore';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatAddress = (addr) => {
  if (!addr) return '-';
  return [addr.street, addr.landmark, addr.city].filter(Boolean).join(', ') || '-';
};

const getTotalQuantity = (items) => {
  if (!items || !items.length) return '-';
  const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  return `${total.toLocaleString()}L`;
};

const formatScheduledTime = (order) => {
  if (order.scheduledTimeSlot) return order.scheduledTimeSlot;
  if (order.scheduledDate) {
    return new Date(order.scheduledDate).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }
  return '-';
};

// Map backend order status → UI display status
const getDisplayStatus = (status) => {
  const map = {
    'assigned':          'Pending',
    'accepted':          'Pending',
    'out-for-delivery':  'In Transit',
    'confirmed':         'Pending',
  };
  return map[status] || status;
};

const isInTransitStatus = (status) => status === 'out-for-delivery';

const ORDER_TRANSITIONS = {
  pending:            ['confirmed', 'cancelled'],
  confirmed:          ['assigned', 'cancelled'],
  assigned:           ['accepted', 'rejected', 'confirmed', 'cancelled'],
  accepted:           ['out-for-delivery', 'cancelled'],
  rejected:           ['assigned', 'confirmed', 'cancelled'],
  'out-for-delivery': ['delivered', 'accepted'],
  delivered:          [],
  cancelled:          [],
};

// Primary action a driver can take per status
const DRIVER_PRIMARY_ACTION = {
  assigned:           { label: 'Accept Order',      nextStatus: 'accepted',         btnClass: 'btn-start-delivery' },
  accepted:           { label: 'Start Delivery',    nextStatus: 'out-for-delivery', btnClass: 'btn-start-delivery' },
  'out-for-delivery': { label: 'Mark as Delivered', nextStatus: 'delivered',        btnClass: 'btn-delivered'      },
};

// Secondary actions (reject / cancel) a driver can take per status
const DRIVER_SECONDARY_ACTIONS = {
  assigned: [
    { label: 'Reject',  nextStatus: 'rejected',  btnClass: 'btn-reject'  },
    { label: 'Cancel',  nextStatus: 'cancelled', btnClass: 'btn-cancel'  },
  ],
  accepted: [
    { label: 'Cancel',  nextStatus: 'cancelled', btnClass: 'btn-cancel'  },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
const AssignedDeliveries = () => {
  const [searchQuery, setSearchQuery]     = useState('');
  const [filterStatus, setFilterStatus]   = useState('All Deliveries');
  const [deliveries, setDeliveries]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchDeliveries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await driverApi.getDriverDeliveries(getDriverId());
      const orders = res?.data?.data ?? [];
      setDeliveries(Array.isArray(orders) ? orders : []);
    } catch (err) {
      setError(err.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleStatusTransition = async (orderId, nextStatus) => {
    setActionLoading(orderId);
    try {
      await driverApi.updateOrderStatus(orderId, nextStatus);
      await fetchDeliveries();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Client-side filtering ──────────────────────────────────────────────────
  const filteredDeliveries = deliveries.filter((order) => {
    const displayStatus = getDisplayStatus(order.status);
    const address = formatAddress(order.deliveryAddress);

    const matchesSearch =
      (order.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === 'All Deliveries' ||
      (filterStatus === 'Pending'    && displayStatus === 'Pending') ||
      (filterStatus === 'In Transit' && displayStatus === 'In Transit');

    return matchesSearch && matchesFilter;
  });

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#64748b' }}>
          Loading deliveries…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchDeliveries} className="btn-start-delivery" style={{ width: 'auto' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

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
            </select>
            <svg className="dropdown-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div className="deliveries-grid">
          {filteredDeliveries.map((order) => {
            const displayStatus  = getDisplayStatus(order.status);
            const inTransit      = isInTransitStatus(order.status);
            const isActing       = actionLoading === order._id;
            const address        = formatAddress(order.deliveryAddress);
            const amount         = getTotalQuantity(order.items);
            const scheduledTime  = formatScheduledTime(order);

            return (
              <div key={order._id} className="delivery-card-full">
                <div className="card-header">
                  <div className="order-info">
                    <span className="order-id">{order.orderNumber || order._id}</span>
                    <div className="status-badges">
                      <span className={`status-badge ${inTransit ? 'in-transit' : 'pending'}`}>
                        {displayStatus}
                      </span>
                    </div>
                  </div>
                  <div className="order-amount-container">
                    <div className="amount-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="order-amount">{amount}</span>
                  </div>
                </div>

                <div className="customer-info">
                  <h3 className="customer-name">{order.customerName}</h3>
                  <p className="customer-phone">{order.customerPhone || '-'}</p>
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
                      <span className="info-value">{address}</span>
                    </div>
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
                      <span className="info-value">{scheduledTime}</span>
                    </div>
                  </div>
                </div>

                <div className="card-actions">
                  {(() => {
                    const primary   = DRIVER_PRIMARY_ACTION[order.status];
                    const secondary = DRIVER_SECONDARY_ACTIONS[order.status] ?? [];
                    if (!primary && secondary.length === 0) return null;
                    return (
                      <>
                        {primary && (
                          <button
                            className={primary.btnClass}
                            onClick={() => handleStatusTransition(order._id, primary.nextStatus)}
                            disabled={isActing}
                          >
                            {isActing ? 'Updating…' : primary.label}
                          </button>
                        )}
                        {secondary.map((sec) => (
                          <button
                            key={sec.nextStatus}
                            className={sec.btnClass}
                            onClick={() => handleStatusTransition(order._id, sec.nextStatus)}
                            disabled={isActing}
                          >
                            {sec.label}
                          </button>
                        ))}
                      </>
                    );
                  })()}
                  <button className="btn-view-details">
                    View Details
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
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
