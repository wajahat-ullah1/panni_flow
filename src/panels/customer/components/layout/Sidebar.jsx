import { useNavigate } from "react-router-dom";
import {
  DashboardIcon,
  OrderIcon,
  MyOrdersIcon,
  TrackIcon,
  PaymentIcon,
  ProfileIcon,
  DropIcon,
  LogoutIcon,
} from "../icons/Icons";
import { useTenant } from "../../../../shared/context/TenantContext";

const NAV_ITEMS = [
  { icon: DashboardIcon, label: "Dashboard", path: "dashboard" },
  { icon: OrderIcon,    label: "Order Water", path: "order-water" },
  { icon: MyOrdersIcon, label: "My Orders", path: "my-orders" },
  { icon: TrackIcon,    label: "Live Tracking", path: "live-tracking" },
  { icon: PaymentIcon,  label: "Payments", path: "payments" },
  { icon: ProfileIcon,  label: "Profile", path: "profile" },
];

export default function Sidebar({ activeNav, setActiveNav, onLogout }) {
  const navigate = useNavigate();
  const { tenantId, tenantData, logoUrl } = useTenant();

  const handleNavigation = (label, path) => {
    setActiveNav(label);
    navigate(`/${tenantId}/customer/${path}`);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };
  return (
    <aside style={styles.sidebar}>
      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={tenantData.name}
              style={{ width: 28, height: 28, objectFit: 'contain', borderRadius: 4 }}
            />
          ) : (
            <DropIcon stroke="white" />
          )}
        </div>
        <div>
          <div style={styles.brandName}>{tenantData?.name ?? 'Panni Flow'}</div>
          <div style={styles.brandSub}>Customer Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              style={{
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              }}
              onClick={() => handleNavigation(label, path)}
            >
              <span style={{ color: isActive ? "#0ea5e9" : "#94a3b8" }}>
                <Icon />
              </span>
              <span
                style={{
                  color: isActive ? "#0ea5e9" : "#64748b",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button style={styles.logoutBtn} onClick={handleLogout}>
        <LogoutIcon />
        <span>Logout</span>
      </button>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    background: "white",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    padding: "20px 0",
    boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 20px 24px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: 10,
  },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: { fontWeight: 700, fontSize: 15, color: "#0f172a" },
  brandSub: { fontSize: 11, color: "#94a3b8" },
  nav: {
    flex: 1,
    padding: "8px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    width: "100%",
    textAlign: "left",
    fontSize: 13.5,
    transition: "background 0.15s",
  },
  navItemActive: { background: "#f0f9ff" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "0 12px",
    padding: "10px 12px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: 13.5,
    cursor: "pointer",
    borderRadius: 10,
  },
};
