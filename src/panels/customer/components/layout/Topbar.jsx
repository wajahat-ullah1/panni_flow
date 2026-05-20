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
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        .ct-search-box { transition: all 0.2s ease; }
        .ct-search-box:focus-within {
          border-color: #7dd3fc !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
        }
        .ct-bell-btn {
          transition: all 0.18s cubic-bezier(.34,1.56,.64,1);
        }
        .ct-bell-btn:hover {
          background: #eff6ff !important;
          border-color: #bae6fd !important;
          transform: scale(1.08);
        }
        .ct-avatar {
          transition: transform 0.18s cubic-bezier(.34,1.56,.64,1);
          cursor: pointer;
        }
        .ct-avatar:hover { transform: scale(1.07); }
        @keyframes ctSlideDown {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .ct-inner { animation: ctSlideDown 0.38s ease both; }
      `}</style>

      <div className="ct-inner" style={styles.inner}>
        <div>
          <div style={styles.dateLabel}>{formattedDate}</div>
          <div style={styles.greeting}>
            Welcome back,&nbsp;
            <span style={styles.greetName}>{userName}</span>
            <span style={{ marginLeft: 6 }}>👋</span>
          </div>
        </div>

        <div style={styles.right}>
          {/* Search */}
          <div style={styles.searchBox} className="ct-search-box">
            <span style={{ color: "#94a3b8", display: "flex" }}>
              <SearchIcon />
            </span>
            <input style={styles.searchInput} placeholder="Search orders..." />
          </div>

          {/* Bell */}
          <button style={styles.bellBtn} className="ct-bell-btn">
            <BellIcon />
            <span style={styles.bellBadge}>3</span>
          </button>

          {/* Divider */}
          <div style={styles.vertDivider} />

          {/* User */}
          <div style={styles.userInfo}>
            <div style={styles.avatar} className="ct-avatar">{initials}</div>
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
    background: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 8px rgba(15,23,42,0.06)",
    padding: "0 32px",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  },
  inner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 80,
  },
  dateLabel: {
    fontSize: 11.5,
    color: "#94a3b8",
    fontWeight: 500,
    letterSpacing: "0.3px",
  },
  greeting: {
    fontSize: 26,
    fontWeight: 800,
    color: "#0f172a",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: "-0.5px",
    marginTop: 2,
    display: "flex",
    alignItems: "center",
  },
  greetName: {
    color: "#0ea5e9",
  },
  right: { display: "flex", alignItems: "center", gap: 12 },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "8px 14px",
    width: 210,
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
    borderRadius: 10,
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
    margin: "0 4px",
  },
  userInfo: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0369a1, #0ea5e9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
    fontSize: 13,
    boxShadow: "0 3px 10px rgba(14,165,233,0.3)",
    fontFamily: "'DM Sans', sans-serif",
  },
  userName: { fontSize: 13, fontWeight: 700, color: "#0f172a" },
  userRole: { fontSize: 10.5, color: "#94a3b8", letterSpacing: "0.3px", fontWeight: 500 },
};