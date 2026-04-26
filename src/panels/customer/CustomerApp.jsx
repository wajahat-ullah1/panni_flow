import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
 
// ── Layout ────────────────────────────────────────────────────────────────────
import Sidebar    from "./components/layout/Sidebar";
import Topbar     from "./components/layout/Topbar";
import ChatWidget from "./components/chat/ChatWidget";
 
// ── Pages ─────────────────────────────────────────────────────────────────────
import DashboardPage  from "./pages/DashboardPage";
import OrderWaterPage from "./pages/OrderWaterPage";
import MyOrdersPage   from "./pages/MyOrdersPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import PaymentsPage   from "./pages/PaymentsPage";
import ProfilePage    from "./pages/ProfilePage";
 
// ── Auth ──────────────────────────────────────────────────────────────────────
import useAuth from "../../shared/hooks/useAuth";
 
// ── Nav label → route path map ─────────────────────────────────────────────────
const NAV_TO_ROUTE = {
  "Dashboard":    "dashboard",
  "Order Water":  "order-water",
  "My Orders":    "my-orders",
  "Live Tracking":"live-tracking",
  "Payments":     "payments",
  "Profile":      "profile",
};
 
export default function CustomerApp() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const { logout } = useAuth();
 
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };
 
  return (
    <div style={styles.app}>
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        onLogout={handleLogout}
      />
      <div style={styles.mainWrapper}>
        <Topbar />
        <Routes>
          {/* /customer/ → redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard"     element={<DashboardPage />} />
          <Route path="order-water"   element={<OrderWaterPage />} />
          <Route path="my-orders"     element={<MyOrdersPage />} />
          <Route path="live-tracking" element={<LiveTrackingPage />} />
          <Route path="payments"      element={<PaymentsPage />} />
          <Route path="profile"       element={<ProfilePage />} />

          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </div>
      <ChatWidget />
    </div>
  );
}
 
const styles = {
  app: {
    display: "flex",
    height: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f8fafc",
    overflow: "hidden",
  },
  mainWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
};