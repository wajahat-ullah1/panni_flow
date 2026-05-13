import { BellIcon, SearchIcon } from "../icons/Icons";
import { useAuthContext } from "../../../../shared/context/AuthContext";

export default function Topbar() {
  const { user } = useAuthContext();

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const userName = user?.name || user?.fullName || user?.username || "User";
  const userRole = user?.role || "Customer";

  function getInitials(name) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  const initials = getInitials(userName);

  return (
    <header style={styles.topbar}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
        .search-box-top { transition: all 0.2s ease; }
        .search-box-top:focus-within {
          border-color: #bae6fd !important;
          background: white !important;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
        }
        .bell-btn-top {
          transition: all 0.18s cubic-bezier(.34,1.56,.64,1);
        }
        .bell-btn-top:hover {
          background: #f0f9ff !important;
          border-color: #bae6fd !important;
          transform: scale(1.08);
        }
        .user-avatar-top {
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .user-avatar-top:hover { transform: scale(1.07); }
        @keyframes topbarIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .topbar-inner { animation: topbarIn 0.4s ease both; }
      `}</style>

      <div className="topbar-inner" style={styles.inner}>
        <div>
          <div style={styles.topDate}>{formattedDate}</div>
          <div style={styles.topGreet}>
            Welcome back, <span style={styles.greetName}>{userName}</span>
            <span style={{ marginLeft: 4 }}>👋</span>
          </div>
        </div>

        <div style={styles.topRight}>
          {/* Search */}
          <div style={styles.searchBox} className="search-box-top">
            <span style={{ color: "#94a3b8", display: "flex" }}>
              <SearchIcon />
            </span>
            <input style={styles.searchInput} placeholder="Search orders..." />
          </div>

          {/* Bell */}
          <button style={styles.bellBtn} className="bell-btn-top">
            <BellIcon />
            <span style={styles.bellBadge}>3</span>
          </button>

          {/* Divider */}
          <div style={styles.vertDivider} />

          {/* User */}
          <div style={styles.userInfo}>
            <div style={styles.avatar} className="user-avatar-top">{initials}</div>
            <div>
              <div style={styles.userName}>{userName}</div>
              <div style={styles.userRole}>{userRole}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    background: "white",
    borderBottom: "1px solid #e8edf5",
    boxShadow: "0 1px 8px rgba(15,23,42,0.05)",
    padding: "0 28px",
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 88,
  },
  topDate: { fontSize: 11.5, color: "#94a3b8", letterSpacing: 0.3 },
  topGreet: {
    fontSize: 30,
    fontWeight: 800,
    color: "#0f172a",
    fontFamily: "sans-serif",
    letterSpacing: -0.5,
    marginTop: 1,
    display: "flex",
    alignItems: "center",
  },
  greetName: {
    background: "linear-gradient(90deg, #0ea5e9, #0284c7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginLeft: 5,
  },
  topRight: { display: "flex", alignItems: "center", gap: 12 },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 11,
    padding: "8px 14px",
    width: 220,
  },
  searchInput: {
    border: "none",
    background: "transparent",
    fontSize: 13,
    color: "#64748b",
    outline: "none",
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
  },
  bellBtn: {
    position: "relative",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 11,
    width: 42,
    height: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#64748b",
  },
  bellBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    fontSize: 9,
    fontWeight: 700,
    borderRadius: "50%",
    width: 17,
    height: 17,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(239,68,68,0.4)",
  },
  vertDivider: {
    width: 1,
    height: 28,
    background: "#e2e8f0",
    margin: "0 2px",
  },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: 13,
    boxShadow: "0 3px 10px rgba(168,85,247,0.3)",
    fontFamily: "'Syne', sans-serif",
  },
  userName: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  userRole: { fontSize: 10.5, color: "#94a3b8", letterSpacing: 0.3 },
};