import OrderRow from "./OrderRow";
import { ChevronRight } from "../icons/Icons";

const ORDERS = [
  { id: "ORD-2451", qty: "3 × 19L", date: "Mar 28, 2026", status: "Delivered" },
  { id: "ORD-2452", qty: "2 × 19L", date: "Mar 30, 2026", status: "On the Way" },
  { id: "ORD-2450", qty: "5 × 19L", date: "Mar 25, 2026", status: "Delivered" },
  { id: "ORD-2449", qty: "3 × 19L", date: "Mar 22, 2026", status: "Delivered" },
  { id: "ORD-2448", qty: "1 × 19L", date: "Mar 19, 2026", status: "Delivered" },
];

export default function RecentOrders() {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Recent Orders</div>
          <div style={styles.subtitle}>Your latest water deliveries</div>
        </div>
        <button style={styles.viewAll}>
          View All <ChevronRight />
        </button>
      </div>
      <div style={styles.list}>
        {ORDERS.map((order) => (
          <OrderRow key={order.id} {...order} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "white",
    borderRadius: 14,
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #f1f5f9",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
  subtitle: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  viewAll: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    border: "none",
    background: "transparent",
    color: "#0ea5e9",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
  },
  list: { display: "flex", flexDirection: "column", gap: 6 },
};
