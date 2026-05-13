import React, { useState, useEffect, useCallback } from 'react';
import driverApi from '../../../shared/api/driverApi';
import { getDriverId } from '../../../shared/api/driverStore';

const filterOptions = ['All Time', 'Today', 'This Week', 'This Month'];

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

const formatDateTime = (isoString) => {
  if (!isoString) return { date: '-', time: '-' };
  const d = new Date(isoString);
  return {
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
};

const getDateRange = (filter) => {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === 'Today') {
    return {
      fromDate: today.toISOString(),
      toDate:   new Date(today.getTime() + 86400000 - 1).toISOString(),
    };
  }
  if (filter === 'This Week') {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    return { fromDate: weekStart.toISOString(), toDate: now.toISOString() };
  }
  if (filter === 'This Month') {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return { fromDate: monthStart.toISOString(), toDate: now.toISOString() };
  }
  return {};
};

const STATUS_CONFIG = {
  pending:            { label: 'Pending',          color: '#d97706', bg: '#fef9c3' },
  confirmed:          { label: 'Confirmed',         color: '#2563eb', bg: '#dbeafe' },
  assigned:           { label: 'Assigned',          color: '#7c3aed', bg: '#ede9fe' },
  accepted:           { label: 'Accepted',          color: '#0891b2', bg: '#cffafe' },
  rejected:           { label: 'Rejected',          color: '#dc2626', bg: '#fee2e2' },
  'out-for-delivery': { label: 'Out for Delivery',  color: '#c2410c', bg: '#ffedd5' },
  delivered:          { label: 'Delivered',         color: '#16a34a', bg: '#dcfce7' },
  cancelled:          { label: 'Cancelled',         color: '#475569', bg: '#f1f5f9' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 11px', borderRadius: 999,
      fontSize: '0.72rem', fontWeight: 700,
      color: cfg.color, background: cfg.bg,
      letterSpacing: '0.3px',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const DeliveryHistory = () => {
  const [search, setSearch]             = useState('');
  const [filter, setFilter]             = useState('All Time');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deliveries, setDeliveries]     = useState([]);
  const [meta, setMeta]                 = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dateRange = getDateRange(filter);
      const params = { search: search || undefined, ...dateRange, sort: '-createdAt', limit: 50 };
      const driverId = getDriverId();
      const [deliveredRes, cancelledRes, rejectedRes] = await Promise.all([
        driverApi.getDriverDeliveries(driverId, { ...params, status: 'delivered' }),
        driverApi.getDriverDeliveries(driverId, { ...params, status: 'cancelled' }),
        driverApi.getDriverDeliveries(driverId, { ...params, status: 'rejected' }),
      ]);
      const merge = (res) => res?.data?.data ?? [];
      const all = [
        ...merge(deliveredRes),
        ...merge(cancelledRes),
        ...merge(rejectedRes),
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setDeliveries(all);
      setMeta((prev) => ({ ...prev, total: all.length }));
    } catch (err) {
      setError(err.message || 'Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const totalDeliveries = meta.total || deliveries.length;
  const delivered       = deliveries.filter((d) => d.status === 'delivered').length;
  const thisWeekCount   = deliveries.filter((d) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    return new Date(d.createdAt) >= weekStart;
  }).length;
  const successRate = deliveries.length > 0
    ? Math.round((delivered / deliveries.length) * 100)
    : 0;

  const handleInvoice = (orderNumber) => {
    alert(`Generating invoice for ${orderNumber}`);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{dhStyles}</style>
      <div className="dh-root">

        {/* ── Header ── */}
        <div className="dh-header">
          <div className="dh-header-left">
            <p className="dh-eyebrow">Driver Portal</p>
            <h1 className="dh-title">Delivery History</h1>
            <p className="dh-subtitle">View your completed and past deliveries</p>
          </div>
          <button className="dh-export-btn" onClick={fetchHistory}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24">
              <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="dh-stats">
          <div className="dh-stat-card">
            <div className="dh-stat-icon" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
              </svg>
            </div>
            <div className="dh-stat-body">
              <p className="dh-stat-label">Total Deliveries</p>
              <h3 className="dh-stat-value">{totalDeliveries}</h3>
              <p className="dh-stat-sub">all time</p>
            </div>
          </div>

          <div className="dh-stat-card">
            <div className="dh-stat-icon" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#fff" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="dh-stat-body">
              <p className="dh-stat-label">This Week</p>
              <h3 className="dh-stat-value">{thisWeekCount}</h3>
              <p className="dh-stat-sub">deliveries</p>
            </div>
          </div>

          <div className="dh-stat-card">
            <div className="dh-stat-icon" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#fff" strokeWidth="2" strokeLinejoin="round"/>
                <path d="M14 2v6h6M9 13h6M9 17h6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="dh-stat-body">
              <p className="dh-stat-label">Success Rate</p>
              <h3 className="dh-stat-value">{successRate}%</h3>
              <p className="dh-stat-sub">completed</p>
            </div>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="dh-toolbar">
          <div className="dh-search-wrap">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              className="dh-search"
              type="text"
              placeholder="Search by Order ID or Customer Name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="dh-clear-btn" onClick={() => setSearch('')}>
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          <div className="dh-filter-tabs">
            {filterOptions.map((opt) => (
              <button
                key={opt}
                className={`dh-filter-tab${filter === opt ? ' dh-filter-tab--active' : ''}`}
                onClick={() => setFilter(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="dh-table-wrap">
          {loading ? (
            <div className="dh-table-state">
              <div className="dh-spinner" />
              <span>Loading delivery history…</span>
            </div>
          ) : error ? (
            <div className="dh-table-state">
              <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p style={{ color: '#ef4444', margin: 0, fontWeight: 600 }}>{error}</p>
              <button className="dh-retry-btn" onClick={fetchHistory}>Try Again</button>
            </div>
          ) : (
            <>
              <div className="dh-table-header">
                <span className="dh-table-count">
                  Showing <strong>{deliveries.length}</strong> records
                </span>
              </div>
              <div className="dh-scroll-wrap">
                <table className="dh-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Quantity</th>
                      <th>Location</th>
                      <th>Date &amp; Time</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveries.length > 0 ? (
                      deliveries.map((order, idx) => {
                        const isDelivered = order.status === 'delivered';
                        const dt = formatDateTime(order.deliveredAt || order.updatedAt);
                        return (
                          <tr key={order._id} className="dh-row" style={{ animationDelay: `${idx * 0.03}s` }}>
                            <td>
                              <span className="dh-order-id">{order.orderNumber || order._id}</span>
                            </td>
                            <td className="dh-customer">{order.customerName}</td>
                            <td>
                              <span className="dh-qty">{getTotalQuantity(order.items)}</span>
                            </td>
                            <td className="dh-location">{formatAddress(order.deliveryAddress)}</td>
                            <td>
                              <div className="dh-datetime">
                                <span className="dh-date">{dt.date}</span>
                                <span className="dh-time">{dt.time}</span>
                              </div>
                            </td>
                            <td><StatusBadge status={order.status} /></td>
                            <td>
                              {isDelivered ? (
                                <button
                                  className="dh-invoice-btn"
                                  onClick={() => handleInvoice(order.orderNumber || order._id)}
                                >
                                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2"/>
                                  </svg>
                                  Invoice
                                </button>
                              ) : (
                                <span className="dh-no-action">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7">
                          <div className="dh-empty">
                            <svg width="48" height="48" fill="none" viewBox="0 0 64 64">
                              <circle cx="32" cy="32" r="30" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5 4"/>
                              <path d="M32 20V32L40 36" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round"/>
                            </svg>
                            <p>No deliveries found</p>
                            <span>Try changing the date filter or search term</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const dhStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.dh-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px 36px;
  box-sizing: border-box;
}

/* ── Header ── */
.dh-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 28px; flex-wrap: wrap; gap: 12px;
}
.dh-eyebrow {
  font-size: 12px; font-weight: 700; color: #0ea5e9;
  text-transform: uppercase; letter-spacing: 0.8px; margin: 0 0 4px;
}
.dh-title {
  font-size: 28px; font-weight: 800; color: #0f172a;
  margin: 0 0 4px; letter-spacing: -0.5px;
}
.dh-subtitle { font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500; }

.dh-export-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 18px;
  background: #fff; border: 1.5px solid #e2e8f0;
  border-radius: 10px; cursor: pointer;
  font-size: 13.5px; font-weight: 600; color: #475569;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.2s;
  margin-top: 6px;
}
.dh-export-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #0f172a; }

/* ── Stats ── */
.dh-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}
.dh-stat-card {
  background: #fff; border-radius: 16px; padding: 22px 20px;
  display: flex; align-items: flex-start; gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.dh-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.dh-stat-icon {
  width: 50px; height: 50px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.dh-stat-body { flex: 1; }
.dh-stat-label {
  font-size: 12px; font-weight: 600; color: #64748b;
  margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.4px;
}
.dh-stat-value {
  font-size: 26px; font-weight: 800; color: #0f172a;
  margin: 0 0 2px; line-height: 1;
}
.dh-stat-sub { font-size: 11.5px; color: #94a3b8; margin: 0; font-weight: 500; }

/* ── Toolbar ── */
.dh-toolbar {
  display: flex; align-items: center; gap: 16px;
  background: #fff; border-radius: 14px;
  padding: 14px 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.dh-search-wrap {
  flex: 1; min-width: 220px;
  display: flex; align-items: center; gap: 10px;
  background: #f8fafc; border: 1.5px solid #e2e8f0;
  border-radius: 10px; padding: 9px 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.dh-search-wrap:focus-within {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
}
.dh-search {
  flex: 1; border: none; outline: none;
  background: transparent; font-size: 14px; color: #0f172a;
  font-family: 'DM Sans', sans-serif;
}
.dh-search::placeholder { color: #94a3b8; }
.dh-clear-btn {
  background: none; border: none; cursor: pointer;
  display: flex; align-items: center; padding: 2px; transition: opacity 0.15s;
}
.dh-clear-btn:hover { opacity: 0.6; }

.dh-filter-tabs {
  display: flex; gap: 6px;
  background: #f1f5f9; border-radius: 10px; padding: 4px;
}
.dh-filter-tab {
  padding: 7px 14px; border-radius: 8px;
  border: none; background: transparent;
  font-size: 13px; font-weight: 600; color: #64748b;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all 0.18s; white-space: nowrap;
}
.dh-filter-tab:hover { color: #0f172a; background: rgba(255,255,255,0.7); }
.dh-filter-tab--active {
  background: #fff; color: #0369a1;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* ── Table wrap ── */
.dh-table-wrap {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  overflow: hidden;
}

.dh-table-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 24px 0;
}
.dh-table-count {
  font-size: 13px; color: #94a3b8; font-weight: 500;
}
.dh-table-count strong { color: #475569; }

/* loading / error state */
.dh-table-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  padding: 60px 24px; color: #64748b; font-size: 14px; font-weight: 500;
}
.dh-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0; border-top-color: #0ea5e9;
  border-radius: 50%; animation: dhSpin 0.7s linear infinite;
}
@keyframes dhSpin { to { transform: rotate(360deg); } }
.dh-retry-btn {
  margin-top: 4px; padding: 8px 22px;
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 13.5px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: opacity 0.2s;
}
.dh-retry-btn:hover { opacity: 0.88; }

/* scroll container */
.dh-scroll-wrap { overflow-x: auto; }

/* ── Table ── */
.dh-table {
  width: 100%; border-collapse: collapse;
  font-size: 13.5px; min-width: 720px;
}
.dh-table thead tr {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}
.dh-table th {
  padding: 13px 20px;
  text-align: left; font-size: 11.5px; font-weight: 700;
  color: #64748b; white-space: nowrap;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.dh-row {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
  animation: dhRowIn 0.35s ease both;
}
@keyframes dhRowIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.dh-row:last-child { border-bottom: none; }
.dh-row:hover { background: #f8fafc; }
.dh-table td {
  padding: 15px 20px; color: #334155; vertical-align: middle;
}

.dh-order-id {
  font-weight: 700; color: #0f172a;
  background: #f1f5f9; border-radius: 6px;
  padding: 3px 9px; font-size: 13px;
  white-space: nowrap;
}
.dh-customer { font-weight: 600; color: #0f172a; }
.dh-qty {
  font-weight: 700; color: #0369a1;
  background: #e0f2fe; border-radius: 6px;
  padding: 3px 9px; font-size: 13px;
}
.dh-location {
  color: #475569; font-size: 13px; font-weight: 500;
  max-width: 180px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
}
.dh-datetime { display: flex; flex-direction: column; gap: 2px; }
.dh-date { font-weight: 600; color: #0f172a; font-size: 13px; }
.dh-time { font-size: 12px; color: #94a3b8; font-weight: 500; }

.dh-invoice-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 12px;
  background: #eff6ff; border: 1px solid #bfdbfe;
  border-radius: 8px; cursor: pointer;
  font-size: 12.5px; font-weight: 700; color: #2563eb;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.18s;
}
.dh-invoice-btn:hover {
  background: #dbeafe; border-color: #93c5fd;
}
.dh-no-action { color: #cbd5e1; font-size: 16px; }

/* ── Empty ── */
.dh-empty {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 60px 24px; text-align: center;
}
.dh-empty p { font-size: 16px; font-weight: 700; color: #475569; margin: 0; }
.dh-empty span { font-size: 13px; color: #94a3b8; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .dh-root { padding: 20px 16px; }
  .dh-stats { grid-template-columns: 1fr; }
  .dh-toolbar { flex-direction: column; align-items: stretch; }
  .dh-filter-tabs { justify-content: center; flex-wrap: wrap; }
  .dh-header { flex-direction: column; }
  .dh-title { font-size: 22px; }
}
`;

export default DeliveryHistory;