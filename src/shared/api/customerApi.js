import api from "./axiosConfig";

// ─────────────────────────────────────────────────────────────────────────────
// customerApi — all endpoints for the Customer Panel
// Every request automatically includes JWT (via axiosConfig interceptor)
// Base prefix: /api/customer
// ─────────────────────────────────────────────────────────────────────────────

const customerApi = {

  // ════════════════════════════════════════════════════════════════════════════
  // PROFILE
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/v1/customers/me
  getProfile: () =>
    api.get("/customers/me"),

  // PATCH /api/v1/customers/me
  updateProfile: (data) =>
    api.patch("/customers/me", data),

  // PATCH /api/auth/change-password
  // Body: { currentPassword, newPassword }
  changePassword: (data) =>
    api.patch("/auth/change-password", data),

  // POST /api/customer/profile/photo
  // Body: FormData with "photo" field
  uploadPhoto: (formData) =>
    api.post("/customer/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),


  // ════════════════════════════════════════════════════════════════════════════
  // ADDRESSES
  // ════════════════════════════════════════════════════════════════════════════

  // Addresses are returned from GET /customers/me
  getAddresses: () =>
    api.get("/customers/me"),

  // POST /api/v1/customers/me/addresses
  addAddress: (data) =>
    api.post("/customers/me/addresses", data),

  // PATCH /api/v1/customers/me/addresses/:addrId
  updateAddress: (addrId, data) =>
    api.patch(`/customers/me/addresses/${addrId}`, data),

  // DELETE /api/v1/customers/me/addresses/:addrId
  deleteAddress: (addrId) =>
    api.delete(`/customers/me/addresses/${addrId}`),

  // PATCH /api/v1/customers/me/addresses/:addrId/default
  setDefaultAddress: (addrId) =>
    api.patch(`/customers/me/addresses/${addrId}/default`),


  // ════════════════════════════════════════════════════════════════════════════
  // PRODUCTS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/v1/products?page=1&limit=1
  getProducts: (params = {}) =>
    api.get("/products", { params }),

  // GET /api/v1/products/:id
  getProduct: (id) =>
    api.get(`/products/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // ORDERS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/v1/orders
  // Query params: page, limit, sort, status, customerId, driverId, fromDate, toDate, search
  getOrders: (params = {}) =>
    api.get("/orders", { params }),

  // GET /api/v1/orders/:id
  getOrder: (id) =>
    api.get(`/orders/${id}`),

  // POST /api/v1/orders
  placeOrder: (data) =>
    api.post("/orders", data),

  // PUT /api/customer/orders/:id/cancel
  cancelOrder: (id) =>
    api.put(`/customer/orders/${id}/cancel`),

  // POST /api/customer/orders/:id/reorder
  // Duplicates a past order
  reorder: (id) =>
    api.post(`/customer/orders/${id}/reorder`),

  // POST /api/customer/orders/:id/rate
  // Body: { rating, comment }
  rateOrder: (id, data) =>
    api.post(`/customer/orders/${id}/rate`, data),


  // ════════════════════════════════════════════════════════════════════════════
  // LIVE TRACKING
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/v1/orders/:id/tracking
  // Returns: { driverLocation: { lat, lng }, status, eta }
  getTrackingInfo: (orderId) =>
    api.get(`/orders/${orderId}/tracking`),


  // ════════════════════════════════════════════════════════════════════════════
  // PAYMENTS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/v1/payments/my?all=true|false
  // Returns paginated list of the customer's payments
  getPayments: (all = true) =>
    api.get("/payments/my", { params: { all } }),

  // GET /api/customer/payments/:id
  getPayment: (id) =>
    api.get(`/customer/payments/${id}`),
  
  // GET /api/v1/payments/my/dashboard
  getPaymentsDashboard: () =>
    api.get("/payments/my/dashboard"),


  // GET /api/customer/payments/:id/invoice
  // Returns PDF blob
  downloadInvoice: (id) =>
    api.get(`/customer/payments/${id}/invoice`, { responseType: "blob" }),


  // ════════════════════════════════════════════════════════════════════════════
  // SUBSCRIPTIONS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/customer/subscriptions
  getSubscriptions: () =>
    api.get("/customer/subscriptions"),

  // POST /api/customer/subscriptions
  // Body: { productId, quantity, frequency: "daily"|"weekly", addressId }
  createSubscription: (data) =>
    api.post("/customer/subscriptions", data),

  // PUT /api/customer/subscriptions/:id/cancel
  cancelSubscription: (id) =>
    api.put(`/customer/subscriptions/${id}/cancel`),


  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD STATS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/v1/customers/me/stats
  // Returns: { totalOrders, activeDeliveries, monthlySpending, totalSpent, bottlesOrdered, activeOrders }
  getDashboardStats: () =>
    api.get("/customers/me/stats"),


  // ════════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/customer/notifications
  getNotifications: () =>
    api.get("/customer/notifications"),

  // PUT /api/customer/notifications/:id/read
  markNotificationRead: (id) =>
    api.put(`/customer/notifications/${id}/read`),

  // PUT /api/customer/notifications/read-all
  markAllNotificationsRead: () =>
    api.put("/customer/notifications/read-all"),

};

export default customerApi;
