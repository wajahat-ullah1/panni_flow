import { Routes, Route, Navigate } from "react-router-dom";
 
// ── Layout ────────────────────────────────────────────────────────────────────
// Your old Sidebar — keep the same import, just remove the old <Router> wrapper
// because the router now lives in main.jsx at the top level
import Sidebar from "./Components/Sidebar";
 
// ── Pages ─────────────────────────────────────────────────────────────────────
import Dashboard          from "./Components/Dashboard";
import AssignedDeliveries from "./Components/AssignedDeliveries";
import LiveRoute          from "./Components/LiveRoute";
import DeliveryHistory    from "./Components/DeliveryHistory";
import Earnings           from "./Components/Earnings";
import Profile            from "./Components/Profile";
 
// ── Auth ──────────────────────────────────────────────────────────────────────
import useAuth from "../../shared/hooks/useAuth";
 
// ─────────────────────────────────────────────────────────────────────────────
// KEY CHANGE from your old DriverApp:
//   OLD: wrapped everything in its own <Router> (BrowserRouter)
//   NEW: Router is already provided in main.jsx — remove it here
//        Otherwise you get a "nested router" error
//
//   OLD routes:  /  /assigned-deliveries  /live-route  etc.
//   NEW routes:  /driver/dashboard  /driver/assigned-deliveries  etc.
//   (because this component is mounted at /driver/* in App.jsx)
// ─────────────────────────────────────────────────────────────────────────────
 
export default function DriverApp() {
  const { logout } = useAuth();
 
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
 
  return (
    <div style={styles.app}>
      {/* Pass onLogout to Sidebar so driver can log out */}
      <Sidebar onLogout={handleLogout} />
 
      <div style={styles.content}>
        <Routes>
          {/* /driver/ → redirect to /driver/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />
 
          {/* All routes are now relative to /driver/ */}
          <Route path="dashboard"            element={<Dashboard />} />
          <Route path="assigned-deliveries"  element={<AssignedDeliveries />} />
          <Route path="live-route"           element={<LiveRoute />} />
          <Route path="delivery-history"     element={<DeliveryHistory />} />
          <Route path="earnings"             element={<Earnings />} />
          <Route path="profile"              element={<Profile />} />
 
          {/* Catch-all inside driver panel */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
}
 
const styles = {
  app: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f8fafc",
  },
  content: {
    marginLeft: "240px", // matches your old driver sidebar width
    flex: 1,
    overflowY: "auto",
  },
};