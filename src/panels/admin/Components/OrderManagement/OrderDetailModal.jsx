import React from 'react';
import {
  X,
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Package,
  User,
  Phone,
  FileText,
  Navigation,
  Truck,
} from 'lucide-react';
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  const orderDetails = [
    { label: 'Order ID', value: order.id, icon: FileText },
    { label: 'Customer', value: order.customer, icon: User },
    { label: 'Location', value: order.location, icon: MapPin },
    { label: 'Quantity', value: order.quantity, icon: Package },
    { label: 'Amount', value: order.amount, icon: DollarSign },
    { label: 'Date', value: order.date, icon: Calendar },
    { label: 'Time', value: order.time, icon: Clock },
  ];

  const timeline = [
    { status: 'Order Placed', time: '08:30 AM', completed: true },
    { status: 'Processing', time: '08:45 AM', completed: true },
    {
      status: 'In Transit',
      time: '09:15 AM',
      completed: order.status !== 'Pending',
    },
    {
      status: 'Delivered',
      time: '10:30 AM',
      completed: order.status === 'Delivered',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Order Details</h2>
            <p className="modal-subtitle">{order.id}</p>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Status Badge */}
          <div className="status-section">
            <div
              className="large-status-badge"
              style={{ backgroundColor: `${order.statusColor}20` }}
            >
              <CheckCircle size={24} color={order.statusColor} />
              <span style={{ color: order.statusColor }}>{order.status}</span>
            </div>
          </div>

          {/* Order Information */}
          <div className="info-section">
            <h3 className="section-title">Order Information</h3>
            <div className="info-grid">
              {orderDetails.map((detail, index) => {
                const IconComponent = detail.icon;
                return (
                  <div key={index} className="info-row">
                    <div className="info-label">
                      <IconComponent size={18} />
                      <span>{detail.label}</span>
                    </div>
                    <span className="info-value">{detail.value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="timeline-section">
            <h3 className="section-title">Order Timeline</h3>
            <div className="timeline">
              {timeline.map((item, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker">
                    <div
                      className={`timeline-dot ${
                        item.completed ? 'completed' : ''
                      }`}
                    >
                      {item.completed && <CheckCircle size={12} />}
                    </div>
                    {index < timeline.length - 1 && (
                      <div
                        className={`timeline-line ${
                          item.completed ? 'completed' : ''
                        }`}
                      />
                    )}
                  </div>
                  <div className="timeline-content">
                    <p
                      className={`timeline-status ${
                        item.completed ? 'completed' : ''
                      }`}
                    >
                      {item.status}
                    </p>
                    <p className="timeline-time">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-section">
            <button className="action-button">
              <Phone size={20} />
              <span>Call Customer</span>
            </button>

            <button className="action-button">
              <MapPin size={20} />
              <span>View Location</span>
            </button>

            <button className="action-button">
              <FileText size={20} />
              <span>View Invoice</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          <button className="secondary-button" onClick={onClose}>
            Close
          </button>

          {order.status === 'Pending' && (
            <button className="primary-button">
              <Truck size={18} />
              <span>Assign Driver</span>
            </button>
          )}

          {order.status === 'In-Transit' && (
            <button className="primary-button">
              <Navigation size={18} />
              <span>Track Delivery</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
