import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// ── Separate axios instance — NO X-Tenant-ID header ──────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request: attach superAdminToken ───────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('superAdminToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response: unwrap data; on 401 → redirect to login ────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem('superAdminToken');
      localStorage.removeItem('superAdminUser');
      window.location.href = '/super-admin/login';
    }
    return Promise.reject(error);
  },
);

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginSuperAdmin = (email, password) =>
  api.post('/auth/super-admin/login', { email, password });

export const logoutSuperAdmin = () =>
  api.post('/auth/logout');

// ── Tenants ───────────────────────────────────────────────────────────────────
export const getTenants = (params = {}) =>
  api.get('/tenants', { params });

export const getTenantById = (id) =>
  api.get(`/tenants/${id}`);

export const updateTenant = (id, data) =>
  api.patch(`/tenants/${id}`, data);

export const updateTenantStatus = (id, status) =>
  api.patch(`/tenants/${id}/status`, { status });

export const deleteTenant = (id) =>
  api.delete(`/tenants/${id}`);

// Creates tenant + admin user in one call (POST /auth/register)
export const registerTenant = (data) =>
  api.post('/auth/register', data);

// Upload logo for an existing tenant — multipart/form-data, field: "file"
export const uploadTenantLogo = (id, file) => {
  const fd = new FormData();
  fd.append('file', file);
  return api.post(`/tenants/${id}/logo`, fd, {
    headers: { 'Content-Type': undefined },
  });
};

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const getSubscriptionPlans = () =>
  api.get('/subscriptions/plans');

export const createSubscription = (data) =>
  api.post('/subscriptions', data);

export const getSubscriptions = (params = {}) =>
  api.get('/subscriptions', { params });

export const getSubscriptionById = (id) =>
  api.get(`/subscriptions/${id}`);

export const getTenantSubscriptions = (tenantId) =>
  api.get(`/subscriptions/tenant/${tenantId}`);

export const getActiveTenantSubscription = (tenantId) =>
  api.get(`/subscriptions/tenant/${tenantId}/active`);

export const updateSubscription = (id, data) =>
  api.patch(`/subscriptions/${id}`, data);

export const updatePaymentStatus = (id, paymentStatus, extra = {}) =>
  api.patch(`/subscriptions/${id}/payment-status`, { paymentStatus, ...extra });

export const cancelSubscription = (id) =>
  api.post(`/subscriptions/${id}/cancel`);

export const renewSubscription = (id) =>
  api.post(`/subscriptions/${id}/renew`);

export default api;
