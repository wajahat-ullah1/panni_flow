import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTenant } from '../../../shared/context/TenantContext';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tenantId, tenantData, logoUrl } = useTenant();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      path: `/${tenantId}/driver/dashboard`,
    },
    {
      id: 'assigned',
      label: 'Assigned Deliveries',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M17 7L10 3L3 7M17 7L10 11M17 7V13L10 17M10 11L3 7M10 11V17M3 7V13L10 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      path: `/${tenantId}/driver/assigned-deliveries`,
    },
    {
      id: 'route',
      label: 'Live Route',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      path: `/${tenantId}/driver/live-route`,
    },
    {
      id: 'history',
      label: 'Delivery History',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 5V10L13.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      path: `/${tenantId}/driver/delivery-history`,
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 6V14M8 8H11C11.5523 8 12 8.44772 12 9C12 9.55228 11.5523 10 11 10H9C8.44772 10 8 10.4477 8 11C8 11.5523 8.44772 12 9 12H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      path: `/${tenantId}/driver/earnings`,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M4 17C4 14.2386 6.23858 12 9 12H11C13.7614 12 16 14.2386 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      path: `/${tenantId}/driver/profile`,
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{sidebarStyles}</style>
      <div className="sb-root">

        {/* ── Brand Header ── */}
        <div className="sb-header">
          <div className="sb-logo-wrap">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={tenantData?.name}
                style={{ width: 26, height: 26, objectFit: 'contain', borderRadius: 5 }}
              />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.5 2 6 6 6 9c0 5 6 13 6 13s6-8 6-13c0-3-2.5-7-6-7z" fill="white" fillOpacity="0.9"/>
                <circle cx="12" cy="9" r="2.5" fill="white" fillOpacity="0.5"/>
              </svg>
            )}
          </div>
          <div className="sb-brand-text">
            <h1 className="sb-brand-name">{tenantData?.name ?? 'Pani Flow'}</h1>
            <span className="sb-brand-role">Driver Panel</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="sb-divider" />

        {/* ── Navigation ── */}
        <nav className="sb-nav">
          <p className="sb-nav-label">MAIN MENU</p>
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`sb-nav-item${active ? ' sb-nav-item--active' : ''}`}
              >
                <span className="sb-nav-icon">{item.icon}</span>
                <span className="sb-nav-label-text">{item.label}</span>
                {active && <span className="sb-active-dot" />}
              </button>
            );
          })}
        </nav>

        {/* ── Footer ── */}
        <div className="sb-footer">
          <div className="sb-divider" style={{ marginBottom: 16 }} />
          <button className="sb-logout-btn" onClick={onLogout}>
            <span className="sb-logout-icon">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M13 13L17 10L13 7M17 10H7M7 17H4C3.44772 17 3 16.5523 3 16V4C3 3.44772 3.44772 3 4 3H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────
const sidebarStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.sb-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, #0c1e3e 0%, #0f2d5a 60%, #0c2346 100%);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0; top: 0;
  z-index: 100;
  box-shadow: 4px 0 24px rgba(0,0,0,0.15);
  overflow: hidden;
}

/* subtle grid overlay */
.sb-root::before {
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
.sb-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px 20px;
  position: relative; z-index: 1;
}

.sb-logo-wrap {
  width: 42px; height: 42px;
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.sb-brand-text { overflow: hidden; }

.sb-brand-name {
  font-size: 15px; font-weight: 800;
  color: #ffffff; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  letter-spacing: -0.3px;
}

.sb-brand-role {
  font-size: 11px; font-weight: 600;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase; letter-spacing: 0.7px;
}

/* ── Divider ── */
.sb-divider {
  height: 1px;
  background: rgba(255,255,255,0.08);
  margin: 0 20px;
  position: relative; z-index: 1;
}

/* ── Nav ── */
.sb-nav {
  flex: 1;
  padding: 20px 12px 12px;
  overflow-y: auto;
  position: relative; z-index: 1;
}

.sb-nav::-webkit-scrollbar { width: 3px; }
.sb-nav::-webkit-scrollbar-track { background: transparent; }
.sb-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

.sb-nav-label {
  font-size: 10.5px; font-weight: 700;
  color: rgba(255,255,255,0.28);
  letter-spacing: 1px;
  margin: 0 8px 10px;
}

.sb-nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  margin-bottom: 3px;
  border: none;
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

.sb-nav-item:hover {
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.9);
}

.sb-nav-item--active {
  background: linear-gradient(135deg, rgba(14,165,233,0.25), rgba(3,105,161,0.2));
  color: #ffffff !important;
  font-weight: 700;
  border: 1px solid rgba(14,165,233,0.25);
}

.sb-nav-icon {
  display: flex; align-items: center; justify-content: center;
  width: 20px; height: 20px; flex-shrink: 0;
}

.sb-nav-label-text { flex: 1; }

.sb-active-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px rgba(56,189,248,0.7);
  flex-shrink: 0;
}

/* ── Footer / Logout ── */
.sb-footer {
  padding: 0 12px 20px;
  position: relative; z-index: 1;
}

.sb-logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 14px;
  border: none;
  background: rgba(239,68,68,0.08);
  border: 1px solid rgba(239,68,68,0.15);
  border-radius: 10px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  color: #fca5a5;
  transition: all 0.18s ease;
}

.sb-logout-btn:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.35);
  color: #fecaca;
}

.sb-logout-icon {
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .sb-root {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  .sb-root.open {
    transform: translateX(0);
  }
}
`;

export default Sidebar;