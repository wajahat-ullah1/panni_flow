import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// ── Public pages ──────────────────────────────────────────────────────────────
import PanniFlowLanding   from "./pages/PanniFlowLanding";
import LoginPage          from "./pages/LoginPage";
import SignUpPage         from "./pages/SignUpPage";
import InvalidTenantPage  from "./pages/InvalidTenantPage";

// ── Panel apps ────────────────────────────────────────────────────────────────
import CustomerApp    from "./panels/customer/CustomerApp.jsx";
import DriverApp      from "./panels/driver/DriverApp.jsx";
import AdminApp       from "./panels/admin/AdminApp.jsx";
import AdminLoginPage from "./panels/admin/Components/Login/LoginPage";

// ── Super Admin ────────────────────────────────────────────────────────────────
import SuperAdminApp       from "./panels/superAdmin/App.jsx";
import SuperAdminLoginPage from "./superAdminLogin/Login.jsx";
import MineralWaterLandingPage from "./panels/superAdmin/pages/MineralWaterLandingPage.jsx";

// ── Route guard ───────────────────────────────────────────────────────────────
import ProtectedRoute from "./shared/components/ProtectedRoute";

// ── Tenant context ────────────────────────────────────────────────────────────
import { TenantProvider, useTenant } from "./shared/context/TenantContext";

// ─────────────────────────────────────────────────────────────────────────────
// TenantLayout — renders inside <TenantProvider>.
// 1. While the tenant is being validated → full-screen loading spinner
// 2. If validation fails → TenantErrorPage with the reason
// 3. If valid → render nested routes via <Outlet />
// ─────────────────────────────────────────────────────────────────────────────
function TenantLayout() {
  const { loading, tenantError, tenantId } = useTenant();

  if (loading) {
    return (
      <div style={tenantLoadingStyles.wrap}>
        <div style={tenantLoadingStyles.spinner} />
      </div>
    );
  }

  if (tenantError) {
    return <InvalidTenantPage reason={tenantError} tenantId={tenantId} />;
  }

  return <Outlet />;
}

const tenantLoadingStyles = {
  wrap: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
  },
  spinner: {
    width: 44,
    height: 44,
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #0ea5e9",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

export default function App() {
  return (
    <Routes>

      {/* ── Root landing page ────────────────────────────────────────────── */}
      <Route index element={<MineralWaterLandingPage />} />

      {/* ── Super Admin routes — outside tenant scope ────────────────────── */}
      <Route path="/super-admin/landing" element={<MineralWaterLandingPage />} />
      <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
      <Route path="/super-admin/*"     element={<SuperAdminApp />} />

      {/* ── Tenant-scoped routes (//:tenantId/*) ─────────────────────────── */}
      {/* TenantProvider reads :tenantId from params, validates it, and       */}
      {/* makes it available to all child components via useTenant().          */}
      <Route
        path="/:tenantId"
        element={
          <TenantProvider>
            <TenantLayout />
          </TenantProvider>
        }
      >
        {/* Public routes — no authentication required */}
        <Route index               element={<PanniFlowLanding />} />
        <Route path="login"        element={<LoginPage />} />
        <Route path="register"     element={<SignUpPage />} />
        <Route path="admin/login"  element={<AdminLoginPage />} />

        {/* ── Customer Panel (/:tenantId/customer/*) ────────────────────── */}
        <Route
          path="customer/*"
          element={
            <ProtectedRoute role="customer">
              <CustomerApp />
            </ProtectedRoute>
          }
        />

        {/* ── Driver Panel (/:tenantId/driver/*) ───────────────────────── */}
        <Route
          path="driver/*"
          element={
            <ProtectedRoute role="driver">
              <DriverApp />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Panel (/:tenantId/admin/*) ─────────────────────────── */}
        {/* Note: admin/login above is more specific and takes priority       */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminApp />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ── 404 — redirect unknown paths back to root ────────────────────── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
// const styles = {
//   app: {
//     display: "flex",
//     height: "100vh",
//     fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
//     background: "#f8fafc",
//     overflow: "hidden",
//   },
//   mainWrapper: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     overflow: "hidden",
//   },
// };