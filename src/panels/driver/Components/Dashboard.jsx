import React, { useState, useEffect, useCallback } from 'react';
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

const STATUS_COLOR = {
  assigned:           { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  accepted:           { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  'out-for-delivery': { bg: '#fff7ed', color: '#c2410c', dot: '#f97316' },
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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{dashStyles}</style>
        <div className="db-root">
          <div className="db-loader">
            <div className="db-loader-spinner" />
            <span>Loading dashboard…</span>
          </div>
        </div>
      </>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <style>{dashStyles}</style>
        <div className="db-root">
          <div className="db-error-box">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>{error}</p>
            <button className="db-retry-btn" onClick={fetchData}>Try Again</button>
          </div>
        </div>
      </>
    );
  }

  const firstName = user?.fullName?.split(' ')[0] || 'Driver';

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{dashStyles}</style>
      <div className="db-root">

        {/* ── Top Header ── */}
        <header className="db-header">
          <div className="db-header-left">
            <p className="db-greeting-label">{getGreeting()} 👋</p>
            <h1 className="db-greeting-name">{firstName}</h1>
            <p className="db-date">{today}</p>
          </div>
          <div className="db-header-right">
            <div className="db-online-badge">
              <span className="db-online-dot" />
              Online
            </div>
            <button className="db-refresh-btn" onClick={fetchData} title="Refresh">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </header>

        <div className="db-body">

          {/* ── Stats Grid ── */}
          <div className="db-stats-grid">
            {/* Assigned */}
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="db-stat-body">
                <p className="db-stat-label">Assigned Today</p>
                <h3 className="db-stat-value">{stats.assigned}</h3>
                <p className="db-stat-sub">deliveries</p>
              </div>
            </div>

            {/* In-Transit */}
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="3" width="15" height="13" rx="2" stroke="#fff" strokeWidth="2"/>
                  <path d="M16 8H20L23 11V16H16V8Z" stroke="#fff" strokeWidth="2"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="#fff" strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="#fff" strokeWidth="2"/>
                </svg>
              </div>
              <div className="db-stat-body">
                <p className="db-stat-label">In-Transit</p>
                <h3 className="db-stat-value">{stats.inTransit}</h3>
                <p className="db-stat-sub">on the road</p>
              </div>
            </div>

            {/* Completed */}
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
                  <path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="db-stat-body">
                <p className="db-stat-label">Completed Today</p>
                <h3 className="db-stat-value">{stats.completed}</h3>
                <p className="db-stat-sub">delivered</p>
              </div>
            </div>

            {/* Earnings */}
            <div className="db-stat-card">
              <div className="db-stat-icon" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="2"/>
                  <path d="M12 8V16M10 10H13C13.5523 10 14 10.4477 14 11C14 11.5523 13.5523 12 13 12H11C10.4477 12 10 12.4477 10 13C10 13.5523 10.4477 14 11 14H14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="db-stat-body">
                <p className="db-stat-label">Earnings Today</p>
                <h3 className="db-stat-value" style={{ fontSize: 22 }}>{stats.earnings}</h3>
                <p className="db-stat-sub">total earned</p>
              </div>
            </div>
          </div>

          {/* ── Two-column layout ── */}
          <div className="db-columns">

            {/* Left — Upcoming Deliveries */}
            <div className="db-deliveries-col">
              <div className="db-section-head">
                <div>
                  <h2 className="db-section-title">Upcoming Deliveries</h2>
                  <p className="db-section-sub">{deliveries.length} pending task{deliveries.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="db-deliveries-list">
                {deliveries.length === 0 ? (
                  <div className="db-empty">
                    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="1.5"/>
                      <path d="M8 12l2 2 4-4" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>No pending deliveries</p>
                    <span>You're all caught up!</span>
                  </div>
                ) : (
                  deliveries.map((order) => {
                    const sc = STATUS_COLOR[order.status] || { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' };
                    const action = DRIVER_PRIMARY_ACTION[order.status];
                    return (
                      <div key={order._id} className="db-delivery-card">
                        <div className="db-delivery-top">
                          <div className="db-delivery-meta">
                            <span className="db-order-num">{order.orderNumber || order._id}</span>
                            <span
                              className="db-status-pill"
                              style={{ background: sc.bg, color: sc.color }}
                            >
                              <span className="db-status-dot" style={{ background: sc.dot }} />
                              {order.status}
                            </span>
                          </div>
                          <span className="db-qty-badge">{getTotalQuantity(order.items)}</span>
                        </div>

                        <p className="db-customer-name">{order.customerName}</p>

                        <div className="db-delivery-info">
                          <div className="db-info-item">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="10" stroke="#94a3b8" strokeWidth="1.8"/>
                              <path d="M12 6v6l4 2" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            <span>{formatScheduledTime(order)}</span>
                          </div>
                          <div className="db-info-item">
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                              <path d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z" stroke="#94a3b8" strokeWidth="1.8"/>
                              <circle cx="12" cy="9" r="2.5" stroke="#94a3b8" strokeWidth="1.8"/>
                            </svg>
                            <span>{formatAddress(order.deliveryAddress)}</span>
                          </div>
                        </div>

                        {action && (
                          <div className="db-delivery-actions">
                            <button
                              className="db-btn-primary"
                              onClick={() => handleStatusTransition(order._id, action.nextStatus)}
                              disabled={actionLoading === order._id}
                            >
                              {actionLoading === order._id ? (
                                <>
                                  <span className="db-btn-spinner" />
                                  Updating…
                                </>
                              ) : action.label}
                            </button>
                            <button className="db-btn-ghost">View Details</button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right — Quick Actions */}
            <div className="db-actions-col">
              <div className="db-section-head">
                <div>
                  <h2 className="db-section-title">Quick Actions</h2>
                  <p className="db-section-sub">Shortcuts for your workflow</p>
                </div>
              </div>

              <div className="db-action-cards">
                <div className="db-action-card">
                  <div className="db-action-icon" style={{ background: '#eff6ff' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#3b82f6" strokeWidth="2"/>
                      <path d="M12 6V12L16 14" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="db-action-text">
                    <h4>View Route Map</h4>
                    <p>Check optimized delivery route</p>
                  </div>
                  <svg className="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="db-action-card">
                  <div className="db-action-icon" style={{ background: '#fff7ed' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2"/>
                      <path d="M12 8V12M12 16H12.01" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="db-action-text">
                    <h4>Report Issue</h4>
                    <p>Contact support for help</p>
                  </div>
                  <svg className="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <div className="db-action-card">
                  <div className="db-action-icon" style={{ background: '#f0fdf4' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/>
                      <path d="M8 12L11 15L16 9" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="db-action-text">
                    <h4>Complete Delivery</h4>
                    <p>Mark current delivery as done</p>
                  </div>
                  <svg className="db-action-arrow" width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Today's summary card */}
              <div className="db-summary-card">
                <div className="db-summary-header">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Today's Summary</span>
                </div>
                <div className="db-summary-rows">
                  <div className="db-summary-row">
                    <span>Completion Rate</span>
                    <strong style={{ color: '#16a34a' }}>
                      {stats.assigned > 0
                        ? `${Math.round((stats.completed / stats.assigned) * 100)}%`
                        : '—'}
                    </strong>
                  </div>
                  <div className="db-summary-row">
                    <span>Remaining</span>
                    <strong style={{ color: '#f97316' }}>
                      {Math.max(0, stats.assigned - stats.completed)} orders
                    </strong>
                  </div>
                  <div className="db-summary-row">
                    <span>Total Earned</span>
                    <strong style={{ color: '#7c3aed' }}>{stats.earnings}</strong>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const dashStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.db-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px 36px;
  box-sizing: border-box;
}

/* ── Loader ── */
.db-loader {
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 14px;
  height: 60vh; color: #64748b; font-size: 14px; font-weight: 500;
}
.db-loader-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: dbSpin 0.7s linear infinite;
}
@keyframes dbSpin { to { transform: rotate(360deg); } }

/* ── Error ── */
.db-error-box {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  height: 60vh; color: #64748b; font-size: 14px;
}
.db-retry-btn {
  margin-top: 8px;
  padding: 9px 24px;
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s;
}
.db-retry-btn:hover { opacity: 0.88; }

/* ── Header ── */
.db-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 32px;
}
.db-greeting-label {
  font-size: 13px; font-weight: 600; color: #0ea5e9;
  margin: 0 0 4px;
  text-transform: uppercase; letter-spacing: 0.6px;
}
.db-greeting-name {
  font-size: 28px; font-weight: 800; color: #0f172a;
  margin: 0 0 4px; letter-spacing: -0.5px;
}
.db-date {
  font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;
}
.db-header-right {
  display: flex; align-items: center; gap: 12px; padding-top: 4px;
}
.db-online-badge {
  display: flex; align-items: center; gap: 7px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 20px; padding: 6px 14px;
  font-size: 13px; font-weight: 600; color: #16a34a;
}
.db-online-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,0.3);
  animation: dbPulse 2s ease infinite;
}
@keyframes dbPulse {
  0%,100% { box-shadow: 0 0 0 2px rgba(34,197,94,0.3); }
  50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0.1); }
}
.db-refresh-btn {
  width: 36px; height: 36px;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 9px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #64748b; transition: all 0.2s;
}
.db-refresh-btn:hover { background: #f1f5f9; color: #0f172a; }

/* ── Stats Grid ── */
.db-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}
.db-stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 22px 20px;
  display: flex; align-items: flex-start; gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}
.db-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.db-stat-icon {
  width: 50px; height: 50px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.db-stat-body { flex: 1; min-width: 0; }
.db-stat-label {
  font-size: 12px; font-weight: 600; color: #64748b;
  margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.4px;
}
.db-stat-value {
  font-size: 26px; font-weight: 800; color: #0f172a;
  margin: 0 0 2px; line-height: 1;
}
.db-stat-sub {
  font-size: 11.5px; color: #94a3b8; margin: 0; font-weight: 500;
}

/* ── Body columns ── */
.db-body {}
.db-columns {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: flex-start;
}

/* ── Section head ── */
.db-section-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 16px;
}
.db-section-title {
  font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 2px;
}
.db-section-sub {
  font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;
}

/* ── Delivery Cards ── */
.db-deliveries-col {}
.db-deliveries-list { display: flex; flex-direction: column; gap: 16px; }

.db-empty {
  background: #fff; border-radius: 16px;
  padding: 48px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.db-empty p {
  font-size: 15px; font-weight: 600; color: #475569; margin: 0;
}
.db-empty span {
  font-size: 13px; color: #94a3b8; margin: 0;
}

.db-delivery-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s;
  border-left: 3px solid #0ea5e9;
}
.db-delivery-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.08); }

.db-delivery-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px;
}
.db-delivery-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.db-order-num {
  font-size: 13px; font-weight: 700; color: #0f172a;
  background: #f1f5f9; border-radius: 6px; padding: 3px 8px;
}
.db-status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 12px; font-weight: 600;
  text-transform: capitalize;
}
.db-status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.db-qty-badge {
  font-size: 13px; font-weight: 700; color: #0ea5e9;
  background: #e0f2fe; border-radius: 8px; padding: 3px 10px;
}

.db-customer-name {
  font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px;
}

.db-delivery-info {
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px;
}
.db-info-item {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: #64748b; font-weight: 500;
}
.db-info-item span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.db-delivery-actions { display: flex; gap: 10px; }

.db-btn-primary {
  flex: 1; padding: 10px 16px;
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 3px 10px rgba(14,165,233,0.3);
  transition: all 0.2s;
}
.db-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(14,165,233,0.4);
}
.db-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.db-btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: dbSpin 0.6s linear infinite;
}

.db-btn-ghost {
  padding: 10px 16px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  color: #475569; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}
.db-btn-ghost:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }

/* ── Right column ── */
.db-actions-col { display: flex; flex-direction: column; gap: 16px; }
.db-action-cards { display: flex; flex-direction: column; gap: 10px; }

.db-action-card {
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.2s;
}
.db-action-card:hover {
  transform: translateX(3px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.db-action-icon {
  width: 44px; height: 44px; border-radius: 11px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.db-action-text { flex: 1; }
.db-action-text h4 {
  font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 2px;
}
.db-action-text p {
  font-size: 12px; color: #94a3b8; margin: 0; font-weight: 500;
}
.db-action-arrow { flex-shrink: 0; }

/* ── Summary Card ── */
.db-summary-card {
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  border-radius: 16px; padding: 20px 22px;
  box-shadow: 0 4px 16px rgba(14,165,233,0.3);
}
.db-summary-header {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 16px;
  font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.9);
}
.db-summary-rows { display: flex; flex-direction: column; gap: 12px; }
.db-summary-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: rgba(255,255,255,0.7);
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.db-summary-row:last-child { border-bottom: none; padding-bottom: 0; }
.db-summary-row strong {
  font-weight: 700; color: #fff;
}

/* ── Responsive ── */
@media (max-width: 1200px) {
  .db-stats-grid { grid-template-columns: repeat(2,1fr); }
  .db-columns { grid-template-columns: 1fr; }
  .db-actions-col { flex-direction: row; flex-wrap: wrap; }
  .db-action-cards { flex-direction: row; flex-wrap: wrap; flex: 1; }
  .db-action-card { flex: 1; min-width: 180px; }
  .db-summary-card { flex: 1; min-width: 260px; }
}
@media (max-width: 768px) {
  .db-root { padding: 20px 16px; }
  .db-stats-grid { grid-template-columns: repeat(2,1fr); gap: 12px; }
  .db-stat-value { font-size: 22px; }
  .db-greeting-name { font-size: 22px; }
  .db-actions-col { flex-direction: column; }
  .db-action-cards { flex-direction: column; }
}
@media (max-width: 480px) {
  .db-stats-grid { grid-template-columns: 1fr 1fr; }
  .db-delivery-actions { flex-direction: column; }
}
`;

export default Dashboard;