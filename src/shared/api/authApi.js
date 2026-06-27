import api from "./axiosConfig";

// ─────────────────────────────────────────────────────────────────────────────
// authApi — public endpoints (no JWT needed)
// Used by: LoginPage, RegisterPage, AdminLoginPage
// ─────────────────────────────────────────────────────────────────────────────

const authApi = {

  // ── Customer / Driver login ─────────────────────────────────────────────────
  // POST /api/auth/login
  // Body: { email, password }
  // Returns: { user: { _id, name, email, role, ... }, token }
  login: (credentials) =>
    api.post("/auth/login", credentials),


  // ── Customer registration ───────────────────────────────────────────────────
  // POST /api/v1/auth/customer-register
  // Body: { fullName, email, phone, password }
  // Returns: { user, accessToken }
  registerCustomer: (userData) =>
    api.post("/auth/customer-register", userData),

  // ── Admin: create driver (one-step) ────────────────────────────────────────
  // POST /auth/driver-register
  // Roles: admin — requires Bearer token
  // Body: { fullName, email, phone, password, licenseNumber?,
  //         vehicleType?, vehicleNumber?, assignedAreas? }
  // Returns: { driver, user }
  registerDriver: (data) =>
    api.post("/auth/driver-register", data),


  // ── Admin login (separate endpoint) ────────────────────────────────────────
  // POST /api/auth/admin/login
  // Body: { email, password }
  // Returns: { user: { _id, name, email, role: "admin" }, token }
  adminLogin: (credentials) =>
    api.post("/auth/admin/login", credentials),


  // ── Email verification ──────────────────────────────────────────────────────
  // GET /api/auth/verify/:token
  verifyEmail: (token) =>
    api.get(`/auth/verify/${token}`),


  // ── Forgot password ─────────────────────────────────────────────────────────
  // POST /api/auth/forgot-password
  // Body: { email }
  forgotPassword: (payload) => {
    const email = typeof payload === 'string' ? payload : payload?.email;
    return api.post("/auth/forgot-password", { email });
  },


  // ── Reset password ──────────────────────────────────────────────────────────
  // POST /api/auth/reset-password
  // Body: { token, newPassword }
  resetPassword: (data) =>
    api.post(`/auth/reset-password`, data),


  // ── Refresh JWT token ───────────────────────────────────────────────────────
  // POST /api/auth/refresh
  refreshToken: () =>
    api.post("/auth/refresh"),


  // ── Logout (invalidate token on backend) ───────────────────────────────────
  // POST /api/auth/logout
  logout: () =>
    api.post("/auth/logout"),


  // ── Get my profile ──────────────────────────────────────────────────────────
  // GET /auth/me  — requires Bearer token
  // Returns: { _id, fullName, email, phone, role, tenantId, isActive, createdAt }
  getProfile: () =>
    api.get("/auth/me"),

  // ── Update my profile ───────────────────────────────────────────────────────
  // PATCH /auth/profile  — requires Bearer token
  // Body: { fullName?, email?, phone? }
  updateProfile: (data) =>
    api.patch("/auth/profile", data),

  // ── Change password ─────────────────────────────────────────────────────────
  // PATCH /auth/change-password  — requires Bearer token
  // Body: { currentPassword, newPassword }
  changePassword: (data) =>
    api.patch("/auth/change-password", data),

};

export default authApi;
