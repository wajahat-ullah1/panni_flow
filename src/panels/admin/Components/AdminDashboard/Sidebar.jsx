import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  TrendingUp,
  LogOut,
  Droplet,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: Package,
      path: '/admin/orders',
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: MapPin,
      path: '/admin/tracking',
    },
    {
      id: 'forecast',
      label: 'Demand Forecasting',
      icon: TrendingUp,
      path: '/admin/forecast',
    },
  ];

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          <Droplet size={32} color="#fff" />
        </div>
        <div className="logo-text">
          <h2 className="logo-title">PANNI FLOW</h2>
          <p className="logo-subtitle">Water Management</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="menu-container">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`menu-item`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent size={20} />
              <span className="menu-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button className="logout-button" onClick={onLogout}>
        <LogOut size={20} />
        <span className="menu-text">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
