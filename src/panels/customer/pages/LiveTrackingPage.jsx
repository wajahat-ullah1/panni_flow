import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";
import { io } from "socket.io-client";
import customerApi from "../../../shared/api/customerApi";

// ─── Constants ───────────────────────────────────────────────────────────────────
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// Backend status → timeline step index (0-based)
const STATUS_TO_STEP = {
  pending:            0,
  confirmed:          0,
  assigned:           1,
  accepted:           1,
  rejected:           1,
  "out-for-delivery": 2,
  delivered:          3,
  cancelled:          3,
};

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };
const MAP_OPTIONS = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  gestureHandling: "cooperative",
};

// ─── SVG Icons ───────────────────────────────────────────────────────────────────
const TruckIcon = ({ size = 22, stroke = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 5.55 5.55l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const WaterBottleIcon = ({ size = 18, stroke = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8M9 2v3.5a4 4 0 0 0-4 4V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5a4 4 0 0 0-4-4V2"/>
    <path d="M7 14h10M7 17h10"/>
  </svg>
);

const BackIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

// ─── No Order Selected State ─────────────────────────────────────────────────────
function NoOrderState({ onGoToOrders }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>
        <TruckIcon size={32} stroke="#94a3b8" />
      </div>
      <div style={{ fontWeight: 700, fontSize: 17, color: "#0f172a", marginBottom: 8 }}>
        No Order Selected
      </div>
      <div style={{ fontSize: 13.5, color: "#94a3b8", marginBottom: 24, textAlign: "center", maxWidth: 280 }}>
        Select an active order from My Orders to track it in real-time.
      </div>
      <button style={styles.goToOrdersBtn} onClick={onGoToOrders}>
        Go to My Orders
      </button>
    </div>
  );
}

// ─── Google Map Component ────────────────────────────────────────────────────────
function MapView({ driverPos, customerPos, driverName, orderId, eta }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const mapCenter = driverPos && customerPos
    ? { lat: (driverPos.lat + customerPos.lat) / 2, lng: (driverPos.lng + customerPos.lng) / 2 }
    : driverPos || customerPos || { lat: 24.85, lng: 67.01 };

  if (!isLoaded) {
    return (
      <div style={{ ...styles.mapContainer, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#94a3b8", fontSize: 14 }}>Loading map…</span>
      </div>
    );
  }

  const driverIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 14,
    fillColor: "#0ea5e9",
    fillOpacity: 1,
    strokeColor: "white",
    strokeWeight: 3,
  };

  const customerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 10,
    fillColor: "#f97316",
    fillOpacity: 1,
    strokeColor: "white",
    strokeWeight: 2,
  };

  return (
    <div style={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={mapCenter}
        zoom={14}
        options={MAP_OPTIONS}
      >
        {driverPos && customerPos && (
          <Polyline
            path={[driverPos, customerPos]}
            options={{
              strokeColor: "#3b82f6",
              strokeOpacity: 0,
              strokeWeight: 0,
              icons: [{
                icon: {
                  path: "M 0,-1 0,1",
                  strokeOpacity: 0.85,
                  strokeWeight: 3,
                  strokeColor: "#3b82f6",
                  scale: 4,
                },
                offset: "0",
                repeat: "20px",
              }],
            }}
          />
        )}
        {driverPos && (
          <Marker
            position={driverPos}
            icon={driverIcon}
            title={`Driver: ${driverName}`}
            label={{ text: "🚚", fontSize: "18px" }}
          />
        )}
        {customerPos && (
          <Marker
            position={customerPos}
            icon={customerIcon}
            title="Your Location"
            label={{ text: "📍", fontSize: "18px" }}
          />
        )}
      </GoogleMap>

      {/* Bottom info bar */}
      <div style={styles.mapInfoBar}>
        <div style={styles.mapInfoLeft}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <TruckIcon size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{driverName}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Order #{orderId}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 2 }}>Estimated Arrival</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0ea5e9" }}>{eta || "—"}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Driver Card ─────────────────────────────────────────────────────────────────
function DriverCard({ driver }) {
  const initials = driver?.name
    ? driver.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={styles.driverAvatar}>
          <span style={{ color: "white", fontWeight: 700, fontSize: 17 }}>{initials}</span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
            {driver?.name || "Assigning driver…"}
          </div>
          <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 5 }}>Delivery Driver</div>
          <span style={styles.activeBadge}>Active</span>
        </div>
      </div>
      <button
        style={styles.callBtn}
        onClick={() => driver?.phone && window.open(`tel:${driver.phone}`)}
        disabled={!driver?.phone}
      >
        <PhoneIcon />
        {driver?.phone ? "Call Driver" : "Phone unavailable"}
      </button>
    </div>
  );
}

// ─── Order Status Timeline ───────────────────────────────────────────────────────
function OrderStatusCard({ currentStatus }) {
  const doneUntil = STATUS_TO_STEP[currentStatus] ?? 0;

  const steps = [
    { label: "Order Confirmed",  desc: "Your order has been placed" },
    { label: "Driver Assigned",  desc: "A driver has been assigned" },
    { label: "Out for Delivery", desc: "Driver is heading to you" },
    { label: "Delivered",        desc: "Order delivered successfully" },
  ];

  return (
    <div style={styles.card}>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 18 }}>
        Order Status
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {steps.map((step, idx) => {
          const done = idx <= doneUntil;
          const isLast = idx === steps.length - 1;
          return (
            <div key={idx} style={{ display: "flex", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: done ? "linear-gradient(135deg,#10b981,#059669)" : "#e2e8f0",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {done
                    ? <WaterBottleIcon size={14} />
                    : <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#cbd5e1" }} />
                  }
                </div>
                {!isLast && (
                  <div style={{
                    width: 2, flex: 1, minHeight: 24,
                    background: done ? "#10b981" : "#e2e8f0",
                    margin: "3px 0",
                  }} />
                )}
              </div>
              <div style={{ paddingBottom: isLast ? 0 : 20 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: done ? "#0f172a" : "#94a3b8", marginBottom: 2 }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 12, color: done ? "#64748b" : "#cbd5e1" }}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export default function LiveTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder]           = useState(null);
  const [driverPos, setDriverPos]   = useState(null);
  const [liveStatus, setLiveStatus] = useState(null);
  const [loading, setLoading]       = useState(!!orderId);
  const [error, setError]           = useState(null);
  const socketRef = useRef(null);

  // ── 1. Fetch initial tracking snapshot ──────────────────────────────────────
  useEffect(() => {
    if (!orderId) return;

    setLoading(true);
    setError(null);

    customerApi.getTrackingInfo(orderId)
      .then(res => {
        const data = res.data ?? res;
        console.log("Initial tracking snapshot:", data);
        setOrder(data);
        setLiveStatus(data.status);
        const { lat, lng } = data?.driver?.currentLocation || {};
        if (lat && lng) {
          setDriverPos({ lat, lng });
        }
      })
      .catch(() => setError("Could not load tracking information. Please try again."))
      .finally(() => setLoading(false));
  }, [orderId]);

  // ── 2. Connect WebSocket and subscribe to live events ───────────────────────
  useEffect(() => {
    if (!order?.orderId) return;
    console.log("Connecting to WebSocket for live tracking...");
    const socket = io(`${SOCKET_URL}/tracking`, { transports: ["websocket"] });
    socketRef.current = socket;
    console.log("socketRef.current:", socketRef.current);
    socket.emit("subscribe-order", { orderId: order?.orderId });

    socket.on("location-update", ({ lat, lng }) => {
      console.log("Received location update:", { lat, lng });
      if (lat != null && lng != null) {
        setDriverPos({ lat, lng });
      }
    });

    socket.on("status-update", ({ status }) => {
      console.log("Received status update:", { status });
      if (status) setLiveStatus(status);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [order?.orderId]);

  // ── Derive display values ───────────────────────────────────────────────────
  const driver = order?.driver ?? null;
  const driverName = driver?.name || "Assigning driver…";
  const displayOrderId = order?.orderNumber || "—";
  const eta = "—";

  const customerPos = order?.deliveryAddress?.coordinates
    ? { lat: order.deliveryAddress.coordinates.lat, lng: order.deliveryAddress.coordinates.lng }
    : null;

  // ── Render: no orderId ──────────────────────────────────────────────────────
  if (!orderId) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Live Tracking</h1>
          <p style={styles.subtitle}>Track your deliveries in real-time</p>
        </div>
        <NoOrderState onGoToOrders={() => navigate("/customer/my-orders")} />
      </div>
    );
  }

  // ── Render: loading ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Live Tracking</h1>
          <p style={styles.subtitle}>Loading order details…</p>
        </div>
        <div style={styles.loadingBox}>
          <div style={styles.spinner} />
          <span style={{ color: "#94a3b8", fontSize: 14, marginTop: 12 }}>Fetching tracking info…</span>
        </div>
      </div>
    );
  }

  // ── Render: error ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Live Tracking</h1>
        </div>
        <div style={styles.emptyState}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#ef4444", marginBottom: 8 }}>
            {error}
          </div>
          <button style={styles.goToOrdersBtn} onClick={() => navigate("/customer/my-orders")}>
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  // ── Render: main view ───────────────────────────────────────────────────────
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button style={styles.backBtn} onClick={() => navigate("/customer/my-orders")}>
            <BackIcon />
          </button>
          <div>
            <h1 style={styles.title}>Live Tracking</h1>
            <p style={styles.subtitle}>Order #{displayOrderId}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>
        <div style={styles.mapWrapper}>
          <MapView
            driverPos={driverPos}
            customerPos={customerPos}
            driverName={driverName}
            orderId={displayOrderId}
            eta={eta}
          />
        </div>
        <div style={styles.rightPanel}>
          <DriverCard driver={driver} />
          <OrderStatusCard currentStatus={liveStatus || order?.status} />
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    flex: 1,
    overflowY: "auto",
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    background: "#f8fafc",
  },
  header: { flexShrink: 0 },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: "#0f172a" },
  subtitle: { margin: "4px 0 0", fontSize: 13.5, color: "#94a3b8" },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    border: "1px solid #e2e8f0", background: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
  },
  body: {
    display: "flex", gap: 20, flex: 1,
    minHeight: 0, alignItems: "flex-start",
  },
  mapWrapper: { flex: 1, minWidth: 0 },
  mapContainer: {
    position: "relative", width: "100%", height: 380,
    borderRadius: 16, overflow: "hidden",
    border: "1px solid #e2e8f0", background: "#e8f4f8",
  },
  mapInfoBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    background: "white", borderTop: "1px solid #e2e8f0",
    padding: "14px 18px", display: "flex",
    alignItems: "center", justifyContent: "space-between", zIndex: 2,
  },
  mapInfoLeft: { display: "flex", alignItems: "center", gap: 12 },
  rightPanel: {
    width: 270, flexShrink: 0,
    display: "flex", flexDirection: "column", gap: 16,
  },
  card: {
    background: "white", borderRadius: 14,
    border: "1px solid #e2e8f0", padding: "18px 20px",
  },
  driverAvatar: {
    width: 50, height: 50, borderRadius: "50%",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  activeBadge: {
    padding: "3px 10px", borderRadius: 20,
    fontSize: 11.5, fontWeight: 600,
    background: "#dcfce7", color: "#15803d",
  },
  callBtn: {
    width: "100%", padding: "11px 0", borderRadius: 10,
    border: "none", background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white", fontSize: 13.5, fontWeight: 600,
    cursor: "pointer", display: "flex",
    alignItems: "center", justifyContent: "center", gap: 8,
  },
  emptyState: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "60px 24px",
  },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 20,
    background: "#f1f5f9", display: "flex",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  goToOrdersBtn: {
    padding: "11px 28px", borderRadius: 10, border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
  },
  loadingBox: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
  },
  spinner: {
    width: 36, height: 36, borderRadius: "50%",
    border: "3px solid #e2e8f0",
    borderTopColor: "#0ea5e9",
    animation: "spin 0.8s linear infinite",
  },
};
