import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

// ── Layout ────────────────────────────────────────────────────────────────────
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
import { useTenant } from "../../shared/context/TenantContext";

// ── Driver store — populated once on mount via GET /drivers/me ────────────────
import driverApi from "../../shared/api/driverApi";
import { setDriverProfile, clearDriverProfile } from "../../shared/api/driverStore";

export default function DriverApp() {
  const { logout } = useAuth();
  const { tenantId } = useTenant();
  const [driverReady, setDriverReady] = useState(false);

  // Fetch the authenticated driver's profile once so all child components
  // can read the driver _id synchronously from driverStore.
  useEffect(() => {
    let cancelled = false;
    driverApi.getDriverProfile()
      .then((res) => {
        if (!cancelled) {
          // Response shape: { success, data: Driver, timestamp }
          setDriverProfile(res?.data ?? res);
          setDriverReady(true);
        }
      })
      .catch(() => {
        // Even on failure, unblock the UI — components will handle missing ID
        if (!cancelled) setDriverReady(true);
      });
    return () => {
      cancelled = true;
      clearDriverProfile();
    };
  }, []);

  const handleLogout = () => {
    clearDriverProfile();
    logout();
    window.location.href = `/${tenantId}/login`;
  };

  if (!driverReady) {
    return (
      <div style={styles.loader}>
        Loading…
      </div>
    );
  }

  return (
    <div style={styles.app}>
      <Sidebar onLogout={handleLogout} />
      <div style={styles.content}>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"            element={<Dashboard />} />
          <Route path="assigned-deliveries"  element={<AssignedDeliveries />} />
          <Route path="live-route"           element={<LiveRoute />} />
          <Route path="delivery-history"     element={<DeliveryHistory />} />
          <Route path="earnings"             element={<Earnings />} />
          <Route path="profile"              element={<Profile />} />
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
    marginLeft: "240px",
    flex: 1,
    overflowY: "auto",
  },
  loader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#64748b",
    fontSize: "1rem",
  },
};