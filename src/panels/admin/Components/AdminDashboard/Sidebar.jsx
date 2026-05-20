import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  TrendingUp,
  LogOut,
  UserPlus,
  Truck,
  User,
} from 'lucide-react';
import { useTenant } from '../../../../shared/context/TenantContext';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId, tenantData, logoUrl } = useTenant();
  const [imgError, setImgError] = useState(false);

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
      icon: User,
      path: `/${tenantId}/admin/profile`,
    },
  ];

  const isActive = (path) => location.pathname === path;

  // Show logo image only when logoUrl exists AND hasn't errored
  const showLogo = logoUrl && !imgError;

  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="asb-root">

        {/* ── Brand Header ── */}
        <div className="asb-header">
          <div className="asb-logo-wrap">
            {showLogo ? (
              <img
                src={logoUrl}
                alt={tenantData?.name ?? 'Logo'}
                onError={() => setImgError(true)}
                style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 5, display: 'block' }}
              />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2.5C11.5 2.5 6 9.5 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9.5 12.5 2.5 12 2.5Z" fill="white" fillOpacity="0.9" />
                <path d="M8 14C8 11.8 10.5 8 12 6" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
              </svg>
            )}
          </div>
          <div className="asb-brand-text">
            <h1 className="asb-brand-name">{tenantData?.name?.toUpperCase() ?? 'PANNI FLOW'}</h1>
            <span className="asb-brand-role">Admin Panel</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="asb-divider" />

        {/* ── Navigation ── */}
        <nav className="asb-nav">
          <p className="asb-nav-section-label">MAIN MENU</p>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`asb-nav-item${active ? ' asb-nav-item--active' : ''}`}
              >
                <span className="asb-nav-icon">
                  <IconComponent size={18} strokeWidth={active ? 2.5 : 1.8} />
                </span>
                <span className="asb-nav-label">{item.label}</span>
                {active && <span className="asb-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="asb-footer">
          <div className="asb-divider" style={{ marginBottom: 16 }} />
          <button className="asb-logout-btn" onClick={onLogout}>
            <span className="asb-logout-icon">
              <LogOut size={18} strokeWidth={1.8} />
            </span>
            <span>Logout</span>
          </button>
        </div>

      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const sidebarStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.asb-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  width: 250px;
  height: 100vh;
  background: linear-gradient(180deg, #0c1e3e 0%, #0f2d5a 60%, #0c2346 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 4px 0 24px rgba(0,0,0,0.15);
  overflow: hidden;
}

/* Subtle grid overlay */
.asb-root::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

/* ── Header ── */
.asb-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px 20px;
  position: relative;
  z-index: 1;
}

.asb-logo-wrap {
  width: 42px;
  height: 42px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.asb-brand-text { overflow: hidden; }

.asb-brand-name {
  font-size: 15px;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.3px;
}

.asb-brand-role {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.7px;
}

/* ── Divider ── */
.asb-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 0 20px;
  position: relative;
  z-index: 1;
}

/* ── Nav ── */
.asb-nav {
  flex: 1;
  padding: 20px 12px 12px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.asb-nav::-webkit-scrollbar { width: 3px; }
.asb-nav::-webkit-scrollbar-track { background: transparent; }
.asb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.asb-nav-section-label {
  font-size: 10.5px;
  font-weight: 700;
  color: rgba(255,255,255,0.28);
  letter-spacing: 1px;
  margin: 0 8px 10px;
  display: block;
}

.asb-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  margin-bottom: 3px;
  /* Always reserve space for the border so layout never shifts */
  border: 1px solid transparent;
  background: transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.55);
  text-align: left;
  position: relative;
}

.asb-nav-item:hover {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.9);
  border-color: rgba(255,255,255,0.06);
}

.asb-nav-item--active {
  background: linear-gradient(135deg, rgba(14,165,233,0.25), rgba(3,105,161,0.2)) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  border-color: rgba(14,165,233,0.3) !important;
}

.asb-nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.asb-nav-label { flex: 1; }

.asb-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px rgba(56,189,248,0.8);
  flex-shrink: 0;
}

/* ── Footer ── */
.asb-footer {
  padding: 0 12px 20px;
  position: relative;
  z-index: 1;
}

.asb-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  border: 1px solid rgba(239,68,68,0.18);
  background: rgba(239,68,68,0.08);
  border-radius: 10px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #fca5a5;
  transition: all 0.18s ease;
}

.asb-logout-btn:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.35);
  color: #fecaca;
}

.asb-logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .asb-root {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .asb-root.open {
    transform: translateX(0);
  }
}
`;

export default Sidebar;