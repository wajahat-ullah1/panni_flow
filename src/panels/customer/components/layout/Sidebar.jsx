import { useNavigate } from "react-router-dom";
import {
  DashboardIcon, OrderIcon, MyOrdersIcon, TrackIcon,
  PaymentIcon, ProfileIcon, DropIcon, LogoutIcon,
} from "../icons/Icons";
import { useTenant } from "../../../../shared/context/TenantContext";

const NAV_ITEMS = [
  { icon: DashboardIcon, label: "Dashboard",     path: "dashboard" },
  { icon: OrderIcon,     label: "Order Water",   path: "order-water" },
  { icon: MyOrdersIcon,  label: "My Orders",     path: "my-orders" },
  { icon: TrackIcon,     label: "Live Tracking", path: "live-tracking" },
  { icon: PaymentIcon,   label: "Payments",      path: "payments" },
  { icon: ProfileIcon,   label: "Profile",       path: "profile" },
];

export default function Sidebar({ activeNav, setActiveNav, onLogout }) {
  const navigate = useNavigate();
  const { tenantId, tenantData, logoUrl } = useTenant();

  // Debug logging
  console.log("Customer Sidebar - tenantData:", tenantData);
  console.log("Customer Sidebar - logoUrl:", logoUrl);
  console.log("Customer Sidebar - tenantData?.logo:", tenantData?.logo);

  const handleNavigation = (label, path) => {
    setActiveNav(label);
    navigate(`/${tenantId}/customer/${path}`);
  };

  const handleLogout = () => { if (onLogout) onLogout(); };

  return (
    <aside style={styles.sidebar}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .nav-item-btn {
          transition: all 0.18s cubic-bezier(.34,1.56,.64,1);
        }
        .nav-item-btn:hover {
          background: #f0f9ff !important;
          transform: translateX(3px);
        }
        .logout-btn-side {
          transition: all 0.18s ease;
        }
        .logout-btn-side:hover {
          background: #fff1f2 !important;
          color: #ef4444 !important;
        }
        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .sidebar-nav-item { animation: slideInLeft 0.35s ease both; }
      `}</style>

      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          {logoUrl ? (
            <img src={logoUrl} alt={tenantData.name} style={{ width: 26, height: 26, objectFit: "contain", borderRadius: 4 }} />
          ) : (
            <DropIcon stroke="white" />
          )}
        </div>
        <div>
          <div style={styles.brandName}>{tenantData?.name ?? "Panni Flow"}</div>
          <div style={styles.brandSub}>Customer Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.navLabel}>NAVIGATION</div>
        {NAV_ITEMS.map(({ icon: Icon, label, path }, i) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
                animationDelay: `${i * 50}ms`,
              }}
              className="nav-item-btn sidebar-nav-item"
              onClick={() => handleNavigation(label, path)}
            >
              <span style={{
                ...styles.navIconWrap,
                background: isActive ? "linear-gradient(135deg,#0ea5e9,#0284c7)" : "transparent",
                color: isActive ? "white" : "#94a3b8",
              }}>
                <Icon />
              </span>
              <span style={{ color: isActive ? "#0f172a" : "#64748b", fontWeight: isActive ? 600 : 400 }}>
                {label}
              </span>
              {isActive && <span style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={styles.bottomSection}>
        <div style={styles.divider} />
        <button style={styles.logoutBtn} className="logout-btn-side" onClick={handleLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 228,
    minWidth: 228,
    background: "white",
    borderRight: "1px solid #e8edf5",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 16px",
    boxShadow: "2px 0 12px rgba(15,23,42,0.05)",
    fontFamily: "'DM Sans', sans-serif",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "22px 20px 20px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: 8,
  },
  brandIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(14,165,233,0.3)",
  },
  brandName: { fontWeight: 900, fontSize: 19, color: "#0f172a", fontFamily: "'DM Sans', sans-serif", letterSpacing: -0.3 },
  brandSub: { fontSize: 10.5, color: "#94a3b8", marginTop: 1, fontWeight: 500, letterSpacing: 0.4 },
  nav: { flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 },
  navLabel: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#cbd5e1",
    letterSpacing: 1.2,
    padding: "4px 12px 10px",
    fontFamily: "'DM Sans', sans-serif",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 11,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontSize: 13.5,
    position: "relative",
    fontFamily: "'DM Sans', sans-serif",
  },
  navItemActive: {
    background: "#f0f9ff",
  },
  navIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "background 0.18s ease",
  },
  activeIndicator: {
    position: "absolute",
    right: 10,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#0ea5e9",
  },
  bottomSection: { padding: "0 12px" },
  divider: { height: 1, background: "#f1f5f9", marginBottom: 8 },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: 13.5,
    cursor: "pointer",
    borderRadius: 11,
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  },
};