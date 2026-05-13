import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { tenantId, tenantData, logoUrl } = useTenant();

  // Debug logging
  console.log("Admin Sidebar - tenantData:", tenantData);
  console.log("Admin Sidebar - logoUrl:", logoUrl);
  console.log("Admin Sidebar - tenantData?.logo:", tenantData?.logo);

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
              alt={tenantData?.name}
              style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 6 }}
              onError={(e) => {
                console.error("Admin Sidebar - Image failed to load:", logoUrl, e);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log("Admin Sidebar - Image loaded successfully:", logoUrl)}
            />
          ) : (
            <Droplet size={24} color="#fff" />
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
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              className={`menu-item${isActive ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <IconComponent size={18} />
              <span className="menu-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <LogOut size={18} />
          <span className="menu-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;