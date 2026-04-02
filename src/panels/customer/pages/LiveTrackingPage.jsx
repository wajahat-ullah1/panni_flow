import { useState, useEffect } from "react";

// ─── Static Data ────────────────────────────────────────────────────────────────
const ACTIVE_ORDER = {
  id: "ORD-2452",
  driver: {
    name: "Michael Johnson",
    initials: "MJ",
    role: "Delivery Driver",
    status: "Active",
    phone: "+1 (555) 234-5678",
  },
  eta: "15 min",
};

const ORDER_STATUS_STEPS = [
  {
    label: "Order Confirmed",
    desc: "Your order has been placed",
    time: "10:30 AM",
    done: true,
  },
  {
    label: "Driver Assigned",
    desc: "Michael is your driver",
    time: "10:45 AM",
    done: true,
  },
  {
    label: "On the Way",
    desc: "Driver is heading to you",
    time: "11:00 AM",
    done: true,
  },
  {
    label: "Delivered",
    desc: "Order will be delivered soon",
    time: "ETA 11:15 AM",
    done: false,
  },
];

const OTHER_DELIVERIES = [
  {
    id: "ORD-2453",
    driver: "Sarah Williams",
    eta: "45 minutes",
    status: "Assigned",
  },
];

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

const NavIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </svg>
);

const WaterBottleIcon = ({ size = 18, stroke = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8M9 2v3.5a4 4 0 0 0-4 4V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5a4 4 0 0 0-4-4V2"/>
    <path d="M7 14h10M7 17h10"/>
  </svg>
);

// ─── Animated Map Component ──────────────────────────────────────────────────────
function MapView() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 3);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Grid dots for the map background
  const gridDots = [];
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 16; col++) {
      gridDots.push(
        <circle
          key={`${row}-${col}`}
          cx={col * 46 + 23}
          cy={row * 46 + 23}
          r="1.5"
          fill="#c7dfe8"
          opacity="0.5"
        />
      );
    }
  }

  return (
    <div style={styles.mapContainer}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 736 380"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Map background */}
        <rect width="736" height="380" fill="#e8f4f8" />
        {gridDots}

        {/* Subtle road lines */}
        <line x1="0" y1="190" x2="736" y2="190" stroke="#cde7f0" strokeWidth="10" />
        <line x1="368" y1="0" x2="368" y2="380" stroke="#cde7f0" strokeWidth="10" />
        <line x1="0" y1="95" x2="736" y2="95" stroke="#d8eef5" strokeWidth="5" />
        <line x1="0" y1="285" x2="736" y2="285" stroke="#d8eef5" strokeWidth="5" />
        <line x1="180" y1="0" x2="180" y2="380" stroke="#d8eef5" strokeWidth="5" />
        <line x1="550" y1="0" x2="550" y2="380" stroke="#d8eef5" strokeWidth="5" />

        {/* Route line: Driver → Your Location */}
        <line
          x1="390" y1="155"
          x2="270" y2="310"
          stroke="#3b82f6"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          opacity="0.8"
        />

        {/* Driver location marker */}
        {/* Outer pulse ring */}
        <circle
          cx="390" cy="155" r={20 + pulse * 4}
          fill="none"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          opacity={0.4 - pulse * 0.1}
        />
        {/* Inner glow */}
        <circle cx="390" cy="155" r="28" fill="#0ea5e9" opacity="0.15" />
        {/* Main circle */}
        <circle cx="390" cy="155" r="22" fill="white" stroke="#0ea5e9" strokeWidth="2" />
        {/* Truck icon inside */}
        <g transform="translate(379, 144)">
          <rect x="0" y="3" width="12" height="9" rx="1" fill="#0ea5e9"/>
          <path d="M12 6h3l2.5 3.5V13H12V6z" fill="#0284c7"/>
          <circle cx="3.5" cy="14" r="2" fill="#0f172a"/>
          <circle cx="13.5" cy="14" r="2" fill="#0f172a"/>
        </g>
        {/* Driver location label */}
        <rect x="340" y="180" width="100" height="20" rx="10" fill="white" opacity="0.9"
          filter="url(#shadow)" />
        <text x="390" y="194" textAnchor="middle" fontSize="10" fill="#0ea5e9" fontWeight="600"
          fontFamily="DM Sans, Segoe UI, sans-serif">
          Driver Location
        </text>

        {/* Your location marker */}
        <circle cx="270" cy="310" r="8" fill="#f97316" opacity="0.2" />
        <circle cx="270" cy="310" r="5" fill="#f97316" />
        <circle cx="270" cy="310" r="2.5" fill="white" />
        <text x="270" y="328" textAnchor="middle" fontSize="10" fill="#f97316" fontWeight="600"
          fontFamily="DM Sans, Segoe UI, sans-serif">
          Your Location
        </text>

        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>
      </svg>

      {/* Navigate button */}
      <button style={styles.navBtn}>
        <NavIcon />
      </button>

      {/* Bottom info bar */}
      <div style={styles.mapInfoBar}>
        <div style={styles.mapInfoLeft}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <TruckIcon size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>
              {ACTIVE_ORDER.driver.name}
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Order #{ACTIVE_ORDER.id}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginBottom: 2 }}>
            Estimated Arrival
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#0ea5e9" }}>
            {ACTIVE_ORDER.eta}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Driver Card ─────────────────────────────────────────────────────────────────
function DriverCard() {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div style={styles.driverAvatar}>
          <span style={{ color: "white", fontWeight: 700, fontSize: 17 }}>
            {ACTIVE_ORDER.driver.initials}
          </span>
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>
            {ACTIVE_ORDER.driver.name}
          </div>
          <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 5 }}>
            {ACTIVE_ORDER.driver.role}
          </div>
          <span style={styles.activeBadge}>
            {ACTIVE_ORDER.driver.status}
          </span>
        </div>
      </div>
      <button style={styles.callBtn}>
        <PhoneIcon />
        Call Driver
      </button>
    </div>
  );
}

