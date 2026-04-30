import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderRow from "./OrderRow";
import { ChevronRight } from "../icons/Icons";
import customerApi from "../../../../shared/api/customerApi";
import { useTenant } from "../../../../shared/context/TenantContext";

export default function RecentOrders() {
  const navigate = useNavigate();
  const { tenantId } = useTenant();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    customerApi
      .getOrders({ page: 1, limit: 5, sort: "createdAt" })
      .then((res) => {
        // Shape: { success, data: { data: [...], meta: { total, page, limit, totalPages } } }
        console.log("API response for recent orders:", res);
        const list = res.data?.data ?? [];
        setOrders(list);
      })
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Recent Orders</div>
          <div style={styles.subtitle}>Your latest water deliveries</div>
        </div>
        <button style={styles.viewAll} onClick={() => navigate(`/${tenantId}/customer/my-orders`)}>
          View All <ChevronRight />
        </button>
      </div>
      <div style={styles.list}>
        {loading && <div style={styles.state}>Loading...</div>}
        {error && <div style={{ ...styles.state, color: "#ef4444" }}>{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div style={styles.state}>No orders found.</div>
        )}
        {!loading &&
          !error &&
          orders.map((order) => <OrderRow key={order._id || order.id} order={order} />)}
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
