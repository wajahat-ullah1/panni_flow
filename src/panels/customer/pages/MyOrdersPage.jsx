import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import customerApi from "../../../shared/api/customerApi";

// ─── Backend status → display label ───────────────────────────────────────────
const STATUS_DISPLAY = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  assigned:         "Assigned",
  accepted:         "Accepted",
  rejected:         "Rejected",
  "out-for-delivery": "Out for Delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
};

// ─── Filter tab → API status param ────────────────────────────────────────────
const FILTER_TO_STATUS = {
  All:       null,
  Active:    null,        // client-side filtered
  Delivered: "delivered",
  Cancelled: "cancelled",
};

const ACTIVE_STATUSES = ["Pending", "Confirmed", "Assigned", "Accepted", "Out for Delivery"];

// ─── Normalize a raw backend order to UI shape ─────────────────────────────────
function normalizeOrder(o) {
  const statusRaw = (o.status || "pending").toLowerCase();
  const status = STATUS_DISPLAY[statusRaw] || o.status || "Pending";
  const items = Array.isArray(o.items) ? o.items : [];
  const qty  = items.length > 0 ? items[0].quantity : (o.quantity || 1);
  const size = items.length > 0 ? (items[0].size || "19L") : "19L";
  const date = o.createdAt
    ? new Date(o.createdAt).toLocaleString("en-US", {
        month: "short", day: "numeric", year: "numeric",
        hour: "numeric", minute: "2-digit",
      })
    : "—";
  return {
    _id:    o._id || o.id,
    id:     o.orderNumber || o._id || o.id,
    status,
    qty,
    size,
    date,
    driver: o?.assignedDriverId?.name || "—",
    eta:    o.estimatedDelivery || o.eta || null,
    total:  o.totalAmount ?? o.total ?? o.amount ?? 0,
  };
}

// ─── Helper: unwrap { value, trend } or plain number ──────────────────────────
const statVal = (f) => (typeof f === "object" && f !== null ? f.value : f);

// ─── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending:           { bg: "#fef3c7", color: "#b45309" },
  Confirmed:         { bg: "#e0f2fe", color: "#0369a1" },
  Assigned:          { bg: "#ede9fe", color: "#6d28d9" },
  Accepted:          { bg: "#dbeafe", color: "#1d4ed8" },
  Rejected:          { bg: "#fee2e2", color: "#b91c1c" },
  "Out for Delivery": { bg: "#dbeafe", color: "#1d4ed8" },
  Delivered:         { bg: "#dcfce7", color: "#15803d" },
  Cancelled:         { bg: "#fee2e2", color: "#b91c1c" },
};

// ─── Icons (inline SVG) ─────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const WaterBottleIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2h8M9 2v3.5a4 4 0 0 0-4 4V20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9.5a4 4 0 0 0-4-4V2"/>
    <path d="M7 14h10M7 17h10"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const ActivityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

// ─── Sub-components ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span style={{
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11.5,
      fontWeight: 600,
      background: cfg.bg,
      color: cfg.color,
      letterSpacing: 0.2,
    }}>
      {status}
    </span>
  );
}

