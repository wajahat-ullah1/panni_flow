import { Routes, Route, Navigate } from "react-router-dom";
 
// ── Layout ────────────────────────────────────────────────────────────────────
// Update these import paths — remove the old "Components/AdminDashboard/" prefix
// and point to your admin components folder
import Sidebar from "./Components/AdminDashboard/Sidebar";
 
// ── Pages ─────────────────────────────────────────────────────────────────────
import AdminDashboard    from "./Components/AdminDashboard/AdminDashboard";
import OrderManagement   from "./Components/OrderManagement/OrderManagement";
import LiveTracking      from "./Components/LiveTracking/LiveTracking";
import DemandForecasting from "./Components/DemandForeCasting/DemandForecasting";
import AddDriver         from "./Components/AddDriver/AdDriver";
import VehicleManagement from "./Components/VehicleManagement/VehicleManagement";
import ProfilePage         from "./Components/Profile/ProfilePage";

// ── Auth (to get logout) ──────────────────────────────────────────────────────
import useAuth from "../../shared/hooks/useAuth";
import { useTenant } from "../../shared/context/TenantContext";
 
// ─────────────────────────────────────────────────────────────────────────────
// Map sidebar screen keys → route paths
// Your old Sidebar used string keys like "dashboard", "orders" etc.
// We keep that same system but now also sync with the URL
// ─────────────────────────────────────────────────────────────────────────────
 
export default function AdminApp() {
  const { logout } = useAuth();
  const { tenantId } = useTenant();
 
  const handleLogout = () => {
    logout();
    // Redirect to admin login (not the public /login)
    window.location.href = `/${tenantId}/login`;
  };
 
  return (
    <div style={styles.app}>
      {/* Pass onLogout so the Sidebar can trigger it */}
      <Sidebar onLogout={handleLogout} />
      <main style={styles.mainContent}>
        <Routes>
          {/* /admin/ → redirect to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard"  element={<AdminDashboard />} />
          <Route path="orders"     element={<OrderManagement />} />
          <Route path="tracking"   element={<LiveTracking />} />
          <Route path="forecast"   element={<DemandForecasting />} />
          <Route path="drivers"    element={<AddDriver />} />
          <Route path="vehicles"   element={<VehicleManagement />} />
          <Route path="profile"    element={<ProfilePage />} />
          {/* Catch-all inside admin panel */}
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
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
  mainContent: {
    flex: 1,
    overflowY: "auto",
  },
};