// ─── Order Status Timeline ───────────────────────────────────────────────────────
function OrderStatusCard() {
  return (
    <div style={styles.card}>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 18 }}>
        Order Status
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {ORDER_STATUS_STEPS.map((step, idx) => {
          const isLast = idx === ORDER_STATUS_STEPS.length - 1;
          return (
            <div key={idx} style={{ display: "flex", gap: 14 }}>
              {/* Timeline column */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: step.done
                    ? "linear-gradient(135deg,#10b981,#059669)"
                    : "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {step.done
                    ? <WaterBottleIcon size={14} />
                    : <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#cbd5e1" }} />
                  }
                </div>
                {!isLast && (
                  <div style={{
                    width: 2,
                    flex: 1,
                    minHeight: 24,
                    background: step.done ? "#10b981" : "#e2e8f0",
                    margin: "3px 0",
                  }} />
                )}
              </div>

              {/* Content column */}
              <div style={{ paddingBottom: isLast ? 0 : 20 }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: 13.5,
                  color: step.done ? "#0f172a" : "#94a3b8",
                  marginBottom: 2,
                }}>
                  {step.label}
                </div>
                <div style={{ fontSize: 12, color: step.done ? "#64748b" : "#cbd5e1", marginBottom: 2 }}>
                  {step.desc}
                </div>
                <div style={{ fontSize: 11, color: step.done ? "#94a3b8" : "#cbd5e1" }}>
                  {step.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Other Active Deliveries ─────────────────────────────────────────────────────
function OtherDeliveriesCard() {
  return (
    <div style={styles.card}>
      <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 14 }}>
        Other Active Deliveries
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {OTHER_DELIVERIES.map(d => (
          <div key={d.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
            borderRadius: 10,
            padding: "12px 14px",
            border: "1px solid #f1f5f9",
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a", marginBottom: 3 }}>
                {d.id}
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                {d.driver} &bull; ETA: {d.eta}
              </div>
            </div>
            <span style={{
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 11.5,
              fontWeight: 600,
              background: "#fff7ed",
              color: "#ea580c",
            }}>
              {d.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
export default function LiveTrackingPage() {
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Live Tracking</h1>
        <p style={styles.subtitle}>Track your deliveries in real-time</p>
      </div>

      {/* Body: map left, sidebar right */}
      <div style={styles.body}>
        {/* Left: Map */}
        <div style={styles.mapWrapper}>
          <MapView />
        </div>

        {/* Right: Driver info + status + other deliveries */}
        <div style={styles.rightPanel}>
          <DriverCard />
          <OrderStatusCard />
          <OtherDeliveriesCard />
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
  header: {
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#0f172a",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: 13.5,
    color: "#94a3b8",
  },
  body: {
    display: "flex",
    gap: 20,
    flex: 1,
    minHeight: 0,
    alignItems: "flex-start",
  },
  mapWrapper: {
    flex: 1,
    minWidth: 0,
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: 380,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid #e2e8f0",
    background: "#e8f4f8",
  },
  navBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    zIndex: 2,
  },
  mapInfoBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    background: "white",
    borderTop: "1px solid #e2e8f0",
    padding: "14px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 2,
  },
  mapInfoLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  rightPanel: {
    width: 270,
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  card: {
    background: "white",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    padding: "18px 20px",
  },
  driverAvatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  activeBadge: {
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11.5,
    fontWeight: 600,
    background: "#dcfce7",
    color: "#15803d",
  },
  callBtn: {
    width: "100%",
    padding: "11px 0",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
    color: "white",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
};