function OrderCard({ order, onTrack }) {
  const navigate = useNavigate();
  console.log("Rendering OrderCard for order:", order);
  const isActive = ["Assigned", "Out for Delivery"].includes(order.status);
  const isDelivered = order.status === "Delivered";
  const isCancelled = order.status === "Cancelled";
  
  return (
    <div style={{
      background: "white",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      padding: "18px 22px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      transition: "box-shadow 0.2s",
      boxShadow: isActive ? "0 0 0 2px #bfdbfe" : "none",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = isActive ? "0 2px 16px rgba(14,165,233,0.13)" : "0 2px 12px rgba(0,0,0,0.07)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = isActive ? "0 0 0 2px #bfdbfe" : "none"}
    >
      {/* Icon */}
      <div style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <WaterBottleIcon size={24} />
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: "#0f172a" }}>{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 3 }}>
          {order.qty} × {order.size} &bull; {order.date}
        </div>
        <div style={{ fontSize: 12.5, color: "#94a3b8", display: "flex", gap: 14 }}>
          <span>Driver: <span style={{ color: "#475569", fontWeight: 500 }}>{order.driver}</span></span>
          {order.eta && (
            <span style={{ color: "#0ea5e9", fontWeight: 600 }}>ETA: {order.eta}</span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 1 }}>Total Amount</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#0f172a" }}>${order.total.toFixed(2)}</div>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          {isActive && (
            <button
              onClick={() => navigate(`../live-tracking/${order._id}`, { relative: "path" })}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#0ea5e9,#0284c7)",
                color: "white",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Track Order
            </button>
          )}

          {/* Reorder always shown */}
          <button style={{
            padding: "7px 14px",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            background: "white",
            color: "#475569",
            fontSize: 12.5,
            fontWeight: 500,
            cursor: "pointer",
          }}>
            Reorder
          </button>

          {isDelivered && (
            <button style={{
              padding: "7px 14px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              background: "white",
              color: "#475569",
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}>
              <DownloadIcon />
              Download Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, bg }) {
  return (
    <div style={{
      flex: 1,
      background: "white",
      borderRadius: 14,
      border: "1px solid #e2e8f0",
      padding: "18px 22px",
      display: "flex",
      alignItems: "center",
      gap: 16,
    }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 700, fontSize: 22, color: "#0f172a" }}>{value}</div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function MyOrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  const FILTERS = ["All", "Active", "Delivered", "Cancelled"];

  // Fetch stats once on mount
  useEffect(() => {
    customerApi.getDashboardStats()
      .then(res => {
        return setStats(res.data ?? null)
      })
      .catch(() => {});
  }, []);

  // Fetch orders on filter/search change (debounce search input)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      const params = { page: 1, limit: 20, sort: "createdAt" };
      const apiStatus = FILTER_TO_STATUS[activeFilter];
      if (apiStatus) params.status = apiStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      customerApi.getOrders(params)
        .then(res => {
          const list = res.data?.data ?? [];
          setOrders(list.map(normalizeOrder));
        })
        .catch(() => setError("Failed to load orders"))
        .finally(() => setLoading(false));
    }, searchQuery ? 400 : 0);

    return () => clearTimeout(timer);
  }, [activeFilter, searchQuery]);

  // "Active" tab is filtered client-side (pending + on_the_way + assigned)
  const filtered = activeFilter === "Active"
    ? orders.filter(o => ACTIVE_STATUSES.includes(o.status))
    : orders;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Orders</h1>
          <p style={styles.subtitle}>View and track all your water delivery orders</p>
        </div>
        <button style={styles.exportBtn}>
          <ExportIcon />
          Export Orders
        </button>
      </div>

      {/* Search + Filter bar */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrapper}>
          <SearchIcon />
          <input
            style={styles.searchInput}
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={styles.filterGroup}>
          {FILTERS.map(f => (
            <button
              key={f}
              style={{
                ...styles.filterBtn,
                ...(activeFilter === f ? styles.filterBtnActive : {}),
              }}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Order list */}
      <div style={styles.orderList}>
        {loading && <div style={styles.empty}>Loading orders...</div>}
        {error && <div style={{ ...styles.empty, color: "#ef4444" }}>{error}</div>}
        {!loading && !error && filtered.length === 0 && (
          <div style={styles.empty}>No orders found.</div>
        )}
        {!loading && !error && filtered.map(order => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Summary cards */}
      <div style={styles.summaryRow}>
        <SummaryCard
          icon={<ShoppingBagIcon />}
          label="Total Orders"
          value={stats ? statVal(stats.totalOrders) : "—"}
          bg="linear-gradient(135deg,#0ea5e9,#0284c7)"
        />
        <SummaryCard
          icon={<DollarIcon />}
          label="Total Spent"
          value={stats ? `$${(stats.totalSpent ?? 0).toLocaleString()}` : "—"}
          bg="linear-gradient(135deg,#10b981,#059669)"
        />
        <SummaryCard
          icon={<ActivityIcon />}
          label="Active Orders"
          value={stats ? (stats.activeDeliveries ?? stats.activeOrders ?? "—") : "—"}
          bg="linear-gradient(135deg,#f59e0b,#d97706)"
        />
      </div>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────────
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
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
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
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 18px",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#475569",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  searchWrapper: {
    flex: 1,
    minWidth: 220,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "9px 14px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: 13,
    color: "#0f172a",
    background: "transparent",
  },
  filterGroup: {
    display: "flex",
    gap: 6,
  },
  filterBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "white",
    color: "#64748b",
    fontSize: 13,
    fontWeight: 500,
    cursor: "pointer",
  },
  filterBtnActive: {
    background: "#0ea5e9",
    borderColor: "#0ea5e9",
    color: "white",
    fontWeight: 600,
  },
  orderList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    padding: "40px 0",
    fontSize: 14,
  },
  summaryRow: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
};
