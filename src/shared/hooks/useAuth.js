import { useAuthContext } from "../context/AuthContext";
import { useTenant } from "../context/TenantContext";

// ─────────────────────────────────────────────────────────────────────────────
// useAuth
// Returns everything about the current logged-in user.
// Use this hook in any component that needs auth info.
//
// Usage:
//   const { user, isAuthenticated, isCustomer, isDriver, isAdmin, logout } = useAuth();
// ─────────────────────────────────────────────────────────────────────────────

export default function useAuth() {
  const { user, token, loading, isAuthenticated, login, logout, updateUser } =
    useAuthContext();
  const { tenantId } = useTenant();

  // Role helpers — cleaner than checking user.role === "x" everywhere
  const isCustomer = user?.role === "customer";
  const isDriver   = user?.role === "driver";
  const isAdmin    = user?.role === "admin";

  // Returns the right home path for the current user's role (tenant-prefixed)
  const getHomePath = () => {
    if (isCustomer) return `/${tenantId}/customer/dashboard`;
    if (isDriver)   return `/${tenantId}/driver/dashboard`;
    if (isAdmin)    return `/${tenantId}/admin/dashboard`;
    return `/${tenantId}/login`;
  };

  return {
    user,           // { _id, name, email, phone, role, ... }
    token,          // raw JWT string
    loading,        // true while restoring session — use to avoid flash
    isAuthenticated,
    isCustomer,
    isDriver,
    isAdmin,
    login,          // login(userData, token)
    logout,         // clears everything
    updateUser,     // updateUser({ name: "New Name" })
    getHomePath,    // "/:tenantId/customer/dashboard" | "/:tenantId/driver/dashboard" | ...
  };
}
