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

  // GET /api/customer/profile
  // Returns: { _id, name, email, phone, addresses, loyaltyPoints, ... }
  getProfile: () =>
    api.get("/customer/profile"),

  // PUT /api/customer/profile
  // Body: { name, email, phone }
  updateProfile: (data) =>
    api.put("/customer/profile", data),

  // PUT /api/customer/profile/password
  // Body: { currentPassword, newPassword }
  changePassword: (data) =>
    api.put("/customer/profile/password", data),

  // POST /api/customer/profile/photo
  // Body: FormData with "photo" field
  uploadPhoto: (formData) =>
    api.post("/customer/profile/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),


  // ════════════════════════════════════════════════════════════════════════════
  // ADDRESSES
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/customer/addresses
  getAddresses: () =>
    api.get("/customer/addresses"),

  // POST /api/customer/addresses
  // Body: { label, address, city, phone, isDefault }
  addAddress: (data) =>
    api.post("/customer/addresses", data),

  // PUT /api/customer/addresses/:id
  updateAddress: (id, data) =>
    api.put(`/customer/addresses/${id}`, data),

  // DELETE /api/customer/addresses/:id
  deleteAddress: (id) =>
    api.delete(`/customer/addresses/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // PRODUCTS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/customer/products
  // Returns: [{ _id, name, description, price, unit, stock, ... }]
  getProducts: () =>
    api.get("/customer/products"),

  // GET /api/customer/products/:id
  getProduct: (id) =>
    api.get(`/customer/products/${id}`),


  // ════════════════════════════════════════════════════════════════════════════
  // ORDERS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/customer/orders
  // Query params: ?page=1&limit=10&status=delivered
  getOrders: (params = {}) =>
    api.get("/customer/orders", { params }),

  // GET /api/customer/orders/:id
  getOrder: (id) =>
    api.get(`/customer/orders/${id}`),

  // POST /api/customer/orders
  // Body: { productId, quantity, addressId, orderType, deliveryDate, paymentMethod }
  placeOrder: (data) =>
    api.post("/customer/orders", data),

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

  // GET /api/customer/orders/:id/tracking
  // Returns: { driverLocation: { lat, lng }, status, eta }
  getTrackingInfo: (orderId) =>
    api.get(`/customer/orders/${orderId}/tracking`),


  // ════════════════════════════════════════════════════════════════════════════
  // PAYMENTS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/customer/payments
  // Returns: [{ _id, orderId, amount, method, status, date }]
  getPayments: (params = {}) =>
    api.get("/customer/payments", { params }),

  // GET /api/customer/payments/:id
  getPayment: (id) =>
    api.get(`/customer/payments/${id}`),

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

  // GET /api/customer/dashboard
  // Returns: { totalOrders, activeDeliveries, monthlySpending, bottlesOrdered }
  getDashboardStats: () =>
    api.get("/customer/dashboard"),


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
