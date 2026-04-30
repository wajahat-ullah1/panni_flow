import api from "./axiosConfig";

const driverApi = {

  // ════════════════════════════════════════════════════════════════════════════
  // AUTH / PROFILE  (auth-api.md)
  // ════════════════════════════════════════════════════════════════════════════

  // GET /auth/me — returns authenticated user's profile
  getMyProfile: () =>
    api.get("/auth/me"),

  // PATCH /auth/profile — update fullName, email, phone
  updateMyProfile: (data) =>
    api.patch("/auth/profile", data),

  // PATCH /auth/change-password — Body: { currentPassword, newPassword }
  changePassword: (data) =>
    api.patch("/auth/change-password", data),


  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD  (driver-api.md #5)
  // ════════════════════════════════════════════════════════════════════════════

  // GET /drivers/me — full Driver object for the authenticated driver
  // Call this once on app mount to get the driver's _id for subsequent calls
  getDriverProfile: () =>
    api.get("/drivers/me"),

  // GET /drivers/dashboard — driver resolved from JWT
  // Returns: { todayDeliveries, completedToday, pendingDeliveries, todayEarnings }
  getDashboardStats: () =>
    api.get("/drivers/dashboard"),


  // ════════════════════════════════════════════════════════════════════════════
  // DRIVER (by ID)  (driver-api.md)
  // ════════════════════════════════════════════════════════════════════════════

  // GET /drivers/:id — get driver profile (vehicle info, status, etc.)
  getDriverById: (id) =>
    api.get(`/drivers/${id}`),

  // PATCH /drivers/:id — update driver fields (name, phone, vehicleType, etc.)
  updateDriver: (id, data) =>
    api.patch(`/drivers/${id}`, data),

  // PATCH /drivers/:id/status — Body: { status: "available"|"on-delivery"|"off-duty" }
  updateDriverStatus: (driverId, status) =>
    api.patch(`/drivers/${driverId}/status`, { status }),

  // PATCH /drivers/:id/location — Body: { lat, lng }
  updateDriverLocation: (driverId, lat, lng) =>
    api.patch(`/drivers/${driverId}/location`, { lat, lng }),

  // GET /drivers/:id/deliveries — paginated order history for a driver
  // Query: page, limit, sort, search, status, fromDate, toDate
  getDriverDeliveries: (driverId, params = {}) =>
    api.get(`/drivers/${driverId}/deliveries`, { params }),


  // ════════════════════════════════════════════════════════════════════════════
  // ORDERS  (order-api.md)
  // ════════════════════════════════════════════════════════════════════════════

  // GET /orders — list orders; drivers can filter via ?driverId=
  // Query: page, limit, sort, search, status, driverId, fromDate, toDate
  getOrders: (params = {}) =>
    api.get("/orders", { params }),

  // GET /orders/driver/:driverId — orders assigned to a specific driver
  getOrdersByDriver: (driverId, params = {}) =>
    api.get(`/orders/driver/${driverId}`, { params }),

  // GET /orders/:id
  getOrderById: (orderId) =>
    api.get(`/orders/${orderId}`),

  // GET /orders/:id/tracking
  getOrderTracking: (orderId) =>
    api.get(`/orders/${orderId}/tracking`),

  // GET /orders/:id/navigation — returns customer info + Google Maps deep link
  getOrderNavigation: (orderId) =>
    api.get(`/orders/${orderId}/navigation`),

  // PATCH /orders/:id/status — Body: { status, note? }
  updateOrderStatus: (orderId, status, note) =>
    api.patch(`/orders/${orderId}/status`, {
      status,
      ...(note ? { note } : {}),
    }),

  // PATCH /orders/:id/accept — assigned → accepted
  acceptOrder: (orderId) =>
    api.patch(`/orders/${orderId}/accept`),

  // PATCH /orders/:id/reject — Body: { reason? } — assigned → rejected
  rejectOrder: (orderId, reason) =>
    api.patch(`/orders/${orderId}/reject`, { reason }),

};

export default driverApi;

