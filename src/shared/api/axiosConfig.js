import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// Base axios instance
// All API files import THIS — never import axios directly.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
const TENANT_ID = import.meta.env.VITE_TENANT_ID || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 second timeout
});

// ── Request interceptor — attach JWT token to every request ──────────────────
api.interceptors.request.use(
  (config) => {
    // Multi-tenant backend requires the tenant slug header on every request.
    if (TENANT_ID) {
      config.headers["X-Tenant-ID"] = TENANT_ID;
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle global errors ───────────────────────────────
api.interceptors.response.use(
  // Success — just return the response data directly
  (response) => response.data,

  // Error — handle common cases globally
  (error) => {
    const status = error.response?.status;

    // 401 Unauthorized — token expired or invalid → force logout
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      globalThis.location.href = "/login";
    }

    // 403 Forbidden — wrong role trying to access a route
    if (status === 403) {
      console.error("Access denied — insufficient permissions");
    }

    // 500 Server error
    if (status === 500) {
      console.error("Server error — please try again later");
    }

    return Promise.reject(error);
  }
);

export default api;
