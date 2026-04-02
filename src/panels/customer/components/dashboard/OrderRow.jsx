import { BoxIcon } from "../icons/Icons";

const STATUS_STYLES = {
  Delivered:    { bg: "#e8faf0", color: "#1a9e5c" },
  "On the Way": { bg: "#e8f3ff", color: "#1a6fd4" },
  Pending:      { bg: "#fff8e1", color: "#d4a017" },
};

export default function OrderRow({ id, qty, date, status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Delivered"];

  return (
    <div style={styles.row}>
      <div style={styles.icon}>
        <BoxIcon color="#0ea5e9" />
      </div>
      <div style={styles.info}>
        <div style={styles.id}>{id}</div>
        <div style={styles.qty}>{qty}</div>
      </div>
      <div style={styles.date}>{date}</div>
      <span style={{ ...styles.badge, background: s.bg, color: s.color }}>
        {status}
      </span>
      <button style={styles.reorderBtn}>Reorder</button>
    </div>
  );
}

const styles = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 14px",
    borderRadius: 10,
    background: "#fafbfc",
    border: "1px solid #f1f5f9",
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "#e0f2fe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  info: { flex: 1 },
  id: { fontSize: 13, fontWeight: 600, color: "#0f172a" },
  qty: { fontSize: 11, color: "#94a3b8" },
  date: { fontSize: 12, color: "#64748b", whiteSpace: "nowrap" },
  badge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  reorderBtn: {
    border: "1px solid #e2e8f0",
    background: "white",
    borderRadius: 8,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#475569",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
};
