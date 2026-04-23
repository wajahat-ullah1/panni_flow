import { BellIcon, SearchIcon } from "../icons/Icons";
import { useAuthContext } from "../../../../shared/context/AuthContext";

export default function Topbar() {
  const { user } = useAuthContext();

  // Format date as: Wednesday, April 23, 2026
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // User info fallback
  const userName = user?.name || user?.fullName || user?.username || "User";
  const userRole = user?.role || "Customer";
  // Avatar: use initials
  function getInitials(name) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  const initials = getInitials(userName);

  return (
    <header style={styles.topbar}>
      <div>
        <div style={styles.topDate}>{formattedDate}</div>
        <div style={styles.topGreet}>Welcome back, {userName}!</div>
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
          <div style={styles.avatar}>{initials}</div>
          <div>
            <div style={styles.userName}>{userName}</div>
            <div style={styles.userRole}>{userRole}</div>
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
