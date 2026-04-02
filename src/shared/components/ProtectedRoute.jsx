import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
 
// ─────────────────────────────────────────────────────────────────────────────
// ProtectedRoute
// Wraps any panel route. If the user is not logged in OR has the wrong role,
// they get redirected to the appropriate login page.
//
// Usage in App.jsx:
//   <ProtectedRoute role="customer"><CustomerApp /></ProtectedRoute>
//   <ProtectedRoute role="driver"><DriverApp /></ProtectedRoute>
//   <ProtectedRoute role="admin"><AdminApp /></ProtectedRoute>
// ─────────────────────────────────────────────────────────────────────────────
 
export default function ProtectedRoute({ role, children }) {
  const { isAuthenticated, user, loading } = useAuth();
 
  // While restoring session from localStorage — show nothing (avoid flash)
  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner} />
      </div>
    );
  }
 
  // Not logged in at all → go to appropriate login
  if (!isAuthenticated) {
    const loginPath = role === "admin" ? "/admin/login" : "/login";
    return <Navigate to={loginPath} replace />;
  }
 
  // Logged in but wrong role (e.g. driver trying to access /customer/*)
  if (user?.role !== role) {
    // Send them to their correct panel instead
    const correctPath =
      user?.role === "customer" ? "/customer/dashboard" :
      user?.role === "driver"   ? "/driver/dashboard"   :
      user?.role === "admin"    ? "/admin/dashboard"    :
      "/login";
    return <Navigate to={correctPath} replace />;
  }
 
  // Correct role — render the panel
  return children;
}
 
const styles = {
  loadingWrap: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8fafc",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #0ea5e9",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};