import { useNavigate } from "react-router-dom";
import {
  DashboardIcon, OrderIcon, MyOrdersIcon, TrackIcon,
  PaymentIcon, ProfileIcon, DropIcon, LogoutIcon,
} from "../icons/Icons";
import { useTenant } from "../../../../shared/context/TenantContext";

const NAV_ITEMS = [
  { icon: DashboardIcon, label: "Dashboard", path: "dashboard" },
  { icon: OrderIcon, label: "Order Water", path: "order-water" },
  { icon: MyOrdersIcon, label: "My Orders", path: "my-orders" },
  { icon: TrackIcon, label: "Live Tracking", path: "live-tracking" },
  { icon: PaymentIcon, label: "Payments", path: "payments" },
  { icon: ProfileIcon, label: "Profile", path: "profile" },
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

        .cs-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .cs-nav-item {
          transition: all 0.18s ease;
        }
        .cs-nav-item:hover {
          background: rgba(255,255,255,0.07) !important;
          color: rgba(255,255,255,0.9) !important;
          transform: translateX(2px);
        }
        .cs-logout-btn {
          transition: all 0.18s ease;
        }
        .cs-logout-btn:hover {
          background: rgba(239,68,68,0.18) !important;
          border-color: rgba(239,68,68,0.35) !important;
          color: #fecaca !important;
        }
        @keyframes csSlideIn {
          from { opacity:0; transform:translateX(-10px); }
          to   { opacity:1; transform:translateX(0); }
        }
        .cs-nav-animated { animation: csSlideIn 0.32s ease both; }
      `}</style>

      {/* Brand */}
      <div style={styles.brand}>
        <div style={styles.brandIcon}>
          {logoUrl ? (
            <img src={logoUrl} alt={tenantData?.name} style={{ width: 26, height: 26, objectFit: "contain", borderRadius: 5 }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2.5C11.5 2.5 6 9.5 6 14C6 17.3 8.7 20 12 20C15.3 20 18 17.3 18 14C18 9.5 12.5 2.5 12 2.5Z" fill="white" fillOpacity="0.9" />
              <path d="M8 14C8 11.8 10.5 8 12 6" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.5" />
            </svg>
          )}
        </div>
        <div style={{ overflow: "hidden" }}>
          <div style={styles.brandName}>{tenantData?.name ?? "Pani Flow"}</div>
          <div style={styles.brandSub}>Customer Panel</div>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider} />

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
              className="cs-nav-item cs-nav-animated"
              onClick={() => handleNavigation(label, path)}
            >
              <span style={{
                ...styles.navIconWrap,
                background: isActive
                  ? "linear-gradient(135deg, rgba(14,165,233,0.35), rgba(3,105,161,0.25))"
                  : "transparent",
              }}>
                <Icon />
              </span>
              <span style={styles.navLabelText}>{label}</span>
              {isActive && <span style={styles.activeDot} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.divider} />
        <button style={styles.logoutBtn} className="cs-logout-btn" onClick={handleLogout}>
          <span style={styles.logoutIcon}><LogoutIcon /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 240,
    minWidth: 240,
    height: "100vh",
    background: "linear-gradient(180deg, #0c1e3e 0%, #0f2d5a 60%, #0c2346 100%)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
    overflow: "hidden",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "22px 20px 20px",
    position: "relative",
    zIndex: 1,
  },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "rgba(255,255,255,0.12)",
    border: "1.5px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    backdropFilter: "blur(6px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  brandName: {
    fontSize: 15,
    fontWeight: 800,
    color: "#ffffff",
    margin: 0,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    letterSpacing: "-0.3px",
  },
  brandSub: {
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    margin: "0 20px",
    position: "relative",
    zIndex: 1,
  },
  nav: {
    flex: 1,
    padding: "20px 12px 12px",
    overflowY: "auto",
    position: "relative",
    zIndex: 1,
  },
  navLabel: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "rgba(255,255,255,0.28)",
    letterSpacing: "1px",
    margin: "0 8px 10px",
  },
  navItem: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "11px 14px",
    marginBottom: 3,
    border: "none",
    background: "transparent",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    fontWeight: 500,
    color: "rgba(255,255,255,0.55)",
    textAlign: "left",
    position: "relative",
  },
  navItemActive: {
    background: "linear-gradient(135deg, rgba(14,165,233,0.25), rgba(3,105,161,0.2))",
    color: "#ffffff",
    fontWeight: 700,
    border: "1px solid rgba(14,165,233,0.25)",
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
  navLabelText: { flex: 1 },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#38bdf8",
    boxShadow: "0 0 6px rgba(56,189,248,0.7)",
    flexShrink: 0,
  },
  footer: {
    padding: "0 12px 20px",
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  logoutBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "11px 14px",
    background: "rgba(239,68,68,0.08)",
    border: "1px solid rgba(239,68,68,0.15)",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13.5,
    fontWeight: 600,
    color: "#fca5a5",
  },
  logoutIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};