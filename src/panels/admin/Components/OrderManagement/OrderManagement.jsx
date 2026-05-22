import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Pencil,
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import OrderDetailModal from './OrderDetailModal';
import OrderActionModal from './OrderActionModal';
import customerApi from '../../../../shared/api/customerApi';
import './OrderManagement.css';
import adminApi from '../../../../shared/api/adminApi';

const ITEMS_PER_PAGE = 10;

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#FF9800', bgColor: '#FFF8E1' },
  confirmed:  { label: 'Confirmed',  color: '#9C27B0', bgColor: '#F3E5F5' },
  assigned:   { label: 'Assigned',   color: '#00BCD4', bgColor: '#E0F7FA' },
  'in-transit':      { label: 'In-Transit',      color: '#2196F3', bgColor: '#E3F2FD' },
  'out-for-delivery': { label: 'Out for Delivery', color: '#FF5722', bgColor: '#FBE9E7' },
  delivered:          { label: 'Delivered',        color: '#4CAF50', bgColor: '#E8F5E9' },
  cancelled:          { label: 'Cancelled',        color: '#F44336', bgColor: '#FFEBEE' },
};

const normalizeOrder = (o) => {
  const statusKey = (o.status || '').toLowerCase().replace(/\s+/g, '-');
  const cfg = STATUS_CONFIG[statusKey] || { label: o.status || '—', color: '#757575', bgColor: '#F5F5F5' };
  const date = new Date(o.createdAt || o.date);
  const validDate = !isNaN(date.getTime());

  // Sum quantities across all order items
  const totalQty = Array.isArray(o.items)
    ? o.items.reduce((acc, item) => acc + (item.quantity || 0), 0)
    : null;

  return {
    id:    o.orderNumber || o._id,
    _raw:  o,
    customer: o.customerName || o.customerId?.name || '—',
    phone:    o.customerPhone || o.customerId?.phone || '—',
    location:
      [o.deliveryAddress?.street, o.deliveryAddress?.city]
        .filter(Boolean)
        .join(', ') || '—',
    quantity:  totalQty != null ? `${totalQty} unit${totalQty !== 1 ? 's' : ''}` : '—',
    amount:    o.totalAmount != null ? `${Number(o.totalAmount).toFixed(2)}` : '—',
    date:      validDate ? date.toISOString().split('T')[0] : '—',
    time:      validDate
      ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : '—',
    status:        cfg.label,
    statusColor:   cfg.color,
    statusBgColor: cfg.bgColor,
    paymentMethod: o.paymentMethod || '—',
    paymentStatus: o.paymentStatus || '—',
    items:         o.items || [],
    driver:        o.assignedDriverId?.name || null,
  };
};

const statusOptions = [
  { label: 'All Status',       value: '' },
  { label: 'Pending',          value: 'pending' },
  { label: 'Confirmed',        value: 'confirmed' },
  { label: 'Assigned',         value: 'assigned' },
  { label: 'Out for Delivery', value: 'out-for-delivery' },
  { label: 'Delivered',        value: 'delivered' },
  { label: 'Cancelled',        value: 'cancelled' },
];

const TERMINAL_STATUSES = ['delivered', 'cancelled'];

