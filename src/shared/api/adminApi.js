import api from "./axiosConfig";

// ─────────────────────────────────────────────────────────────────────────────
// adminApi — all endpoints for the Admin Panel
// Base prefix: /api/admin
// ─────────────────────────────────────────────────────────────────────────────

const adminApi = {

  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/dashboard
  // Returns: { totalOrders, activeDeliveries, totalRevenue, totalCustomers,
  //            totalDrivers, pendingOrders, todayOrders, ... }
  getDashboardStats: () =>
    api.get("/admin/dashboard"),

  // GET /reports/dashboard/summary
  // Returns: { totalOrders, activeDeliveries, monthlyRevenue, tankers }
  getDashboardSummary: () =>
    api.get("/reports/dashboard/summary"),

  // GET /reports/dashboard/monthly-revenue?year=YYYY
  // Returns: [{ month, revenue }, ...]
  getMonthlyRevenue: (year = new Date().getFullYear()) =>
    api.get("/reports/dashboard/monthly-revenue", { params: { year } }),


  // ════════════════════════════════════════════════════════════════════════════
  // CUSTOMERS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/customers
  // Query: ?page=1&limit=20&search=john&status=active
  getCustomers: (params = {}) =>
    api.get("/admin/customers", { params }),

  // GET /api/admin/customers/:id
  getCustomer: (id) =>
    api.get(`/admin/customers/${id}`),

  // PUT /api/admin/customers/:id/status
  // Body: { status: "active" | "suspended" }
  updateCustomerStatus: (id, status) =>
    api.put(`/admin/customers/${id}/status`, { status }),

  // DELETE /api/admin/customers/:id
  deleteCustomer: (id) =>
    api.delete(`/admin/customers/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // DRIVERS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/drivers
  // Query: ?status=active|inactive&available=true
  getDrivers: (params = {}) =>
    api.get("/admin/drivers", { params }),

  // GET /api/admin/drivers/:id
  getDriver: (id) =>
    api.get(`/admin/drivers/${id}`),

  // POST /api/admin/drivers
  // Body: { name, email, phone, licenseNo, vehicleId }
  // Creates driver account + sends credentials via SMS/email
  createDriver: (data) =>
    api.post("/admin/drivers", data),

  // PUT /api/admin/drivers/:id
  updateDriver: (id, data) =>
    api.put(`/admin/drivers/${id}`, data),

  // PUT /api/admin/drivers/:id/status
  // Body: { status: "active" | "inactive" }
  updateDriverStatus: (id, status) =>
    api.put(`/admin/drivers/${id}/status`, { status }),

  // DELETE /api/admin/drivers/:id
  deleteDriver: (id) =>
    api.delete(`/admin/drivers/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // VEHICLES
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/vehicles
  getVehicles: (params = {}) =>
    api.get("/admin/vehicles", { params }),

  // POST /api/admin/vehicles
  // Body: { plateNo, type, capacityLiters }
  createVehicle: (data) =>
    api.post("/admin/vehicles", data),

  // PUT /api/admin/vehicles/:id
  updateVehicle: (id, data) =>
    api.put(`/admin/vehicles/${id}`, data),

  // DELETE /api/admin/vehicles/:id
  deleteVehicle: (id) =>
    api.delete(`/admin/vehicles/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // ORDERS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/orders
  // Query: ?status=pending|confirmed|in_transit|delivered|cancelled&date=2026-03-30
  getOrders: (params = {}) =>
    api.get("/admin/orders", { params }),

  // GET /api/admin/orders/:id
  getOrder: (id) =>
    api.get(`/admin/orders/${id}`),

  // PUT /api/admin/orders/:id/assign
  // Body: { driverId, vehicleId }
  assignOrder: (id, data) =>
    api.put(`/admin/orders/${id}/assign`, data),

  // PUT /api/admin/orders/:id/status
  // Body: { status }
  updateOrderStatus: (id, status) =>
    api.put(`/admin/orders/${id}/status`, { status }),

  // DELETE /api/admin/orders/:id
  cancelOrder: (id) =>
    api.delete(`/admin/orders/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // INVENTORY
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/inventory
  getInventory: () =>
    api.get("/admin/inventory"),

  // POST /api/admin/inventory
  // Body: { productId, quantity, location }
  addStock: (data) =>
    api.post("/admin/inventory", data),

  // PUT /api/admin/inventory/:id
  updateStock: (id, data) =>
    api.put(`/admin/inventory/${id}`, data),


  // ════════════════════════════════════════════════════════════════════════════
  // PRODUCTS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/products
  getProducts: () =>
    api.get("/admin/products"),

  // POST /api/admin/products
  // Body: { name, description, price, unit, stock }
  createProduct: (data) =>
    api.post("/admin/products", data),

  // PUT /api/admin/products/:id
  updateProduct: (id, data) =>
    api.put(`/admin/products/${id}`, data),

  // DELETE /api/admin/products/:id
  deleteProduct: (id) =>
    api.delete(`/admin/products/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // ANALYTICS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/analytics/revenue
  // Query: ?period=week|month|year
  getRevenueAnalytics: (params = {}) =>
    api.get("/admin/analytics/revenue", { params }),

  // GET /api/admin/analytics/orders
  getOrderAnalytics: (params = {}) =>
    api.get("/admin/analytics/orders", { params }),

  // GET /api/admin/analytics/drivers
  getDriverAnalytics: (params = {}) =>
    api.get("/admin/analytics/drivers", { params }),

  // GET /api/admin/analytics/forecast
  // Returns AI demand forecast
  getDemandForecast: (params = {}) =>
    api.get("/admin/analytics/forecast", { params }),


  // ════════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ════════════════════════════════════════════════════════════════════════════

  // POST /api/admin/notifications/broadcast
  // Body: { title, message, targetRole: "all"|"customer"|"driver" }
  broadcastNotification: (data) =>
    api.post("/admin/notifications/broadcast", data),


  // ════════════════════════════════════════════════════════════════════════════
  // SETTINGS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/admin/settings
  getSettings: () =>
    api.get("/admin/settings"),

  // PUT /api/admin/settings
  // Body: { deliveryFee, minOrderValue, workingHours, ... }
  updateSettings: (data) =>
    api.put("/admin/settings", data),

};

export default adminApi;
