import axios from "axios";
import { getTenantId } from "./tenantStore";

// ─────────────────────────────────────────────────────────────────────────────
// Base axios instance
// All API files import THIS — never import axios directly.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // 10 second timeout
});

// ── Request interceptor — attach JWT token to every request ──────────────────
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    
    // Multi-tenant backend requires the tenant slug header on every request.
    const tenantId = getTenantId();
    if (tenantId) {
      config.headers["X-Tenant-ID"] = tenantId;
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
  (response) => {
    console.log(`[API Response] ${response.status}`, response.data);
    return response.data;
  },

  // Error — handle common cases globally
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    
    console.error(`[API Error] Status: ${status}, Message: ${message}`, error.response?.data);

    // 401 Unauthorized — token expired or invalid → force logout
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const currentTenantId = getTenantId();
      globalThis.location.href = currentTenantId
        ? `/${currentTenantId}/login`
        : "/login";
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
