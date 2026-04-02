import { Routes, Route, Navigate } from "react-router-dom";
 
// ── Public pages ──────────────────────────────────────────────────────────────
import PanniFlowLanding from "./pages/PanniFlowLanding";
import LoginPage      from "./pages/LoginPage";
import SignUpPage     from "./pages/SignUpPage";
 
// ── Panel apps ────────────────────────────────────────────────────────────────
import CustomerApp    from "./panels/customer/CustomerApp.jsx.jsx";
import DriverApp      from "./panels/driver/DriverApp.jsx.jsx";
import AdminApp       from "./panels/admin/AdminApp.jsx.jsx";
import AdminLoginPage from "./panels/admin/Components/Login/LoginPage";
 
// ── Route guard ───────────────────────────────────────────────────────────────
import ProtectedRoute from "./shared/components/ProtectedRoute";
 
export default function App() {
  return (
    <Routes>
 
      {/* ── Public routes (no login needed) ─────────────────────────────── */}
      <Route path="/"            element={<PanniFlowLanding />} />
      <Route path="/login"       element={<LoginPage />} />
      <Route path="/register"    element={<SignUpPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
 
      {/* ── Customer Panel (/customer/*) ────────────────────────────────── */}
      <Route
        path="/customer/*"
        element={
          <ProtectedRoute role="customer">
            <CustomerApp />
          </ProtectedRoute>
        }
      />
 
      {/* ── Driver Panel (/driver/*) ─────────────────────────────────────── */}
      <Route
        path="/driver/*"
        element={
          <ProtectedRoute role="driver">
            <DriverApp />
          </ProtectedRoute>
        }
      />
 
      {/* ── Admin Panel (/admin/*) ───────────────────────────────────────── */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminApp />
          </ProtectedRoute>
        }
      />
 
      {/* ── 404 ─────────────────────────────────────────────────────────── */}
      <Route path="*"    element={<Navigate to="/404" replace />} />
 
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