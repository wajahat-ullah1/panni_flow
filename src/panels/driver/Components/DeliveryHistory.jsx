import React, { useState, useEffect, useCallback } from 'react';
import './DeliveryHistory.css';
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

// Convert filter label → { fromDate, toDate } ISO strings for API
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

// ─────────────────────────────────────────────────────────────────────────────
// Status badge config keyed by OrderStatus enum values
const STATUS_CONFIG = {
  pending:          { label: 'Pending',          color: '#f59e0b', bg: '#fef3c7' },
  confirmed:        { label: 'Confirmed',         color: '#3b82f6', bg: '#dbeafe' },
  assigned:         { label: 'Assigned',          color: '#8b5cf6', bg: '#ede9fe' },
  accepted:         { label: 'Accepted',          color: '#06b6d4', bg: '#cffafe' },
  rejected:         { label: 'Rejected',          color: '#ef4444', bg: '#fee2e2' },
  'out-for-delivery': { label: 'Out for Delivery', color: '#f97316', bg: '#ffedd5' },
  delivered:        { label: 'Delivered',         color: '#22c55e', bg: '#dcfce7' },
  cancelled:        { label: 'Cancelled',         color: '#64748b', bg: '#f1f5f9' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
      padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 600,
      color: cfg.color, background: cfg.bg,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const DeliveryHistory = () => {
  const [search, setSearch]               = useState('');
  const [filter, setFilter]               = useState('All Time');
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [deliveries, setDeliveries]       = useState([]);
  const [meta, setMeta]                   = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dateRange = getDateRange(filter);
      const params = {
        search: search || undefined,
        ...dateRange,
        sort: '-createdAt',
        limit: 50,
      };
      const driverId = getDriverId();
      // API accepts only a single status value — fetch terminal statuses in parallel
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

  // ── Computed stats from loaded data ───────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
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
            <span className="dh-stat-value">{thisWeekCount}</span>
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
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading delivery history…
          </div>
        ) : error ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
            <button className="dh-invoice-btn" onClick={fetchHistory}>Retry</button>
          </div>
        ) : (
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
                deliveries.map((order) => {
                  const isDelivered = order.status === 'delivered';
                  const dt = formatDateTime(order.deliveredAt || order.updatedAt);

                  return (
                    <tr key={order._id} className="dh-row">
                      <td className="dh-order-id">{order.orderNumber || order._id}</td>
                      <td className="dh-customer">{order.customerName}</td>
                      <td className="dh-quantity">{getTotalQuantity(order.items)}</td>
                      <td className="dh-location">{formatAddress(order.deliveryAddress)}</td>
                      <td className="dh-datetime">
                        <span>{dt.date}</span>
                        <span className="dh-time">{dt.time}</span>
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td>
                        {isDelivered && (
                          <button
                            className="dh-invoice-btn"
                            onClick={() => handleInvoice(order.orderNumber || order._id)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
                              <path d="M14 2v6h6" stroke="#3b82f6" strokeWidth="2"/>
                            </svg>
                            Invoice
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="dh-empty">No deliveries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
