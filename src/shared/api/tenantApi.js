import api from "./axiosConfig";

// ─────────────────────────────────────────────────────────────────────────────
// tenantApi
// Public endpoint — no auth required. Tenant slug is in the URL path so the
// backend can identify the tenant even before the X-Tenant-ID header is set.
// ─────────────────────────────────────────────────────────────────────────────

const tenantApi = {
  /** GET /tenants/:tenantId/profile */
  getProfile: (tenantId) => api.get(`/tenants/${tenantId}/profile`),
};

export default tenantApi;
