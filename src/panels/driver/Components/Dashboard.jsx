import React, { useState, useEffect, useCallback } from 'react';
import './Dashboard.css';
import driverApi from '../../../shared/api/driverApi';
import useAuth from '../../../shared/hooks/useAuth';
import { getDriverId } from '../../../shared/api/driverStore';

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatAddress = (addr) => {
  if (!addr) return '-';
  return [addr.street, addr.city].filter(Boolean).join(', ') || '-';
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

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const formatEarnings = (value) => {
  if (value == null) return 'Rs0';
  return `Rs${Number(value).toLocaleString()}`;
};

const DRIVER_PRIMARY_ACTION = {
  assigned:           { label: 'Accept Order',      nextStatus: 'accepted'         },
  accepted:           { label: 'Start Delivery',    nextStatus: 'out-for-delivery' },
  'out-for-delivery': { label: 'Mark as Delivered', nextStatus: 'delivered'        },
};

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    assigned: 0,
    inTransit: 0,
    completed: 0,
    earnings: 'Rs0',
  });
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, deliveriesRes] = await Promise.all([
        driverApi.getDashboardStats(),
        driverApi.getDriverDeliveries(getDriverId(), { limit: 3, sort: '-createdAt' }),
      ]);

      setStats({
        assigned:  statsRes?.data?.todayDeliveries ?? 0,
        inTransit: statsRes?.data?.pendingDeliveries ?? 0,
        completed: statsRes?.data?.completedToday   ?? 0,
        earnings:  formatEarnings(statsRes?.data?.todayEarnings),
      });

      const orders = deliveriesRes?.data?.data ?? [];
      const TERMINAL = new Set(['delivered', 'cancelled', 'rejected']);
      const active = Array.isArray(orders) ? orders.filter((o) => !TERMINAL.has(o.status)) : [];
      setDeliveries(active);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleStatusTransition = async (orderId, nextStatus) => {
    setActionLoading(orderId);
    try {
      await driverApi.updateOrderStatus(orderId, nextStatus);
      await fetchData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#64748b' }}>
          Loading dashboard…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchData} className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1.5rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="greeting-section">
            <h2 className="greeting">{getGreeting()}, {user?.fullName?.split(' ')[0] || 'Driver'}</h2>
            <p className="date">{today}</p>
          </div>
          <div className="status-badge">
            <span className="status-indicator"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <p className="stat-label">Assigned Deliveries</p>
                <h3 className="stat-value">{stats.assigned}</h3>
              </div>
              <div className="stat-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <p className="stat-label">In-Transit Orders</p>
                <h3 className="stat-value">{stats.inTransit}</h3>
              </div>
              <div className="stat-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8H20L23 11V16H16V8Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <p className="stat-label">Completed Today</p>
                <h3 className="stat-value">{stats.completed}</h3>
              </div>
              <div className="stat-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-info">
                <p className="stat-label">Earnings Today</p>
                <h3 className="stat-value">{stats.earnings}</h3>
              </div>
              <div className="stat-icon purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V16M10 10H13C13.5523 10 14 10.4477 14 11C14 11.5523 13.5523 12 13 12H11C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="deliveries-section">
          <div className="section-header">
            <h3 className="section-title">Upcoming Deliveries</h3>
            <button className="link-button">{deliveries.length} pending</button>
          </div>

          <div className="deliveries-list">
            {deliveries.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No pending deliveries
              </div>
            ) : (
              deliveries.map((order) => (
                <div key={order._id} className="delivery-card">
                  <div className="delivery-header">
                    <div className="delivery-id-section">
                      <span className="delivery-id">{order.orderNumber || order._id}</span>
                    </div>
                    <span className="delivery-amount">{getTotalQuantity(order.items)}</span>
                  </div>

                  <p className="customer-name">{order.customerName}</p>

                  <div className="delivery-details">
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 4V8L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span>{formatScheduledTime(order)}</span>
                    </div>
                    <div className="detail-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 14C10 14 13 11 13 8C13 7 12 3 8 3C4 3 3 7 3 8C3 11 6 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      <span>{formatAddress(order.deliveryAddress)}</span>
                    </div>
                  </div>

                  <div className="delivery-actions">
                    {(() => {
                      const action = DRIVER_PRIMARY_ACTION[order.status];
                      if (!action) return null;
                      return (
                        <button
                          className="btn-primary"
                          onClick={() => handleStatusTransition(order._id, action.nextStatus)}
                          disabled={actionLoading === order._id}
                        >
                          {actionLoading === order._id ? 'Updating…' : action.label}
                        </button>
                      );
                    })()}
                    <button className="btn-secondary">View Details</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="action-cards-grid">
            <div className="action-card">
              <div className="action-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="action-title">View Route Map</h4>
              <p className="action-description">Check optimized delivery route</p>
            </div>

            <div className="action-card">
              <div className="action-icon orange">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="action-title">Report Issue</h4>
              <p className="action-description">Contact support for help</p>
            </div>

            <div className="action-card">
              <div className="action-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="action-title">Complete Delivery</h4>
              <p className="action-description">Mark current delivery as done</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
