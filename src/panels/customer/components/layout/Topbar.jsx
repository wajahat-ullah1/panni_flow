import { BellIcon, SearchIcon } from "../icons/Icons";

export default function Topbar() {
  return (
    <header style={styles.topbar}>
      <div>
        <div style={styles.topDate}>Monday, March 30, 2026</div>
        <div style={styles.topGreet}>Welcome back, John!</div>
      </div>

      <div style={styles.topRight}>
        {/* Search */}
        <div style={styles.searchBox}>
          <span style={{ color: "#94a3b8" }}>
            <SearchIcon />
          </span>
          <input style={styles.searchInput} placeholder="Search orders..." />
        </div>

        {/* Bell */}
        <button style={styles.bellBtn}>
          <BellIcon />
          <span style={styles.bellBadge}>3</span>
        </button>

        {/* User */}
        <div style={styles.userInfo}>
          <div style={styles.avatar}>JD</div>
          <div>
            <div style={styles.userName}>John Doe</div>
            <div style={styles.userRole}>Customer</div>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 28px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
  },
  topDate: { fontSize: 12, color: "#94a3b8" },
  topGreet: { fontSize: 18, fontWeight: 700, color: "#0f172a" },
  topRight: { display: "flex", alignItems: "center", gap: 14 },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "7px 14px",
    width: 220,
  },
  searchInput: {
    border: "none",
    background: "transparent",
    fontSize: 13,
    color: "#64748b",
    outline: "none",
    width: "100%",
  },
  bellBtn: {
    position: "relative",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
  },
  bellBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    background: "#ef4444",
    color: "white",
    fontSize: 9,
    fontWeight: 700,
    borderRadius: "50%",
    width: 16,
    height: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#a855f7,#7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: 13,
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  userRole: { fontSize: 11, color: "#94a3b8" },
};
