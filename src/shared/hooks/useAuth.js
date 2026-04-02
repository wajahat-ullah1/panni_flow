import { useAuthContext } from "../context/AuthContext";

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

  // Role helpers — cleaner than checking user.role === "x" everywhere
  const isCustomer = user?.role === "customer";
  const isDriver   = user?.role === "driver";
  const isAdmin    = user?.role === "admin";

  // Returns the right home path for the current user's role
  const getHomePath = () => {
    if (isCustomer) return "/customer/dashboard";
    if (isDriver)   return "/driver/dashboard";
    if (isAdmin)    return "/admin/dashboard";
    return "/login";
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
    getHomePath,    // "/customer/dashboard" | "/driver/dashboard" | ...
  };
}
