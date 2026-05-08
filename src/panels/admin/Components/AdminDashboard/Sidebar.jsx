import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  TrendingUp,
  LogOut,
  Droplet,
  UserPlus,
  Truck,
} from 'lucide-react';
import './Sidebar.css';
import { useTenant } from '../../../../shared/context/TenantContext';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const { tenantId, tenantData, logoUrl } = useTenant();
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: `/${tenantId}/admin/dashboard`,
    },
    {
      id: 'addDriver',
      label: 'Add Driver',
      icon: UserPlus,
      path: `/${tenantId}/admin/drivers`,
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: Truck,
      path: `/${tenantId}/admin/vehicles`,
    },
    {
      id: 'orders',
      label: 'Order Management',
      icon: Package,
      path: `/${tenantId}/admin/orders`,
    },
    {
      id: 'tracking',
      label: 'Live Tracking',
      icon: MapPin,
      path: `/${tenantId}/admin/tracking`,
    },
    {
      id: 'forecast',
      label: 'Demand Forecasting',
      icon: TrendingUp,
      path: `/${tenantId}/admin/forecast`,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserPlus,
      path: `/${tenantId}/admin/profile`,
    },
  ];

  return (
    <div className="sidebar">
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={tenantData.name}
              style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6 }}
            />
          ) : (
            <Droplet size={32} color="#fff" />
          )}
        </div>
        <div className="logo-text">
          <h2 className="logo-title">{tenantData?.name?.toUpperCase() ?? 'PANNI FLOW'}</h2>
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
