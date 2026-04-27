import React, { useState, useEffect } from 'react';
import { X, UserCheck, Loader, AlertCircle, User, Phone } from 'lucide-react';
import adminApi from '../../../../shared/api/adminApi';
import './OrderActionModal.css';

// ─── Status transition map (mirrors backend ORDER_TRANSITIONS) ────────────────
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

const STATUS_META = {
  pending:            { label: 'Pending',          color: '#FF9800', bgColor: '#FFF8E1' },
  confirmed:          { label: 'Confirmed',         color: '#9C27B0', bgColor: '#F3E5F5' },
  assigned:           { label: 'Assigned',          color: '#00BCD4', bgColor: '#E0F7FA' },
  accepted:           { label: 'Accepted',          color: '#3F51B5', bgColor: '#E8EAF6' },
  rejected:           { label: 'Rejected',          color: '#F44336', bgColor: '#FFEBEE' },
  'out-for-delivery': { label: 'Out for Delivery',  color: '#FF5722', bgColor: '#FBE9E7' },
  delivered:          { label: 'Delivered',         color: '#4CAF50', bgColor: '#E8F5E9' },
  cancelled:          { label: 'Cancelled',         color: '#9E9E9E', bgColor: '#F5F5F5' },
};

// ─────────────────────────────────────────────────────────────────────────────

const OrderActionModal = ({ order, onClose, onSuccess }) => {
  const currentStatusKey = (order._raw?.status || '').toLowerCase();
  const validTransitions = ORDER_TRANSITIONS[currentStatusKey] || [];

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active drivers whenever "assigned" transition is selected
  useEffect(() => {
    if (selectedStatus !== 'assigned') {
      setSelectedDriverId('');
      return;
    }
    setDriversLoading(true);
    adminApi
      .getDrivers({ all: true })
      .then((res) => {
        const list = res.data.data ?? [];
        const activeDrivers = list.filter(d => ['available', 'on-delivery'].includes(d.status));
        setDrivers(activeDrivers);
      })
      .catch(() => setDrivers([]))
      .finally(() => setDriversLoading(false));
  }, [selectedStatus]);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    if (!selectedStatus) return 'Please select a new status.';
    if (selectedStatus === 'assigned' && !selectedDriverId)
      return 'A driver must be selected before assigning the order.';
    return null;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const orderId = order._raw?._id;

      if (selectedStatus === 'assigned') {
        // Assign driver — backend transitions status to "assigned" automatically
        await adminApi.assignOrder(selectedDriverId, { orderId });
      } else {
        await adminApi.updateOrderStatus(orderId, selectedStatus);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentMeta = STATUS_META[currentStatusKey] || { label: order.status, color: '#757575', bgColor: '#F5F5F5' };
  const assignedDriver = order._raw?.assignedDriverId;

  return (
    <div className="oam-overlay" onClick={onClose}>
      <div className="oam-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="oam-header">
          <div>
            <h2 className="oam-title">Update Order</h2>
            <p className="oam-subtitle">{order.id}</p>
          </div>
          <button className="oam-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="oam-body">
          {/* Current status */}
          <div className="oam-current-status">
            <span className="oam-current-label">Current Status</span>
            <span
              className="status-badge"
              style={{ backgroundColor: currentMeta.bgColor, color: currentMeta.color }}
            >
              {currentMeta.label}
            </span>
          </div>

          {/* Assigned driver */}
          {assignedDriver && (
            <div className="oam-driver-info">
              <span className="oam-driver-info-title">Assigned Driver</span>
              <div className="oam-driver-info-details">
                <span className="oam-driver-info-item">
                  <User size={14} />
                  {assignedDriver.name}
                </span>
                {assignedDriver.phone && (
                  <span className="oam-driver-info-item">
                    <Phone size={14} />
                    {assignedDriver.phone}
                  </span>
                )}
              </div>
            </div>
          )}

          {validTransitions.length === 0 ? (
            <p className="oam-no-transitions">
              This order has reached a terminal state and cannot be updated further.
            </p>
          ) : (
            <>
              {/* Next status picker */}
              <div className="oam-field">
                <label className="oam-field-label">Change Status To</label>
                <div className="oam-status-grid">
                  {validTransitions.map((key) => {
                    const meta = STATUS_META[key] || { label: key, color: '#757575', bgColor: '#F5F5F5' };
                    const isSelected = selectedStatus === key;
                    return (
                      <button
                        key={key}
                        className={`oam-status-option ${isSelected ? 'selected' : ''}`}
                        style={isSelected ? { borderColor: meta.color, backgroundColor: meta.bgColor, color: meta.color } : {}}
                        onClick={() => { setSelectedStatus(key); setError(null); }}
                      >
                        {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Driver picker — shown only when "assigned" is the chosen next status */}
              {selectedStatus === 'assigned' && (
                <div className="oam-field">
                  <label className="oam-field-label">
                    <UserCheck size={15} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                    Assign Driver
                    <span className="oam-required">*</span>
                  </label>

                  {driversLoading ? (
                    <div className="oam-drivers-loading">
                      <Loader size={16} className="spin-icon" />
                      <span>Loading available drivers…</span>
                    </div>
                  ) : drivers.length === 0 ? (
                    <p className="oam-no-drivers">No active drivers available at the moment.</p>
                  ) : (
                    <select
                      className={`oam-driver-select ${!selectedDriverId && error ? 'input-error' : ''}`}
                      value={selectedDriverId}
                      onChange={(e) => { setSelectedDriverId(e.target.value); setError(null); }}
                    >
                      <option value="">— Select a driver —</option>
                      {drivers.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}{d.phone ? ` · ${d.phone}` : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="oam-error">
                  <AlertCircle size={15} />
                  <span>{error}</span>
                </div>
              )}

              {/* Footer actions */}
              <div className="oam-footer">
                <button className="oam-btn-cancel" onClick={onClose} disabled={submitting}>
                  Cancel
                </button>
                <button
                  className="oam-btn-confirm"
                  onClick={handleSubmit}
                  disabled={submitting || !selectedStatus}
                >
                  {submitting ? (
                    <><Loader size={15} className="spin-icon" /> Updating…</>
                  ) : (
                    'Confirm Update'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderActionModal;
