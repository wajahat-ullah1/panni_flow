import { BoxIcon } from "../icons/Icons";

const STATUS_STYLES = {
  delivered:    { bg: "rgba(16,185,129,0.1)", color: "#059669", dot: "#10b981" },
  "on the way": { bg: "rgba(14,165,233,0.1)", color: "#0284c7", dot: "#0ea5e9" },
  pending:      { bg: "rgba(245,158,11,0.1)", color: "#b45309", dot: "#f59e0b" },
  cancelled:    { bg: "rgba(239,68,68,0.1)",  color: "#dc2626", dot: "#ef4444" },
  assigned:     { bg: "rgba(168,85,247,0.1)", color: "#7c3aed", dot: "#a855f7" },
};

export default function OrderRow({ order }) {
  const id = order.orderNumber || order._id || order.id || "—";
  const qty = order.items
    ? order.items.map((i) => `${i.quantity} × ${i.productName || i.name || "item"}`).join(", ")
    : order.quantity ? `${order.quantity} × item` : "—";
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : order.date || "—";
  const statusRaw = order.status || "pending";
  const statusLabel = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1).replace(/_/g, " ");
  const s = STATUS_STYLES[statusRaw.toLowerCase()] || STATUS_STYLES["pending"];

  return (
    <div style={styles.row} className="order-row">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
        .order-row {
          transition: background 0.18s ease, transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.18s ease;
        }
        .order-row:hover {
          background: #f0f9ff !important;
          transform: translateX(3px);
          box-shadow: 0 2px 12px rgba(14,165,233,0.08);
        }
        .reorder-btn {
          transition: all 0.18s ease;
        }
        .reorder-btn:hover {
          background: linear-gradient(135deg, #0ea5e9, #0284c7) !important;
          color: white !important;
          border-color: transparent !important;
          transform: scale(1.04);
        }
      `}</style>

      <div style={styles.icon}>
        <BoxIcon color="#0ea5e9" />
      </div>

      <div style={styles.info}>
        <div style={styles.id}>{id}</div>
        <div style={styles.qty}>{qty}</div>
      </div>

      <div style={styles.date}>{date}</div>

      <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block", marginRight: 5, flexShrink: 0 }} />
        {statusLabel}
      </span>

      <button style={styles.reorderBtn} className="reorder-btn">Reorder</button>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "13px 16px",
    borderRadius: 12,
    background: "#fafcff",
    border: "1px solid #eef2f8",
    fontFamily: "'DM Sans', sans-serif",
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1, minWidth: 0 },
  id: { fontSize: 13, fontWeight: 600, color: "#0f172a", letterSpacing: -0.2 },
  qty: { fontSize: 11, color: "#94a3b8", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  date: { fontSize: 12, color: "#64748b", whiteSpace: "nowrap" },
  badge: {
    padding: "5px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
  },
  reorderBtn: {
    border: "1.5px solid #e2e8f0",
    background: "white",
    borderRadius: 9,
    padding: "5px 13px",
    fontSize: 12,
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
  },
};