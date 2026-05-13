import React, { useState, useEffect, useCallback } from 'react';
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

const getDisplayStatus = (status) => {
  const map = {
    'assigned':         'Pending',
    'accepted':         'Pending',
    'out-for-delivery': 'In Transit',
    'confirmed':        'Pending',
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

const DRIVER_PRIMARY_ACTION = {
  assigned:           { label: 'Accept Order',      nextStatus: 'accepted'         },
  accepted:           { label: 'Start Delivery',    nextStatus: 'out-for-delivery' },
  'out-for-delivery': { label: 'Mark as Delivered', nextStatus: 'delivered'        },
};

const DRIVER_SECONDARY_ACTIONS = {
  assigned: [
    { label: 'Reject', nextStatus: 'rejected' },
  ],
  accepted: [],
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
      const TERMINAL = new Set(['delivered', 'cancelled', 'rejected']);
      const active = Array.isArray(orders) ? orders.filter((o) => !TERMINAL.has(o.status)) : [];
      setDeliveries(active);
    } catch (err) {
      setError(err.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDeliveries(); }, [fetchDeliveries]);

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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{adStyles}</style>
        <div className="ad-root">
          <div className="ad-loader">
            <div className="ad-spinner" />
            <span>Loading deliveries…</span>
          </div>
        </div>
      </>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <style>{adStyles}</style>
        <div className="ad-root">
          <div className="ad-error">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>{error}</p>
            <button className="ad-retry-btn" onClick={fetchDeliveries}>Try Again</button>
          </div>
        </div>
      </>
    );
  }

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <>
      <style>{adStyles}</style>
      <div className="ad-root">

        {/* ── Page Header ── */}
        <div className="ad-header">
          <div className="ad-header-left">
            <p className="ad-page-eyebrow">Driver Portal</p>
            <h1 className="ad-page-title">Assigned Deliveries</h1>
            <p className="ad-page-sub">Manage and track your active delivery orders</p>
          </div>
          <div className="ad-header-badges">
            <div className="ad-count-pill ad-count-total">
              <span>{deliveries.length}</span> Total Active
            </div>
            <div className="ad-count-pill ad-count-transit">
              <span>{deliveries.filter(o => isInTransitStatus(o.status)).length}</span> In Transit
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="ad-toolbar">
          <div className="ad-search-wrap">
            <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="ad-search-icon">
              <circle cx="9" cy="9" r="6" stroke="#94a3b8" strokeWidth="1.6"/>
              <path d="M13.5 13.5L17 17" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Search by Order ID, Customer or Location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ad-search-input"
            />
            {searchQuery && (
              <button className="ad-search-clear" onClick={() => setSearchQuery('')}>
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          <div className="ad-filter-tabs">
            {['All Deliveries', 'Pending', 'In Transit'].map((tab) => (
              <button
                key={tab}
                className={`ad-filter-tab${filterStatus === tab ? ' ad-filter-tab--active' : ''}`}
                onClick={() => setFilterStatus(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results count ── */}
        {!loading && (
          <p className="ad-results-label">
            Showing <strong>{filteredDeliveries.length}</strong> of {deliveries.length} orders
          </p>
        )}

        {/* ── Cards Grid ── */}
        <div className="ad-grid">
          {filteredDeliveries.map((order, idx) => {
            const displayStatus = getDisplayStatus(order.status);
            const inTransit     = isInTransitStatus(order.status);
            const isActing      = actionLoading === order._id;
            const address       = formatAddress(order.deliveryAddress);
            const amount        = getTotalQuantity(order.items);
            const scheduledTime = formatScheduledTime(order);
            const primary       = DRIVER_PRIMARY_ACTION[order.status];
            const secondary     = DRIVER_SECONDARY_ACTIONS[order.status] ?? [];

            return (
              <div
                key={order._id}
                className="ad-card"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                {/* Card top stripe */}
                <div className={`ad-card-stripe${inTransit ? ' ad-stripe-transit' : ''}`} />

                {/* Card Header */}
                <div className="ad-card-head">
                  <div className="ad-card-head-left">
                    <span className="ad-order-num">{order.orderNumber || order._id}</span>
                    <span className={`ad-status-pill${inTransit ? ' ad-pill-transit' : ' ad-pill-pending'}`}>
                      <span className="ad-pill-dot" />
                      {displayStatus}
                    </span>
                  </div>
                  <div className="ad-qty-block">
                    <div className="ad-qty-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="ad-qty-text">{amount}</span>
                  </div>
                </div>

                {/* Customer */}
                <div className="ad-customer">
                  <h3 className="ad-customer-name">{order.customerName}</h3>
                  <p className="ad-customer-phone">{order.customerPhone || '-'}</p>
                </div>

                {/* Info rows */}
                <div className="ad-info-rows">
                  <div className="ad-info-row">
                    <div className="ad-info-icon">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M12 21C12 21 5 13.5 5 9a7 7 0 0114 0c0 4.5-7 12-7 12z" stroke="#0ea5e9" strokeWidth="1.8"/>
                        <circle cx="12" cy="9" r="2.5" stroke="#0ea5e9" strokeWidth="1.8"/>
                      </svg>
                    </div>
                    <div className="ad-info-body">
                      <span className="ad-info-label">Delivery Location</span>
                      <span className="ad-info-value">{address}</span>
                    </div>
                  </div>

                  <div className="ad-info-row">
                    <div className="ad-info-icon">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="#0ea5e9" strokeWidth="1.8"/>
                        <path d="M12 6v6l4 2" stroke="#0ea5e9" strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="ad-info-body">
                      <span className="ad-info-label">Scheduled Time</span>
                      <span className="ad-info-value">{scheduledTime}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {(primary || secondary.length > 0) && (
                  <div className="ad-actions">
                    {primary && (
                      <button
                        className={`ad-btn-primary${inTransit ? ' ad-btn-green' : ''}`}
                        onClick={() => handleStatusTransition(order._id, primary.nextStatus)}
                        disabled={isActing}
                      >
                        {isActing ? (
                          <><span className="ad-btn-spinner" /> Updating…</>
                        ) : primary.label}
                      </button>
                    )}
                    {secondary.map((sec) => (
                      <button
                        key={sec.nextStatus}
                        className="ad-btn-danger"
                        onClick={() => handleStatusTransition(order._id, sec.nextStatus)}
                        disabled={isActing}
                      >
                        {sec.label}
                      </button>
                    ))}
                    <button className="ad-btn-ghost">
                      Details
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Empty State ── */}
        {filteredDeliveries.length === 0 && (
          <div className="ad-empty">
            <div className="ad-empty-icon">
              <svg width="52" height="52" fill="none" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="30" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 4"/>
                <path d="M32 20V32L40 36" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="ad-empty-title">No deliveries found</h3>
            <p className="ad-empty-sub">
              {searchQuery || filterStatus !== 'All Deliveries'
                ? 'Try adjusting your search or filter'
                : 'You have no active deliveries right now'}
            </p>
            {(searchQuery || filterStatus !== 'All Deliveries') && (
              <button
                className="ad-retry-btn"
                onClick={() => { setSearchQuery(''); setFilterStatus('All Deliveries'); }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const adStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.ad-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px 36px;
  box-sizing: border-box;
}

/* ── Loader ── */
.ad-loader {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 14px;
  height: 60vh; color: #64748b; font-size: 14px; font-weight: 500;
}
.ad-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: adSpin 0.7s linear infinite;
}
@keyframes adSpin { to { transform: rotate(360deg); } }

/* ── Error ── */
.ad-error {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  height: 60vh; color: #64748b; font-size: 14px;
}

/* ── Retry / Clear btn ── */
.ad-retry-btn {
  margin-top: 8px; padding: 9px 24px;
  background: linear-gradient(135deg, #0369a1, #0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: opacity 0.2s;
}
.ad-retry-btn:hover { opacity: 0.88; }

/* ── Page Header ── */
.ad-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
}
.ad-page-eyebrow {
  font-size: 12px; font-weight: 700; color: #0ea5e9;
  text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 4px;
}
.ad-page-title {
  font-size: 28px; font-weight: 800; color: #0f172a;
  margin: 0 0 4px; letter-spacing: -0.5px;
}
.ad-page-sub { font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500; }

.ad-header-badges { display: flex; gap: 10px; align-items: center; padding-top: 6px; }
.ad-count-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 20px;
  font-size: 13px; font-weight: 600;
}
.ad-count-pill span { font-size: 17px; font-weight: 800; }
.ad-count-total { background: #e0f2fe; color: #0369a1; }
.ad-count-transit { background: #fff7ed; color: #c2410c; }

/* ── Toolbar ── */
.ad-toolbar {
  display: flex; align-items: center; gap: 16px;
  background: #fff; border-radius: 14px;
  padding: 14px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.ad-search-wrap {
  flex: 1; min-width: 220px;
  display: flex; align-items: center; gap: 10px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 9px 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.ad-search-wrap:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}
.ad-search-icon { flex-shrink: 0; }
.ad-search-input {
  flex: 1; border: none; outline: none;
  background: transparent;
  font-size: 14px; color: #0f172a;
  font-family: 'DM Sans', sans-serif;
}
.ad-search-input::placeholder { color: #94a3b8; }
.ad-search-clear {
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; padding: 2px;
  transition: opacity 0.15s;
}
.ad-search-clear:hover { opacity: 0.6; }

.ad-filter-tabs {
  display: flex; gap: 6px;
  background: #f1f5f9; border-radius: 10px; padding: 4px;
}
.ad-filter-tab {
  padding: 7px 16px; border-radius: 8px;
  border: none; background: transparent;
  font-size: 13px; font-weight: 600; color: #64748b;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all 0.18s;
  white-space: nowrap;
}
.ad-filter-tab:hover { color: #0f172a; background: rgba(255,255,255,0.7); }
.ad-filter-tab--active {
  background: #fff; color: #0369a1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* ── Results label ── */
.ad-results-label {
  font-size: 13px; color: #94a3b8; margin: 0 0 18px;
  font-weight: 500;
}
.ad-results-label strong { color: #475569; }

/* ── Grid ── */
.ad-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(460px, 1fr));
  gap: 20px;
}

/* ── Card ── */
.ad-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: adCardUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
  position: relative;
}
@keyframes adCardUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}
.ad-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(0,0,0,0.09);
}

/* Top accent stripe */
.ad-card-stripe {
  height: 3px;
  background: linear-gradient(90deg, #0369a1, #0ea5e9);
}
.ad-stripe-transit {
  background: linear-gradient(90deg, #ea580c, #f97316);
}

/* Card Head */
.ad-card-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f1f5f9;
}
.ad-card-head-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.ad-order-num {
  font-size: 13px; font-weight: 700; color: #0f172a;
  background: #f1f5f9; border-radius: 7px; padding: 4px 10px;
}

.ad-status-pill {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 11px; border-radius: 20px;
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px;
}
.ad-pill-pending  { background: #fef9c3; color: #a16207; }
.ad-pill-transit  { background: #dbeafe; color: #1d4ed8; }
.ad-pill-dot {
  width: 6px; height: 6px; border-radius: 50%; background: currentColor; flex-shrink: 0;
}

.ad-qty-block { display: flex; align-items: center; gap: 10px; }
.ad-qty-icon {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #0369a1, #0ea5e9);
  border-radius: 11px; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(14,165,233,0.3);
  flex-shrink: 0;
}
.ad-qty-text {
  font-size: 18px; font-weight: 800; color: #0f172a;
}

/* Customer */
.ad-customer { padding: 14px 20px 12px; }
.ad-customer-name {
  font-size: 17px; font-weight: 800; color: #0f172a; margin: 0 0 3px;
}
.ad-customer-phone { font-size: 13px; color: #64748b; margin: 0; font-weight: 500; }

/* Info rows */
.ad-info-rows {
  display: flex; flex-direction: column; gap: 8px;
  padding: 0 20px 16px;
}
.ad-info-row {
  display: flex; align-items: flex-start; gap: 12px;
  background: #f8fafc; border-radius: 10px; padding: 11px 14px;
}
.ad-info-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: #e0f2fe; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.ad-info-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.ad-info-label { font-size: 11.5px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.4px; }
.ad-info-value { font-size: 13.5px; color: #0f172a; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Actions */
.ad-actions {
  display: flex; gap: 10px; flex-wrap: wrap;
  padding: 14px 20px 20px;
  border-top: 1px solid #f1f5f9;
}

.ad-btn-primary {
  flex: 1; min-width: 130px;
  padding: 10px 16px;
  background: linear-gradient(135deg, #0369a1, #0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 13.5px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 3px 10px rgba(14,165,233,0.28);
  transition: all 0.2s;
}
.ad-btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(14,165,233,0.38);
}
.ad-btn-primary:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.ad-btn-green {
  background: linear-gradient(135deg, #16a34a, #22c55e) !important;
  box-shadow: 0 3px 10px rgba(34,197,94,0.28) !important;
}
.ad-btn-green:hover:not(:disabled) {
  box-shadow: 0 6px 16px rgba(34,197,94,0.38) !important;
}

.ad-btn-danger {
  padding: 10px 16px;
  background: rgba(239,68,68,0.08); color: #dc2626;
  border: 1.5px solid rgba(239,68,68,0.2);
  border-radius: 10px;
  font-size: 13.5px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all 0.2s;
}
.ad-btn-danger:hover:not(:disabled) {
  background: rgba(239,68,68,0.14);
  border-color: rgba(239,68,68,0.4);
}
.ad-btn-danger:disabled { opacity: 0.6; cursor: not-allowed; }

.ad-btn-ghost {
  padding: 10px 14px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  color: #64748b; border-radius: 10px;
  font-size: 13.5px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; gap: 5px;
  transition: all 0.2s;
}
.ad-btn-ghost:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }

.ad-btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: adSpin 0.6s linear infinite;
  display: inline-block;
}

/* ── Empty State ── */
.ad-empty {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 10px;
  padding: 80px 24px; text-align: center;
}
.ad-empty-icon {
  width: 88px; height: 88px; border-radius: 50%;
  background: #f8fafc;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 8px;
}
.ad-empty-title { font-size: 19px; font-weight: 800; color: #0f172a; margin: 0; }
.ad-empty-sub   { font-size: 13.5px; color: #94a3b8; margin: 0; font-weight: 500; }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .ad-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .ad-root { padding: 20px 16px; }
  .ad-toolbar { flex-direction: column; align-items: stretch; }
  .ad-filter-tabs { justify-content: center; }
  .ad-header { flex-direction: column; }
  .ad-page-title { font-size: 22px; }
  .ad-actions { flex-direction: column; }
  .ad-btn-primary, .ad-btn-ghost, .ad-btn-danger { width: 100%; }
}
`;

export default AssignedDeliveries;