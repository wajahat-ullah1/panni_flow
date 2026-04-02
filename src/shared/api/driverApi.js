import api from "./axiosConfig";

// ─────────────────────────────────────────────────────────────────────────────
// driverApi — all endpoints for the Driver Panel
// Base prefix: /api/driver
// ─────────────────────────────────────────────────────────────────────────────

const driverApi = {

  // ════════════════════════════════════════════════════════════════════════════
  // PROFILE
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/driver/profile
  getProfile: () =>
    api.get("/driver/profile"),

  // PUT /api/driver/profile
  // Body: { name, phone }
  updateProfile: (data) =>
    api.put("/driver/profile", data),

  // PUT /api/driver/profile/password
  changePassword: (data) =>
    api.put("/driver/profile/password", data),


  // ════════════════════════════════════════════════════════════════════════════
  // AVAILABILITY
  // ════════════════════════════════════════════════════════════════════════════

  // PUT /api/driver/availability
  // Body: { available: true | false }
  // Call this when driver goes online/offline
  setAvailability: (available) =>
    api.put("/driver/availability", { available }),


  // ════════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/driver/dashboard
  // Returns: { todayDeliveries, completedToday, pendingDeliveries, todayEarnings }
  getDashboardStats: () =>
    api.get("/driver/dashboard"),


  // ════════════════════════════════════════════════════════════════════════════
  // DELIVERIES
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/driver/deliveries
  // Query: ?status=pending|in_progress|completed&date=2026-03-30
  getDeliveries: (params = {}) =>
    api.get("/driver/deliveries", { params }),

  // GET /api/driver/deliveries/:id
  getDelivery: (id) =>
    api.get(`/driver/deliveries/${id}`),

  // PUT /api/driver/deliveries/:id/accept
  acceptDelivery: (id) =>
    api.put(`/driver/deliveries/${id}/accept`),

  // PUT /api/driver/deliveries/:id/reject
  // Body: { reason }
  rejectDelivery: (id, reason) =>
    api.put(`/driver/deliveries/${id}/reject`, { reason }),

  // PUT /api/driver/deliveries/:id/pickup
  // Mark order as picked up from warehouse
  markPickedUp: (id) =>
    api.put(`/driver/deliveries/${id}/pickup`),

  // PUT /api/driver/deliveries/:id/complete
  // Body: FormData with optional "photo" proof + { notes, signature }
  completeDelivery: (id, formData) =>
    api.put(`/driver/deliveries/${id}/complete`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // PUT /api/driver/deliveries/:id/fail
  // Body: { reason }
  reportFailedDelivery: (id, reason) =>
    api.put(`/driver/deliveries/${id}/fail`, { reason }),


  // ════════════════════════════════════════════════════════════════════════════
  // LIVE LOCATION
  // ════════════════════════════════════════════════════════════════════════════

  // PUT /api/driver/location
  // Body: { lat, lng, deliveryId }
  // Call this every 5-10 seconds while on a delivery
  updateLocation: (locationData) =>
    api.put("/driver/location", locationData),


  // ════════════════════════════════════════════════════════════════════════════
  // EARNINGS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/driver/earnings
  // Query: ?period=today|week|month
  getEarnings: (params = {}) =>
    api.get("/driver/earnings", { params }),


  // ════════════════════════════════════════════════════════════════════════════
  // NOTIFICATIONS
  // ════════════════════════════════════════════════════════════════════════════

  // GET /api/driver/notifications
  getNotifications: () =>
    api.get("/driver/notifications"),

  // PUT /api/driver/notifications/:id/read
  markNotificationRead: (id) =>
    api.put(`/driver/notifications/${id}/read`),

};

export default driverApi;