const OrderManagement = () => {
  const [orders, setOrders]                 = useState([]);
  const [meta, setMeta]                     = useState({ total: 0, page: 1, totalPages: 1 });
  const [statsCounts, setStatsCounts]       = useState({ total: 0, pending: 0, active: 0, delivered: 0 });
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [searchInput, setSearchInput]       = useState('');
  const [searchQuery, setSearchQuery]       = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedOrder, setSelectedOrder]       = useState(null);
  const [showOrderDetail, setShowOrderDetail]   = useState(false);
  const [actionOrder, setActionOrder]           = useState(null);
  const [showActionModal, setShowActionModal]   = useState(false);
  const [currentPage, setCurrentPage]           = useState(1);

  // Debounce search so we don't fire an API call on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 800);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset to page 1 whenever filters change
  useEffect(() => { setCurrentPage(1); }, [searchQuery, selectedStatus]);

  // ── Table data — server-side paginated & filtered ─────────────────────────
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page: currentPage, limit: ITEMS_PER_PAGE };
      if (selectedStatus)         params.status = selectedStatus;
      if (searchQuery.trim())     params.search = searchQuery.trim();

      const res      = await customerApi.getOrders(params);
      const raw      = Array.isArray(res?.data?.data) ? res.data.data : [];
      const metaData = res?.data?.meta ?? { total: 0, page: 1, totalPages: 1 };
      setOrders(raw.map(normalizeOrder));
      setMeta(metaData);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, searchQuery]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── Stats — parallel lightweight calls on mount ───────────────────────────
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getOrderStats();
        const data = res?.data ?? {};
        setStatsCounts({
          total:   data.total ?? 0,
          pending: data.pending ?? 0,
          active:  data.active ?? 0,
          delivered: data.delivered ?? 0,
        });
      } catch {
        // Non-critical — silently ignore stats fetch errors
      }
    };
    fetchStats();
  }, []);

  const orderStats = [
    { label: 'Total Orders', count: statsCounts.total,     color: '#757575', bgColor: '#F5F5F5' },
    { label: 'Pending',      count: statsCounts.pending,   color: '#FF9800', bgColor: '#FFF8E1' },
    { label: 'In Transit',       count: statsCounts.active,    color: '#2196F3', bgColor: '#E3F2FD' },
    { label: 'Delivered',    count: statsCounts.delivered, color: '#4CAF50', bgColor: '#E8F5E9' },
  ];

  // ── Pagination values from server meta ────────────────────────────────────
  const totalPages = Math.max(1, meta.totalPages);
  const pageStart  = (currentPage - 1) * ITEMS_PER_PAGE;

  const handleExportData = () => {
    const csv = [
      ['Order ID', 'Customer', 'Location', 'Quantity', 'Amount', 'Date', 'Time', 'Status'],
      ...orders.map(o => [o.id, o.customer, o.location, o.quantity, o.amount, o.date, o.time, o.status]),
    ]
      .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleOpenAction = (order) => {
    setActionOrder(order);
    setShowActionModal(true);
  };

  const handleActionSuccess = () => {
    fetchOrders();
  };

  return (
    <div className="order-management">
      {/* Header */}
      <div className="order-header">
        <div>
          <h1 className="header-title">Order Management</h1>
          <p className="header-subtitle">Track and manage all water delivery orders</p>
        </div>
        <button className="export-button" onClick={handleExportData} disabled={loading}>
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="filter-container">
            <button
              className="filter-button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
            >
              <Filter size={18} />
              <span>{statusOptions.find(o => o.value === selectedStatus)?.label ?? 'All Status'}</span>
              <ChevronDown size={18} />
            </button>

            {showStatusDropdown && (
              <div className="status-dropdown">
                {statusOptions.map((status) => (
                  <button
                    key={status.value}
                    className={`dropdown-item ${selectedStatus === status.value ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedStatus(status.value);
                      setShowStatusDropdown(false);
                    }}
                  >
                    <span>{status.label}</span>
                    {selectedStatus === status.value && <span className="checkmark">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="stats-container">
          {orderStats.map((stat, index) => (
            <div key={index} className="stat-card" style={{ backgroundColor: stat.bgColor }}>
              <h2 className="stat-count" style={{ color: stat.color }}>
                {loading ? '—' : stat.count}
              </h2>
              <p className="stat-label" style={{ color: stat.color }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className="table-state-overlay">
            <Loader size={28} className="spin-icon" />
            <span>Loading orders…</span>
          </div>
        )}

        {!loading && error && (
          <div className="table-state-overlay error">
            <AlertCircle size={28} />
            <span>{error}</span>
            <button className="retry-button" onClick={fetchOrders}>
              <RefreshCw size={16} /> Retry
            </button>
          </div>
        )}

        {/* Orders Table */}
        {!loading && !error && (
          <>
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Location</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td><span className="order-id">{order.id}</span></td>
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
                              backgroundColor: order.statusBgColor,
                              color: order.statusColor,
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="view-button" onClick={() => handleViewOrder(order)} title="View details">
                              <Eye size={18} />
                            </button>
                            {!TERMINAL_STATUSES.includes((order._raw?.status || '').toLowerCase()) && (
                              <button
                                className="update-button"
                                onClick={() => handleOpenAction(order)}
                                title="Update status / assign driver"
                              >
                                <Pencil size={16} />
                              </button>
                            )}
                          </div>
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

            {/* Pagination */}
            {meta.total > 0 && (
              <div className="pagination">
                <span className="pagination-info">
                  Showing {pageStart + 1}–{Math.min(pageStart + ITEMS_PER_PAGE, meta.total)} of {meta.total} orders
                </span>
                <div className="pagination-controls">
                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '…' ? (
                        <span key={`ellipsis-${idx}`} className="page-ellipsis">…</span>
                      ) : (
                        <button
                          key={p}
                          className={`page-btn ${currentPage === p ? 'active' : ''}`}
                          onClick={() => setCurrentPage(p)}
                        >
                          {p}
                        </button>
                      )
                    )}

                  <button
                    className="page-btn"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowOrderDetail(false)}
        />
      )}

      {/* Order Action Modal (status change / driver assign) */}
      {showActionModal && actionOrder && (
        <OrderActionModal
          order={actionOrder}
          onClose={() => setShowActionModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}
    </div>
  );
};

export default OrderManagement;
